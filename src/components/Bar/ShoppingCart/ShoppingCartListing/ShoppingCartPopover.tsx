import { Box, Stack } from "@mui/material"
import { MutableRefObject, useCallback, useEffect } from "react"
import { useTheme } from "../../../../containers/theme"
import { useToggle } from "../../../../hooks"
import { ShoppingCart } from "../../../../types/fiat"
import { NicePopover } from "../../../Common/Nice/NicePopover"
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
    const backgroundColor = theme.factionTheme.u800

    return (
        <NicePopover
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
        </NicePopover>
    )
}
