import { Box, Fade, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ClipThing, ContributionBar, TooltipHelper, VotingButton } from ".."
import { SvgSupToken } from "../../assets"
import { NullUUID, VOTING_OPTION_COSTS } from "../../constants"
import { BribeStageResponse, useGame, useGameServerAuth, useGameServerWebsocket, WebSocketProperties } from "../../containers"
import { GameServerKeys } from "../../keys"
import { zoomEffect } from "../../theme/keyframes"
import { colors } from "../../theme/theme"
import { GameAbility, GameAbilityProgress } from "../../types"

interface ContributeFactionUniqueAbilityRequest {
    ability_identity: string
    ability_offering_id: string
    percentage: number
}

interface FactionAbilityItemProps extends Partial<WebSocketProperties> {
    gameAbility: GameAbility
    abilityMaxPrice?: BigNumber
    clipSlantSize?: string
    bribeStage?: BribeStageResponse
    faction_id?: string
}

export const FactionAbilityItem = ({ gameAbility, abilityMaxPrice, clipSlantSize }: FactionAbilityItemProps) => {
    const { state, send, subscribe, subscribeAbilityNetMessage } = useGameServerWebsocket()
    const { faction_id } = useGameServerAuth()
    const { bribeStage } = useGame()

    const { label, colour, text_colour, image_url, identity, description, ability_offering_id } = gameAbility

    const [shouldIgnore, setIgnore] = useState<boolean>(false)
    const [gameAbilityProgress, setGameAbilityProgress] = useState<GameAbilityProgress>()
    const [offeringID, setOfferingID] = useState<string>(gameAbility.ability_offering_id)
    const [currentSups, setCurrentSups] = useState(new BigNumber(gameAbility.current_sups).dividedBy("1000000000000000000"))
    const [supsCost, setSupsCost] = useState(new BigNumber(gameAbility.sups_cost).dividedBy("1000000000000000000"))
    const [initialTargetCost, setInitialTargetCost] = useState<BigNumber>(
        abilityMaxPrice || new BigNumber(gameAbility.sups_cost).dividedBy("1000000000000000000"),
    )

    const progressPayload = useRef<GameAbilityProgress>()

    // DO NOT REMOVE THIS! Triggered faction ability or war machine ability price ticking
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !faction_id || faction_id === NullUUID) return
        return subscribe(GameServerKeys.TriggerFactionAbilityPriceUpdated, () => null, { ability_identity: identity })
    }, [state, subscribe, faction_id, identity])

    // Listen on the progress of the votes
    // Listen on the progress of the votes

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeAbilityNetMessage || !faction_id || faction_id === NullUUID) return

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
    }, [identity, state, subscribeAbilityNetMessage, faction_id])

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
    }, [gameAbilityProgress])

    let ignoreTimeout: boolean
    const onContribute = useCallback(
        (amount: BigNumber, percentage: number) => {
            if (!send || percentage > 1 || percentage < 0) return
            setGameAbilityProgress((gap: GameAbilityProgress | undefined): GameAbilityProgress | undefined => {
                if (!gap) return gap
                const current_sups = new BigNumber(gap.current_sups).plus(new BigNumber(amount).multipliedBy("1000000000000000000")).toString()
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
                return cs.plus(new BigNumber(amount, 18))
            })
            send<boolean, ContributeFactionUniqueAbilityRequest>(GameServerKeys.ContributeFactionUniqueAbility, {
                ability_identity: identity,
                ability_offering_id: offeringID,
                percentage,
            })
        },
        [send, identity, offeringID],
    )

    const isVoting = useMemo(
        () => bribeStage && bribeStage?.phase != "HOLD" && supsCost.isGreaterThanOrEqualTo(currentSups),
        [bribeStage, supsCost, currentSups],
    )

    return (
        <FactionAbilityItemInner
            currentSups={currentSups}
            label={label}
            colour={colour}
            description={description}
            text_colour={text_colour}
            image_url={image_url}
            clipSlantSize={clipSlantSize}
            supsCost={supsCost}
            isVoting={!!isVoting}
            onContribute={onContribute}
            initialTargetCost={initialTargetCost}
        />
    )
}

interface InnerProps {
    initialTargetCost: BigNumber
    clipSlantSize?: string
    colour: string
    label: string
    description: string
    text_colour: string
    image_url: string
    currentSups: BigNumber
    supsCost: BigNumber
    isVoting: boolean
    onContribute: (c: BigNumber, p: number) => void
}

