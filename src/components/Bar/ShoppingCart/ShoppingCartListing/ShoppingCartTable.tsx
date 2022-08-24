import { useState, useEffect, useCallback, useMemo } from "react"
import { Box, Stack, Typography, TextField, CircularProgress } from "@mui/material"
import { SvgArrow, SvgSupToken } from "../../../../assets"
import { IS_TESTING_MODE } from "../../../../constants"
import { generatePriceText } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { ShoppingCart, ShoppingCartItem } from "../../../../types/fiat"
import { ClipThing } from "../../../Common/ClipThing"
import { GameServerKeys } from "../../../../keys"
import { FancyButton } from "../../../Common/FancyButton"

interface Props {
    loading: boolean
    shoppingCart?: ShoppingCart
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
}

export const ShoppingCartTable = ({ shoppingCart, loading, primaryColor, secondaryColor, backgroundColor }: Props) => {
    const content = useMemo(() => {
        if (loading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                    </Stack>
                </Stack>
            )
        }

        // Render empty cart
        if (!shoppingCart || shoppingCart.items.length === 0) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <Typography variant="caption" sx={{ fontFamily: fonts.shareTech }}>
                            YOUR CART IS EMPTY
                        </Typography>
                    </Stack>
                </Stack>
            )
        }

        // Render cart items
        let totalDollars = 0
        let totalCents = 0
        shoppingCart?.items.forEach((item) => {
            totalDollars += item.product.price_dollars * item.quantity
            totalCents += item.product.price_cents * item.quantity
        })

        return (
            <>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption">Product</Typography>
                    <Typography variant="caption">Total</Typography>
                </Stack>

                {shoppingCart?.items.map((item) => {
                    return <ShoppingCartRow key={`shopping-cart-item-${item.id}`} item={item} primaryColor={primaryColor} backgroundColor={backgroundColor} />
                })}

                <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: "2rem" }}>
                    <Stack>
                        <Typography variant="caption" sx={{ textAlign: "right" }}>
                            Sub-Total:
                        </Typography>

                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="flex-end"
                            sx={{
                                mr: ".3rem",
                                py: ".6rem",
                                cursor: "pointer",
                                borderRadius: 1,
                                backgroundColor: "unset",
                                ":hover": {
                                    backgroundColor: "#FFFFFF12",
                                },
                                ":active": {
                                    opacity: 0.8,
                                },
                            }}
                        >
                            <SvgSupToken size="1.9rem" fill={IS_TESTING_MODE ? colors.red : colors.yellow} sx={{ mr: ".2rem", pb: 0 }} />
                            <Typography sx={{ fontFamily: fonts.nostromoBold, lineHeight: 1, whiteSpace: "nowrap" }}>
                                {/* {supFormatterNoFixed(onWorldSupsRaw, 2) : "0.00"} */}
                                0.00
                            </Typography>
                        </Stack>

                        <Typography
                            sx={{
                                fontFamily: fonts.shareTech,
                                textAlign: "right",
                            }}
                        >
                            {generatePriceText(totalDollars, totalCents)}
                        </Typography>

                        <FancyButton
                            clipThingsProps={{
                                clipSize: "5px",
                                backgroundColor: colors.blue,
                                opacity: 1,
                                border: { isFancy: true, borderColor: colors.blue, borderThickness: "1.5px" },
                                sx: { position: "relative", width: "100%", height: "100%", mt: "1rem" },
                            }}
                            sx={{ px: "1.6rem", py: "1.1rem" }}
                        >
                            <Typography variant={"body1"} sx={{ fontFamily: fonts.nostromoBlack, color: colors.offWhite }}>
                                CHECKOUT
                            </Typography>
                        </FancyButton>
                    </Stack>
                </Stack>
            </>
        )
    }, [shoppingCart, loading, primaryColor])

    return <Box sx={{ width: "500px" }}>{content}</Box>
}

interface ShoppingCartRowProps {
    item: ShoppingCartItem
    primaryColor: string
    backgroundColor: string
}

