import { useState, useCallback, useMemo } from "react"
import { Box, Stack, Skeleton, Typography, TextField } from "@mui/material"
import { SafePNG, SvgArrow } from "../../../../assets"
import { useGlobalNotifications } from "../../../../containers"
import React from "react"
import { useTheme } from "../../../../containers/theme"
import { generatePriceText } from "../../../../helpers"
import { fonts } from "../../../../theme/theme"
import { FiatProduct } from "../../../../types/fiat"
import { ClipThing } from "../../../Common/ClipThing"
import { FancyButton } from "../../../Common/FancyButton"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"
import { GameServerKeys } from "../../../../keys"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"

interface PackageStoreItemProps {
    enlargedView?: boolean
    item: FiatProduct
}

const propsAreEqual = (prevProps: PackageStoreItemProps, nextProps: PackageStoreItemProps) => {
    return prevProps.enlargedView === nextProps.enlargedView && prevProps.item.id === nextProps.item.id
}

export const PackageStoreItem = React.memo(function PackageStoreItem({ enlargedView, item }: PackageStoreItemProps) {
    const theme = useTheme()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    const [isLoading, setIsLoading] = useState(false)
    const [quantity, setQuantity] = useState(1)

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    const addToCart = useCallback(async () => {
        const errMsg = "Failed to add item to the shopping cart."
        const quantity = 1
        try {
            setIsLoading(true)
            const resp = await send<boolean>(GameServerKeys.FiatShoppingCartItemAdd, {
                product_id: item.id,
                quantity,
            })

            if (!resp) {
                newSnackbarMessage(errMsg, "error")
                return
            }

            newSnackbarMessage(`Successfully added ${quantity} Starter Package crate to shopping cart.`, "success")
        } catch (err) {
            newSnackbarMessage(typeof err === "string" ? err : errMsg, "error")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [send, newSnackbarMessage, item.id])

    const fiatPrice = useMemo(() => {
        let pricing: string | null = null
        for (const p of item.pricing) {
            if (p.currency_code === "USD") {
                pricing = generatePriceText("$USD", p.amount)
                break
            }
        }
        return pricing
    }, [item])

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
                        borderColor: `${primaryColor}50`,
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
                                    <Typography sx={{ fontSize: enlargedView ? "2.2rem" : "1.9rem", fontFamily: fonts.nostromoBlack }}>{fiatPrice}</Typography>
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
                                <ClipThing
                                    clipSize="5px"
                                    clipSlantSize="2px"
                                    border={{
                                        borderColor: primaryColor,
                                        borderThickness: "1.5px",
                                    }}
                                    opacity={0.9}
                                    backgroundColor={backgroundColor}
                                    sx={{ height: "100%", width: "15rem" }}
                                >
                                    <Stack direction="row" justifyContent="space-between">
                                        <TextField
                                            variant="outlined"
                                            hiddenLabel
                                            onWheel={(event) => {
                                                event.currentTarget.getElementsByTagName("input")[0]?.blur()
                                            }}
                                            sx={{
                                                backgroundColor: "#00000090",
                                                ".MuiOutlinedInput-input": {
                                                    px: "1.5rem",
                                                    py: "1.5rem",
                                                    fontSize: "2rem",
                                                    height: "unset",
                                                    "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                                                        WebkitAppearance: "none",
                                                    },
                                                    appearance: "textfield",
                                                },
                                                ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                                            }}
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => {
                                                const newAmount = parseInt(e.target.value)
                                                setQuantity(newAmount)
                                            }}
                                        />
                                        <Stack
                                            sx={{
                                                height: "5rem",
                                                p: "1em",
                                                "& svg:active": {
                                                    transform: "scale(1.5)",
                                                    transition: "all .2s",
                                                },
                                            }}
                                        >
                                            <SvgArrow
                                                size="1.5rem"
                                                sx={{ cursor: "pointer", zIndex: 1 }}
                                                fill={primaryColor}
                                                onClick={() => {
                                                    setQuantity(quantity + 1)
                                                }}
                                            />
                                            <SvgArrow
                                                size="1.5rem"
                                                sx={{ transform: "rotate(180deg)", cursor: "pointer" }}
                                                fill={primaryColor}
                                                onClick={() => {
                                                    if (quantity > 1) setQuantity(quantity - 1)
                                                }}
                                            />
                                        </Stack>
                                    </Stack>
                                </ClipThing>
                                <FancyButton
                                    loading={isLoading}
                                    clipThingsProps={{
                                        clipSize: "5px",
                                        backgroundColor: primaryColor,
                                        opacity: 1,
                                        border: { isFancy: true, borderColor: primaryColor, borderThickness: "1.5px" },
                                        sx: { position: "relative", width: enlargedView ? "50%" : "100%", height: "100%" },
                                    }}
                                    onClick={addToCart}
                                    sx={{ px: "1.6rem", py: enlargedView ? "1.1rem" : ".6rem" }}
                                >
                                    <Typography
                                        variant={enlargedView ? "body1" : "caption"}
                                        sx={{ fontFamily: fonts.nostromoBlack, color: theme.factionTheme.secondary }}
                                    >
                                        Add to Cart
                                    </Typography>
                                </FancyButton>
                            </Stack>
                        </Stack>
                    </Stack>
                </ClipThing>
            </Box>
        </>
    )
}, propsAreEqual)

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
