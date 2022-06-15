import { Box, Divider, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useMemo, useState } from "react"
import { ClipThing, FancyButton } from "../../.."
import { SvgSupToken, SvgWallet } from "../../../../assets"
import { useAuth, useSnackbar } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { numberCommaFormatter, numFormatter, timeDiff, timeSince } from "../../../../helpers"
import { useInterval, useToggle } from "../../../../hooks"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { ItemType, MarketUser } from "../../../../types/marketplace"
import { ConfirmModal } from "../../../Common/ConfirmModal"

interface BuyNowDetailsProps {
    id: string
    itemType: ItemType
    owner?: MarketUser
    itemName: string
    buyNowPrice: string
    dutchAuctionDropRate?: string
    createdAt: Date
    isTimeEnded: boolean
}

export const BuyNowDetails = ({ id, itemType, owner, itemName, buyNowPrice, dutchAuctionDropRate, createdAt, isTimeEnded }: BuyNowDetailsProps) => {
    const { userID } = useAuth()

    const calculateNewPrice = useCallback(() => {
        let newPrice = new BigNumber(buyNowPrice).shiftedBy(-18)

        // Drop price
        if (dutchAuctionDropRate) {
            const dropRate = new BigNumber(dutchAuctionDropRate).shiftedBy(-18)
            newPrice = BigNumber.max(newPrice.minus(dropRate.multipliedBy(timeDiff(createdAt, new Date()).minutes)), new BigNumber(1))
        }
        return newPrice
    }, [buyNowPrice, createdAt, dutchAuctionDropRate])

    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { newSnackbarMessage } = useSnackbar()
    const [currentPrice, setCurrentPrice] = useState<BigNumber>(calculateNewPrice())
    const [confirmBuyModalOpen, toggleConfirmBuyModalOpen] = useToggle()

    // Buying
    const [isLoading, setIsLoading] = useState(false)
    const [buyError, setBuyError] = useState<string>()

    const primaryColor = useMemo(() => theme.factionTheme.primary, [theme.factionTheme])
    const secondaryColor = useMemo(() => theme.factionTheme.secondary, [theme.factionTheme])
    const backgroundColor = useMemo(() => theme.factionTheme.background, [theme.factionTheme])
    const formattedCommaPrice = useMemo(() => numberCommaFormatter(currentPrice.toNumber()), [currentPrice])

    const confirmBuy = useCallback(async () => {
        try {
            setIsLoading(true)
            const isKeycard = itemType === ItemType.Keycards

            const resp = await send(isKeycard ? GameServerKeys.MarketplaceSalesKeycardBuy : GameServerKeys.MarketplaceSalesBuy, {
                id,
            })

            if (!resp) return
            newSnackbarMessage(`Successfully purchased ${itemName}.`, "success")
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to purchase item."
            setBuyError(message)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [id, itemName, itemType, newSnackbarMessage, send])

    const isSelfItem = userID === owner?.id

    return (
        <>
            <Stack spacing="2rem">
                <Divider />

                {dutchAuctionDropRate && (
                    <Box>
                        <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                            PRICE DROP:
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: "fontWeightBold", span: { color: colors.lightNeonBlue, fontFamily: "inherit" } }}>
                            NEXT PRICE DROP IN{" "}
                            <span>{<PriceDropper createdAt={createdAt} calculateNewPrice={calculateNewPrice} setCurrentPrice={setCurrentPrice} />}</span>{" "}
                            SECONDS
                        </Typography>
                    </Box>
                )}

                <Stack>
                    <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                        BUYOUT:
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing="2rem">
                        <ClipThing
                            clipSize="10px"
                            clipSlantSize="3px"
                            border={{
                                isFancy: true,
                                borderColor: primaryColor,
                                borderThickness: ".2rem",
                            }}
                            corners={{
                                topRight: true,
                                bottomLeft: true,
                            }}
                            backgroundColor={backgroundColor}
                            sx={{ alignSelf: "flex-start" }}
                        >
                            <Stack direction="row" alignItems="center" spacing=".2rem" sx={{ pl: "1.5rem", pr: "1.6rem", py: ".5rem" }}>
                                <SvgSupToken size="2.2rem" fill={colors.yellow} sx={{ mt: ".1rem" }} />
                                <Typography variant="h5" sx={{ fontWeight: "fontWeightBold" }}>
                                    {formattedCommaPrice}
                                </Typography>
                            </Stack>
                        </ClipThing>

                        <FancyButton
                            excludeCaret
                            disabled={isSelfItem || isTimeEnded}
                            clipThingsProps={{
                                clipSize: "9px",
                                backgroundColor: primaryColor,
                                opacity: 1,
                                border: { isFancy: true, borderColor: primaryColor, borderThickness: "2px" },
                                sx: { position: "relative", width: "18rem" },
                            }}
                            sx={{ py: ".7rem", color: secondaryColor }}
                            onClick={() => toggleConfirmBuyModalOpen(true)}
                        >
                            <Stack direction="row" spacing=".9rem" alignItems="center" justifyContent="center">
                                <SvgWallet size="1.9rem" fill={secondaryColor} />

                                <Typography
                                    variant="body2"
                                    sx={{
                                        flexShrink: 0,
                                        color: secondaryColor,
                                        fontFamily: fonts.nostromoBlack,
                                    }}
                                >
                                    BUY NOW
                                </Typography>
                            </Stack>
                        </FancyButton>
                    </Stack>
                </Stack>
            </Stack>

            {confirmBuyModalOpen && !isSelfItem && !isTimeEnded && (
                <ConfirmModal
                    title="CONFIRMATION"
                    onConfirm={confirmBuy}
                    onClose={() => toggleConfirmBuyModalOpen(false)}
                    isLoading={isLoading}
                    error={buyError}
                    confirmSuffix={
                        <>
                            <SvgSupToken size="1.8rem" />
                            <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                {numFormatter(new BigNumber(buyNowPrice).shiftedBy(-18).toNumber())}
                            </Typography>
                        </>
                    }
                >
                    <Typography variant="h6">
                        Do you wish to purchase <strong>{itemName}</strong> for{" "}
                        <span>{numFormatter(new BigNumber(buyNowPrice).shiftedBy(-18).toNumber())}</span> SUPS?
                    </Typography>
                </ConfirmModal>
            )}
        </>
    )
}

const PriceDropper = ({
    createdAt,
    calculateNewPrice,
    setCurrentPrice,
}: {
    createdAt: Date
    calculateNewPrice: () => BigNumber
    setCurrentPrice: React.Dispatch<React.SetStateAction<BigNumber>>
}) => {
    const [timeLeft, setTimeLeft] = useState<number>(60 - timeSince(createdAt, new Date()).seconds)

    useInterval(() => {
        setTimeLeft((prev) => {
            let newTimeLeft = prev - 1
            if (newTimeLeft === 0) {
                setCurrentPrice(calculateNewPrice())
            }

            if (newTimeLeft < 0) newTimeLeft = 59
            return newTimeLeft
        })
    }, 1000)

    return <>{timeLeft}</>
}
