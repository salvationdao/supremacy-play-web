import { Box, Fade, Stack } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ClipThing, ContributionBar } from "../.."
import { NullUUID } from "../../../constants"
import { useGame, useGameServerAuth, useGameServerWebsocket } from "../../../containers"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { GameAbility, GameAbilityProgress } from "../../../types"
import { SupsBar } from "./SupsBar"
import { TopText } from "./TopText"
import { VotingButtons } from "./VotingButtons"

interface ContributeFactionUniqueAbilityRequest {
    ability_identity: string
    ability_offering_id: string
    percentage: number
}

interface FactionAbilityItemProps {
    gameAbility: GameAbility
    abilityMaxPrice?: BigNumber
    clipSlantSize?: string
}

export const FactionAbilityItem = ({ gameAbility, abilityMaxPrice, clipSlantSize }: FactionAbilityItemProps) => {
    const { state, send, subscribe, subscribeAbilityNetMessage } = useGameServerWebsocket()
    const { factionID } = useGameServerAuth()
    const { bribeStage } = useGame()

    const [shouldIgnore, setIgnore] = useState<boolean>(false)
    const [gameAbilityProgress, setGameAbilityProgress] = useState<GameAbilityProgress>()
    const [offeringID, setOfferingID] = useState<string>(gameAbility.ability_offering_id)
    const [currentSups, setCurrentSups] = useState(new BigNumber(gameAbility.current_sups).dividedBy("1000000000000000000"))
    const [supsCost, setSupsCost] = useState(new BigNumber(gameAbility.sups_cost).dividedBy("1000000000000000000"))
    const [initialTargetCost, setInitialTargetCost] = useState<BigNumber>(
        abilityMaxPrice || new BigNumber(gameAbility.sups_cost).dividedBy("1000000000000000000"),
    )

    const progressPayload = useRef<GameAbilityProgress>()

    const { identity } = gameAbility

    // DO NOT REMOVE THIS! Triggered faction ability or war machine ability price ticking
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !factionID || factionID === NullUUID) return
        return subscribe(GameServerKeys.TriggerFactionAbilityPriceUpdated, () => null, { ability_identity: identity })
    }, [state, subscribe, factionID, identity])

    // Listen on the progress of the votes
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeAbilityNetMessage || !factionID || factionID === NullUUID) return

        return subscribeAbilityNetMessage<GameAbilityProgress | undefined>(identity, (payload) => {
            if (!payload || shouldIgnore) return

            let unchanged = true
            if (!progressPayload.current) {
                unchanged = false
            } else if (payload.sups_cost !== progressPayload.current.sups_cost) {
                unchanged = false
            } else if (payload.current_sups !== progressPayload.current.current_sups) {
                unchanged = false
            } else if (payload.should_reset !== progressPayload.current.should_reset) {
                unchanged = false
            }

            if (unchanged) return
            progressPayload.current = payload
            setGameAbilityProgress(payload)
        })
    }, [identity, state, subscribeAbilityNetMessage, factionID, shouldIgnore])

    // Set states
    useEffect(() => {
        if (!gameAbilityProgress) return
        const currentSups = new BigNumber(gameAbilityProgress.current_sups).dividedBy("1000000000000000000")
        const supsCost = new BigNumber(gameAbilityProgress.sups_cost).dividedBy("1000000000000000000")
        setCurrentSups(currentSups)
        setSupsCost(supsCost)
        setOfferingID(gameAbilityProgress.offering_id)

        if (gameAbilityProgress.should_reset || initialTargetCost.isZero()) {
            setInitialTargetCost(supsCost)
        }
    }, [gameAbilityProgress, initialTargetCost])

    const onContribute = useCallback(
        async (amount: BigNumber, percentage: number) => {
            let ignoreTimeout: boolean

            if (!send || percentage > 1 || percentage < 0) return

            const resp = await send<boolean, ContributeFactionUniqueAbilityRequest>(GameServerKeys.ContributeFactionUniqueAbility, {
                ability_identity: identity,
                ability_offering_id: offeringID,
                percentage,
            })

            if (resp) {
                setGameAbilityProgress((gap: GameAbilityProgress | undefined): GameAbilityProgress | undefined => {
                    if (!gap) return gap
                    const current_sups = new BigNumber(gap.current_sups).plus(amount.multipliedBy("1000000000000000000")).toString()
                    return { ...gap, current_sups }
                })
                setCurrentSups((cs) => {
                    if (!ignoreTimeout) {
                        setIgnore(true)
                        ignoreTimeout = true
                        setTimeout(() => {
                            ignoreTimeout = false
                            setIgnore(false)
                        }, 150)
                    }

                    return BigNumber.minimum(cs.plus(amount), supsCost)
                })
            }
        },
        [send, identity, offeringID, supsCost],
    )

    const isVoting = useMemo(() => bribeStage && bribeStage?.phase != "HOLD" && supsCost.isGreaterThan(currentSups), [bribeStage, supsCost, currentSups])

    return (
        <FactionAbilityItemInner
            gameAbility={gameAbility}
            currentSups={currentSups}
            clipSlantSize={clipSlantSize}
            supsCost={supsCost}
            isVoting={!!isVoting}
            onContribute={onContribute}
            initialTargetCost={initialTargetCost}
        />
    )
}

interface InnerProps {
    gameAbility: GameAbility
    initialTargetCost: BigNumber
    clipSlantSize?: string
    currentSups: BigNumber
    supsCost: BigNumber
    isVoting: boolean
    onContribute: (c: BigNumber, p: number) => void
}

export const FactionAbilityItemInner = ({ gameAbility, initialTargetCost, clipSlantSize, currentSups, supsCost, isVoting, onContribute }: InnerProps) => {
    const { label, colour, text_colour, image_url, description } = gameAbility

    return (
        <Box>
            <Fade in={true}>
                <Box>
                    <ClipThing clipSize="6px" clipSlantSize={clipSlantSize} backgroundColor={colour ? `${colour}` : `${colors.neonBlue}`} opacity={0.12}>
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
                                <TopText description={description} image_url={image_url} colour={colour} label={label} />
                                <SupsBar currentSups={currentSups} colour={colour} supsCost={supsCost} />
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
                                <ContributionBar
                                    color={colour}
                                    initialTargetCost={initialTargetCost}
                                    currentSups={currentSups}
                                    supsCost={supsCost}
                                    forceHundredPercent={false}
                                />
                            </Box>

                            <VotingButtons colour={colour} isVoting={isVoting} supsCost={supsCost} text_colour={text_colour} onContribute={onContribute} />
                        </Stack>
                    </ClipThing>
                </Box>
            </Fade>
        </Box>
    )
}
