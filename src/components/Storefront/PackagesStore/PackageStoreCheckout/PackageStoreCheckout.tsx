import { useState, useEffect, useMemo } from "react"
import { Masonry } from "@mui/lab"
import { useMediaQuery, Stack, Box, Typography, CircularProgress } from "@mui/material"
import { Elements, CardElement } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { STRIPE_PUBLISHABLE_KEY } from "../../../../constants"
import { useTheme } from "../../../../containers/theme"
import { colors, fonts } from "../../../../theme/theme"
import { SafePNG } from "../../../../assets"
import { ClipThing } from "../../../Common/ClipThing"
import { ImagesPreview } from "../../../Marketplace/Common/MarketDetails/ImagesPreview"
import { FiatProduct } from "../../../../types/fiat"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { useSnackbar } from "../../../../containers"

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

interface Props {
    id: string
}

export const PackageStoreCheckout = ({ id }: Props) => {
    const theme = useTheme()
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    const [product, setProduct] = useState<FiatProduct>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()

    const primaryColor = theme.factionTheme.primary

    useEffect(() => {
        ;(async () => {
            try {
                setIsLoading(true)
                const resp = await send<FiatProduct>(GameServerKeys.FiatProductGet, { id })
                if (!resp) return
                setLoadError(undefined)
                setProduct(resp)
            } catch (err) {
                let message = "Failed to get package."
                if (typeof err === "string") {
                    message = err
                } else if (err instanceof Error) {
                    message = err.message
                }
                setLoadError(message)
                newSnackbarMessage(message, "error")
            } finally {
                setIsLoading(false)
            }
        })()
    }, [id, send, newSnackbarMessage])

    const content = useMemo(() => {
        if (loadError) {
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
                            {loadError}
                        </Typography>
                    </Stack>
                </Stack>
            )
        }

        if (!product || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                    </Stack>
                </Stack>
            )
        }
        return <PackageStoreCheckoutInner product={product} />
    }, [isLoading, loadError, product, primaryColor])

    return (
        <Elements stripe={stripePromise}>
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
                <Stack sx={{ height: "100%" }}>({content}</Stack>
            </ClipThing>
        </Elements>
    )
}

interface PackageStoreCheckoutInnerProps {
    product: FiatProduct
}

const PackageStoreCheckoutInner = ({ product }: PackageStoreCheckoutInnerProps) => {
    const theme = useTheme()
    const below780 = useMediaQuery("(max-width:780px)")

    const primaryColor = theme.factionTheme.primary

    return (
        <Stack sx={{ height: "100%" }}>
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
                        }}
                    >
                        <Masonry columns={below780 ? 1 : 2} spacing={4}>
                            <ImagesPreview
                                media={[
                                    {
                                        imageUrl: SafePNG,
                                    },
                                ]}
                                primaryColor={primaryColor}
                            />

                            <Stack spacing="2rem" sx={{ pb: "1rem", minHeight: "65rem" }}>
                                <Box>
                                    <Typography gutterBottom variant="h5" sx={{ color: primaryColor, fontFamily: fonts.nostromoBold }}>
                                        STARTER PACKAGES
                                    </Typography>

                                    <Typography variant="h4" sx={{ fontFamily: fonts.nostromoBlack }}>
                                        {product.name}
                                    </Typography>
                                </Box>
                                <CardElement />
                            </Stack>
                        </Masonry>
                    </Box>
                </Box>
            </Box>
        </Stack>
    )
}
