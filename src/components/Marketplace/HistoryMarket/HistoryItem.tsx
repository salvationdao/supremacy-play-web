import { Box, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useMemo, useState } from "react"
import { FancyButton } from "../.."
import { SvgSupToken } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { numFormatter } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { MARKETPLACE_TABS } from "../../../pages"
import { colors } from "../../../theme/theme"
import { MechDetails, Weapon } from "../../../types/assets"
import { MarketplaceBuyAuctionItem, MarketplaceEvent, MarketplaceEventType } from "../../../types/marketplace"
import { KeycardCommonArea } from "../../Hangar/KeycardsHangar/KeycardHangarItem"
import { CrateCommonArea } from "../../Hangar/MysteryCratesHangar/MysteryCrateHangarItem"
import { MechCommonArea } from "../../Hangar/WarMachinesHangar/WarMachineHangarItem"
import { WeaponCommonArea } from "../../Hangar/WeaponsHangar/WeaponHangarItem"
import { General } from "../Common/MarketItem/General"

export const HistoryItem = ({ eventItem, isGridView }: { eventItem: MarketplaceEvent; isGridView: boolean }) => {
    const theme = useTheme()
    const [isExpanded, toggleIsExpanded] = useToggle(false)

    const itemRelatedData = useMemo(() => {
        const item = eventItem.item
        let linkSubPath = MARKETPLACE_TABS.WarMachines
        let primaryColor = colors.marketSold
        let statusText = ""
        const formattedAmount = eventItem.amount ? numFormatter(new BigNumber(eventItem.amount).shiftedBy(-18).toNumber()) : ""

        if (item.mech && item.collection_item) {
            linkSubPath = MARKETPLACE_TABS.WarMachines
        } else if (item.mystery_crate && item.collection_item) {
            linkSubPath = MARKETPLACE_TABS.MysteryCrates
        } else if (item.weapon && item.collection_item) {
            linkSubPath = MARKETPLACE_TABS.Weapons
        } else if (item.keycard) {
            linkSubPath = MARKETPLACE_TABS.Keycards
        }

        if (eventItem.event_type === MarketplaceEventType.Purchased) {
            primaryColor = colors.buyout
            statusText = "PURCHASED ITEM"
        } else if (eventItem.event_type === MarketplaceEventType.Bid) {
            primaryColor = colors.auction
            statusText = "BID"
        } else if (eventItem.event_type === MarketplaceEventType.BidReturned) {
            primaryColor = colors.marketBidReturned
            statusText = "Bid RETURNED"
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
            primaryColor,
            statusText,
            formattedAmount,
        }
    }, [eventItem])

    return (
        <Box sx={{ position: "relative", overflow: "visible", height: "100%" }}>
            <FancyButton
                disableRipple
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
                    border: { isFancy: !isGridView, borderColor: itemRelatedData.primaryColor, borderThickness: ".25rem" },
                    sx: { position: "relative", height: "100%" },
                }}
                sx={{ color: itemRelatedData.primaryColor, textAlign: "start", height: "100%" }}
                to={`/marketplace/${itemRelatedData.linkSubPath}/${eventItem.item.id}${location.hash}`}
            >
                <Box
                    sx={{
                        position: "relative",
                        height: "100%",
                        p: isGridView ? ".5rem .6rem" : ".1rem .3rem",
                        display: isGridView ? "block" : "grid",
                        gridTemplateRows: "7rem",
                        gridTemplateColumns: `minmax(36rem, auto) repeat(2, 17rem) 23rem`, // hard-coded to have 5 columns, adjust as required
                        gap: "1.4rem",
                        ...(isGridView
                            ? {
                                  "&>*:not(:last-child)": {
                                      mb: ".8rem",
                                  },
                              }
                            : {}),
                    }}
                >
                    <ItemCommonArea
                        item={eventItem.item}
                        isGridView={isGridView}
                        isExpanded={isExpanded}
                        toggleIsExpanded={toggleIsExpanded}
                        primaryColor={itemRelatedData.primaryColor}
                    />

                    <General title="EVENT TYPE" text={itemRelatedData.statusText} textColor={itemRelatedData.primaryColor} isGridView={isGridView} />

                    <General title="AMOUNT" isGridView={isGridView}>
                        <Stack direction="row" alignItems="center" flexWrap="wrap">
                            {itemRelatedData.formattedAmount && <SvgSupToken size="1.7rem" fill={itemRelatedData.primaryColor} />}
                            <Typography
                                sx={{ color: itemRelatedData.formattedAmount ? itemRelatedData.primaryColor : colors.lightGrey, fontWeight: "fontWeightBold" }}
                            >
                                {itemRelatedData.formattedAmount || "---"}
                            </Typography>
                        </Stack>
                    </General>

                    <General title="DATE" text={eventItem.created_at.toUTCString()} isGridView={isGridView} />
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

const ItemCommonArea = ({
    primaryColor,
    item,
    isGridView,
    isExpanded,
    toggleIsExpanded,
}: {
    primaryColor: string

    item: MarketplaceBuyAuctionItem
    isGridView: boolean
    isExpanded: boolean
    toggleIsExpanded: (value?: boolean) => void
}) => {
    const [mechDetails, setMechDetails] = useState<MechDetails>()
    const [weaponDetails, setWeaponDetails] = useState<Weapon>()

    useGameServerSubscriptionFaction<MechDetails>(
        {
            URI: `/mech/${item.mech?.id || ""}/details`,
            key: GameServerKeys.GetMechDetails,
            ready: !!item.mech,
        },
        (payload) => {
            if (!payload) return
            setMechDetails(payload)
        },
    )

    useGameServerSubscriptionFaction<Weapon>(
        {
            URI: `/weapon/${item.weapon?.id}/details`,
            key: GameServerKeys.GetWeaponDetails,
            ready: !!item.weapon,
        },
        (payload) => {
            if (!payload) return
            setWeaponDetails(payload)
        },
    )

    if (item.mech) {
        return (
            <MechCommonArea
                primaryColor={primaryColor}
                secondaryColor="#FFFFFF"
                isGridView={isGridView}
                mechDetails={mechDetails}
                isExpanded={isExpanded}
                toggleIsExpanded={toggleIsExpanded}
            />
        )
    }

    if (item.weapon) {
        return (
            <WeaponCommonArea
                primaryColor={primaryColor}
                secondaryColor="#FFFFFF"
                isGridView={isGridView}
                weaponDetails={weaponDetails}
                isExpanded={isExpanded}
                toggleIsExpanded={toggleIsExpanded}
            />
        )
    }

    if (item.mystery_crate) {
        return (
            <CrateCommonArea
                isGridView={isGridView}
                label={item.mystery_crate.label}
                description={item.mystery_crate.description}
                imageUrl={item.collection_item?.image_url}
                videoUrls={[item.collection_item?.animation_url, item.collection_item?.card_animation_url]}
            />
        )
    }

    if (item.keycard) {
        return (
            <KeycardCommonArea
                isGridView={isGridView}
                label={item.keycard.label}
                description={item.keycard.description}
                imageUrl={item.keycard.image_url}
                videoUrls={[item.keycard.animation_url, item.keycard.card_animation_url]}
            />
        )
    }

    return <Typography>MARKET ITEM</Typography>
}
