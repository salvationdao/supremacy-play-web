import { Box, Fade, Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { SvgDrag } from "../../../assets"
import { useAuth, useMiniMap, useSnackbar } from "../../../containers"
import { shadeColor } from "../../../helpers"
import { useTimer } from "../../../hooks"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { BlueprintPlayerAbility, Faction, LocationSelectType, WarMachineState } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"
import { FancyButton } from "../../Common/FancyButton"
import { ProgressBar } from "../../Common/ProgressBar"
import { TopText } from "../../VotingSystem/FactionAbility/TopText"

const fake: MechMoveCommand = {
    id: "string",
    mech_id: "string",
    triggered_by_id: "string",
    remain_cooldown_seconds: 26,
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

interface MechMoveCommandProps {
    warMachine: WarMachineState
    faction: Faction
    clipSlantSize: string
    onClose: () => void
}

export const MechMoveCommandCard = ({ warMachine, faction, clipSlantSize, onClose }: MechMoveCommandProps) => {
    const { factionID } = useAuth()
    const { hash, factionID: wmFactionID, participantID } = warMachine
    const [mechMoveCommand, setMechMoveCommand] = useState<MechMoveCommand>(fake)
    const backgroundColor = useMemo(() => shadeColor(faction.primary_color, -70), [faction.primary_color])

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
                                    icon={<SvgDrag size="1.1rem" sx={{ pb: 0 }} />}
                                    colour={faction.primary_color}
                                    label={"Move Command"}
                                />
                                <Typography variant="body2" style={{ lineHeight: 1, color: `${faction.primary_color} !important` }}>
                                    10 SUPS
                                </Typography>
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
                                <MechCommandCooldownBar
                                    key={mechMoveCommand.id}
                                    remainCooldownSeconds={mechMoveCommand.remain_cooldown_seconds}
                                    color={faction.primary_color}
                                />
                            </Box>

                            <MechCommandButton
                                color={faction.primary_color}
                                remainCooldownSeconds={mechMoveCommand.remain_cooldown_seconds}
                                textColor={faction.secondary_color}
                                isCancelled={!!mechMoveCommand.cancelled_at}
                                hash={hash}
                                mechMoveCommandID={mechMoveCommand.id}
                                onClose={onClose}
                            />
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
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { setPlayerAbility } = useMiniMap()
    const { totalSecRemain } = useTimer(new Date(new Date().getTime() + remainCooldownSeconds * 1000))

    const text = useMemo(() => {
        if (totalSecRemain > 0 && !isCancelled) return "CANCEL"
        return "ACTIVATE"
    }, [totalSecRemain, isCancelled])

    const backgroundColor = useMemo(() => {
        if (totalSecRemain > 0) return "#14182B"
        return color || "#14182B"
    }, [totalSecRemain, color])

    const colorText = useMemo(() => {
        if (totalSecRemain > 0 && isCancelled) return "#FFFFFF20"
        return textColor || "#FFFFFF"
    }, [totalSecRemain, isCancelled, textColor])

    const onActivate = useCallback(() => {
        setPlayerAbility({
            count: 1,
            last_purchased_at: new Date(),
            mechHash: hash,
            ability: { ...MechMoveCommandAbility, text_colour: colorText, colour: backgroundColor },
        })
        onClose()
    }, [backgroundColor, colorText, hash, onClose, setPlayerAbility])

    const onCancel = useCallback(async () => {
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
    }, [hash, mechMoveCommandID, newSnackbarMessage, send])

    const onClick = useMemo(() => {
        if (totalSecRemain > 0 && !isCancelled) return onCancel
        return onActivate
    }, [totalSecRemain, isCancelled, onActivate, onCancel])

    return (
        <FancyButton
            clipThingsProps={{
                clipSize: "5px",
                backgroundColor: backgroundColor,
                border: { isFancy: true, borderColor: color || "#14182B" },
                sx: { flex: 1, position: "relative", width: "100%" },
            }}
            disabled={totalSecRemain > 0 && isCancelled}
            sx={{ py: ".45rem", minWidth: "2rem" }}
            onClick={onClick}
        >
            <Stack alignItems="center" justifyContent="center" direction="row">
                <Typography
                    variant="body2"
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

const MechCommandCooldownBar = ({ remainCooldownSeconds, color }: { remainCooldownSeconds: number; color: string }) => {
    const { totalSecRemain } = useTimer(new Date(new Date().getTime() + remainCooldownSeconds * 1000))
    return (
        <ProgressBar
            percent={((30.0 - totalSecRemain) / 30.0) * 100}
            color={color || colors.neonBlue}
            backgroundColor="#FFFFFF10"
            thickness=".7rem"
            orientation="horizontal"
        />
    )
}
