import { Box, Fade, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useEffect, useMemo, useState } from "react"
import { ClipThing, ContributionBar, TooltipHelper, VotingButton } from ".."
import {
    BribeStageResponse,
    httpProtocol,
    useGame,
    useGameServerAuth,
    useGameServerWebsocket,
    WebSocketProperties,
} from "../../containers"
import { GameServerKeys } from "../../keys"
import { zoomEffect } from "../../theme/keyframes"
import { colors } from "../../theme/theme"
import { GameAbility, GameAbilityProgress } from "../../types"
import { GAME_SERVER_HOSTNAME, NullUUID } from "../../constants"
import { SvgSupToken } from "../../assets"

interface ContributeFactionUniqueAbilityRequest {
    ability_identity: string
    amount: string
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

    return (
        <FactionAbilityItemInner
            state={state}
            send={send}
            subscribe={subscribe}
            subscribeAbilityNetMessage={subscribeAbilityNetMessage}
            faction_id={faction_id}
            bribeStage={bribeStage}
            gameAbility={gameAbility}
            abilityMaxPrice={abilityMaxPrice}
            clipSlantSize={clipSlantSize}
        />
    )
}

export const FactionAbilityItemInner = ({
    state,
    send,
    subscribe,
    subscribeAbilityNetMessage,
    faction_id,
    bribeStage,
    gameAbility,
    abilityMaxPrice,
    clipSlantSize,
}: FactionAbilityItemProps) => {
    const { label, colour, text_colour, image_url, identity, description } = gameAbility

    const [gameAbilityProgress, setGameAbilityProgress] = useState<GameAbilityProgress>()
    const [currentSups, setCurrentSups] = useState(
        new BigNumber(gameAbility.current_sups).dividedBy("1000000000000000000"),
    )
    const [supsCost, setSupsCost] = useState(new BigNumber(gameAbility.sups_cost).dividedBy("1000000000000000000"))
    const [initialTargetCost, setInitialTargetCost] = useState<BigNumber>(
        abilityMaxPrice || new BigNumber(gameAbility.sups_cost).dividedBy("1000000000000000000"),
    )

    // Triggered faction ability or war machine ability price ticking
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !faction_id || faction_id === NullUUID) return
        return subscribe(GameServerKeys.TriggerFactionAbilityPriceUpdated, () => null, { ability_identity: identity })
    }, [state, subscribe, faction_id, identity])

    // Listen on the progress of the votes
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeAbilityNetMessage || !faction_id || faction_id === NullUUID) return

        return subscribeAbilityNetMessage<GameAbilityProgress | undefined>(identity, (payload) => {
            if (!payload) return
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

        if (gameAbilityProgress.should_reset || initialTargetCost.isZero()) {
            setInitialTargetCost(supsCost)
        }
    }, [gameAbilityProgress])

    const onContribute = async (amount: string) => {
        if (!send) return
        send<boolean, ContributeFactionUniqueAbilityRequest>(
            GameServerKeys.ContributeFactionUniqueAbility,
            {
                ability_identity: identity,
                amount,
            },
            true,
        )
    }

    const isVoting = useMemo(
        () => bribeStage && bribeStage?.phase != "HOLD" && supsCost.isGreaterThanOrEqualTo(currentSups),
        [supsCost, currentSups],
    )

    return (
        <Box key={`${initialTargetCost}`}>
            <Fade in={true}>
                <Box>
                    <ClipThing clipSize="6px" clipSlantSize={clipSlantSize}>
                        <Stack
                            spacing={1}
                            alignItems="flex-start"
                            sx={{
                                flex: 1,
                                minWidth: 325,
                                backgroundColor: colour ? `${colour}15` : `${colors.darkNavyBlue}80`,
                                px: 2,
                                pt: 1.6,
                                pb: 1.6,
                            }}
                        >
                            <Stack
                                spacing={3}
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                alignSelf="stretch"
                            >
                                <TooltipHelper placement="right" text={description}>
                                    <Stack spacing={1} direction="row" alignItems="center" justifyContent="center">
                                        <Box
                                            sx={{
                                                height: 19,
                                                width: 19,
                                                backgroundImage: `url(${httpProtocol()}://${GAME_SERVER_HOSTNAME}${image_url})`,
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition: "center",
                                                backgroundSize: "cover",
                                                backgroundColor: colour || "#030409",
                                                border: `${colour} 1px solid`,
                                                borderRadius: 0.6,
                                                mb: 0.3,
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
                                                maxWidth: 200,
                                            }}
                                        >
                                            {label}
                                        </Typography>
                                    </Stack>
                                </TooltipHelper>

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
                            </Stack>

                            <Box
                                sx={{ width: "100%", px: 1.5, py: 1.2, backgroundColor: "#00000030", borderRadius: 1 }}
                            >
                                <ContributionBar
                                    color={colour}
                                    initialTargetCost={initialTargetCost}
                                    currentSups={currentSups}
                                    supsCost={supsCost}
                                />
                            </Box>

                            <Stack direction="row" spacing={0.4} sx={{ mt: 0.6, width: "100%" }}>
                                <VotingButton
                                    color={colour}
                                    textColor={text_colour || "#FFFFFF"}
                                    amount={"0.1"}
                                    cost={"0.1"}
                                    isVoting={!!isVoting}
                                    onClick={() => onContribute("0.1")}
                                    Prefix={<SvgSupToken size="14px" fill={text_colour || "#FFFFFF"} />}
                                />
                                <VotingButton
                                    color={colour}
                                    textColor={text_colour || "#FFFFFF"}
                                    amount={"1"}
                                    cost={"1"}
                                    isVoting={!!isVoting}
                                    onClick={() => onContribute("1")}
                                    Prefix={<SvgSupToken size="14px" fill={text_colour || "#FFFFFF"} />}
                                />
                                <VotingButton
                                    color={colour}
                                    textColor={text_colour || "#FFFFFF"}
                                    amount={"10"}
                                    cost={"10"}
                                    isVoting={!!isVoting}
                                    onClick={() => onContribute("10")}
                                    Prefix={<SvgSupToken size="14px" fill={text_colour || "#FFFFFF"} />}
                                />
                            </Stack>
                        </Stack>
                    </ClipThing>
                </Box>
            </Fade>
        </Box>
    )
}
