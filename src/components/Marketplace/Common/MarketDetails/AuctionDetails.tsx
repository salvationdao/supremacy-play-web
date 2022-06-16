import { Box, Divider, InputAdornment, Stack, TextField, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useMemo, useState } from "react"
import { ClipThing, FancyButton } from "../../.."
import { SvgHammer, SvgSupToken } from "../../../../assets"
import { useAuth, useSnackbar } from "../../../../containers"
import { numberCommaFormatter, shadeColor } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { ItemType, MarketUser } from "../../../../types/marketplace"
import { ConfirmModal } from "../../../Common/ConfirmModal"

interface AuctionDetailsProps {
    id: string
    itemType: ItemType
    owner?: MarketUser
    itemName: string
    auctionCurrentPrice: string
    auctionBidCount: number
    auctionLastBid?: MarketUser
    isTimeEnded: boolean
}

export const AuctionDetails = ({ id, owner, itemName, auctionCurrentPrice, auctionBidCount, auctionLastBid, isTimeEnded }: AuctionDetailsProps) => {
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { userID } = useAuth()
    const [currentPrice, setCurrentPrice] = useState<BigNumber>(new BigNumber(auctionCurrentPrice).shiftedBy(-18))
    const [bidCount, setBidCount] = useState<number>(auctionBidCount)
    const [lastBidUser, setLastBidUser] = useState<MarketUser | undefined>(auctionLastBid)
    const [inputBidPrice, setInputBidPrice] = useState<number>()

    // Bidding
    const [isLoading, setIsLoading] = useState(false)
    const [bidError, setBidError] = useState<string>()
    const [confirmBidModalOpen, toggleConfirmBidModalOpen] = useToggle()

    const primaryColor = useMemo(() => colors.auction, [])
    const secondaryColor = useMemo(() => "#FFFFFF", [])
    const backgroundColor = useMemo(() => shadeColor(colors.auction, -97), [])
    const formattedCommaCurrentPrice = useMemo(() => (currentPrice ? numberCommaFormatter(currentPrice.toNumber()) : "-"), [currentPrice])

    const inputBidPriceError: string | undefined = useMemo(() => {
        if (!inputBidPrice) return
        if (inputBidPrice <= 0) {
            return "Value has to be greater than 0."
        }
        if (inputBidPrice <= currentPrice.toNumber()) {
            return "Your bid amount must be greater than the current bid price."
        }
    }, [currentPrice, inputBidPrice])

    const confirmBid = useCallback(async () => {
        try {
            if (!inputBidPrice) return
            setIsLoading(true)
            const resp = await send(GameServerKeys.MarketplaceSalesBid, {
                id,
                amount: inputBidPrice.toString(),
            })

            if (!resp) return
            setInputBidPrice(undefined)
            newSnackbarMessage("Successfully placed your bid.", "success")
            toggleConfirmBidModalOpen(false)
            setBidError(undefined)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to purchase item."
            setBidError(message)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [send, id, inputBidPrice, newSnackbarMessage, toggleConfirmBidModalOpen])

    useGameServerSubscriptionFaction<{ auction_current_price: string; total_bids: number; last_bid: MarketUser }>(
        {
            URI: `/marketplace/${id}`,
            key: GameServerKeys.SubMarketplaceSalesItem,
        },
        (payload) => {
            if (!payload) return
            setCurrentPrice(new BigNumber(payload.auction_current_price).shiftedBy(-18))
            setBidCount(payload.total_bids)
            setLastBidUser(payload.last_bid)
        },
    )

    const isSelfItem = userID === owner?.id

    return (
        <>
            <Stack spacing="2rem">
                <Divider />

                <Stack>
                    <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                        CURRENT BID:
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
                                    {formattedCommaCurrentPrice}
                                </Typography>
                            </Stack>
                        </ClipThing>

                        {bidCount > 0 && lastBidUser && (
                            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBold, span: { color: colors.lightNeonBlue, fontFamily: "inherit" } }}>
                                LATEST BID:{" "}
                                <span>
                                    {lastBidUser.username}#{lastBidUser.gid}
                                </span>
                                <br />
                                TOTAL BIDS: <span>{bidCount}</span>
                            </Typography>
                        )}
                    </Stack>
                </Stack>

                <Box>
                    <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                        PLACE YOUR BID:
                    </Typography>

                    <Stack direction="row" spacing="1.5rem" alignItems="center">
                        <TextField
                            variant="outlined"
                            hiddenLabel
                            disabled={isSelfItem}
                            placeholder={currentPrice ? currentPrice.plus(1).toString() : "Enter your bid..."}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgSupToken fill={colors.yellow} size="2.4rem" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                backgroundColor: "#00000090",
                                ".MuiOutlinedInput-root": { borderRadius: 0.5, border: `${primaryColor}99 2px dashed` },
                                ".MuiOutlinedInput-input": {
                                    px: "1.5rem",
                                    py: ".8rem",
                                    fontSize: "2.2rem",
                                    height: "unset",
                                    "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                                        "-webkit-appearance": "none",
                                    },
                                },
                                ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                            }}
                            type="number"
                            value={inputBidPrice}
                            onChange={(e) => {
                                const value = parseInt(e.target.value)
                                if (value <= 0) return
                                setInputBidPrice(value)
                            }}
                        />
                        <FancyButton
                            disabled={isSelfItem || isTimeEnded || !currentPrice || !inputBidPrice || currentPrice.isGreaterThanOrEqualTo(inputBidPrice)}
                            clipThingsProps={{
                                clipSize: "9px",
                                backgroundColor: primaryColor,
                                opacity: 1,
                                border: { isFancy: true, borderColor: primaryColor, borderThickness: "2px" },
                                sx: { position: "relative", width: "18rem" },
                            }}
                            sx={{ py: ".7rem", color: secondaryColor }}
                            onClick={() => toggleConfirmBidModalOpen(true)}
                        >
                            <Stack direction="row" spacing=".9rem" alignItems="center" justifyContent="center">
                                <SvgHammer size="1.9rem" fill={secondaryColor} />

                                <Typography
                                    variant="body2"
                                    sx={{
                                        flexShrink: 0,
                                        color: secondaryColor,
                                        fontFamily: fonts.nostromoBlack,
                                    }}
                                >
                                    PLACE BID
                                </Typography>
                            </Stack>
                        </FancyButton>
                    </Stack>

                    {inputBidPriceError && (
                        <Typography
                            sx={{
                                ml: ".3rem",
                                mt: ".5rem",
                                color: colors.red,
                                fontWeight: "fontWeightBold",
                                userSelect: "text",
                            }}
                        >
                            {inputBidPriceError}
                        </Typography>
                    )}
                </Box>
            </Stack>

            {confirmBidModalOpen && inputBidPrice && !isSelfItem && !isTimeEnded && (
                <ConfirmModal
                    title="CONFIRMATION"
                    onConfirm={confirmBid}
                    onClose={() => {
                        setBidError(undefined)
                        toggleConfirmBidModalOpen(false)
                    }}
                    isLoading={isLoading}
                    error={bidError}
                    confirmSuffix={
                        <Stack direction="row" sx={{ ml: ".4rem" }}>
                            <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                (
                            </Typography>
                            <SvgSupToken size="1.8rem" />
                            <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                {numberCommaFormatter(inputBidPrice)})
                            </Typography>
                        </Stack>
                    }
                >
                    <Typography variant="h6">
                        Do you wish to place a bid of <span>{numberCommaFormatter(inputBidPrice)}</span> SUPS on <strong>{itemName}</strong>?
                    </Typography>
                </ConfirmModal>
            )}
        </>
    )
}
