import { useState, useEffect, useCallback } from "react"
import { Box, Stack, Typography, TextField } from "@mui/material"
import { SvgSupToken } from "../../../../assets"
import { IS_TESTING_MODE } from "../../../../constants"
import { generatePriceText } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { ShoppingCart, ShoppingCartItem } from "../../../../types/fiat"
import { ClipThing } from "../../../Common/ClipThing"
import { GameServerKeys } from "../../../../keys"

interface Props {
    shoppingCart?: ShoppingCart
    primaryColor: string
    backgroundColor: string
}

export const ShoppingCartTable = ({ shoppingCart, primaryColor, backgroundColor }: Props) => {
    let totalDollars = 0
    let totalCents = 0
    shoppingCart?.items.forEach((item) => {
        totalDollars += item.product.price_dollars * item.quantity
        totalCents += item.product.price_cents * item.quantity
    })

    return (
        <Box sx={{ width: "500px" }}>
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
                        }}
                    >
                        {generatePriceText(totalDollars, totalCents)}
                    </Typography>
                </Stack>
            </Stack>
        </Box>
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
                    {generatePriceText(item.product.price_dollars, item.product.price_cents)}
                </Typography>
            </Stack>
        </Stack>
    )
}
