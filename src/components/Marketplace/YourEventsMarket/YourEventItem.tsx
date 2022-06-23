import { Box } from "@mui/material"
import BigNumber from "bignumber.js"
import { ReactNode, useMemo } from "react"
import { FancyButton } from "../.."
import { useTheme } from "../../../containers/theme"
import { numFormatter, shadeColor, timeDiff } from "../../../helpers"
import { MARKETPLACE_TABS } from "../../../pages"
import { colors } from "../../../theme/theme"
import { MarketplaceEvent, MarketplaceEventType } from "../../../types/marketplace"
import { AuctionPrice } from "../Common/MarketItem/AuctionPrice"
import { BuyoutPrice } from "../Common/MarketItem/BuyoutPrice"
import { UserInfo } from "../Common/MarketItem/UserInfo"
import { Thumbnail } from "../Common/MarketItem/Thumbnail"
import { Timeframe } from "../Common/MarketItem/Timeframe"
import { SoldPrice } from "../Common/MarketItem/SoldPrice"

export const YourEventItem = ({ eventItem }: { eventItem: MarketplaceEvent }) => {
    return null
    // const theme = useTheme()

    // const itemRelatedData = useMemo(() => {
    //     const linkSubPath = ""
    //     const imageUrl = ""
    //     const animationUrl = ""
    //     const cardAnimationUrl = ""
    //     const backgroundImageUrl = ""

    //     return {
    //         linkSubPath,
    //         imageUrl,
    //         animationUrl,
    //         cardAnimationUrl,
    //         backgroundImageUrl,
    //     }
    // }, [])

    // const content = useMemo(() => {
    //     switch (eventItem.event_type) {
    //         case MarketplaceEventType.Purchased:
    //             return (
    //                 <>
    //                     {children}

    //                     <UserInfo marketUser={owner} title="SELLER" />

    //                     {sold_to && <UserInfo marketUser={sold_to} title="SOLD TO" />}

    //                     <Timeframe endAt={end_at} soldAt={sold_at} />

    //                     {sold_at && sold_for ? (
    //                         <SoldPrice soldFor={sold_for} />
    //                     ) : (
    //                         <>
    //                             <BuyoutPrice formattedPrice={formattedBuyoutPrice} formattedDropPrice={formattedDropPrice} />
    //                             <AuctionPrice formattedPrice={formattedAuctionPrice} totalBids={total_bids} />
    //                         </>
    //                     )}
    //                 </>
    //             )
    //         case MarketplaceEventType.Bid:
    //             return null
    //         case MarketplaceEventType.Outbid:
    //             return null
    //         case MarketplaceEventType.Created:
    //             return null
    //         case MarketplaceEventType.Sold:
    //             return null
    //         case MarketplaceEventType.Cancelled:
    //             return null
    //         default:
    //             return null
    //     }
    // }, [eventItem])

    // const formattedBuyoutPrice = useMemo(() => {
    //     if (!item.buyout_price) return ""
    //     let buyoutPrice = new BigNumber(item.buyout_price).shiftedBy(-18)
    //     const dropPrice = new BigNumber(item.dutch_auction_drop_rate).shiftedBy(-18)
    //     if (item.dutch_auction_drop_rate) {
    //         buyoutPrice = BigNumber.max(buyoutPrice.minus(dropPrice.multipliedBy(timeDiff(item.created_at, new Date()).minutes)), new BigNumber(1))
    //     }
    //     return numFormatter(buyoutPrice.toNumber())
    // }, [item.buyout_price, item.created_at, item.dutch_auction_drop_rate])
    // const formattedAuctionPrice = useMemo(() => {
    //     if (!item.auction_current_price) return ""
    //     const auctionPrice = new BigNumber(item.auction_current_price).shiftedBy(-18)
    //     return numFormatter(auctionPrice.toNumber())
    // }, [item.auction_current_price])
    // const formattedDropPrice = useMemo(() => {
    //     if (!item.dutch_auction_drop_rate) return ""
    //     const dropPrice = new BigNumber(item.dutch_auction_drop_rate).shiftedBy(-18)
    //     return numFormatter(dropPrice.toNumber())
    // }, [item.dutch_auction_drop_rate])

    // const primaryColor = theme.factionTheme.primary
    // const backgroundColor = theme.factionTheme.background
    // const soldBackgroundColor = useMemo(() => shadeColor(colors.marketSold, -95), [])

    // const { id, end_at, owner, total_bids, sold_at, sold_for, sold_to } = item

    // if (!owner) return null

    // return (
    //     <Box sx={{ position: "relative", overflow: "visible" }}>
    //         <FancyButton
    //             clipThingsProps={{
    //                 clipSize: "7px",
    //                 clipSlantSize: "0px",
    //                 corners: {
    //                     topLeft: true,
    //                     topRight: true,
    //                     bottomLeft: true,
    //                     bottomRight: true,
    //                 },
    //                 backgroundColor: sold_at ? soldBackgroundColor : backgroundColor,
    //                 opacity: 0.9,
    //                 border: { isFancy: true, borderColor: sold_at ? colors.marketSold : primaryColor, borderThickness: ".25rem" },
    //                 sx: { position: "relative" },
    //             }}
    //             sx={{ color: primaryColor, textAlign: "start" }}
    //             to={`/marketplace/${itemRelatedData.linkSubPath}/${id}${location.hash}`}
    //         >
    //             <Box
    //                 sx={{
    //                     position: "relative",
    //                     p: ".1rem .3rem",
    //                     display: "grid",
    //                     gridTemplateRows: "7rem",
    //                     gridTemplateColumns: `8rem minmax(auto, 38rem) 1.2fr ${sold_to ? "1.2fr" : "1fr"} repeat(2, 1fr)`, // hard-coded to have 6 columns, adjust as required
    //                     gap: "1.4rem",
    //                 }}
    //             >
    //                 <Thumbnail
    //                     imageUrl={itemRelatedData.imageUrl}
    //                     animationUrl={itemRelatedData.animationUrl}
    //                     cardAnimationUrl={itemRelatedData.cardAnimationUrl}
    //                 />
    //                 {content}
    //             </Box>

    //             <Box
    //                 sx={{
    //                     position: "absolute",
    //                     left: 0,
    //                     right: 0,
    //                     top: 0,
    //                     bottom: 0,
    //                     background: `url(${itemRelatedData.backgroundImageUrl})`,
    //                     backgroundRepeat: "no-repeat",
    //                     backgroundPosition: "top",
    //                     backgroundSize: "cover",
    //                     opacity: 0.06,
    //                     zIndex: -2,
    //                 }}
    //             />

    //             <Box
    //                 sx={{
    //                     position: "absolute",
    //                     left: 0,
    //                     right: 0,
    //                     top: 0,
    //                     bottom: 0,
    //                     background: `linear-gradient(to top, #FFFFFF08, ${backgroundColor}90)`,
    //                     zIndex: -1,
    //                 }}
    //             />
    //         </FancyButton>
    //     </Box>
    // )
}
