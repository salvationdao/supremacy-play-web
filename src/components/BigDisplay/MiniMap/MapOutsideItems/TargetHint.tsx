import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo } from "react"
import { ClipThing, FancyButton } from "../../.."
import { SvgLine, SvgMicrochip, SvgQuestionMark, SvgTarget } from "../../../../assets"
import { useMiniMap, useGlobalNotifications } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { useTimer } from "../../../../hooks"
import { colors } from "../../../../theme/theme"
import { LocationSelectType } from "../../../../types"
import { TOP_BAR_HEIGHT } from "../MiniMap"

export const TargetHint = () => {
    const { isTargeting, winner, playerAbility } = useMiniMap()

    if (!isTargeting) return null
    if (winner) return <WinnerTargetHint />
    if (playerAbility) return <PlayerAbilityTargetHint />
    return null
}

// Winner hint
const WinnerTargetHint = () => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { winner, resetSelection } = useMiniMap()

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
                    zIndex: 98,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(rgba(0, 0, 0, 0), ${colour}aa)`,
                    pointerEvents: "none",
                    opacity: 0.2,
                }}
            />
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
            >
                <ClipThing
                    backgroundColor={colour}
                    corners={{ topRight: true }}
                    border={{ borderColor: colour, borderThickness: ".25rem" }}
                    sx={{ zIndex: 99, m: "-.3rem" }}
                >
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
                            endTime={winner.end_time}
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
        </Stack>
    )
}

const WinnerTargetHintInner = ({ endTime, onCountdownExpired }: { endTime: Date; onCountdownExpired: () => void }) => {
    const { totalSecRemain } = useTimer(endTime)

    useEffect(() => {
        if (totalSecRemain <= 1) onCountdownExpired()
    }, [totalSecRemain, onCountdownExpired])

    return <>{Math.max(totalSecRemain - 2, 0)}</>
}

// Player ability hint
const PlayerAbilityTargetHint = () => {
    const { playerAbility, resetSelection } = useMiniMap()
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
        document.addEventListener("keydown", handleKeyDown)

        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [handleKeyDown])

    const data = useMemo(() => {
        const ability = playerAbility?.ability

        if (!ability) return null

        const iconProps = { fill: theme.factionTheme.secondary, size: "30px", sx: { display: "inline", pb: 0 } }

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
    }, [playerAbility?.ability, theme.factionTheme.secondary])

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

                    <FancyButton
                        clipThingsProps={{
                            clipSize: "4px",
                            backgroundColor: colors.red,
                            border: { isFancy: true, borderColor: colors.red },
                            sx: { ml: "auto !important" },
                        }}
                        sx={{ py: ".2rem", px: "1.5rem" }}
                        onClick={() => resetSelection()}
                    >
                        <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>Cancel</Typography>
                    </FancyButton>
                </Stack>
            </Stack>
        </>
    )
}
