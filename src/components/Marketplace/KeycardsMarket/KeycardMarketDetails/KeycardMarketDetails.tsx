import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { SafePNG } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { MarketplaceBuyItem } from "../../../../types/marketplace"
import { ClipThing } from "../../../Common/ClipThing"
import { BuyNowDetails } from "../../Common/MarketDetails/BuyNowDetails"
import { Dates } from "../../Common/MarketDetails/Dates"
import { ImagesPreview } from "../../Common/MarketDetails/ImagesPreview"
import { Owner } from "../../Common/MarketDetails/Owner"
import { KeycardDetails } from "./KeycardDetails"

export const KeycardMarketDetails = ({ id }: { id: string }) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [loadError, setLoadError] = useState<string>()
    const [marketItem, setMarketItem] = useState<MarketplaceBuyItem>()

    // Get listing details
    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<MarketplaceBuyItem>(GameServerKeys.GetKeycard, {
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

    const content = useMemo(() => {
        const validStruct = !marketItem || (marketItem.keycard && marketItem.owner)

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

        if (!marketItem) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: theme.factionTheme.primary }} />
                    </Stack>
                </Stack>
            )
        }

        return <WarMachineMarketDetailsInner marketItem={marketItem} primaryColor={theme.factionTheme.primary} />
    }, [loadError, marketItem, theme.factionTheme.primary])

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            opacity={0.7}
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%" }}
        >
            <Stack sx={{ height: "100%" }}>{content}</Stack>
        </ClipThing>
    )
}

const WarMachineMarketDetailsInner = ({ marketItem, primaryColor }: { marketItem: MarketplaceBuyItem; primaryColor: string }) => {
    const { owner, keycard, created_at, end_at } = marketItem

    return (
        <Box
            sx={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                ml: "2rem",
                mr: "1rem",
                pr: "1rem",
                my: "2rem",
                direction: "ltr",
                scrollbarWidth: "none",
                "::-webkit-scrollbar": {
                    width: ".4rem",
                },
                "::-webkit-scrollbar-track": {
                    background: "#FFFFFF15",
                    borderRadius: 3,
                },
                "::-webkit-scrollbar-thumb": {
                    background: primaryColor,
                    borderRadius: 3,
                },
            }}
        >
            <Box sx={{ direction: "ltr", height: 0 }}>
                <Box
                    sx={{
                        pt: "2rem",
                        pb: "3.8rem",
                        px: "3rem",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(50rem, 1fr))",
                        gap: "3.5rem",
                        justifyContent: "center",
                    }}
                >
                    <ImagesPreview
                        media={[
                            {
                                imageUrl: keycard?.image_url || SafePNG,
                                videoUrl: keycard?.animation_url || SafePNG,
                            },
                        ]}
                        primaryColor={primaryColor}
                    />

                    <Stack spacing="2rem">
                        <Box>
                            <Typography gutterBottom variant="h5" sx={{ color: primaryColor, fontFamily: fonts.nostromoBold }}>
                                KEYCARD
                            </Typography>

                            <Typography variant="h4" sx={{ fontFamily: fonts.nostromoBlack }}>
                                {keycard?.label || "KEYCARD"}
                            </Typography>
                        </Box>

                        <Owner owner={owner} />

                        <Dates createdAt={created_at} endAt={end_at} />

                        <BuyNowDetails
                            id={marketItem.id}
                            itemName={marketItem.keycard?.label || "KEYCARD"}
                            buyNowPrice={marketItem.buyout_price}
                            createdAt={marketItem.created_at}
                        />
                    </Stack>

                    <KeycardDetails keycard={keycard} primaryColor={primaryColor} />
                </Box>
            </Box>
        </Box>
    )
}
