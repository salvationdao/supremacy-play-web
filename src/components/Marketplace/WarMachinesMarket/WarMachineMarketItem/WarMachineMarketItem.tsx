import { Box, Stack } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { ClipThing } from "../../.."
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { MechDetails } from "../../../../types"
import { MarketplaceMechItem } from "../../../../types/marketplace"
import { Thumbnail } from "./Thumbnail"
import { MechInfo } from "./MechInfo"
import { SellerInfo } from "./SellerInfo"
import { OfferTimeframe } from "./OfferTimeframe"
import { Pricing } from "./Pricing"
import { ViewButton } from "./ViewButton"
import { colors } from "../../../../theme/theme"
import { shadeColor } from "../../../../helpers"

interface WarMachineMarketItemProps {
    item: MarketplaceMechItem
}

export const WarMachineMarketItem = ({ item }: WarMachineMarketItemProps) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [mechDetails, setMechDetails] = useState<MechDetails>()

    const auctionBackgroundColor = useMemo(() => shadeColor(colors.orange, -95), [])

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

    const { id, buyout, auction, end_at, buyout_price, auction_price, owner, mech } = item

    if (!mech || !owner) return null

    const { username, gid } = owner
    const { name, label, tier, avatar_url } = mech

    const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined
    const imageUrl = skin?.large_image_url

    return (
        <Box sx={{ position: "relative", overflow: "visible" }}>
            <ClipThing
                clipSize="7px"
                border={{
                    isFancy: true,
                    borderColor: buyout ? theme.factionTheme.primary : colors.orange,
                    borderThickness: ".25rem",
                }}
                opacity={0.7}
                backgroundColor={buyout ? theme.factionTheme.background : auctionBackgroundColor}
            >
                <Box
                    sx={{
                        position: "relative",
                        px: "1rem",
                        py: ".8rem",
                        display: "grid",
                        gridTemplateRows: "7rem",
                        gridTemplateColumns: "8rem minmax(auto, 32rem) 1.5fr repeat(2, 1fr) min-content",
                        gap: "1.6rem",
                    }}
                >
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
                            background: `linear-gradient(to top, #FFFFFF10, ${buyout ? theme.factionTheme.background : `${auctionBackgroundColor}80`})`,
                            zIndex: -1,
                        }}
                    />

                    <Thumbnail avatarUrl={avatar_url} />
                    <MechInfo name={name} label={label} tier={tier} mechDetails={mechDetails} />
                    <SellerInfo username={username} gid={gid} />
                    <OfferTimeframe endAt={end_at} buyout={buyout} auction={auction} />
                    <Pricing buyoutPrice={buyout_price} auctionPrice={auction_price} buyout={buyout} auction={auction} />
                    <ViewButton id={id} buyout={buyout} auction={auction} />
                </Box>
            </ClipThing>
        </Box>
    )
}

export const WarMachineMarketItemLoadingSkeleton = () => {
    return <Stack>Loading...</Stack>
}