export const FactionAbilityItemInner = ({
    initialTargetCost,
    clipSlantSize,
    colour,
    description,
    text_colour,
    image_url,
    label,
    currentSups,
    supsCost,
    isVoting,
    onContribute,
}: InnerProps) => {
    return (
        <Box>
            <Fade in={true}>
                <Box>
                    <ClipThing clipSize="6px" clipSlantSize={clipSlantSize}>
                        <Stack
                            spacing=".8rem"
                            alignItems="flex-start"
                            sx={{
                                flex: 1,
                                minWidth: "32.5rem",
                                backgroundColor: colour ? `${colour}15` : `${colors.darkNavyBlue}80`,
                                px: "1.6rem",
                                pt: "1.28rem",
                                pb: "1.28rem",
                            }}
                        >
                            <Stack spacing="2.4rem" direction="row" alignItems="center" justifyContent="space-between" alignSelf="stretch">
                                <TopText description={description} image_url={image_url} colour={colour} label={label} />
                                <SupsStackBar currentSups={currentSups} colour={colour} supsCost={supsCost} />
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

interface TopTextProps {
    description: string
    image_url: string
    colour: string
    label: string
}

const TopText = ({ description, image_url, colour, label }: TopTextProps) => (
    <TooltipHelper placement="right" text={description}>
        <Stack spacing=".8rem" direction="row" alignItems="center" justifyContent="center">
            <Box
                sx={{
                    height: "1.9rem",
                    width: "1.9rem",
                    backgroundImage: `url(${image_url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundColor: colour || "#030409",
                    border: `${colour} 1px solid`,
                    borderRadius: 0.6,
                    mb: ".24rem",
                }}
            />
            <Typography
                variant="body1"
                sx={{
                    lineHeight: 1,
                    fontWeight: "fontWeightBold",
                    fontFamily: "Nostromo Regular Bold",
                    color: colour,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "20rem",
                }}
            >
                {label}
            </Typography>
        </Stack>
    </TooltipHelper>
)

interface SupsStackBarProps {
    currentSups: BigNumber
    colour: string
    supsCost: BigNumber
}

const SupsStackBar = ({ currentSups, colour, supsCost }: SupsStackBarProps) => (
    <Stack direction="row" alignItems="center" justifyContent="center">
        <Typography
            key={`currentSups-${currentSups.toFixed()}`}
            variant="body2"
            sx={{
                lineHeight: 1,
                color: `${colour} !important`,
                animation: `${zoomEffect(1.2)} 300ms ease-out`,
            }}
        >
            {currentSups.toFixed(2)}
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1, color: `${colour} !important` }}>
            &nbsp;/&nbsp;
        </Typography>
        <Typography
            key={`supsCost-${supsCost.toFixed()}`}
            variant="body2"
            sx={{
                lineHeight: 1,
                color: `${colour} !important`,
                animation: `${zoomEffect(1.2)} 300ms ease-out`,
            }}
        >
            {supsCost.toFixed(2)}
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1, color: `${colour} !important` }}>
            &nbsp;SUP{supsCost.eq(1) ? "" : "S"}
        </Typography>
    </Stack>
)

interface VotingButtonsProps {
    colour: string
    text_colour: string
    isVoting: boolean
    supsCost: BigNumber
    onContribute: (c: BigNumber, p: number) => void
}

const VotingButtons = ({ colour, text_colour, isVoting, supsCost, onContribute }: VotingButtonsProps) => {
    const voteCosts = VOTING_OPTION_COSTS.map((voteCost) => {
        const cost = supsCost.multipliedBy(voteCost.percentage / 100)
        return {
            cost: cost.isLessThan(voteCost.minCost) ? voteCost.minCost : cost,
            percentage: voteCost.percentage,
        }
    })
    return (
        <Stack direction="row" spacing=".32rem" sx={{ mt: ".48rem", width: "100%" }}>
            {voteCosts.map((c) => (
                <VotingButton
                    key={`faction-ability-vote-cost-button-${c.cost.toFixed(2)}`}
                    color={colour}
                    textColor={text_colour || "#FFFFFF"}
                    percentage={c.percentage.toFixed(1)}
                    cost={c.cost.toFixed(2)}
                    isVoting={isVoting}
                    onClick={() => onContribute(c.cost, c.percentage)}
                    Prefix={<SupsToken text_colour={text_colour} />}
                />
            ))}
        </Stack>
    )
}

const SupsToken = ({ text_colour }: { text_colour: string }) => <SvgSupToken size="1.4rem" fill={text_colour || "#FFFFFF"} />
