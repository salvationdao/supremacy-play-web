import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { SvgIntroAnimation, SvgOutroAnimation, SvgPowerCore, SvgSkin, SvgUtilities, SvgWeapons } from "../../../assets"
import { getRarityDeets } from "../../../helpers"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { MARKETPLACE_TABS } from "../../../pages"
import { colors, fonts } from "../../../theme/theme"
import { MechDetails } from "../../../types"
import { MarketplaceBuyAuctionItem } from "../../../types/marketplace"
import { MarketItem } from "../Common/MarketItem/MarketItem"

interface WarMachineMarketItemProps {
    item: MarketplaceBuyAuctionItem
    isGridView: boolean
}

export const WeaponsMarketItem = ({ item, isGridView }: WarMachineMarketItemProps) => {
    // const { send } = useGameServerCommandsFaction("/faction_commander")
    // const [mechDetails, setMechDetails] = useState<MechDetails>()

    // useEffect(() => {
    //     ;(async () => {
    //         try {
    //             if (!item.mech) return
    //             const resp = await send<MechDetails>(GameServerKeys.GetMechDetails, {
    //                 mech_id: item.mech.id,
    //             })

    //             if (!resp) return
    //             setMechDetails(resp)
    //         } catch (e) {
    //             console.error(e)
    //         }
    //     })()
    // }, [item.mech, send])

    // const { mech, collection_item } = item
    const { weapon, collection_item } = item

    if (!weapon || !collection_item) return null

    const { label, avatar_url } = weapon
    const { tier } = collection_item

    // const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined
    // const imageUrl = skin?.large_image_url

    return (
        <MarketItem item={item} imageUrl={avatar_url} backgroundImageUrl={avatar_url} isGridView={isGridView} linkSubPath={MARKETPLACE_TABS.Weapons}>
            <WeaponInfo isGridView={isGridView} label={label} tier={tier} />
        </MarketItem>
    )
}

const WeaponInfo = ({ isGridView, label, tier }: { isGridView: boolean; label: string; tier: string }) => {
    const rarityDeets = useMemo(() => getRarityDeets(tier), [tier])

    return (
        <Stack spacing={isGridView ? ".1rem" : ".6rem"}>
            <Typography
                variant="body2"
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    color: rarityDeets.color,
                }}
            >
                {rarityDeets.label}
            </Typography>

            <Typography
                sx={{
                    fontWeight: "fontWeightBold",
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                }}
            >
                {label}
            </Typography>

            <Box sx={{ pt: isGridView ? ".4rem" : "" }}>{/* <MechLoadoutIcons mechDetails={mechDetails} /> */}</Box>
        </Stack>
    )
}