const ShoppingCartRow = ({ item, primaryColor, backgroundColor }: ShoppingCartRowProps) => {
    const { send } = useGameServerCommandsUser("/user_commander")

    const [quantity, setQuantity] = useState(item.quantity)
    const [updating, setUpdating] = useState(false)
    const [unsaved, setUnsaved] = useState(false)

    const updateCart = useCallback(async () => {
        try {
            setUpdating(true)
            const resp = await send(GameServerKeys.FiatShoppingCartItemUpdate, {
                id: item.id,
                quantity,
            })

            if (!resp) return
            setUnsaved(false)
        } catch (err) {
            console.error(err)
        } finally {
            setUpdating(false)
        }
    }, [quantity, send, item.id])

    useEffect(() => {
        if (!unsaved || updating) return
        const t = setTimeout(updateCart, 1000)
        return () => clearTimeout(t)
    }, [unsaved, updating, updateCart])

    return (
        <Stack direction="row" spacing={1} sx={{ borderBottom: `1px solid ${primaryColor}`, pb: "2rem" }}>
            {/* TODO: Product Image */}
            <Box sx={{ backgroundColor: "#666", width: "64px", height: "64px" }} />

            <Stack flexGrow={1}>
                <Typography
                    variant="h5"
                    sx={{
                        fontFamily: fonts.nostromoHeavy,
                        fontSize: "1.5rem",
                        textTransform: "uppercase",
                    }}
                >
                    {item?.product.name}
                </Typography>
                <Typography variant={"caption"}>Extremely Large (dummy text)</Typography>

                <Box sx={{ width: "10rem", mt: "0.5rem" }}>
                    <ClipThing
                        clipSize="5px"
                        clipSlantSize="2px"
                        opacity={0.9}
                        border={{
                            borderColor: primaryColor,
                            borderThickness: "1px",
                        }}
                        backgroundColor={backgroundColor}
                        sx={{ height: "100%", flex: 1 }}
                    >
                        <Stack sx={{ height: "100%" }}>
                            <Stack direction="row" justifyContent="space-between">
                                <TextField
                                    variant="outlined"
                                    hiddenLabel
                                    type="number"
                                    sx={{
                                        backgroundColor: "unset",
                                        ".MuiOutlinedInput-input": {
                                            px: "1.5rem",
                                            py: ".5rem",
                                            height: "unset",
                                            "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                                                WebkitAppearance: "none",
                                            },
                                            borderRadius: 0.5,
                                            border: `${primaryColor}50 2px solid`,
                                            ":hover, :focus, :active": { backgroundColor: "#00000080", border: `${primaryColor}99 2px solid` },
                                        },
                                        ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                                    }}
                                    value={quantity}
                                    disabled={updating}
                                    onChange={(e) => {
                                        const newValue = parseInt(e.target.value)
                                        if (isNaN(newValue)) return
                                        setQuantity(newValue)
                                        setUnsaved(true)
                                    }}
                                />

                                <Stack
                                    sx={{
                                        height: "2.5rem",
                                        p: "1em",
                                        "& svg:active": {
                                            transform: "scale(1.5)",
                                            transition: "all .2s",
                                        },
                                    }}
                                >
                                    <SvgArrow
                                        size="0.75rem"
                                        sx={{ cursor: "pointer", zIndex: 1 }}
                                        fill={primaryColor}
                                        onClick={() => {
                                            setQuantity((prev) => prev + 1)
                                        }}
                                    />
                                    <SvgArrow
                                        size="0.75rem"
                                        sx={{ transform: "rotate(180deg)", cursor: "pointer" }}
                                        fill={primaryColor}
                                        onClick={() => {
                                            if (quantity > 1) setQuantity((prev) => prev - 1)
                                        }}
                                    />
                                </Stack>
                            </Stack>
                        </Stack>
                    </ClipThing>
                </Box>
            </Stack>

            <Stack>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    sx={{
                        mr: ".3rem",
                        py: ".6rem",
                        cursor: "pointer",
                        borderRadius: 1,
                        backgroundColor: "unset",
                        ":hover": {
                            backgroundColor: "#FFFFFF12",
                        },
                        ":active": {
                            opacity: 0.8,
                        },
                    }}
                >
                    <SvgSupToken size="1.9rem" fill={IS_TESTING_MODE ? colors.red : colors.yellow} sx={{ mr: ".2rem", pb: 0 }} />
                    <Typography sx={{ fontFamily: fonts.nostromoBold, lineHeight: 1, whiteSpace: "nowrap" }}>
                        {/* {supFormatterNoFixed(onWorldSupsRaw, 2) : "0.00"} */}
                        0.00
                    </Typography>
                </Stack>

                <Typography
                    sx={{
                        fontFamily: fonts.shareTech,
                    }}
                >
                    {generatePriceText(item.product.price_dollars * quantity, item.product.price_cents * quantity)}
                </Typography>
            </Stack>
        </Stack>
    )
}
