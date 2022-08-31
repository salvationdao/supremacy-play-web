import { Stack, Typography } from "@mui/material"
import { useEffect, useMemo } from "react"
import { SvgDrag } from "../../../assets"
import { RecordType, useHotkey } from "../../../containers/hotkeys"
import { shadeColor } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { LocationSelectType, PlayerAbility, WarMachineState } from "../../../types"

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

export const MoveCommand = ({
    warMachine,
    activateMechMoveCommand,
}: {
    warMachine: WarMachineState
    isAlive: boolean
    activateMechMoveCommand: () => void
}) => {
    const { hash } = warMachine

    return <MoveCommandInner key={hash} activateMechMoveCommand={activateMechMoveCommand} />
}

interface MoveCommandInnerProps {
    activateMechMoveCommand: () => void
}

const MoveCommandInner = ({ activateMechMoveCommand }: MoveCommandInnerProps) => {
    const { addToHotkeyRecord } = useHotkey()

    const primaryColor = MechMoveCommandAbility.ability.colour
    const backgroundColor = useMemo(() => shadeColor(primaryColor, -84), [primaryColor])

    useEffect(() => {
        addToHotkeyRecord(RecordType.MiniMap, "a", activateMechMoveCommand)
    }, [activateMechMoveCommand, addToHotkeyRecord])

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
                onClick={activateMechMoveCommand}
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
