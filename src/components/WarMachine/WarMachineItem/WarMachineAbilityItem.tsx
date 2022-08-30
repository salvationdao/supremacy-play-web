import { Box, Fade, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { useArena } from "../../../containers/arena"
import { MECH_ABILITY_KEY, RecordType, useHotkey } from "../../../containers/hotkeys"
import { shadeColor } from "../../../helpers"
import { useInterval } from "../../../hooks"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { GameAbility, WarMachineState } from "../../../types"
import { TopText } from "../../LeftDrawer/BattleArena/BattleAbility/Common/TopText"

export interface ContributeFactionUniqueAbilityRequest {
    ability_identity: string
    ability_offering_id: string
    percentage: number
}

interface MechAbilityItemProps {
    warMachine: WarMachineState
    gameAbility: GameAbility
    clipSlantSize?: string
    index: number
}

export const WarMachineAbilityItem = ({ warMachine, gameAbility, clipSlantSize, index }: MechAbilityItemProps) => {
    const { label, colour, image_url, description } = gameAbility

    const backgroundColor = useMemo(() => shadeColor(colour, -75), [colour])

    return (
        <Box>
            <Fade in={true}>
                <Box>
                    <ClipThing
                        clipSize="6px"
                        clipSlantSize={clipSlantSize}
                        border={{
                            borderColor: colour,
                            borderThickness: "1px",
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
                                p: ".6rem 1.6rem",
                            }}
                        >
                            <Stack direction="row" alignItems="center" justifyContent="space-between" alignSelf="stretch">
                                <TopText description={description} image_url={image_url} colour={colour} label={label} />
                                <MechAbilityButton warMachine={warMachine} gameAbility={gameAbility} index={index} />
                            </Stack>
                        </Stack>
                    </ClipThing>
                </Box>
            </Fade>
        </Box>
    )
}

export const MechAbilityButton = ({ warMachine, gameAbility, index }: { warMachine: WarMachineState; gameAbility: GameAbility; index: number }) => {
    const { participantID, hash } = warMachine
    const { currentArenaID } = useArena()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { id, colour, text_colour } = gameAbility
    const [remainSeconds, setRemainSeconds] = useState(30)
    const { addToHotkeyRecord } = useHotkey()

    // Listen on the progress of the votes
    useGameServerSubscriptionFaction<number | undefined>(
        {
            URI: `/arena/${currentArenaID}/mech/${participantID}/abilities/${id}/cool_down_seconds`,
            key: GameServerKeys.SubMechAbilityCoolDown,
            ready: !!participantID && !!currentArenaID,
        },
        (payload) => {
            if (payload === undefined) return
            setRemainSeconds(payload)
        },
    )

    useInterval(() => {
        setRemainSeconds((rs) => {
            if (rs === 0) {
                return 0
            }
            return rs - 1
        })
    }, 1000)

    const onTrigger = useCallback(async () => {
        if (!currentArenaID) return
        try {
            await send<boolean, { arena_id: string; mech_hash: string; game_ability_id: string }>(GameServerKeys.TriggerWarMachineAbility, {
                arena_id: currentArenaID,
                mech_hash: hash,
                game_ability_id: id,
            })
        } catch (e) {
            console.error(e)
        }
    }, [hash, id, send, currentArenaID])

    useEffect(() => {
        addToHotkeyRecord(RecordType.Map, MECH_ABILITY_KEY[index], onTrigger)
    }, [onTrigger, addToHotkeyRecord, index])

    return (
        <FancyButton
            disabled={remainSeconds !== 0}
            clipThingsProps={{
                clipSize: "5px",
                backgroundColor: colour || "#14182B",
                border: { isFancy: true, borderColor: colour || "#14182B" },
                sx: { position: "relative" },
            }}
            sx={{ px: "1.2rem", pt: ".4rem", pb: ".5rem", minWidth: "7rem" }}
            onClick={onTrigger}
        >
            <Stack alignItems="center" justifyContent="center" direction="row">
                <Typography
                    variant="body2"
                    sx={{
                        lineHeight: 1,
                        fontWeight: "fontWeightBold",
                        whiteSpace: "nowrap",
                        textTransform: "none",
                        color: remainSeconds > 0 || !text_colour ? "#FFFFFF" : text_colour,
                    }}
                >
                    {remainSeconds > 300 ? "∞" : remainSeconds > 0 ? `${remainSeconds}s` : `FIRE`}
                </Typography>
            </Stack>
        </FancyButton>
    )
}
