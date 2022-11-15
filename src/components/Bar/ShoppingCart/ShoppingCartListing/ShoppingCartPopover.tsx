import { Box, Popover, Stack } from "@mui/material"
import { MutableRefObject, useCallback, useEffect } from "react"
import { useTheme } from "../../../../containers/theme"
import { useToggle } from "../../../../hooks"
import { ShoppingCart } from "../../../../types/fiat"
import { NiceBoxThing } from "../../../Common/Nice/NiceBoxThing"
import { ShoppingCartTable } from "./ShoppingCartTable"

interface Props {
    open: boolean
    loading: boolean
    shoppingCart?: ShoppingCart
    popoverRef: MutableRefObject<null>
    onClose: () => void
}

export const ShoppingCartPopover = ({ open, loading, shoppingCart, popoverRef, onClose }: Props) => {
    const theme = useTheme()
    const [localOpen, toggleLocalOpen] = useToggle(open)

    useEffect(() => {
        if (!localOpen) {
            const timeout = setTimeout(() => {
                onClose()
            }, 300)

            return () => clearTimeout(timeout)
        }
    }, [localOpen, onClose])

    const closePopover = useCallback(() => toggleLocalOpen(false), [toggleLocalOpen])

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    return (
        <Popover
            open={localOpen}
            anchorEl={popoverRef.current}
            onClose={closePopover}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
        >
            <NiceBoxThing border={{ color: theme.factionTheme.primary }} background={{ colors: [theme.factionTheme.background] }} sx={{ height: "100%" }}>
                <Stack spacing="2rem" sx={{ position: "relative", minWidth: "35rem", maxHeight: "90vh", px: "2rem", pt: "1.6rem", pb: "2rem" }}>
                    <Box sx={{ minWidth: "500px" }}>
                        <ShoppingCartTable
                            loading={loading}
                            shoppingCart={shoppingCart}
                            primaryColor={primaryColor}
                            backgroundColor={backgroundColor}
                            onCheckoutClicked={closePopover}
                        />
                    </Box>
                </Stack>
            </NiceBoxThing>
        </Popover>
    )
}
