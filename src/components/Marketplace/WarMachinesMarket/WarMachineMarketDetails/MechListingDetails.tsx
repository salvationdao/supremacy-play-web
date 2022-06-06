import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useSupremacy } from "../../../../containers"
import { getRarityDeets } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"
import { MarketplaceMechItem } from "../../../../types/marketplace"
import { AuctionDetails } from "./AuctionDetails"
import { BuyoutDetails } from "./BuyoutDetails"

export const MechListingDetails = ({ marketItem }: { marketItem: MarketplaceMechItem }) => {
    const { getFaction } = useSupremacy()

    const rarityDeets = useMemo(() => getRarityDeets(marketItem.mech?.tier || ""), [marketItem.mech?.tier])
    const ownerFactionDeets = useMemo(() => getFaction(marketItem.owner?.faction_id || ""), [marketItem.owner, getFaction])

    if (!marketItem.owner || !marketItem.mech) return null

    const { buyout, owner, mech } = marketItem
    const { username, gid } = owner
    const { name, label } = mech

    return (
        <Stack spacing="2.5rem">
            <Box>
                <Typography gutterBottom variant="h5" sx={{ color: rarityDeets.color, fontFamily: fonts.nostromoBold }}>
                    {rarityDeets.label}
                </Typography>

                <Typography variant="h4" sx={{ fontFamily: fonts.nostromoBlack }}>
                    {name || label}
                </Typography>
            </Box>

            <Box>
                <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                    ITEM TYPE:
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: "fontWeightBold" }}>
                    WAR MACHINE
                </Typography>
            </Box>

            <Box>
                <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                    OWNED BY:
                </Typography>
                <Stack direction="row" alignItems="center" spacing=".7rem">
                    {ownerFactionDeets && (
                        <Box
                            sx={{
                                mt: "-0.2rem !important",
                                width: "2.4rem",
                                height: "2.4rem",
                                flexShrink: 0,
                                backgroundImage: `url(${ownerFactionDeets.logo_url})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "contain",
                                backgroundColor: ownerFactionDeets.primary_color,
                                borderRadius: 0.8,
                                border: `${ownerFactionDeets.primary_color} 1px solid`,
                            }}
                        />
                    )}
                    <Typography variant="h5" sx={{ color: ownerFactionDeets.primary_color, fontWeight: "fontWeightBold" }}>
                        {username}
                        <span style={{ marginLeft: ".2rem", opacity: 0.7, fontFamily: "inherit" }}>{`#${gid}`}</span>
                    </Typography>
                </Stack>
            </Box>

            {buyout ? <BuyoutDetails marketItem={marketItem} /> : <AuctionDetails marketItem={marketItem} />}
        </Stack>
    )
}
