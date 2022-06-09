import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useTheme } from "../../../../containers/theme"
import { consolidateMarketItemDeets } from "../../../../helpers"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { MechDetails } from "../../../../types"
import { MarketplaceBuyAuctionItem } from "../../../../types/marketplace"
import { ClipThing } from "../../../Common/ClipThing"
import { MarketMedia, MechImage } from "./MechImage"
import { MechListingDetails } from "./MechListingDetails"
import { MechStatsDetails } from "./MechStatsDetails"

export const WarMachineMarketDetails = ({ id }: { id: string }) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [loadError, setLoadError] = useState<string>()
    const [marketItem, setMarketItem] = useState<MarketplaceBuyAuctionItem>()
    const [mechDetails, setMechDetails] = useState<MechDetails>()

    const marketItemDeets = useMemo(() => (marketItem ? consolidateMarketItemDeets(marketItem, theme) : undefined), [marketItem, theme])

    // Get listing details
    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<MarketplaceBuyAuctionItem>(GameServerKeys.MarketplaceSalesGet, {
                    id,
                })

                if (!resp) return
                setMarketItem(resp)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get listing details."
                setLoadError(message)
                console.error(err)
            }
        })()
    }, [id, send])

    // Get mech details
    useEffect(() => {
        ;(async () => {
            try {
                if (!marketItem || !marketItem.mech?.id) return
                const resp = await send<MechDetails>(GameServerKeys.GetMechDetails, {
                    mech_id: marketItem.mech.id,
                })

                if (!resp) return
                setMechDetails(resp)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get war machine details."
                setLoadError(message)
                console.error(err)
            }
        })()
    }, [marketItem, send])

    const content = useMemo(() => {
        const validStruct = !marketItem || (marketItem.mech && marketItem.owner)

        if (loadError || !validStruct) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: "100%", maxWidth: "100%", width: "75rem", px: "3rem", pt: "1.28rem" }}
                        spacing="1.5rem"
                    >
                        <Typography
                            sx={{
                                color: colors.red,
                                fontFamily: fonts.nostromoBold,
                                textAlign: "center",
                            }}
                        >
                            {loadError ? loadError : "Failed to load listing details."}
                        </Typography>
                    </Stack>
                </Stack>
            )
        }

        if (!marketItem || !marketItemDeets) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: theme.factionTheme.primary }} />
                    </Stack>
                </Stack>
            )
        }

        return <WarMachineMarketDetailsInner marketItem={marketItem} mechDetails={mechDetails} />
    }, [loadError, marketItem, marketItemDeets, mechDetails, theme.factionTheme.primary])

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: marketItemDeets?.primaryColor || theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            opacity={0.7}
            backgroundColor={marketItemDeets?.backgroundColor || theme.factionTheme.background}
            sx={{ height: "100%" }}
        >
            <Stack sx={{ height: "100%" }}>{content}</Stack>
        </ClipThing>
    )
}

const WarMachineMarketDetailsInner = ({ marketItem, mechDetails }: { marketItem: MarketplaceBuyAuctionItem; mechDetails?: MechDetails }) => {
    const media: MarketMedia[] = useMemo(() => {
        const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined
        if (!skin) return []

        const avatarUrl = skin.avatar_url // avatar
        const imageUrl = skin.image_url // poster for card_animation_url
        const cardAnimationUrl = skin.card_animation_url // smaller one, transparent bg
        const largeImageUrl = skin.large_image_url // poster for animation_url
        const animationUrl = skin.animation_url // big one

        return [
            {
                imageUrl: largeImageUrl,
                videoUrl: animationUrl,
            },
            {
                imageUrl: imageUrl,
                videoUrl: cardAnimationUrl,
            },
            {
                imageUrl: avatarUrl,
                videoUrl: avatarUrl,
            },
        ]
    }, [mechDetails])

    return (
        <Stack>
            <Box
                sx={{
                    px: "5rem",
                    py: "4rem",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(50rem, 1fr))",
                    gap: "3.5rem",
                    justifyContent: "center",
                }}
            >
                <MechImage media={media} />
                <MechListingDetails marketItem={marketItem} />
                <MechStatsDetails mechDetails={mechDetails} />
            </Box>
        </Stack>
    )
}
