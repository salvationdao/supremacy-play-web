import { Box, Fade, Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { shadeColor } from "../../../helpers"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { GameAbility, WarMachineState } from "../../../types"
import { TopText } from "../../VotingSystem/FactionAbility/TopText"
import { useInterval } from "../../../hooks"

export interface ContributeFactionUniqueAbilityRequest {
    ability_identity: string
    ability_offering_id: string
    percentage: number
}

interface MechAbilityItemProps {
    warMachine: WarMachineState
    gameAbility: GameAbility
    clipSlantSize?: string
}

export const WarMachineAbilityItem = ({ warMachine, gameAbility, clipSlantSize }: MechAbilityItemProps) => {
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
                            borderThickness: ".15rem",
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
                                <MechAbilityButton warMachine={warMachine} gameAbility={gameAbility} />
                            </Stack>
                        </Stack>
                    </ClipThing>
                </Box>
            </Fade>
        </Box>
    )
}

export const MechAbilityButton = ({ warMachine, gameAbility }: { warMachine: WarMachineState; gameAbility: GameAbility }) => {
    const { participantID, hash } = warMachine
    const { id, colour, text_colour } = gameAbility

    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [remainSeconds, setRemainSeconds] = useState(30)

    // Listen on the progress of the votes
    useGameServerSubscriptionFaction<number | undefined>(
        {
            URI: `/mech/${participantID}/abilities/${id}/cool_down_seconds`,
            key: GameServerKeys.SubMechAbilityCoolDown,
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
        try {
            await send<boolean, { mech_hash: string; game_ability_id: string }>(GameServerKeys.TriggerWarMachineAbility, {
                mech_hash: hash,
                game_ability_id: id,
            })
        } catch (e) {
            console.error(e)
        }
    }, [hash, id, send])

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
