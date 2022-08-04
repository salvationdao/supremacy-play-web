import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { SvgClose2, SvgDrag } from "../../../assets"
import { useAuth, useMiniMap, useSnackbar } from "../../../containers"
import { shadeColor } from "../../../helpers"
import { useTimer } from "../../../hooks"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { LocationSelectType, PlayerAbility, WarMachineState } from "../../../types"
import { DEAD_OPACITY, WIDTH_SKILL_BUTTON } from "./WarMachineItem"

export const MechMoveCommandAbility: PlayerAbility = {
    id: "mech_move_command",
    blueprint_id: "mech_move_command",
    count: 1,
    last_purchased_at: new Date(),
    ability: {
        id: "",
        game_client_ability_id: 8,
        label: "MOVE COMMAND",
        image_url: "",
        description: "Command the war machine to move to a specific location.",
        text_colour: "#000000",
        colour: colors.gold,
        location_select_type: LocationSelectType.MECH_COMMAND,
        created_at: new Date(),
        inventory_limit: 10,
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

    if (!mechMoveCommand || !isAlive) return null

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
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { setPlayerAbility } = useMiniMap()

    const { totalSecRemain } = useTimer(new Date(new Date().getTime() + remainCooldownSeconds * 1000))
    const ready = useMemo(() => totalSecRemain <= 0, [totalSecRemain])

    const primaryColor = isMoving ? colors.grey : MechMoveCommandAbility.ability.colour
    const secondaryColor = isMoving ? "#FFFFFF" : MechMoveCommandAbility.ability.text_colour
    const backgroundColor = useMemo(() => shadeColor(primaryColor, -84), [primaryColor])

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
            <Stack
                direction="row"
                alignItems="center"
                spacing=".4rem"
                sx={{
                    position: "relative",
                    height: "3rem",
                    width: "100%",
                }}
            >
                {/* Image */}
                <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        flexShrink: 0,
                        width: "3rem",
                        height: "100%",
                        cursor: "pointer",
                        backgroundColor: backgroundColor,
                        border: `${primaryColor} 1.5px solid`,
                        ":hover": { borderWidth: "3px" },
                    }}
                    onClick={onClick}
                >
                    {isMoving ? <SvgClose2 size="1.6rem" sx={{ pb: 0 }} fill={primaryColor} /> : <SvgDrag size="1.6rem" sx={{ pb: 0 }} fill={primaryColor} />}
                </Stack>

                <Typography
                    variant="body2"
                    sx={{
                        pt: ".2rem",
                        opacity: ready ? 1 : 0.6,
                        lineHeight: 1,
                        fontWeight: "fontWeightBold",
                        display: "-webkit-box",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1, // change to max number of lines
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {ready ? MechMoveCommandAbility.ability.label : `${totalSecRemain}s`}
                </Typography>
            </Stack>
        )
    }

    return (
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
    )
}
