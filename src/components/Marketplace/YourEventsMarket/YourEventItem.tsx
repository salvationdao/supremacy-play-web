import { Box, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useMemo } from "react"
import { FancyButton } from "../.."
import { SvgSupToken } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { getRarityDeets, numFormatter } from "../../../helpers"
import { MARKETPLACE_TABS } from "../../../pages"
import { colors, fonts } from "../../../theme/theme"
import { MarketplaceEvent, MarketplaceEventType } from "../../../types/marketplace"
import { General } from "../Common/MarketItem/General"
import { Thumbnail } from "../Common/MarketItem/Thumbnail"

export const YourEventItem = ({ eventItem }: { eventItem: MarketplaceEvent }) => {
    const theme = useTheme()

    const itemRelatedData = useMemo(() => {
        const item = eventItem.item
        let linkSubPath = ""
        let imageUrl = ""
        let animationUrl = ""
        let cardAnimationUrl = ""
        let label = ""
        let labelColor = ""
        let description = ""
        let primaryColor = colors.marketSold
        let statusText = ""
        const formattedAmount = eventItem.amount ? numFormatter(new BigNumber(eventItem.amount).shiftedBy(-18).toNumber()) : ""

        if (item.mech && item.collection_item) {
            const rarityDeets = getRarityDeets(item.collection_item.tier)

            linkSubPath = MARKETPLACE_TABS.WarMachines
            imageUrl = item.mech.avatar_url
            label = rarityDeets.label
            labelColor = rarityDeets.color
            description = item.mech.name || item.mech.label
        } else if (item.mystery_crate && item.collection_item) {
            linkSubPath = MARKETPLACE_TABS.MysteryCrates
            imageUrl = item.collection_item.image_url || ""
            animationUrl = item.collection_item.animation_url || ""
            cardAnimationUrl = item.collection_item.card_animation_url || ""
            label = item.mystery_crate.label
            description = item.mystery_crate.description
        } else if (item.keycard) {
            linkSubPath = MARKETPLACE_TABS.Keycards
            imageUrl = item.keycard.image_url
            animationUrl = item.keycard.animation_url
            cardAnimationUrl = item.keycard.card_animation_url
            label = item.keycard.label
            description = item.keycard.description
        }

        if (eventItem.event_type === MarketplaceEventType.Purchased) {
            primaryColor = colors.buyout
            statusText = "PURCHASED ITEM"
        } else if (eventItem.event_type === MarketplaceEventType.Bid) {
            primaryColor = colors.auction
            statusText = "BID"
        } else if (eventItem.event_type === MarketplaceEventType.Outbid) {
            primaryColor = colors.marketOutbid
            statusText = "OUTBID"
        } else if (eventItem.event_type === MarketplaceEventType.Created) {
            primaryColor = colors.marketCreate
            statusText = "CREATED LISTING"
        } else if (eventItem.event_type === MarketplaceEventType.Sold) {
            primaryColor = colors.marketSold
            statusText = "SOLD ITEM"
        } else if (eventItem.event_type === MarketplaceEventType.Cancelled) {
            primaryColor = colors.lightGrey
            statusText = "CANCELLED LISTING"
        }

        return {
            linkSubPath,
            imageUrl,
            animationUrl,
            cardAnimationUrl,
            label,
            labelColor,
            description,
            primaryColor,
            statusText,
            formattedAmount,
        }
    }, [eventItem])

    return (
        <Box sx={{ position: "relative", overflow: "visible" }}>
            <FancyButton
                clipThingsProps={{
                    clipSize: "7px",
                    clipSlantSize: "0px",
                    corners: {
                        topLeft: true,
                        topRight: true,
                        bottomLeft: true,
                        bottomRight: true,
                    },
                    backgroundColor: theme.factionTheme.background,
                    opacity: 0.9,
                    border: { isFancy: true, borderColor: itemRelatedData.primaryColor, borderThickness: ".25rem" },
                    sx: { position: "relative" },
                }}
                sx={{ color: itemRelatedData.primaryColor, textAlign: "start" }}
                to={`/marketplace/${itemRelatedData.linkSubPath}/${eventItem.id}${location.hash}`}
            >
                <Box
                    sx={{
                        position: "relative",
                        p: ".1rem .3rem",
                        display: "grid",
                        gridTemplateRows: "7rem",
                        gridTemplateColumns: `8rem minmax(auto, 38rem) repeat(3, 1fr)`, // hard-coded to have 6 columns, adjust as required
                        gap: "1.4rem",
                    }}
                >
                    <Thumbnail
                        imageUrl={itemRelatedData.imageUrl}
                        animationUrl={itemRelatedData.animationUrl}
                        cardAnimationUrl={itemRelatedData.cardAnimationUrl}
                    />

                    <Stack spacing=".6rem">
                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: fonts.nostromoBlack,
                                color: itemRelatedData.labelColor,
                                display: "-webkit-box",
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {itemRelatedData.label}
                        </Typography>

                        <Typography
                            sx={{
                                display: "-webkit-box",
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {itemRelatedData.description}
                        </Typography>
                    </Stack>

                    <General title="EVENT TYPE" text={itemRelatedData.statusText} textColor={itemRelatedData.primaryColor} />

                    <General title="AMOUNT">
                        <Stack direction="row" alignItems="center" flexWrap="wrap">
                            {itemRelatedData.formattedAmount && <SvgSupToken size="1.7rem" fill={itemRelatedData.primaryColor} />}
                            <Typography
                                sx={{ color: itemRelatedData.formattedAmount ? itemRelatedData.primaryColor : colors.lightGrey, fontWeight: "fontWeightBold" }}
                            >
                                {itemRelatedData.formattedAmount || "---"}
                            </Typography>
                        </Stack>
                    </General>

                    <General title="DATE" text={eventItem.created_at.toUTCString()} />
                </Box>

                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: `linear-gradient(to top, #FFFFFF08, ${theme.factionTheme.background}90)`,
                        zIndex: -1,
                    }}
                />
            </FancyButton>
        </Box>
    )
}
