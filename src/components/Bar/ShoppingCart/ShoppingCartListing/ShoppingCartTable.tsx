import { useState, useEffect, useCallback, useMemo } from "react"
import { Box, Stack, Typography, TextField, CircularProgress, Button } from "@mui/material"
import { SvgArrow, SvgSupToken, SvgBin } from "../../../../assets"
import { IS_TESTING_MODE } from "../../../../constants"
import { snakeToTitle, generatePriceText, supFormatter } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { ShoppingCart, ShoppingCartItem } from "../../../../types/fiat"
import { ClipThing } from "../../../Common/ClipThing"
import { GameServerKeys } from "../../../../keys"
import { FancyButton } from "../../../Common/FancyButton"
import BigNumber from "bignumber.js"

interface Props {
    loading: boolean
    shoppingCart?: ShoppingCart
    primaryColor: string
    backgroundColor: string
    fullPage?: boolean
    onCheckoutClicked?: () => void
}

export const ShoppingCartTable = ({ shoppingCart, loading, primaryColor, backgroundColor, fullPage, onCheckoutClicked }: Props) => {
    const content = useMemo(() => {
        if (loading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress />
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
        let totalUSD = new BigNumber(0)
        let totalSUPS = new BigNumber(0)
        shoppingCart?.items.forEach((item) => {
            const priceUSD = item.product.pricing.find((p) => p.currency_code === "USD")
            const priceSUPS = item.product.pricing.find((p) => p.currency_code === "SUPS")
            if (priceUSD) {
                totalUSD = totalUSD.plus(new BigNumber(priceUSD.amount).multipliedBy(item.quantity))
            }
            if (priceSUPS) {
                totalSUPS = totalSUPS.plus(new BigNumber(priceSUPS.amount).multipliedBy(item.quantity))
            }
        })

        return (
            <>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption">Product</Typography>
                    <Typography variant="caption">Total</Typography>
                </Stack>

                {shoppingCart?.items.map((item) => {
                    return (
                        <ShoppingCartRow
                            key={`shopping-cart-item-${fullPage ? "full" : "popover"}-${item.id}`}
                            item={item}
                            primaryColor={primaryColor}
                            backgroundColor={backgroundColor}
                        />
                    )
                })}

                <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: "2rem" }}>
                    <Stack>
                        <Typography variant="caption" sx={{ textAlign: "right" }}>
                            Sub-Total:
                        </Typography>

                        {totalSUPS.isGreaterThan(new BigNumber(0)) && (
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
                                    {supFormatter(totalSUPS.toString(), 2) || "0.00"}
                                </Typography>
                            </Stack>
                        )}

                        <Typography
                            sx={{
                                fontFamily: fonts.shareTech,
                                textAlign: "right",
                            }}
                        >
                            {generatePriceText("$USD", totalUSD)}
                        </Typography>

                        {!fullPage && (
                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: colors.blue,
                                    opacity: 1,
                                    border: { isFancy: true, borderColor: colors.blue, borderThickness: "1.5px" },
                                    sx: { position: "relative", width: "100%", height: "100%", mt: "1rem" },
                                }}
                                to={"/storefront/shopping-cart"}
                                sx={{ px: "1.6rem", py: "1.1rem" }}
                                onClick={onCheckoutClicked}
                            >
                                <Typography variant={"body1"} sx={{ fontFamily: fonts.nostromoBlack, color: colors.offWhite }}>
                                    CHECKOUT
                                </Typography>
                            </FancyButton>
                        )}
                    </Stack>
                </Stack>
            </>
        )
    }, [shoppingCart, loading, primaryColor, backgroundColor, fullPage, onCheckoutClicked])

    return (
        <>
            <Typography sx={{ fontFamily: fonts.nostromoBlack, color: colors.offWhite }}>YOUR CART</Typography>

            {content}
        </>
    )
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

    const updateItem = useCallback(async () => {
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

    const removeItem = useCallback(async () => {
        try {
            await send(GameServerKeys.FiatShoppingCartItemRemove, {
                id: item.id,
            })
        } catch (err) {
            console.error(err)
        }
    }, [send, item.id])

    useEffect(() => {
        if (!unsaved || updating) return
        const t = setTimeout(updateItem, 1000)
        return () => clearTimeout(t)
    }, [unsaved, updating, updateItem])

    const fiatPrice = useMemo(() => {
        let pricing: string | null = null
        for (const p of item.product.pricing) {
            if (p.currency_code === "USD") {
                const amount = new BigNumber(p.amount).multipliedBy(item.quantity)
                pricing = generatePriceText("USD", amount)
                break
            }
        }
        return pricing
    }, [item.product, item.quantity])

    const supPrice = useMemo(() => {
        let pricing: string | null = null
        for (const p of item.product.pricing) {
            if (p.currency_code === "SUPS") {
                const amount = new BigNumber(p.amount).multipliedBy(item.quantity)
                pricing = supFormatter(amount.toString(), 2) || "0.00"
                break
            }
        }
        return pricing
    }, [item.product, item.quantity])

    return (
        <Stack direction="row" spacing={1} sx={{ borderBottom: `1px solid ${primaryColor}`, pb: "2rem", mb: "2rem" }}>
            <Box
                sx={{
                    width: "12rem",
                    height: "100%",
                    minHeight: "12rem",
                    backgroundColor,
                    background: `url(${item.product.avatar_url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                    transform: "scale(1.1)",
                }}
            />

            <Stack flexGrow={1}>
                <Typography
                    variant="h5"
                    sx={{
                        fontFamily: fonts.nostromoHeavy,
                        fontSize: "1.5rem",
                        textTransform: "uppercase",
                    }}
                >
                    {item.product.name}
                </Typography>
                <Typography variant={"caption"}>{snakeToTitle(item.product.product_type).toLocaleUpperCase()}</Typography>

                <Stack flexDirection="row">
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
                                        placeholder={"1"}
                                        onWheel={(event) => {
                                            event.currentTarget.getElementsByTagName("input")[0]?.blur()
                                        }}
                                        sx={{
                                            backgroundColor: "#00000090",
                                            ".MuiOutlinedInput-input": {
                                                px: ".75rem",
                                                py: ".75rem",
                                                height: "unset",
                                                "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                                                    WebkitAppearance: "none",
                                                },
                                                appearance: "textfield",
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
                                            size=".75rem"
                                            sx={{ cursor: "pointer", zIndex: 1 }}
                                            fill={primaryColor}
                                            onClick={() => {
                                                setQuantity((prev) => prev + 1)
                                                setUnsaved(true)
                                            }}
                                        />
                                        <SvgArrow
                                            size=".75rem"
                                            sx={{ transform: "rotate(180deg)", cursor: "pointer" }}
                                            fill={primaryColor}
                                            onClick={() => {
                                                if (quantity > 1) {
                                                    setQuantity((prev) => prev - 1)
                                                    setUnsaved(true)
                                                }
                                            }}
                                        />
                                    </Stack>
                                </Stack>
                            </Stack>
                        </ClipThing>
                    </Box>

                    <Button type="button" size="small" disabled={updating} onClick={removeItem} sx={{ ml: "1rem" }}>
                        <SvgBin sx={{ mr: "0.5rem" }} />
                        <Typography variant="caption">Remove</Typography>
                    </Button>
                </Stack>
            </Stack>

            <Stack>
                {supPrice !== "0" && (
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
                        <Typography sx={{ fontFamily: fonts.nostromoBold, lineHeight: 1, whiteSpace: "nowrap" }}>{supPrice}</Typography>
                    </Stack>
                )}

                <Typography
                    sx={{
                        fontFamily: fonts.shareTech,
                        textAlign: "right",
                    }}
                >
                    {fiatPrice}
                </Typography>
            </Stack>
        </Stack>
    )
}
