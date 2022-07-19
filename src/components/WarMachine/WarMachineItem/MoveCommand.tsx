import { Box, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { FancyButton } from "../.."
import { useAuth, useMiniMap, useSnackbar } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useTimer } from "../../../hooks"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { LocationSelectType, PlayerAbility, WarMachineState } from "../../../types"
import { ProgressBar } from "../../Common/ProgressBar"
import { DEAD_OPACITY, WIDTH_SKILL_BUTTON, WIDTH_STAT_BAR } from "./WarMachineItem"

const MECH_MOVE_COOLDOWN_SECONDS = 5

export const MechMoveCommandAbility: PlayerAbility = {
    id: "mech_move_command",
    blueprint_id: "mech_move_command",
    count: 1,
    last_purchased_at: new Date(),
    ability: {
        id: "",
        game_client_ability_id: 8,
        label: "Move Command",
        image_url: "",
        description: "Command the war machine to move to a specific location.",
        text_colour: "#000000",
        colour: colors.gold,
        location_select_type: LocationSelectType.MECH_COMMAND,
        created_at: new Date(),
    },
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

export const MoveCommand = ({ warMachine, isAlive, smallVersion }: { warMachine: WarMachineState; isAlive: boolean; smallVersion?: boolean }) => {
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
            key={mechMoveCommand.id}
            isAlive={isAlive}
            hash={hash}
            remainCooldownSeconds={mechMoveCommand.remain_cooldown_seconds}
            isMoving={!mechMoveCommand?.reached_at && !mechMoveCommand?.cancelled_at && mechMoveCommand.remain_cooldown_seconds !== 0}
            isCancelled={!!mechMoveCommand.cancelled_at}
            mechMoveCommandID={mechMoveCommand.id}
            smallVersion={smallVersion}
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
    smallVersion?: boolean
}

const MoveCommandInner = ({ isAlive, remainCooldownSeconds, isMoving, isCancelled, hash, mechMoveCommandID, smallVersion }: MoveCommandInnerProps) => {
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
                ...MechMoveCommandAbility,
                mechHash: hash,
            })
        }
    }, [isAlive, isMoving, isCancelled, send, mechMoveCommandID, hash, newSnackbarMessage, setPlayerAbility])

    if (smallVersion) {
        return (
            <FancyButton
                clipThingsProps={{
                    clipSize: "3px",
                    clipSlantSize: "0px",
                    backgroundColor: isMoving ? colors.lightGrey : colors.gold,
                    opacity: 1,
                    border: { isFancy: true, borderColor: isMoving ? colors.lightGrey : colors.gold, borderThickness: "1px" },
                    sx: { position: "relative", width: "100%" },
                }}
                sx={{ px: ".2rem", py: ".3rem", color: "#000000" }}
                onClick={onClick}
            >
                <Typography
                    variant="caption"
                    sx={{
                        textAlign: "center",
                        lineHeight: 1,
                        fontWeight: "fontWeightBold",
                        color: isMoving ? "#000000" : "#000000",
                        transition: "all .2s",
                    }}
                >
                    {isMoving ? "CANCEL" : "MOVE"}
                </Typography>
            </FancyButton>
        )
    }

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
                    percent={((MECH_MOVE_COOLDOWN_SECONDS - totalSecRemain) / MECH_MOVE_COOLDOWN_SECONDS) * 100}
                    color={colors.gold}
                    backgroundColor="#FFFFFF06"
                    thickness={`${WIDTH_STAT_BAR}rem`}
                />
            </Box>
        </>
    )
}
