import { Box, Fade, Stack } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ClipThing } from "../.."
import { useGame } from "../../../containers"
import { shadeColor } from "../../../helpers"
import { useGameServerCommandsFaction, useGameServerSubscriptionAbilityFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { GameAbility, GameAbilityProgress } from "../../../types"
import { ProgressBar } from "../../Common/ProgressBar"
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
    progressWsURI?: string
}

export const FactionAbilityItem = ({ gameAbility, abilityMaxPrice, clipSlantSize, progressWsURI }: FactionAbilityItemProps) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { bribeStage } = useGame()

    const [gameAbilityProgress, setGameAbilityProgress] = useState<GameAbilityProgress>()
    const [offeringID, setOfferingID] = useState<string>(gameAbility.ability_offering_id)
    const [currentSups, setCurrentSups] = useState(new BigNumber(gameAbility.current_sups).dividedBy("1000000000000000000"))
    const [supsCost, setSupsCost] = useState(new BigNumber(gameAbility.sups_cost).dividedBy("1000000000000000000"))
    const [initialTargetCost, setInitialTargetCost] = useState<BigNumber>(
        abilityMaxPrice || new BigNumber(gameAbility.sups_cost).dividedBy("1000000000000000000"),
    )

    const { identity } = gameAbility

    // Listen on the progress of the votes
    useGameServerSubscriptionAbilityFaction<GameAbilityProgress | undefined>(
        {
            URI: progressWsURI || "/faction",
            key: GameServerKeys.SubAbilityProgress,
        },
        (payload) => {
            if (!payload || payload.id !== identity) return
            setGameAbilityProgress(payload)
        },
    )

    // Set states
    useEffect(() => {
        if (!gameAbilityProgress) return
        const currentSups = new BigNumber(gameAbilityProgress.current_sups).dividedBy("1000000000000000000")
        const supsCost = new BigNumber(gameAbilityProgress.sups_cost).dividedBy("1000000000000000000")
        setCurrentSups(currentSups)
        setSupsCost(supsCost)
        setOfferingID(gameAbilityProgress.offering_id)

        setInitialTargetCost((prev) => {
            if (gameAbilityProgress.should_reset || prev.isZero()) {
                return supsCost
            }
            return prev
        })
    }, [gameAbilityProgress])

    const onContribute = useCallback(
        async (amount: BigNumber, percentage: number) => {
            if (percentage > 1 || percentage < 0) return

            try {
                await send<boolean, ContributeFactionUniqueAbilityRequest>(GameServerKeys.ContributeFactionUniqueAbility, {
                    ability_identity: identity,
                    ability_offering_id: offeringID,
                    percentage,
                })
            } catch (e) {
                console.error(e)
            }
        },
        [send, identity, offeringID],
    )

    const isVoting = useMemo(() => bribeStage && bribeStage?.phase != "HOLD", [bribeStage])

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

    const backgroundColor = useMemo(() => shadeColor(colour, -75), [colour])

    return (
        <Box>
            <Fade in={true}>
                <Box>
                    <ClipThing
                        clipSize="6px"
                        clipSlantSize={clipSlantSize}
                        border={{
                            isFancy: true,
                            borderColor: colour,
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
                                <ProgressBar
                                    percent={initialTargetCost.isZero() ? 0 : +currentSups.dividedBy(initialTargetCost) * 100}
                                    linePercent={initialTargetCost.isZero() ? 0 : supsCost.dividedBy(initialTargetCost).toNumber() * 100}
                                    color={colour}
                                    backgroundColor="#FFFFFF10"
                                    thickness=".7rem"
                                    orientation="horizontal"
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
