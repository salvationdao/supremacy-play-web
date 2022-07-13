import { Box, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { useAuth, useMiniMap, useSnackbar } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useTimer } from "../../../hooks"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { BlueprintPlayerAbility, LocationSelectType, WarMachineState } from "../../../types"
import { ProgressBar } from "../../Common/ProgressBar"
import { DEAD_OPACITY, WIDTH_SKILL_BUTTON, WIDTH_STAT_BAR } from "./WarMachineItem"

const MechMoveCommandAbility: BlueprintPlayerAbility = {
    id: "",
    game_client_ability_id: 8,
    label: "Move Command",
    colour: "#FFFFFF",
    image_url: "",
    description: "Command the war machine to move to a specific location.",
    text_colour: "",
    location_select_type: LocationSelectType.MECH_COMMAND,
    created_at: new Date(),
}

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

export const MoveCommand = ({ warMachine, isAlive }: { warMachine: WarMachineState; isAlive: boolean }) => {
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

    return (
        <MoveCommandInner
            isAlive={isAlive}
            hash={hash}
            remainCooldownSeconds={mechMoveCommand.remain_cooldown_seconds}
            isMoving={mechMoveCommand.cell_x !== undefined && mechMoveCommand.cell_y !== undefined}
            isCancelled={!!mechMoveCommand.cancelled_at}
            mechMoveCommandID={mechMoveCommand.id}
        />
    )
}

interface MoveCommandInnerProps {
    hash: string
    mechMoveCommandID: string
    isAlive: boolean
    isMoving: boolean
    isCancelled: boolean
    remainCooldownSeconds: number
}

const MoveCommandInner = ({ isAlive, remainCooldownSeconds, isMoving, isCancelled, hash, mechMoveCommandID }: MoveCommandInnerProps) => {
    const theme = useTheme()
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { setPlayerAbility } = useMiniMap()

    const { totalSecRemain } = useTimer(new Date(new Date().getTime() + remainCooldownSeconds * 1000))

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    const onClick = useCallback(async () => {
        if (!isAlive) return

        if (isMoving && !isCancelled) {
            try {
                await send(GameServerKeys.MechMoveCommandCancel, {
                    move_command_id: mechMoveCommandID,
                    hash,
                })
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed cancel mech move command."
                newSnackbarMessage(message, "error")
                console.error(err)
            }
        } else {
            setPlayerAbility({
                id: "mech_move_command",
                blueprint_id: "mech_move_command",
                count: 1,
                last_purchased_at: new Date(),
                mechHash: hash,
                ability: { ...MechMoveCommandAbility, text_colour: secondaryColor, colour: primaryColor || "#FFFFFF" },
            })
        }
    }, [isAlive, isMoving, isCancelled, send, mechMoveCommandID, hash, newSnackbarMessage, setPlayerAbility, secondaryColor, primaryColor])

    return (
        <>
            <Box
                sx={{
                    position: "relative",
                    width: `${WIDTH_SKILL_BUTTON}rem`,
                    height: "100%",
                    backgroundColor: isMoving ? colors.lightGrey : primaryColor,
                    boxShadow: 2,
                    cursor: isAlive ? "pointer" : "auto",
                    zIndex: 3,
                    opacity: isAlive ? 1 : DEAD_OPACITY,
                    ":hover #warMachineSkillsText": {
                        letterSpacing: isAlive ? 2.3 : 1,
                    },
                }}
                onClick={onClick}
            >
                <Box
                    sx={{
                        position: "absolute",
                        left: "2rem",
                        top: "50%",
                        transform: `translate(-50%, -50%) rotate(-${90}deg)`,
                        zIndex: 2,
                    }}
                >
                    <Typography
                        id="warMachineSkillsText"
                        variant="body1"
                        sx={{
                            fontWeight: "fontWeightBold",
                            color: isMoving ? "#000000" : secondaryColor,
                            letterSpacing: 1,
                            transition: "all .2s",
                        }}
                    >
                        {isMoving ? "CANCEL" : "MOVE"}
                    </Typography>
                </Box>
            </Box>

            <Box style={{ height: "100%" }}>
                <ProgressBar
                    percent={((30.0 - totalSecRemain) / 30.0) * 100}
                    color={colors.gold}
                    backgroundColor="#FFFFFF06"
                    thickness={`${WIDTH_STAT_BAR}rem`}
                />
            </Box>
        </>
    )
}
