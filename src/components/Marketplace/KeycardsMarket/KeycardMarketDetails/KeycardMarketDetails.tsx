import Masonry from "@mui/lab/Masonry"
import { Box, CircularProgress, Stack, Typography, useMediaQuery } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { SafePNG } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { useToggle } from "../../../../hooks"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { ItemType, MarketplaceBuyAuctionItem } from "../../../../types/marketplace"
import { ClipThing } from "../../../Common/ClipThing"
import { BuyNowDetails } from "../../Common/MarketDetails/BuyNowDetails"
import { Dates } from "../../Common/MarketDetails/Dates"
import { ImagesPreview } from "../../Common/MarketDetails/ImagesPreview"
import { ManageListing } from "../../Common/MarketDetails/ManageListing"
import { UserInfo } from "../../Common/MarketDetails/UserInfo"
import { SoldDetails } from "../../Common/MarketDetails/SoldDetails"
import { KeycardDetails } from "./KeycardDetails"

export const KeycardMarketDetails = ({ id }: { id: string }) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [loadError, setLoadError] = useState<string>()
    const [marketItem, setMarketItem] = useState<MarketplaceBuyAuctionItem>()

    const primaryColor = useMemo(
        () => (marketItem?.sold_at ? colors.marketSold : theme.factionTheme.primary),
        [marketItem?.sold_at, theme.factionTheme.primary],
    )

    // Get listing details
    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<MarketplaceBuyAuctionItem>(GameServerKeys.GetKeycard, {
                    id,
                })

                if (!resp) return
                setMarketItem(resp)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get listing details."
                setLoadError(message)
                console.error(err)
            }
        })()
    }, [id, send])

    const content = useMemo(() => {
        const validStruct = !marketItem || (marketItem.keycard && marketItem.owner)

        if (loadError || !validStruct) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: "100%", maxWidth: "100%", width: "75rem", px: "3rem", pt: "1.28rem" }}
                        spacing="1.5rem"
                    >
                        <Typography
                            sx={{
                                color: colors.red,
                                fontFamily: fonts.nostromoBold,
                                textAlign: "center",
                            }}
                        >
                            {loadError ? loadError : "Failed to load listing details."}
                        </Typography>
                    </Stack>
                </Stack>
            )
        }

        if (!marketItem) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                    </Stack>
                </Stack>
            )
        }

        return <WarMachineMarketDetailsInner marketItem={marketItem} primaryColor={primaryColor} />
    }, [loadError, marketItem, primaryColor])

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: primaryColor,
                borderThickness: ".3rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            opacity={0.7}
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%" }}
        >
            <Stack sx={{ height: "100%" }}>{content}</Stack>
        </ClipThing>
    )
}

const WarMachineMarketDetailsInner = ({ marketItem, primaryColor }: { marketItem: MarketplaceBuyAuctionItem; primaryColor: string }) => {
    const below780 = useMediaQuery("(max-width:780px)")
    const [isTimeEnded, toggleIsTimeEnded] = useToggle()
    const { id, owner, keycard, created_at, end_at, sold_at, sold_for, sold_to } = marketItem

    return (
        <Box
            sx={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                ml: "2rem",
                mr: "1rem",
                pr: "1rem",
                my: "2rem",
                direction: "ltr",
                scrollbarWidth: "none",
                "::-webkit-scrollbar": {
                    width: "1rem",
                },
                "::-webkit-scrollbar-track": {
                    background: "#FFFFFF15",
                },
                "::-webkit-scrollbar-thumb": {
                    background: primaryColor,
                },
            }}
        >
            <Box sx={{ direction: "ltr", height: 0 }}>
                <Box
                    sx={{
                        pt: "2rem",
                        pb: "3.8rem",
                        px: "3rem",
                    }}
                >
                    <Masonry columns={below780 ? 1 : 2} spacing={4}>
                        <ImagesPreview
                            media={[
                                {
                                    imageUrl: keycard?.image_url || SafePNG,
                                    videoUrl: keycard?.animation_url || SafePNG,
                                },
                            ]}
                            primaryColor={primaryColor}
                        />

                        <Stack spacing="2rem" sx={{ minHeight: "65rem" }}>
                            <Box>
                                <Typography gutterBottom variant="h5" sx={{ color: primaryColor, fontFamily: fonts.nostromoBold }}>
                                    KEYCARD
                                </Typography>

                                <Typography variant="h4" sx={{ fontFamily: fonts.nostromoBlack }}>
                                    {keycard?.label || "KEYCARD"}
                                </Typography>
                            </Box>

                            <UserInfo marketUser={owner} title="OWNED BY:" />

                            <Dates createdAt={created_at} endAt={end_at} onTimeEnded={() => toggleIsTimeEnded(true)} soldAt={sold_at} />

                            {sold_to && <UserInfo marketUser={sold_to} title="SOLD TO:" primaryColor={colors.marketSold} />}

                            {sold_for && <SoldDetails soldFor={sold_for} />}

                            {!sold_for && (
                                <BuyNowDetails
                                    id={marketItem.id}
                                    itemType={ItemType.Keycards}
                                    owner={marketItem.owner}
                                    itemName={marketItem.keycard?.label || "KEYCARD"}
                                    buyNowPrice={marketItem.buyout_price}
                                    reservePrice={marketItem.auction_reserved_price}
                                    createdAt={marketItem.created_at}
                                    isTimeEnded={isTimeEnded}
                                />
                            )}

                            <ManageListing id={id} owner={owner} isKeycard isTimeEnded={isTimeEnded} />
                        </Stack>

                        <KeycardDetails keycard={keycard} primaryColor={primaryColor} />
                    </Masonry>
                </Box>
            </Box>
        </Box>
    )
}
