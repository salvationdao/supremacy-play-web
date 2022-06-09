import { Box } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { ClipThing } from "../../.."
import { useTheme } from "../../../../containers/theme"
import { consolidateMarketItemDeets, numFormatter } from "../../../../helpers"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { MechDetails } from "../../../../types"
import { MarketplaceBuyAuctionItem } from "../../../../types/marketplace"
import { MechInfo } from "./MechInfo"
import { Pricing } from "../../Common/MarketItem/Pricing"
import { Thumbnail } from "../../Common/MarketItem/Thumbnail"
import { SellerInfo } from "../../Common/MarketItem/SellerInfo"
import { Timeframe } from "../../Common/MarketItem/Timeframe"
import { ViewButton } from "../../Common/MarketItem/ViewButton"
import { MARKETPLACE_TABS } from "../../../../pages"

interface WarMachineMarketItemProps {
    item: MarketplaceBuyAuctionItem
    isGridView: boolean
}

export const WarMachineMarketItem = ({ item, isGridView }: WarMachineMarketItemProps) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [mechDetails, setMechDetails] = useState<MechDetails>()

    const marketItemDeets = useMemo(() => consolidateMarketItemDeets(item, theme), [item, theme])
    const formattedPrice = useMemo(() => numFormatter(marketItemDeets.price.toNumber()), [marketItemDeets.price])

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

    const { id, end_at, owner, mech, collection_item } = item

    if (!mech || !collection_item || !owner) return null

    const { username, gid } = owner
    const { name, label, avatar_url } = mech
    const { tier } = collection_item

    const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined
    const imageUrl = skin?.large_image_url

    return (
        <Box sx={{ position: "relative", overflow: "visible" }}>
            <ClipThing
                clipSize="7px"
                border={{
                    isFancy: !isGridView,
                    borderColor: marketItemDeets.primaryColor,
                    borderThickness: ".25rem",
                }}
                opacity={0.7}
                backgroundColor={marketItemDeets.backgroundColor}
            >
                <Box
                    sx={{
                        position: "relative",
                        p: isGridView ? "1.2rem 1.3rem" : ".8rem 1rem",
                        display: isGridView ? "block" : "grid",
                        gridTemplateRows: "7rem",
                        gridTemplateColumns: "8rem minmax(auto, 30rem) 1.5fr repeat(2, 1fr) min-content",
                        gap: "1.6rem",
                        ...(isGridView
                            ? {
                                  "&>*:not(:last-child)": {
                                      mb: ".8rem",
                                  },
                              }
                            : {}),
                    }}
                >
                    <Thumbnail isGridView={isGridView} imageUrl={avatar_url} />
                    <MechInfo isGridView={isGridView} name={name} label={label} tier={tier} mechDetails={mechDetails} />
                    <SellerInfo isGridView={isGridView} username={username} gid={gid} />
                    <Timeframe isGridView={isGridView} endAt={end_at} />
                    <Pricing isGridView={isGridView} formattedPrice={formattedPrice} priceLabel={marketItemDeets.priceLabel} />
                    <ViewButton
                        isGridView={isGridView}
                        primaryColor={marketItemDeets.primaryColor}
                        secondaryColor={marketItemDeets.secondaryColor}
                        listingTypeLabel={marketItemDeets.listingTypeLabel}
                        ctaLabel={marketItemDeets.ctaLabel}
                        icon={<marketItemDeets.Icon size="1.9rem" fill={marketItemDeets.secondaryColor} />}
                        to={`/marketplace/${MARKETPLACE_TABS.WarMachines}/${id}${location.hash}`}
                    />
                </Box>

                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: `url(${imageUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "top",
                        backgroundSize: "cover",
                        opacity: 0.11,
                        zIndex: -2,
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: `linear-gradient(to top, #FFFFFF10, ${marketItemDeets.backgroundColor}80)`,
                        zIndex: -1,
                    }}
                />
            </ClipThing>
        </Box>
    )
}
