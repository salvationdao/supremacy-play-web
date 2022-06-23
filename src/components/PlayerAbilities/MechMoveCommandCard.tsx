import { Box, Fade, Stack, Typography } from "@mui/material"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { useCallback, useEffect, useMemo, useState } from "react"
import { BlueprintPlayerAbility, Faction, LocationSelectType, WarMachineState } from "../../types"
import { useAuth, useConsumables } from "../../containers"
import { ClipThing } from "../Common/ClipThing"
import { TopText } from "../VotingSystem/FactionAbility/TopText"
import { SupsBar } from "../VotingSystem/FactionAbility/SupsBar"
import { FancyButton } from "../Common/FancyButton"
import { useInterval } from "../../hooks"
import { colors } from "../../theme/theme"
import { shadeColor } from "../../helpers"

export interface MechMoveCommand {
    id: string
    mech_id: string
    triggered_by_id: string
    cell_x?: number
    cell_y?: number
    cancelled_at?: string
    reached_at?: string
    remain_cooldown_seconds: number
}

interface MechMoveCommandProps {
    warMachine: WarMachineState
    faction: Faction
    clipSlantSize: string
    onClose: () => void
}

export const MechMoveCommandCard = ({ warMachine, faction, clipSlantSize, onClose }: MechMoveCommandProps) => {
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

    return <MechMoveCommandInner faction={faction} clipSlantSize={clipSlantSize} mechMoveCommand={mechMoveCommand} warMachine={warMachine} onClose={onClose} />
}

interface MechMoveCommandInnerProps {
    faction: Faction
    clipSlantSize: string
    mechMoveCommand: MechMoveCommand
    warMachine: WarMachineState
    onClose: () => void
}

export const MechMoveCommandInner = ({ faction, clipSlantSize, mechMoveCommand, warMachine, onClose }: MechMoveCommandInnerProps) => {
    const { hash } = warMachine
    const backgroundColor = useMemo(() => shadeColor(faction.primary_color, -70), [])
    const [remainSeconds, setRemainSeconds] = useState(mechMoveCommand.remain_cooldown_seconds)
    useEffect(() => {
        setRemainSeconds(mechMoveCommand.remain_cooldown_seconds)
    }, [mechMoveCommand])
    useInterval(() => {
        setRemainSeconds((rs) => {
            if (rs == 0) {
                return 0
            }
            return rs - 1
        })
    }, 1000)

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
                                    remainCooldownSeconds={remainSeconds}
                                    textColor={faction.secondary_color}
                                    isCancelled={!!mechMoveCommand.cancelled_at}
                                    hash={hash}
                                    mechMoveCommandID={mechMoveCommand.id}
                                    onClose={onClose}
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
                                <MechCommandChargingBar remainCooldownSecond={remainSeconds} color={faction.primary_color} />
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
    onClose: () => void

    // delete afterward
    hash: string
    mechMoveCommandID: string
}

const MechMoveCommandAbility: BlueprintPlayerAbility = {
    id: "",
    game_client_ability_id: 8,
    label: "Mech Move Command",
    colour: "#FFFFFF",
    image_url: "",
    description: "Force mech to move to certain spot",
    text_colour: "",
    location_select_type: LocationSelectType.MECH_COMMAND,
    created_at: new Date(),
}

const MechCommandButton = ({ color, remainCooldownSeconds, isCancelled, textColor, hash, mechMoveCommandID, onClose }: MechCommandButton) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { setPlayerAbility } = useConsumables()
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

    const onCreate = useCallback(() => {
        setPlayerAbility({
            count: 1,
            last_purchased_at: new Date(),
            mechHash: hash,
            ability: { ...MechMoveCommandAbility, text_colour: colorText, colour: backgroundColor },
        })
        onClose()
    }, [hash])

    const onCancel = useCallback(
        () =>
            send(GameServerKeys.MechMoveCommandCancel, {
                move_command_id: mechMoveCommandID,
                hash,
            }).catch((e) => console.log(e)),
        [mechMoveCommandID],
    )

    const onClick = useMemo(() => {
        if (remainCooldownSeconds > 0 && !isCancelled) return onCancel
        return onCreate
    }, [remainCooldownSeconds, isCancelled, textColor, onCreate, onCancel])

    return (
        <FancyButton
            clipThingsProps={{
                clipSize: "5px",
                backgroundColor: backgroundColor,
                border: { isFancy: true, borderColor: color || "#14182B" },
                sx: { flex: 1, position: "relative" },
            }}
            disabled={remainCooldownSeconds > 0 && isCancelled}
            sx={{ py: ".2rem", minWidth: "2rem" }}
            onClick={onClick}
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
const MechCommandChargingBar = ({ remainCooldownSecond, color }: MechCommandCooldownBarProps) => {
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
                    width: `${((30.0 - remainCooldownSecond) / 30.0) * 100}%`,
                    height: "100%",
                    transition: "all 1s",
                    backgroundColor: color || colors.neonBlue,
                    zIndex: 5,
                    borderRadius: 0.4,
                }}
            />
        </Stack>
    )
}
