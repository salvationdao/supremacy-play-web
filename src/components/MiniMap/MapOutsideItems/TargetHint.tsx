import { Stack, Typography } from "@mui/material"
import { useEffect, useMemo } from "react"
import { SvgLine, SvgMicrochip, SvgQuestionMark, SvgTarget } from "../../../assets"
import { useMiniMap, useSnackbar } from "../../../containers"
import { useTimer } from "../../../hooks"
import { BlueprintPlayerAbility, GameAbility, LocationSelectType } from "../../../types"

export const TargetHint = () => {
    const { isTargeting, winner, playerAbility } = useMiniMap()

    if (!isTargeting) return null
    if (winner) return <WinnerTargetHint />
    if (playerAbility) return <PlayerAbilityTargetHint ability={playerAbility.ability} />
    return null
}

const WinnerTargetHint = () => {
    const { newSnackbarMessage } = useSnackbar()
    const { winner, resetSelection } = useMiniMap()

    if (!winner) return null

    return (
        <WinnerTargetHintInner
            gameAbility={winner.game_ability}
            endTime={winner.end_time}
            onCountdownExpired={() => {
                newSnackbarMessage("Failed to submit target location on time.", "error")
                resetSelection()
            }}
        />
    )
}

const WinnerTargetHintInner = ({ gameAbility, endTime, onCountdownExpired }: { gameAbility: GameAbility; endTime: Date; onCountdownExpired: () => void }) => {
    const { label, colour } = gameAbility
    const { totalSecRemain } = useTimer(endTime)

    useEffect(() => {
        if (totalSecRemain <= 1) onCountdownExpired()
    }, [totalSecRemain, onCountdownExpired])

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            direction="row"
            spacing=".8rem"
            sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                px: "1.12rem",
                py: ".48rem",
                backgroundColor: (theme) => `${theme.factionTheme.background}`,
                borderRadius: 0.5,
                zIndex: 98,
            }}
        >
            <Typography variant="h6" sx={{ span: { lineHeight: 1, fontWeight: "fontWeightBold", color: colour } }}>
                You have&nbsp;
                {Math.max(totalSecRemain - 2, 0)}s to choose a location for&nbsp;
                <span>{`${label}`}</span>
            </Typography>
        </Stack>
    )
}

const PlayerAbilityTargetHint = ({ ability }: { ability: BlueprintPlayerAbility }) => {
    const data = useMemo(() => {
        const iconProps = { size: "1.6rem", fill: ability.colour, sx: { display: "inline" } }

        let icon = <SvgQuestionMark {...iconProps} />
        let descriptor = "Select a location"

        switch (ability.location_select_type) {
            case LocationSelectType.LOCATION_SELECT:
            case LocationSelectType.MECH_COMMAND:
                icon = <SvgTarget {...iconProps} />
                descriptor = "Select a location"
                break
            case LocationSelectType.MECH_SELECT:
                icon = <SvgMicrochip {...iconProps} />
                descriptor = "Select an allied mech"
                break
            case LocationSelectType.LINE_SELECT:
                icon = <SvgLine {...iconProps} />
                descriptor = "Draw a line by selecting two locations"
                break
        }

        return { icon, descriptor }
    }, [ability])

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            direction="row"
            spacing=".8rem"
            sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                px: "1.12rem",
                py: ".48rem",
                backgroundColor: (theme) => `${theme.factionTheme.background}`,
                borderRadius: 0.5,
                zIndex: 98,
            }}
        >
            <Stack direction="row" alignItems="center" spacing=".5rem">
                <Typography variant="h6">{data.descriptor} to deploy</Typography>

                {data.icon}

                <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: "fontWeightBold", color: ability.colour }}>
                    {ability.label}
                </Typography>
            </Stack>
        </Stack>
    )
}
