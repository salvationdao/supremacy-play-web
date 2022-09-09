import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { ClipThing, FancyButton } from "../../.."
import { SvgLine, SvgMicrochip, SvgQuestionMark, SvgTarget } from "../../../../assets"
import { useGlobalNotifications, useTraining } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { colors } from "../../../../theme/theme"
import { BattleAbilityStages, LocationSelectType } from "../../../../types"
import { MechAbilityStages, PlayerAbilityStages } from "../../../../types/training"
import { TOP_BAR_HEIGHT } from "../../../BigDisplay/MiniMap/MiniMap"

export const TargetHintBT = () => {
    const { isTargeting, winner, playerAbility } = useTraining()

    if (!isTargeting) return null
    if (winner) return <WinnerTargetHint />
    if (playerAbility) return <PlayerAbilityTargetHint />
    return null
}

// Winner hint
const WinnerTargetHint = () => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { winner, resetSelection, setTutorialRef, trainingStage } = useTraining()
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (trainingStage === BattleAbilityStages.LocationExplainBA) {
            setTutorialRef(ref)
        }
    }, [setTutorialRef, trainingStage])

    if (!winner) return null

    const { label, colour, image_url } = winner.game_ability

    return (
        <Stack
            direction="row"
            alignItems="flex-end"
            sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 98,
            }}
            ref={ref}
        >
            <ClipThing backgroundColor={colour} corners={{ topRight: true }} border={{ borderColor: colour, borderThickness: ".25rem" }} sx={{ zIndex: 99 }}>
                <Box
                    sx={{
                        width: "45px",
                        height: "45px",
                        background: `url(${image_url})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                    }}
                />
            </ClipThing>

            <Box
                sx={{
                    position: "relative",
                    flex: 1,
                    px: "2rem",
                    py: ".6rem",
                    backgroundColor: (theme) => `${theme.factionTheme.background}`,
                }}
            >
                <Typography variant="h5" sx={{ lineHeight: 1, span: { fontWeight: "fontWeightBold", color: colour } }}>
                    You have{" "}
                    <WinnerTargetHintInner
                        time={winner.time}
                        onCountdownExpired={() => {
                            newSnackbarMessage("Failed to submit target location on time.", "error")
                            resetSelection()
                        }}
                    />
                    s to choose a location for&nbsp;
                    <span>{`${label}`}</span>
                </Typography>
            </Box>
        </Stack>
    )
}

const WinnerTargetHintInner = ({ time, onCountdownExpired }: { time: number; onCountdownExpired: () => void }) => {
    useEffect(() => {
        if (time <= 1) onCountdownExpired()
    }, [time, onCountdownExpired])

    return <>{time}</>
}

// Player ability hint
const PlayerAbilityTargetHint = () => {
    const { playerAbility, resetSelection, trainingStage, setTrainingStage, setTutorialRef } = useTraining()
    const ref = useRef<HTMLDivElement>(null)
    const theme = useTheme()

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                resetSelection()
            }
        },
        [resetSelection],
    )

    useEffect(() => {
        if (trainingStage === PlayerAbilityStages.LocationExplainPA) {
            setTutorialRef(ref)
        }
    }, [setTutorialRef, trainingStage])

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown)

        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [handleKeyDown])

    const data = useMemo(() => {
        const ability = playerAbility?.ability

        if (!ability) return null

        const iconProps = { size: "30px", sx: { display: "inline", pb: 0 } }

        let icon = <SvgQuestionMark {...iconProps} />
        let descriptor = "Select a location"

        switch (ability.location_select_type) {
            case LocationSelectType.LocationSelect:
            case LocationSelectType.MechCommand:
                icon = <SvgTarget {...iconProps} />
                descriptor = "Select a location to deploy"
                break
            case LocationSelectType.MechSelect:
                icon = <SvgMicrochip {...iconProps} />
                descriptor = "Select an allied mech to activate"
                break
            case LocationSelectType.LineSelect:
                icon = <SvgLine {...iconProps} />
                descriptor = "Draw a line by selecting two locations to deploy"
                break
        }

        return { icon, descriptor }
    }, [playerAbility?.ability])

    const ability = playerAbility?.ability
    if (!ability) return null

    return (
        <>
            <Box
                sx={{
                    zIndex: 98,
                    position: "absolute",
                    top: `${TOP_BAR_HEIGHT}rem`,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(rgba(0, 0, 0, 0), ${playerAbility.ability.colour}aa)`,
                    pointerEvents: "none",
                    opacity: 0.2,
                }}
            />

            <Stack
                ref={ref}
                direction="row"
                alignItems="flex-end"
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 98,
                }}
            >
                <ClipThing
                    backgroundColor={theme.factionTheme.primary}
                    corners={{ topRight: true }}
                    sx={{ zIndex: 1, p: ".9rem 1.1rem", svg: { fill: theme.factionTheme.secondary } }}
                >
                    {data?.icon}
                </ClipThing>

                <Stack
                    direction="row"
                    alignItems="center"
                    spacing=".5rem"
                    sx={{
                        position: "relative",
                        flex: 1,
                        px: "2rem",
                        py: ".6rem",
                        backgroundColor: (theme) => `${theme.factionTheme.background}`,
                    }}
                >
                    <Typography variant="h5" sx={{ lineHeight: 1, span: { fontWeight: "fontWeightBold", color: ability.colour } }}>
                        {data?.descriptor}&nbsp;
                        <span>{`${ability.label}`}</span>
                    </Typography>

                    {trainingStage in PlayerAbilityStages ? null : (
                        <FancyButton
                            clipThingsProps={{
                                clipSize: "4px",
                                backgroundColor: colors.red,
                                border: { isFancy: true, borderColor: colors.red },
                                sx: { ml: "auto !important" },
                            }}
                            sx={{ py: ".2rem", px: "1.5rem" }}
                            onClick={() => {
                                if (trainingStage === MechAbilityStages.MoveMA) {
                                    setTrainingStage(MechAbilityStages.MapMA)
                                }
                                resetSelection()
                            }}
                        >
                            <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>Cancel</Typography>
                        </FancyButton>
                    )}
                </Stack>
            </Stack>
        </>
    )
}
