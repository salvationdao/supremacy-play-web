import { Box, Fade, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useEffect, useState } from "react"
import { ClipThing, VotingButton } from ".."
import { useAuth, useWebsocket } from "../../containers"
import HubKey from "../../keys"
import { zoomEffect } from "../../theme/keyframes"
import { colors } from "../../theme/theme"
import { GameAbility, GameAbilityTargetPrice } from "../../types"
import { NullUUID } from "../../constants"
import { SvgSupToken } from "../../assets"

const ContributionBar = ({
    color,
    initialTargetCost,
    currentSups,
    supsCost,
}: {
    color: string
    initialTargetCost: BigNumber
    currentSups: BigNumber
    supsCost: BigNumber
}) => {
    const progressPercent = initialTargetCost.isZero() ? 0 : currentSups.dividedBy(initialTargetCost).toNumber() * 100
    const costPercent = initialTargetCost.isZero() ? 0 : supsCost.dividedBy(initialTargetCost).toNumber() * 100

    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ width: "100%", px: 1.5, py: 1.2, backgroundColor: "#00000050", borderRadius: 1 }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                sx={{
                    flex: 1,
                    position: "relative",
                    height: 7,
                    backgroundColor: `${colors.text}20`,
                    overflow: "visible",
                }}
            >
                <Box
                    sx={{
                        width: `${progressPercent}%`,
                        height: "100%",
                        transition: "all .25s",
                        backgroundColor: color || colors.neonBlue,
                        zIndex: 5,
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        left: `${costPercent}%`,
                        height: 10,
                        width: 2,
                        backgroundColor: colors.red,
                        zIndex: 6,
                    }}
                />
            </Stack>
            {/* 
            <Typography
                key={progressPercent}
                variant="caption"
                sx={{
                    fontWeight: 'fontWeightBold',
                    lineHeight: 1,
                    animation: `${zoomEffect()} 300ms ease-out`,
                }}
            >
                {Math.round(progressPercent)}%
            </Typography> */}
        </Stack>
    )
}

interface GameAbilityContributeRequest {
    gameAbilityID: string
    amount: BigNumber
}

interface WarMachineAbilityItemProps {
    gameAbility: GameAbility
    maxAbilityPriceMap?: React.MutableRefObject<Map<string, BigNumber>>
}

export const WarMachineAbilityItem = ({ gameAbility, maxAbilityPriceMap }: WarMachineAbilityItemProps) => {
    const { factionID } = useAuth()
    const { state, send, subscribeAbilityNetMessage } = useWebsocket()

    const { label, colour, imageUrl, id } = gameAbility
    // const [refresh, toggleRefresh] = useToggle()
    const [supsCost, setSupsCost] = useState(new BigNumber("0"))
    const [currentSups, setCurrentSups] = useState(new BigNumber("0"))
    const [initialTargetCost, setInitialTargetCost] = useState<BigNumber>(
        maxAbilityPriceMap?.current.get(id) || new BigNumber("0"),
    )
    const [isVoting, setIsVoting] = useState(false)

    const [gameAbilityTargetPrice, setGameAbilityTargetPrice] = useState<GameAbilityTargetPrice>()

    // Listen on current faction ability price change
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeAbilityNetMessage || !factionID || factionID === NullUUID) return

        return subscribeAbilityNetMessage<GameAbilityTargetPrice | undefined>(id, (payload) => {
            if (!payload) return
            setGameAbilityTargetPrice(payload)
        })
    }, [id, state, subscribeAbilityNetMessage, factionID])

    useEffect(() => {
        if (!gameAbilityTargetPrice) return
        const currentSups = new BigNumber(gameAbilityTargetPrice.currentSups).dividedBy("1000000000000000000")
        const supsCost = new BigNumber(gameAbilityTargetPrice.supsCost).dividedBy("1000000000000000000")
        setCurrentSups(currentSups)
        setSupsCost(supsCost)
        setIsVoting(supsCost.isGreaterThanOrEqualTo(currentSups))

        if (gameAbilityTargetPrice.shouldReset || initialTargetCost.isZero()) {
            setInitialTargetCost(supsCost)
        }
    }, [gameAbilityTargetPrice])

    const onContribute = useCallback(
        (amount: number) => async () => {
            if (state !== WebSocket.OPEN) return
            try {
                const resp = await send<boolean, GameAbilityContributeRequest>(HubKey.GameAbilityContribute, {
                    gameAbilityID: id,
                    amount: new BigNumber(amount),
                })

                if (resp) {
                    return true
                } else {
                    throw new Error()
                }
            } catch (e) {
                return false
            }
        },
        [state],
    )

    return (
        <Box key={`${initialTargetCost}`}>
            <Fade in={true}>
                <Box>
                    <ClipThing clipSize="6px" clipSlantSize="5px">
                        <Stack
                            spacing={0.9}
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
                                <Stack spacing={0.9} direction="row" alignItems="center" justifyContent="center">
                                    <Box
                                        sx={{
                                            height: 17,
                                            width: 17,
                                            backgroundImage: `url(${imageUrl})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundColor: colour || "#030409",
                                            mb: 0.3,
                                        }}
                                    />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            lineHeight: 1,
                                            fontWeight: "fontWeightBold",
                                            fontFamily: "Nostromo Regular Medium",
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

                                <Stack direction="row" alignItems="center" justifyContent="center">
                                    <Typography
                                        key={`currentSups-${currentSups.toFixed()}`}
                                        variant="body2"
                                        sx={{
                                            lineHeight: 1,
                                            color: `${colour} !important`,
                                            animation: `${zoomEffect(1.5)} 300ms ease-out`,
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
                                            animation: `${zoomEffect(1.5)} 300ms ease-out`,
                                        }}
                                    >
                                        {supsCost.toFixed(2)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ lineHeight: 1, color: `${colour} !important` }}>
                                        &nbsp;SUP{supsCost.eq(1) ? "" : "S"}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <ContributionBar
                                color={colour}
                                initialTargetCost={initialTargetCost}
                                currentSups={currentSups}
                                supsCost={supsCost}
                            />

                            <Stack direction="row" spacing={0.4} sx={{ mt: 0.6, width: "100%" }}>
                                <VotingButton
                                    color={colour}
                                    amount={1}
                                    cost={1}
                                    isVoting={isVoting}
                                    onClick={onContribute(1)}
                                    Prefix={<SvgSupToken size="14px" fill="#FFFFFF" />}
                                    disableHover
                                />
                                <VotingButton
                                    color={colour}
                                    amount={25}
                                    cost={25}
                                    isVoting={isVoting}
                                    onClick={onContribute(25)}
                                    Prefix={<SvgSupToken size="14px" fill="#FFFFFF" />}
                                    disableHover
                                />
                                <VotingButton
                                    color={colour}
                                    amount={100}
                                    cost={100}
                                    isVoting={isVoting}
                                    onClick={onContribute(100)}
                                    Prefix={<SvgSupToken size="14px" fill="#FFFFFF" />}
                                    disableHover
                                />
                            </Stack>
                        </Stack>
                    </ClipThing>
                </Box>
            </Fade>
        </Box>
    )
}