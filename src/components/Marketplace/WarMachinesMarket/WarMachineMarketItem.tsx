import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { getRarityDeets } from "../../../helpers"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { MARKETPLACE_TABS } from "../../../pages"
import { fonts } from "../../../theme/theme"
import { MechDetails } from "../../../types"
import { MarketplaceBuyAuctionItem } from "../../../types/marketplace"
import { MechLoadoutIcons } from "../../Hangar/WarMachinesHangar/Common/MechLoadoutIcons"
import { MarketItem } from "../Common/MarketItem/MarketItem"

interface WarMachineMarketItemProps {
    item: MarketplaceBuyAuctionItem
    isGridView: boolean
}

export const WarMachineMarketItem = ({ item, isGridView }: WarMachineMarketItemProps) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [mechDetails, setMechDetails] = useState<MechDetails>()

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

    const { mech, collection_item } = item

    if (!mech || !collection_item) return null

    const { name, label } = mech
    const { tier } = collection_item

    const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined
    const avatarUrl = skin?.avatar_url || mech.avatar_url
    const largeImageUrl = skin?.large_image_url

    return (
        <MarketItem item={item} imageUrl={avatarUrl} backgroundImageUrl={largeImageUrl} isGridView={isGridView} linkSubPath={MARKETPLACE_TABS.WarMachines}>
            <MechInfo isGridView={isGridView} name={name} label={label} tier={tier} mechDetails={mechDetails} />
        </MarketItem>
    )
}

const MechInfo = ({
    isGridView,
    name,
    label,
    tier,
    mechDetails,
}: {
    isGridView: boolean
    name: string
    label: string
    tier: string
    mechDetails?: MechDetails
}) => {
    const rarityDeets = useMemo(() => getRarityDeets(tier), [tier])

    return (
        <Stack spacing={isGridView ? ".1rem" : ".6rem"}>
            <Typography
                variant="body2"
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    color: rarityDeets.color,
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 1, // change to max number of lines
                    WebkitBoxOrient: "vertical",
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
                {name || label}
            </Typography>

            <Box sx={{ pt: isGridView ? ".4rem" : "" }}>
                <MechLoadoutIcons mechDetails={mechDetails} />
            </Box>
        </Stack>
    )
}
