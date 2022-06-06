import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { ClipThing, FancyButton } from "../../.."
import { SvgSupToken, SvgWallet } from "../../../../assets"
import { useSupremacy } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { getRarityDeets, timeSinceInWords } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"
import { MarketplaceMechItem } from "../../../../types/marketplace"

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

            {buyout ? <Buyout marketItem={marketItem} /> : <Auction marketItem={marketItem} />}
        </Stack>
    )
}

const Buyout = ({ marketItem }: { marketItem: MarketplaceMechItem }) => {
    const theme = useTheme()
    const { end_at, buyout_price } = marketItem
    const timeLeft = useMemo(() => timeSinceInWords(new Date(), end_at), [end_at])

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    // const confirmBuyCloseHandler = useCallback(async () => {
    //     try {
    //         await send<{ total: number; records: MarketplaceMechItem[] }>(GameServerKeys.MarketplaceSalesBuy, {
    //             item_id: targetBuyItem.id,
    //         })
    //         setBuyError(null)
    //         listQuery()
    //     } catch (err) {
    //         setBuyError(err as string)
    //     }
    // },[])

    return (
        <>
            <Box>
                <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                    PRICE:
                </Typography>
                <ClipThing
                    clipSize="10px"
                    clipSlantSize="3px"
                    border={{
                        isFancy: true,
                        borderColor: primaryColor,
                        borderThickness: ".2rem",
                    }}
                    corners={{
                        topRight: true,
                        bottomLeft: true,
                    }}
                    backgroundColor={backgroundColor}
                    sx={{ width: "min-content" }}
                >
                    <Stack direction="row" alignItems="center" spacing=".2rem" sx={{ pl: "1.5rem", pr: "1.6rem", py: ".5rem" }}>
                        <SvgSupToken size="2.2rem" fill={colors.yellow} sx={{ mt: ".1rem" }} />
                        <Typography variant="h5" sx={{ fontWeight: "fontWeightBold" }}>
                            {buyout_price}
                        </Typography>
                    </Stack>
                </ClipThing>
            </Box>

            <Box>
                <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                    TIME LEFT:
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: "fontWeightBold" }}>
                    {timeLeft} <span style={{ opacity: 0.7, fontFamily: "inherit" }}>({end_at.toUTCString()})</span>
                </Typography>
            </Box>

            <FancyButton
                excludeCaret
                clipThingsProps={{
                    clipSize: "9px",
                    backgroundColor: primaryColor,
                    opacity: 1,
                    border: { isFancy: true, borderColor: primaryColor, borderThickness: "2px" },
                    sx: { position: "relative", width: "20rem" },
                }}
                sx={{ py: ".9rem", color: secondaryColor }}
                // onClick={onClick}
            >
                <Stack direction="row" spacing=".9rem" alignItems="center" justifyContent="center">
                    <SvgWallet size="1.9rem" fill={secondaryColor} />

                    <Typography
                        sx={{
                            flexShrink: 0,
                            color: secondaryColor,
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        BUY NOW
                    </Typography>
                </Stack>
            </FancyButton>
        </>
    )
}

const Auction = ({ marketItem }: { marketItem: MarketplaceMechItem }) => {
    const { end_at, auction_price } = marketItem

    return null
}
