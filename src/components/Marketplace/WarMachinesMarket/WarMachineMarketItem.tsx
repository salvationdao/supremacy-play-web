import { Stack, Typography } from "@mui/material"
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

    const { name, label, avatar_url } = mech
    const { tier } = collection_item

    const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined
    const imageUrl = skin?.large_image_url

    return (
        <MarketItem item={item} imageUrl={avatar_url} backgroundImageUrl={imageUrl} isGridView={isGridView} linkSubPath={MARKETPLACE_TABS.WarMachines}>
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

    let hasSkin = false
    let hasIntroAnimation = false
    let hasOutroAnimation = false
    let hasPowerCore = false
    let weaponCount = 0
    let utilityCount = 0

    if (mechDetails) {
        const { chassis_skin_id, intro_animation_id, outro_animation_id, power_core_id } = mechDetails
        const weapons = mechDetails.weapons?.length
        const utilities = mechDetails.utility?.length

        if (chassis_skin_id) hasSkin = true
        if (intro_animation_id) hasIntroAnimation = true
        if (outro_animation_id) hasOutroAnimation = true
        if (power_core_id) hasPowerCore = true
        weaponCount += weapons
        utilityCount += utilities
    }

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
                variant="caption"
                sx={{
                    fontFamily: fonts.nostromoBold,
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

            <Stack direction="row" spacing=".5rem" sx={{ pt: isGridView ? ".4rem" : "" }}>
                {hasSkin && <SvgSkin fill={colors.chassisSkin} size="1.3rem" />}

                {hasIntroAnimation && <SvgIntroAnimation fill={colors.introAnimation} size="1.3rem" />}

                {hasOutroAnimation && <SvgOutroAnimation fill={colors.outroAnimation} size="1.3rem" />}

                {hasPowerCore && <SvgPowerCore fill={colors.powerCore} size="1.3rem" />}

                {new Array(weaponCount).fill(0).map((_, index) => (
                    <SvgWeapons key={`mech-info-${index}`} fill={colors.weapons} size="1.3rem" />
                ))}

                {new Array(utilityCount).fill(0).map((_, index) => (
                    <SvgUtilities key={`mech-info-${index}`} fill={colors.utilities} size="1.3rem" />
                ))}
            </Stack>
        </Stack>
    )
}
