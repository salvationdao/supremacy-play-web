import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { SvgClose2, SvgDrag } from "../../../assets"
import { useAuth } from "../../../containers"
import { shadeColor } from "../../../helpers"
import { useTimer } from "../../../hooks"
import { useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { WarMachineState } from "../../../types"
import { DEAD_OPACITY, WIDTH_SKILL_BUTTON } from "./WarMachineItem"
import { MechMoveCommandAbility, useHotkey } from "../../../containers/hotkeys"

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
    const { setMechMoveCommand, mechMoveCommand } = useHotkey()

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
            warMachine={warMachine}
            remainCooldownSeconds={mechMoveCommand.remain_cooldown_seconds}
            isMoving={!mechMoveCommand?.reached_at && !mechMoveCommand?.cancelled_at && mechMoveCommand.remain_cooldown_seconds !== 0}
            smallVersion={smallVersion}
        />
    )
}

interface MoveCommandInnerProps {
    isAlive: boolean
    isMoving: boolean
    remainCooldownSeconds: number
    smallVersion?: boolean
    warMachine: WarMachineState
}

const MoveCommandInner = ({ isAlive, remainCooldownSeconds, isMoving, warMachine, smallVersion }: MoveCommandInnerProps) => {
    const { handleMechMove } = useHotkey()

    const { totalSecRemain } = useTimer(new Date(new Date().getTime() + remainCooldownSeconds * 1000))
    const ready = useMemo(() => totalSecRemain <= 0, [totalSecRemain])

    const primaryColor = isMoving ? colors.grey : MechMoveCommandAbility.ability.colour
    const secondaryColor = isMoving ? "#FFFFFF" : MechMoveCommandAbility.ability.text_colour
    const backgroundColor = useMemo(() => shadeColor(primaryColor, -84), [primaryColor])

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
                    onClick={() => handleMechMove(warMachine)}
                >
                    {isMoving ? <SvgClose2 size="1.6rem" sx={{ pb: 0 }} fill={primaryColor} /> : <SvgDrag size="1.6rem" sx={{ pb: 0 }} fill={primaryColor} />}
                </Stack>

                <Stack direction={"row"} sx={{ width: "100%" }} justifyContent={"space-between"} alignItems={"center"}>
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
                    <Typography sx={{ opacity: "0.7" }}>[a]</Typography>
                </Stack>
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
            onClick={() => handleMechMove(warMachine)}
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
