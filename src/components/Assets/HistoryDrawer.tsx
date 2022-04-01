import { Drawer, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { RIGHT_DRAWER_WIDTH } from "../../constants"
import { colors } from "../../theme/theme"
import { Asset } from "../../types/assets"

export interface HistoryDrawerProps {
    open: boolean
    onClose: () => void
    asset: Asset
}

export const HistoryDrawer = ({ open, onClose, asset }: HistoryDrawerProps) => {
    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => {
            setShouldRender(open)
        }, 50)

        return () => clearTimeout(t)
    }, [open])

    return (
        <Drawer
            open={shouldRender}
            onClose={onClose}
            anchor="right"
            sx={{
                width: `${RIGHT_DRAWER_WIDTH}rem`,
                flexShrink: 0,
                zIndex: 9999,
                "& .MuiDrawer-paper": {
                    width: `${RIGHT_DRAWER_WIDTH}rem`,
                    backgroundColor: colors.darkNavy,
                },
            }}
        >
            <Typography variant="h4">{asset.data.mech.name || asset.data.mech.label}</Typography>
        </Drawer>
    )
}
