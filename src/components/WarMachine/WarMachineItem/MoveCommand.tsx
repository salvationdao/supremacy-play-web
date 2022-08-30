import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo } from "react"
import { SvgDrag } from "../../../assets"
import { useMiniMap } from "../../../containers"
import { useArena } from "../../../containers/arena"
import { RecordType, useHotkey } from "../../../containers/hotkeys"
import { shadeColor } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { LocationSelectType, PlayerAbility, WarMachineState } from "../../../types"
import { DEAD_OPACITY, WIDTH_SKILL_BUTTON } from "./WarMachineItem"

export const MechMoveCommandAbility: PlayerAbility = {
    id: "mech_move_command",
    blueprint_id: "mech_move_command",
    count: 1,
    last_purchased_at: new Date(),
    cooldown_expires_on: new Date(),
    ability: {
        id: "",
        game_client_ability_id: 8,
        label: "MOVE COMMAND",
        image_url: "",
        description: "Command the war machine to move to a specific location.",
        text_colour: "#000000",
        colour: colors.gold,
        location_select_type: LocationSelectType.MechCommand,
        created_at: new Date(),
        inventory_limit: 10,
        cooldown_seconds: 5,
    },
}

export interface MechMoveCommand {
    id: string
    mech_id: string
    triggered_by_id: string
    cell_x: number
    cell_y: number
    cancelled_at?: string
    reached_at?: string
    is_moving: boolean
    remain_cooldown_seconds: number
    is_mini_mech: boolean
}

export const MoveCommand = ({ warMachine, isAlive, smallVersion }: { warMachine: WarMachineState; isAlive: boolean; smallVersion?: boolean }) => {
    const { hash } = warMachine

    if (!isAlive) return null

    return <MoveCommandInner key={hash} hash={hash} isAlive={isAlive} smallVersion={smallVersion} />
}

interface MoveCommandInnerProps {
    hash: string
    isAlive: boolean
    smallVersion?: boolean
}

const MoveCommandInner = ({ isAlive, hash, smallVersion }: MoveCommandInnerProps) => {
    const { currentArenaID } = useArena()
    const { setPlayerAbility } = useMiniMap()
    const { addToHotkeyRecord } = useHotkey()

    const primaryColor = MechMoveCommandAbility.ability.colour
    const secondaryColor = MechMoveCommandAbility.ability.text_colour
    const backgroundColor = useMemo(() => shadeColor(primaryColor, -84), [primaryColor])

    const onClick = useCallback(() => {
        if (!isAlive || !currentArenaID) return

        setPlayerAbility({
            ...MechMoveCommandAbility,
            mechHash: hash,
        })
    }, [isAlive, hash, setPlayerAbility, currentArenaID])

    useEffect(() => {
        addToHotkeyRecord(RecordType.MiniMap, "a", onClick)
    }, [onClick, addToHotkeyRecord])

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
                    <SvgDrag size="1.6rem" sx={{ pb: 0 }} fill={primaryColor} />
                </Stack>

                <Stack direction={"row"} sx={{ flex: 1 }} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography
                        variant="body2"
                        sx={{
                            pt: ".2rem",
                            opacity: 1,
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
                        {MechMoveCommandAbility.ability.label}
                    </Typography>

                    <Typography variant="body2" sx={{ color: colors.neonBlue }}>
                        <i>
                            <strong>[a]</strong>
                        </i>
                    </Typography>
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
                backgroundColor: primaryColor,
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
                        color: secondaryColor,
                        letterSpacing: 1,
                        transition: "all .2s",
                    }}
                >
                    MOVE
                </Typography>
            </Box>
        </Box>
    )
}
