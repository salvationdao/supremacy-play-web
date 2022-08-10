import { Box, Divider, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useMemo, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { ClipThing, FancyButton } from "../../.."
import { SvgSupToken, SvgWallet } from "../../../../assets"
import { useAuth } from "../../../../containers"
import { calculateDutchAuctionCurrentPrice, numberCommaFormatter, shadeColor, timeSince } from "../../../../helpers"
import { useInterval, useToggle } from "../../../../hooks"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { HANGAR_TABS } from "../../../../pages"
import { colors, fonts } from "../../../../theme/theme"
import { ItemType, MarketUser } from "../../../../types/marketplace"
import { ConfirmModal } from "../../../Common/ConfirmModal"
import { SuccessModal } from "../../../Common/SuccessModal"

interface BuyNowDetailsProps {
    id: string
    itemType: ItemType
    owner?: MarketUser
    itemName: string
    buyNowPrice: string
    dutchAuctionDropRate?: string
    reservePrice?: string
    createdAt: Date
    isTimeEnded: boolean
}

export const BuyNowDetails = ({
    id,
    itemType,
    owner,
    itemName,
    buyNowPrice,
    dutchAuctionDropRate,
    reservePrice,
    createdAt,
    isTimeEnded,
}: BuyNowDetailsProps) => {
    const { userID } = useAuth()

    const calculateNewPrice = useCallback(() => {
        let newPrice = new BigNumber(buyNowPrice).shiftedBy(-18)

        // Drop price
        if (dutchAuctionDropRate) {
            const dropRate = new BigNumber(dutchAuctionDropRate).shiftedBy(-18)
            newPrice = BigNumber.max(
                calculateDutchAuctionCurrentPrice({ createdAt, dropRate, startPrice: newPrice }),
                new BigNumber(reservePrice || 1000000000000000000).shiftedBy(-18),
            )
        }
        return newPrice
    }, [buyNowPrice, createdAt, dutchAuctionDropRate, reservePrice])

    const history = useHistory()
    const location = useLocation()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [currentPrice, setCurrentPrice] = useState<BigNumber>(calculateNewPrice())

    // Buying
    const [isLoading, setIsLoading] = useState(false)
    const [buyError, setBuyError] = useState<string>()
    const [confirmBuyModalOpen, toggleConfirmBuyModalOpen] = useToggle()
    const [successModalOpen, toggleSuccessModalOpen] = useToggle()

    const primaryColor = colors.buyout
    const secondaryColor = "#FFFFFF"
    const backgroundColor = useMemo(() => shadeColor(colors.buyout, -93), [])
    const formattedCommaPrice = useMemo(() => numberCommaFormatter(currentPrice.toNumber()), [currentPrice])
    const formattedCommaDropPrice = useMemo(
        () => numberCommaFormatter(new BigNumber(dutchAuctionDropRate || "").shiftedBy(-18).toNumber()),
        [dutchAuctionDropRate],
    )

    const confirmBuy = useCallback(async () => {
        try {
            setIsLoading(true)
            const isKeycard = itemType === ItemType.Keycards

            const resp = await send(isKeycard ? GameServerKeys.MarketplaceSalesKeycardBuy : GameServerKeys.MarketplaceSalesBuy, {
                id,
                amount: currentPrice,
            })

            if (!resp) return
            toggleConfirmBuyModalOpen(false)
            toggleSuccessModalOpen(true)
            setBuyError(undefined)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to purchase item."
            setBuyError(message)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [id, currentPrice, itemType, send, toggleConfirmBuyModalOpen, toggleSuccessModalOpen])

    const isSelfItem = userID === owner?.id

    return (
        <>
            <Stack spacing="2rem">
                <Divider />

                {dutchAuctionDropRate && (
                    <>
                        <Box>
                            <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                                PRICE DROP:
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: "fontWeightBold", span: { color: colors.lightNeonBlue } }}>
                                NEXT PRICE DROP IN{" "}
                                <span>{<PriceDropper createdAt={createdAt} calculateNewPrice={calculateNewPrice} setCurrentPrice={setCurrentPrice} />}</span>{" "}
                                SECONDS
                            </Typography>
                        </Box>

                        <Box>
                            <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                                DROP RATE:
                            </Typography>
                            <Stack direction="row" alignItems="center" sx={{ fontStyle: "italic" }}>
                                <Typography variant="h5" sx={{ color: colors.dutchAuction, fontWeight: "fontWeightBold" }}>
                                    -
                                </Typography>
                                <SvgSupToken size="2.4rem" fill={colors.dutchAuction} sx={{ transform: "skew(-20deg)" }} />
                                <Typography variant="h5" sx={{ ml: "-.3rem", fontWeight: "fontWeightBold", color: colors.dutchAuction }}>
                                    {formattedCommaDropPrice}/MIN
                                </Typography>
                            </Stack>
                        </Box>
                    </>
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
                    onClose={() => {
                        setBuyError(undefined)
                        toggleConfirmBuyModalOpen(false)
                    }}
                    isLoading={isLoading}
                    error={buyError}
                    confirmSuffix={
                        <Stack direction="row" sx={{ ml: ".4rem" }}>
                            <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                (
                            </Typography>
                            <SvgSupToken size="1.8rem" />
                            <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                {formattedCommaPrice})
                            </Typography>
                        </Stack>
                    }
                >
                    <Typography variant="h6">
                        Do you wish to purchase <strong>{itemName}</strong> for <span>{formattedCommaPrice}</span> SUPS?
                    </Typography>
                </ConfirmModal>
            )}

            {successModalOpen && (
                <SuccessModal
                    title="PURCHASED ITEM"
                    leftLabel="GO BACK TO MARKETPLACE"
                    onLeftButton={() => {
                        history.replace(`/marketplace${location.hash}`)
                    }}
                    rightLabel="GO TO FLEET"
                    onRightButton={() => {
                        let subPath = ""
                        switch (itemType) {
                            case ItemType.WarMachine:
                                subPath = HANGAR_TABS.WarMachines
                                break
                            case ItemType.MysteryCrate:
                                subPath = HANGAR_TABS.MysteryCrates
                                break
                            case ItemType.Keycards:
                                subPath = HANGAR_TABS.Keycards
                                break
                        }

                        history.replace(`/fleet/${subPath}${location.hash}`)
                    }}
                >
                    <Typography variant="h6">You have successfully purchased the item.</Typography>
                </SuccessModal>
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
