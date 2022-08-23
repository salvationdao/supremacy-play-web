import { useRef } from "react"
import { Stack, Box, IconButton, Badge } from "@mui/material"
import { SvgShoppingCart } from "../../../assets"
import { useFiat } from "../../../containers/fiat"
import { ShoppingCartPopover } from "./ShoppingCartListing/ShoppingCartPopover"
import { useToggle } from "../../../hooks"

export const ShoppingCart = () => {
    const { shoppingCart, itemsCount } = useFiat()
    const popoverRef = useRef(null)
    const [popoverOpen, togglePopoverOpen] = useToggle(false)

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                ref={popoverRef}
                sx={{
                    mx: "1.2rem",
                    height: "100%",
                }}
            >
                <Box>
                    <Badge
                        badgeContent={itemsCount}
                        color="error"
                        sx={{
                            "& .MuiBadge-badge": {
                                top: 10,
                                right: 6,
                                height: 14,
                                minWidth: 14,
                                fontSize: "1.5rem",
                                fontWeight: "fontWeightBold",
                            },
                        }}
                    >
                        <IconButton onClick={() => togglePopoverOpen()}>
                            <SvgShoppingCart size="2.2rem" />
                        </IconButton>
                    </Badge>
                </Box>
            </Stack>

            {popoverOpen && (
                <ShoppingCartPopover
                    open={popoverOpen}
                    shoppingCart={shoppingCart}
                    popoverRef={popoverRef}
                    onClose={() => {
                        togglePopoverOpen(false)
                    }}
                />
            )}
        </>
    )
}
