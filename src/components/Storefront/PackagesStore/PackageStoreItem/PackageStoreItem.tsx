import { Box, Stack, Skeleton, Typography } from "@mui/material"
import { useStripe } from "@stripe/react-stripe-js"
import { useMutation } from "react-fetching-library"
import { SafePNG } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { generatePriceText } from "../../../../helpers"
import { fonts } from "../../../../theme/theme"
import { StorefrontPackage } from "../../../../types"
import { ClipThing } from "../../../Common/ClipThing"
import { FancyButton } from "../../../Common/FancyButton"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"
import { CreateCheckoutSession } from "../../../../fetching"

interface PackageStoreItemProps {
    enlargedView?: boolean
    item: StorefrontPackage
}

export const PackageStoreItem = ({ enlargedView, item }: PackageStoreItemProps) => {
    const theme = useTheme()
    const stripe = useStripe()
    const { loading, mutate } = useMutation(CreateCheckoutSession)

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    const buyNowClickHandler = async () => {
        if (!stripe) return

        const host = window.location.protocol + "//" + window.location.host

        const { payload: sessionID, error } = await mutate({
            package_id: item.id,
            success_url: host + "/storefront/packages",
            cancel_url: host + "/storefront/packages",
        })

        if (error || !sessionID) {
            return
        }

        const resp = await stripe.redirectToCheckout({
            sessionId: sessionID,
        })

        if (resp.error) {
            // TODO: Handle errors :/
            return
        }
    }

    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    transition: "all .15s",
                    ":hover": {
                        transform: "translateY(-.4rem)",
                    },
                }}
            >
                <ClipThing
                    clipSize="12px"
                    border={{
                        borderColor: primaryColor,
                        borderThickness: enlargedView ? ".3rem" : ".2rem",
                    }}
                    opacity={0.9}
                    backgroundColor={backgroundColor}
                    sx={{ height: "100%" }}
                >
                    <Stack spacing={enlargedView ? "2.5rem" : "1.5rem"} sx={{ height: "100%", p: enlargedView ? "3rem" : "1.5rem" }}>
                        <Box sx={{ position: "relative" }}>
                            <Box
                                sx={{
                                    height: enlargedView ? "39rem" : "25rem",
                                }}
                            >
                                <MediaPreview imageUrl={SafePNG} objectFit="cover" />
                            </Box>

                            <Stack
                                alignItems="flex-start"
                                sx={{
                                    position: "absolute",
                                    left: enlargedView ? "1.4rem" : ".5rem",
                                    bottom: enlargedView ? ".6rem" : ".2rem",
                                }}
                            >
                                <Stack direction="row" alignItems="center" spacing=".1rem">
                                    <Typography sx={{ fontSize: enlargedView ? "2.2rem" : "1.9rem", fontFamily: fonts.nostromoBlack }}>
                                        {generatePriceText(item.price_dollars, item.price_cents)}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Box>

                        <Stack alignItems={enlargedView ? "center" : "flex-start"} spacing="1rem" sx={{ flex: 1, px: ".4rem", py: ".3rem", flexShrink: 0 }}>
                            <Typography
                                gutterBottom
                                variant={enlargedView ? "h4" : "h6"}
                                sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack, textAlign: enlargedView ? "center" : "start" }}
                            >
                                {item.name}
                            </Typography>

                            <Typography sx={{ fontSize: enlargedView ? "2.1rem" : "1.6rem", textAlign: enlargedView ? "center" : "start" }}>
                                {item.description}
                            </Typography>

                            <Stack
                                direction="row"
                                spacing="2rem"
                                alignItems="stretch"
                                justifyContent="center"
                                sx={{
                                    mt: "auto !important",
                                    mx: "auto",
                                    width: "100%",
                                    pt: "1.8rem",
                                }}
                            >
                                <FancyButton
                                    clipThingsProps={{
                                        clipSize: "5px",
                                        backgroundColor: primaryColor,
                                        opacity: 1,
                                        border: { isFancy: true, borderColor: primaryColor, borderThickness: "1.5px" },
                                        sx: { position: "relative", width: enlargedView ? "50%" : "100%", height: "100%" },
                                    }}
                                    loading={!stripe || loading}
                                    onClick={buyNowClickHandler}
                                    sx={{ px: "1.6rem", py: enlargedView ? "1.1rem" : ".6rem" }}
                                >
                                    <Typography
                                        variant={enlargedView ? "body1" : "caption"}
                                        sx={{ fontFamily: fonts.nostromoBlack, color: theme.factionTheme.secondary }}
                                    >
                                        Buy Now
                                    </Typography>
                                </FancyButton>
                            </Stack>
                        </Stack>
                    </Stack>
                </ClipThing>
            </Box>
        </>
    )
}

export const PackageStoreItemLoadingSkeleton = () => {
    const theme = useTheme()

    return (
        <Box sx={{ p: "1.2rem", width: "30rem" }}>
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".2rem",
                }}
                opacity={0.5}
                backgroundColor={theme.factionTheme.background}
            >
                <Stack spacing=".7rem" sx={{ px: "1.8rem", py: "1.6rem" }}>
                    <Skeleton variant="rectangular" width="100%" height="12rem" sx={{ mb: ".3rem !important" }} />
                    <Skeleton variant="rectangular" width="80%" height="2.2rem" />
                    <Skeleton variant="rectangular" width="100%" height="1.5rem" />
                    <Skeleton variant="rectangular" width="100%" height="1.5rem" />
                    <Skeleton variant="rectangular" width="100%" height="1.5rem" />
                    <Skeleton variant="rectangular" width="100%" height="4rem" sx={{ mt: "1rem !important" }} />
                </Stack>
            </ClipThing>
        </Box>
    )
}
