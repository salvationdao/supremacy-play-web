import { Box, Fade, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ClipThing } from "../../.."
import { useAuth, useGame, useMiniMap } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { useInterval, useToggle } from "../../../../hooks"
import { useGameServerCommandsFaction, useGameServerSubscription, useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"
import { AIType, BribeStage, GameAbility, WarMachineLiveState, WarMachineState } from "../../../../types"
import { MoveCommand } from "../../../WarMachine/WarMachineItem/MoveCommand"
import { useArena } from "../../../../containers/arena"
import { RecordType, useHotkey } from "../../../../containers/hotkeys"

export const HighlightedMechAbilities = () => {
    const { userID } = useAuth()
    const { bribeStage, warMachines, spawnedAI } = useGame()
    const { highlightedMechParticipantID, isTargeting } = useMiniMap()

    const isVoting = useMemo(() => bribeStage && bribeStage?.phase !== BribeStage.Hold, [bribeStage])

    const highlightedMech = useMemo(() => {
        return [...(warMachines || []), ...(spawnedAI || [])].find((m) => m.participantID === highlightedMechParticipantID)
    }, [highlightedMechParticipantID, spawnedAI, warMachines])

    if (isTargeting || !highlightedMechParticipantID || !highlightedMech || highlightedMech?.ownedByID !== userID || !isVoting) {
        return null
    }

    return <HighlightedMechAbilitiesInner key={highlightedMechParticipantID} warMachine={highlightedMech} />
}

const HighlightedMechAbilitiesInner = ({ warMachine }: { warMachine: WarMachineState }) => {
    const { userID } = useAuth()
    const { currentArenaID } = useArena()
    const theme = useTheme()
    const { participantID, ownedByID } = warMachine
    const [isAlive, toggleIsAlive] = useToggle(warMachine.health > 0)

    const isMiniMech = warMachine.aiType === AIType.MiniMech

    // Subscribe to war machine ability updates
    const gameAbilities = useGameServerSubscriptionFaction<GameAbility[] | undefined>({
        URI: `/arena/${currentArenaID}/mech/${participantID}/abilities`,
        key: GameServerKeys.SubWarMachineAbilitiesUpdated,
        ready: !!participantID && !!currentArenaID,
    })

    // Listen on current war machine changes
    useGameServerSubscription<WarMachineLiveState | undefined>(
        {
            URI: `/public/arena/${currentArenaID}/mech/${participantID}`,
            key: GameServerKeys.SubMechLiveStats,
            ready: !!participantID && !!currentArenaID,
            batchURI: `/public/arena/${currentArenaID}/mech`,
        },
        (payload) => {
            if (payload?.health !== undefined) {
                if (payload.health <= 0) toggleIsAlive(false)
            }
        },
    )

    if (!isAlive) {
        return null
    }

    return (
        <Fade in>
            <ClipThing
                clipSize="8px"
                border={{
                    borderColor: userID === ownedByID ? colors.gold : theme.factionTheme.primary,
                    borderThickness: "2px",
                }}
                corners={{ bottomLeft: true }}
                opacity={0.3}
                backgroundColor={theme.factionTheme.background}
                sx={{ position: "absolute", top: "3.5rem", left: ".4rem" }}
            >
                <Stack
                    spacing=".8rem"
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    sx={{ p: ".8rem .9rem", width: "17rem" }}
                >
                    {!isMiniMech &&
                        gameAbilities &&
                        gameAbilities.length > 0 &&
                        gameAbilities.map((ga, i) => {
                            return <AbilityItem key={ga.id} hash={warMachine.hash} participantID={participantID} ability={ga} index={i} />
                        })}

                    {userID === ownedByID && <MoveCommand isAlive={isAlive} warMachine={warMachine} smallVersion />}
                </Stack>
            </ClipThing>
        </Fade>
    )
}

const AbilityItem = ({ hash, participantID, ability, index }: { hash: string; participantID: number; ability: GameAbility; index: number }) => {
    const { id, colour, image_url, label } = ability
    const { currentArenaID } = useArena()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [remainSeconds, setRemainSeconds] = useState(30)
    const ready = useMemo(() => remainSeconds === 0, [remainSeconds])
    const { mechAbilityKey, addToHotkeyRecord } = useHotkey()

    useGameServerSubscriptionFaction<number | undefined>(
        {
            URI: `/arena/${currentArenaID}/mech/${participantID}/abilities/${id}/cool_down_seconds`,
            key: GameServerKeys.SubMechAbilityCoolDown,
            ready: !!currentArenaID && !!participantID,
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
        addToHotkeyRecord(RecordType.Map, mechAbilityKey[index], onTrigger)
    }, [onTrigger, mechAbilityKey, addToHotkeyRecord, index])

    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing=".4rem"
            sx={{
                position: "relative",
                height: "3rem",
                width: "100%",
                opacity: ready ? 1 : 0.6,
                pointerEvents: ready ? "all" : "none",
            }}
        >
            {/* Image */}
            <Box
                sx={{
                    flexShrink: 0,
                    width: "3rem",
                    height: "100%",
                    cursor: "pointer",
                    background: `url(${image_url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    border: `${colour} 1.5px solid`,
                    ":hover": ready ? { borderWidth: "3px", transform: "scale(1.04)" } : undefined,
                }}
                onClick={ready ? onTrigger : undefined}
            />

            <Stack direction={"row"} sx={{ flex: 1 }} justifyContent={"space-between"} alignItems={"center"}>
                <Typography
                    variant="body2"
                    sx={{
                        pt: ".4rem",
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
                    {ready ? label : remainSeconds > 300 ? "∞" : `${remainSeconds}s`}
                </Typography>

                {ready && (
                    <Typography variant="body2" sx={{ color: colors.neonBlue }}>
                        <i>
                            <strong>[{mechAbilityKey[index]}]</strong>
                        </i>
                    </Typography>
                )}
            </Stack>
        </Stack>
    )
}
