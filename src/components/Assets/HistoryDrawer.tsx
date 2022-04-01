import { Drawer, Typography } from "@mui/material"
import { useEffect } from "react"
import { Asset } from "../../types/assets"

export interface HistoryDrawerProps {
    open: boolean
    onClose: () => void
    asset: Asset
}

export const HistoryDrawer = ({ open, onClose, asset }: HistoryDrawerProps) => {
    useEffect(() => {
        console.log(asset)
    }, [])

    return (
        <Drawer
            ModalProps={{
                sx: {
                    zIndex: "tooltip",
                },
            }}
            anchor="right"
            open={open}
            onClose={onClose}
        >
            <Typography variant="h1">{asset.data.mech.name || asset.data.mech.label}</Typography>
        </Drawer>
    )
}
