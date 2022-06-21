import { Box, Fade, Stack, Typography } from "@mui/material"
import { useGameServerSubscriptionFaction } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { useMemo, useState } from "react"
import { Faction, WarMachineState } from "../../types"
import { useAuth } from "../../containers"
import { ClipThing } from "../Common/ClipThing"
import { TopText } from "../VotingSystem/FactionAbility/TopText"
import { SupsBar } from "../VotingSystem/FactionAbility/SupsBar"
import { FancyButton } from "../Common/FancyButton"
import { useInterval } from "../../hooks"
import { colors } from "../../theme/theme"
import { shadeColor } from "../../helpers"

interface MechMoveCommand {
    id: string
    mech_id: string
    triggered_by_id: string
    x: number
    y: number
    cancelled_at?: string
    remain_cooldown_seconds: number
}

interface MechMoveCommandProps {
    warMachine: WarMachineState
    faction: Faction
    clipSlantSize: string
}

export const MechMoveCommand = ({ warMachine, faction, clipSlantSize }: MechMoveCommandProps) => {
    const { factionID } = useAuth()
    const { hash, factionID: wmFactionID, participantID } = warMachine
    const [mechMoveCommand, setMechMoveCommand] = useState<MechMoveCommand>()
    useGameServerSubscriptionFaction<MechMoveCommand>(
        {
            URI: `/mech_command/${hash}`,
            key: GameServerKeys.SubMechMoveCommand,
            ready: factionID === wmFactionID && !!participantID,
        },
        (payload) => {
            if (!payload) return
            setMechMoveCommand(payload)
        },
    )

    if (!mechMoveCommand) return null

    return <MechMoveCommandInner faction={faction} clipSlantSize={clipSlantSize} mechMoveCommand={mechMoveCommand} />
}

interface MechMoveCommandInnerProps {
    faction: Faction
    clipSlantSize: string
    mechMoveCommand: MechMoveCommand
}

export const MechMoveCommandInner = ({ faction, clipSlantSize, mechMoveCommand }: MechMoveCommandInnerProps) => {
    const backgroundColor = useMemo(() => shadeColor(faction.primary_color, -70), [])
    return (
        <Box>
            <Fade in={true}>
                <Box>
                    <ClipThing
                        clipSize="6px"
                        clipSlantSize={clipSlantSize}
                        border={{
                            isFancy: true,
                            borderColor: faction.primary_color,
                            borderThickness: ".3rem",
                        }}
                        backgroundColor={backgroundColor}
                        opacity={0.7}
                    >
                        <Stack
                            spacing=".8rem"
                            alignItems="flex-start"
                            sx={{
                                flex: 1,
                                minWidth: "32.5rem",
                                px: "1.6rem",
                                pt: "1.28rem",
                                pb: "1.28rem",
                            }}
                        >
                            <Stack spacing="2.4rem" direction="row" alignItems="center" justifyContent="space-between" alignSelf="stretch">
                                <TopText
                                    description={"command mech to move to certain position"}
                                    image_url={""}
                                    colour={faction.primary_color}
                                    label={"Move Command"}
                                />
                                <MechCommandButton
                                    color={faction.primary_color}
                                    remainCooldownSeconds={mechMoveCommand.remain_cooldown_seconds}
                                    textColor={faction.secondary_color}
                                    isCancelled={!!mechMoveCommand.cancelled_at}
                                />
                            </Stack>
                            <Box
                                sx={{
                                    width: "100%",
                                    px: "1.2rem",
                                    py: ".96rem",
                                    backgroundColor: "#00000030",
                                    borderRadius: 1,
                                }}
                            >
                                <MechCommandCooldownBar remainCooldownSecond={mechMoveCommand.remain_cooldown_seconds} color={faction.primary_color} />
                            </Box>
                        </Stack>
                    </ClipThing>
                </Box>
            </Fade>
        </Box>
    )
}

interface MechCommandButton {
    color: string
    remainCooldownSeconds: number
    isCancelled: boolean
    textColor?: string
}
const MechCommandButton = ({ color, remainCooldownSeconds, isCancelled, textColor }: MechCommandButton) => {
    const text = useMemo(() => {
        if (remainCooldownSeconds > 0 && !isCancelled) {
            return "Cancel"
        }
        return "Fire"
    }, [remainCooldownSeconds, isCancelled])

    const backgroundColor = useMemo(() => {
        if (remainCooldownSeconds > 0) {
            return "#14182B"
        }

        return color || "#14182B"
    }, [remainCooldownSeconds, isCancelled, color])

    const colorText = useMemo(() => {
        if (remainCooldownSeconds > 0 && isCancelled) {
            return "#FFFFFF20"
        }
        return textColor || "#FFFFFF"
    }, [remainCooldownSeconds, isCancelled, textColor])

    return (
        <FancyButton
            clipThingsProps={{
                clipSize: "5px",
                backgroundColor: backgroundColor,
                border: { isFancy: true, borderColor: color || "#14182B" },
                sx: { flex: 1, position: "relative" },
            }}
            sx={{ py: ".2rem", minWidth: "2rem" }}
        >
            <Stack alignItems="center" justifyContent="center" direction="row">
                <Typography
                    sx={{
                        lineHeight: 1,
                        fontWeight: "fontWeightBold",
                        whiteSpace: "nowrap",
                        color: colorText,
                    }}
                >
                    {text}
                </Typography>
            </Stack>
        </FancyButton>
    )
}

interface MechCommandCooldownBarProps {
    remainCooldownSecond: number
    color: string
}
const MechCommandCooldownBar = ({ remainCooldownSecond, color }: MechCommandCooldownBarProps) => {
    const [progressPercent, setProgressPercent] = useState(0)
    useInterval(() => {
        setProgressPercent((30 - remainCooldownSecond / 30) * 100)
    }, 1000)

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            style={{
                flex: 1,
                position: "relative",
                alignSelf: "stretch",
                height: ".7rem",
                backgroundColor: `${color}10`,
                overflow: "visible",
                borderRadius: 0.4,
            }}
        >
            <Box
                style={{
                    width: `${progressPercent}%`,
                    height: "100%",
                    transition: "all .15s",
                    backgroundColor: color || colors.neonBlue,
                    zIndex: 5,
                    borderRadius: 0.4,
                }}
            />
        </Stack>
    )
}
