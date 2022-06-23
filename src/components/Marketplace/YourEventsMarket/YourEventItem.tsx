import { Box, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { ReactNode, useEffect, useMemo, useState } from "react"
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
    const [content, setContent] = useState<ReactNode>(null)
    const [primaryColor, setPrimaryColor] = useState(colors.marketSold)

    const itemRelatedData = useMemo(() => {
        const item = eventItem.item
        let linkSubPath = ""
        let imageUrl = ""
        let animationUrl = ""
        let cardAnimationUrl = ""
        let label = ""
        let labelColor = ""
        let description = ""

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

        return {
            linkSubPath,
            imageUrl,
            animationUrl,
            cardAnimationUrl,
            label,
            labelColor,
            description,
        }
    }, [eventItem.item])

    useEffect(() => {
        const formattedAmount = eventItem.amount ? numFormatter(new BigNumber(eventItem.amount).shiftedBy(-18).toNumber()) : "-"

        if (eventItem.event_type === MarketplaceEventType.Purchased) {
            const color = colors.buyout
            setPrimaryColor(color)
            setContent(
                <>
                    <General title="STATUS" text="PURCHASED" textColor={color} />
                    <div />
                    <General title="DATE" text={eventItem.created_at.toUTCString()} />
                </>,
            )
        } else if (eventItem.event_type === MarketplaceEventType.Bid) {
            const color = colors.auction
            setPrimaryColor(color)
            setContent(
                <>
                    <General title="STATUS" text="BID" textColor={color} />
                    <General title="AMOUNT">
                        <Stack direction="row" alignItems="center" flexWrap="wrap">
                            <SvgSupToken size="1.7rem" fill={color} />
                            <Typography sx={{ color, fontWeight: "fontWeightBold" }}>{formattedAmount}</Typography>
                        </Stack>{" "}
                    </General>
                    <General title="DATE" text={eventItem.created_at.toUTCString()} />
                </>,
            )
        } else if (eventItem.event_type === MarketplaceEventType.Outbid) {
            const color = colors.marketOutbid
            setPrimaryColor(color)
            setContent(
                <>
                    <General title="STATUS" text="OUTBID" textColor={color} />
                    <General title="AMOUNT">
                        <Stack direction="row" alignItems="center" flexWrap="wrap">
                            <SvgSupToken size="1.7rem" fill={color} />
                            <Typography sx={{ color, fontWeight: "fontWeightBold" }}>{formattedAmount}</Typography>
                        </Stack>{" "}
                    </General>
                    <General title="DATE" text={eventItem.created_at.toUTCString()} />
                </>,
            )
        } else if (eventItem.event_type === MarketplaceEventType.Created) {
            const color = colors.marketCreate
            setPrimaryColor(color)
            setContent(
                <>
                    <General title="STATUS" text="CREATED LISTING" textColor={color} />
                    <General title="AMOUNT">
                        <Stack direction="row" alignItems="center" flexWrap="wrap">
                            <SvgSupToken size="1.7rem" fill={color} />
                            <Typography sx={{ color, fontWeight: "fontWeightBold" }}>{formattedAmount}</Typography>
                        </Stack>{" "}
                    </General>
                    <General title="DATE" text={eventItem.created_at.toUTCString()} />
                </>,
            )
        } else if (eventItem.event_type === MarketplaceEventType.Sold) {
            const color = colors.marketSold
            setPrimaryColor(color)
            setContent(
                <>
                    <General title="STATUS" text="SOLD" textColor={color} />
                    <General title="AMOUNT">
                        <Stack direction="row" alignItems="center" flexWrap="wrap">
                            <SvgSupToken size="1.7rem" fill={color} />
                            <Typography sx={{ color, fontWeight: "fontWeightBold" }}>{formattedAmount}</Typography>
                        </Stack>{" "}
                    </General>
                    <General title="DATE" text={eventItem.created_at.toUTCString()} />
                </>,
            )
        } else if (eventItem.event_type === MarketplaceEventType.Cancelled) {
            const color = colors.lightGrey
            setPrimaryColor(color)
            setContent(
                <>
                    <General title="STATUS" text="CANCELLED LISTING" textColor={color} />
                    <div />
                    <General title="DATE" text={eventItem.created_at.toUTCString()} />
                </>,
            )
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
                    border: { isFancy: true, borderColor: primaryColor, borderThickness: ".25rem" },
                    sx: { position: "relative" },
                }}
                sx={{ color: primaryColor, textAlign: "start" }}
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

                    {content}
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
