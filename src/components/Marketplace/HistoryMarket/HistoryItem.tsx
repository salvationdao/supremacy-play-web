import { Box, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useEffect, useMemo, useState } from "react"
import { FancyButton } from "../.."
import { SvgSupToken } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { numFormatter } from "../../../helpers"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
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
import { Thumbnail } from "../Common/MarketItem/Thumbnail"

export const HistoryItem = ({ eventItem, isGridView }: { eventItem: MarketplaceEvent; isGridView: boolean }) => {
    const theme = useTheme()

    const itemRelatedData = useMemo(() => {
        const item = eventItem.item
        let linkSubPath = MARKETPLACE_TABS.WarMachines
        let imageUrl = ""
        let animationUrl = ""
        let cardAnimationUrl = ""
        let primaryColor = colors.marketSold
        let statusText = ""
        const formattedAmount = eventItem.amount ? numFormatter(new BigNumber(eventItem.amount).shiftedBy(-18).toNumber()) : ""

        if (item.mech && item.collection_item) {
            // const rarityDeets = getRarityDeets(item.collection_item.tier)

            linkSubPath = MARKETPLACE_TABS.WarMachines
            imageUrl = item.mech.avatar_url
            // label = rarityDeets.label
            // labelColor = rarityDeets.color
            // description = item.mech.name || item.mech.label
        } else if (item.mystery_crate && item.collection_item) {
            linkSubPath = MARKETPLACE_TABS.MysteryCrates
            imageUrl = item.collection_item.image_url || ""
            animationUrl = item.collection_item.animation_url || ""
            cardAnimationUrl = item.collection_item.card_animation_url || ""
            // label = item.mystery_crate.label
            // description = item.mystery_crate.description
        } else if (item.weapon && item.collection_item) {
            // const rarityDeets = getRarityDeets(weaponDetails?.weapon_skin?.tier || "")
            linkSubPath = MARKETPLACE_TABS.Weapons
            imageUrl = item.collection_item.image_url || item.weapon?.avatar_url || ""
            animationUrl = item.collection_item.animation_url || ""
            cardAnimationUrl = item.collection_item.card_animation_url || ""
            // label = rarityDeets.label
            // labelColor = rarityDeets.color
            // description = item.weapon.label
        } else if (item.keycard) {
            linkSubPath = MARKETPLACE_TABS.Keycards
            imageUrl = item.keycard.image_url
            animationUrl = item.keycard.animation_url
            cardAnimationUrl = item.keycard.card_animation_url
            // label = item.keycard.label
            // description = item.keycard.description
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
            imageUrl,
            animationUrl,
            cardAnimationUrl,
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
                to={`/marketplace/${itemRelatedData.linkSubPath}/${eventItem.item.id}${location.hash}`}
            >
                <Box
                    sx={{
                        position: "relative",
                        p: ".1rem .3rem",
                        display: "grid",
                        gridTemplateRows: "7rem",
                        gridTemplateColumns: `8rem minmax(auto, 38rem) repeat(2, 1fr) 1.3fr`, // hard-coded to have 5 columns, adjust as required
                        gap: "1.4rem",
                    }}
                >
                    <Thumbnail
                        imageUrl={itemRelatedData.imageUrl}
                        animationUrl={itemRelatedData.animationUrl}
                        cardAnimationUrl={itemRelatedData.cardAnimationUrl}
                    />

                    <ItemCommonArea item={eventItem.item} isGridView={isGridView} />

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

const ItemCommonArea = ({ item, isGridView }: { item: MarketplaceBuyAuctionItem; isGridView: boolean }) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [mechDetails, setMechDetails] = useState<MechDetails>()
    const [weaponDetails, setWeaponDetails] = useState<Weapon>()

    useEffect(() => {
        ;(async () => {
            try {
                if (!item.mech) return
                const resp = await send<MechDetails>(GameServerKeys.GetMechDetails, {
                    mech_id: item.mech.id,
                })

                if (!resp) return
                setMechDetails(resp)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [item.mech, send])

    useEffect(() => {
        ;(async () => {
            try {
                if (!item.weapon) return
                const resp = await send<Weapon>(GameServerKeys.GetWeaponDetails, {
                    weapon_id: item.weapon.id,
                })
                if (!resp) return
                setWeaponDetails(resp)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [item.weapon, send])

    if (item.mech) {
        return <MechCommonArea isGridView={isGridView} mechDetails={mechDetails} />
    }

    if (item.weapon) {
        return <WeaponCommonArea isGridView={isGridView} weaponDetails={weaponDetails} />
    }

    if (item.mystery_crate) {
        return <CrateCommonArea isGridView={isGridView} label={item.mystery_crate.label} description={item.mystery_crate.description} />
    }

    if (item.keycard) {
        return <KeycardCommonArea isGridView={isGridView} label={item.keycard.label} description={item.keycard.description} />
    }

    return null
}
