import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo } from "react"
import { FancyButton } from "../.."
import { SvgLine, SvgMicrochip, SvgQuestionMark, SvgTarget } from "../../../assets"
import { useMiniMap, useSnackbar } from "../../../containers"
import { useTimer } from "../../../hooks"
import { colors } from "../../../theme/theme"
import { LocationSelectType } from "../../../types"

export const TargetHint = () => {
    const { isTargeting, winner, playerAbility } = useMiniMap()

    if (!isTargeting) return null
    if (winner) return <WinnerTargetHint />
    if (playerAbility) return <PlayerAbilityTargetHint />
    return null
}

// Winner hint
const WinnerTargetHint = () => {
    const { newSnackbarMessage } = useSnackbar()
    const { winner, resetSelection } = useMiniMap()

    if (!winner) return null

    const { label, colour } = winner.game_ability

    return (
        <Box
            sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                px: "2rem",
                py: ".6rem",
                backgroundColor: (theme) => `${theme.factionTheme.background}`,
                borderRadius: 0.5,
                zIndex: 98,
            }}
        >
            <Typography variant="h6" sx={{ textAlign: "center", lineHeight: 1, span: { fontWeight: "fontWeightBold", color: colour } }}>
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

    const data = useMemo(() => {
        const ability = playerAbility?.ability

        if (!ability) return null

        const iconProps = { size: "1.6rem", fill: ability.colour, sx: { display: "inline", pb: 0 } }

        let icon = <SvgQuestionMark {...iconProps} />
        let descriptor = "Select a location"

        switch (ability.location_select_type) {
            case LocationSelectType.LOCATION_SELECT:
            case LocationSelectType.MECH_COMMAND:
                icon = <SvgTarget {...iconProps} />
                descriptor = "Select a location to deploy"
                break
            case LocationSelectType.MECH_SELECT:
                icon = <SvgMicrochip {...iconProps} />
                descriptor = "Select an allied mech to activate"
                break
            case LocationSelectType.LINE_SELECT:
                icon = <SvgLine {...iconProps} />
                descriptor = "Draw a line by selecting two locations to deploy"
                break
        }

        return { icon, descriptor }
    }, [playerAbility?.ability])

    const ability = playerAbility?.ability
    if (!ability) return null

    return (
        <Box
            sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                px: "2rem",
                py: ".6rem",
                backgroundColor: (theme) => `${theme.factionTheme.background}`,
                borderRadius: 0.5,
                zIndex: 98,
            }}
        >
            <Stack direction="row" alignItems="center" spacing=".5rem" sx={{ position: "relative", width: "100%" }}>
                <Typography variant="h6" sx={{ lineHeight: 1 }}>
                    {data?.descriptor}
                </Typography>

                {data?.icon}

                <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: "fontWeightBold", color: ability.colour }}>
                    {ability.label}
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
        </Box>
    )
}
