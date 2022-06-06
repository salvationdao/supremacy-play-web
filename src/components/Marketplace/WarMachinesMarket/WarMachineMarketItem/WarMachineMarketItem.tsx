import { Box } from "@mui/material"
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
import { Timeframe } from "./Timeframe"
import { Pricing } from "./Pricing"
import { ViewButton } from "./ViewButton"
import { colors } from "../../../../theme/theme"
import { shadeColor } from "../../../../helpers"

interface WarMachineMarketItemProps {
    item: MarketplaceMechItem
    isGridView: boolean
}

export const WarMachineMarketItem = ({ item, isGridView }: WarMachineMarketItemProps) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [mechDetails, setMechDetails] = useState<MechDetails>()

    const primaryColor = useMemo(() => (item.buyout ? theme.factionTheme.primary : colors.orange), [item.buyout, theme.factionTheme.primary])
    const backgroundColor = useMemo(
        () => (item.buyout ? theme.factionTheme.background : shadeColor(colors.orange, -97)),
        [item.buyout, theme.factionTheme.background],
    )

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

    const { id, buyout, auction, end_at, buyout_price, auction_current_price, owner, mech } = item

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
                    isFancy: !isGridView,
                    borderColor: primaryColor,
                    borderThickness: ".25rem",
                }}
                opacity={0.7}
                backgroundColor={backgroundColor}
            >
                <Box
                    sx={{
                        position: "relative",
                        p: isGridView ? "1.2rem 1.3rem" : ".8rem 1rem",
                        display: isGridView ? "block" : "grid",
                        gridTemplateRows: "7rem",
                        gridTemplateColumns: "8rem minmax(auto, 32rem) 1.5fr repeat(2, 1fr) min-content",
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
                    <Thumbnail isGridView={isGridView} avatarUrl={avatar_url} />
                    <MechInfo isGridView={isGridView} name={name} label={label} tier={tier} mechDetails={mechDetails} />
                    <SellerInfo isGridView={isGridView} username={username} gid={gid} />
                    <Timeframe isGridView={isGridView} endAt={end_at} buyout={buyout} auction={auction} />
                    <Pricing isGridView={isGridView} buyoutPrice={buyout_price} auctionPrice={auction_current_price} buyout={buyout} auction={auction} />
                    <ViewButton isGridView={isGridView} id={id} buyout={buyout} auction={auction} />
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
                        background: `linear-gradient(to top, #FFFFFF10, ${backgroundColor}80)`,
                        zIndex: -1,
                    }}
                />
            </ClipThing>
        </Box>
    )
}
