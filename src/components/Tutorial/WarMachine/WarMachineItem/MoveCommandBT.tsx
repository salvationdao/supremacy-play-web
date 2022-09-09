import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useMemo } from "react"
import { SvgClose2, SvgDrag } from "../../../../assets"
import { useAuth, useTraining } from "../../../../containers"
import { shadeColor } from "../../../../helpers"
import { zoomEffect } from "../../../../theme/keyframes"
import { colors } from "../../../../theme/theme"
import { LocationSelectType, MechAbilityStages, PlayerAbility, WarMachineState } from "../../../../types"
import { DEAD_OPACITY, WIDTH_SKILL_BUTTON } from "./WarMachineItemBT"

export const MechMoveCommandAbilityBT: PlayerAbility = {
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
    cell_x?: number
    cell_y?: number
    cancelled_at?: string
    reached_at?: string
    remain_cooldown_seconds: number
}

export const MoveCommandBT = ({ warMachine, isAlive, smallVersion }: { warMachine: WarMachineState; isAlive: boolean; smallVersion?: boolean }) => {
    const { hash } = warMachine
    const { userID } = useAuth()
    let { mechMoveCommand } = useTraining()

    if (!mechMoveCommand) {
        mechMoveCommand = {
            id: "test",
            mech_id: "test",
            triggered_by_id: userID,
            remain_cooldown_seconds: 0,
        }
    }

    const render = useMemo(
        () =>
            mechMoveCommand ? (
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
            ) : null,
        [hash, isAlive, mechMoveCommand, smallVersion],
    )

    return render
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

const MoveCommandInner = ({ isAlive, isMoving, hash, smallVersion }: MoveCommandInnerProps) => {
    const { setPlayerAbility, trainingStage, setTrainingStage } = useTraining()

    const primaryColor = isMoving ? colors.grey : MechMoveCommandAbilityBT.ability.colour
    const secondaryColor = isMoving ? "#FFFFFF" : MechMoveCommandAbilityBT.ability.text_colour
    const backgroundColor = useMemo(() => shadeColor(primaryColor, -84), [primaryColor])

    const onClick = useCallback(async () => {
        if (trainingStage === MechAbilityStages.MoveActionMA) return
        if (!isAlive) return

        setPlayerAbility({
            ...MechMoveCommandAbilityBT,
            mechHash: hash,
        })

        setTrainingStage(MechAbilityStages.MoveMA)
    }, [isAlive, hash, setPlayerAbility, setTrainingStage, trainingStage])

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
                        cursor: trainingStage === MechAbilityStages.MapMA ? "pointer" : "unset",
                        backgroundColor: backgroundColor,
                        border: `${primaryColor} 1.5px solid`,
                        animation: trainingStage === MechAbilityStages.MapMA ? `${zoomEffect(1.25)} 2s infinite` : "unset",
                        ":hover": { borderWidth: trainingStage === MechAbilityStages.MapMA ? "3px" : "1.5px", animation: "unset" },
                    }}
                    onClick={trainingStage === MechAbilityStages.MapMA ? onClick : undefined}
                >
                    {isMoving ? <SvgClose2 size="1.6rem" sx={{ pb: 0 }} fill={primaryColor} /> : <SvgDrag size="1.6rem" sx={{ pb: 0 }} fill={primaryColor} />}
                </Stack>

                <Typography
                    variant="body2"
                    sx={{
                        pt: ".2rem",
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
                    {trainingStage !== MechAbilityStages.MoveActionMA ? MechMoveCommandAbilityBT.ability.label : "CANCEL"}
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
                zIndex: 3,
                opacity: DEAD_OPACITY,
            }}
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
