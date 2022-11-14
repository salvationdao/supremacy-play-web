import { Popover, Stack } from "@mui/material"
import React, { MutableRefObject } from "react"
import { useTheme } from "../../../containers/theme"
import { NiceBoxThing } from "../Nice/NiceBoxThing"
import { NiceButton } from "../Nice/NiceButton"

export const BulkActionPopover = React.memo(function BulkActionPopover({
    open,
    onClose,
    popoverRef,
}: {
    open: boolean
    onClose: () => void
    popoverRef: MutableRefObject<null>
}) {
    const theme = useTheme()

    return (
        <Popover
            open={open}
            anchorEl={popoverRef.current}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
        >
            <NiceBoxThing border={{ color: theme.factionTheme.primary }} background={{ colors: [theme.factionTheme.background] }} sx={{ height: "100%" }}>
                <Stack spacing=".32rem" sx={{ p: ".8rem" }}>
                    <NiceButton sx={{ justifyContent: "flex-start" }}>STAKE SELECTED</NiceButton>

                    <NiceButton sx={{ justifyContent: "flex-start" }}>REPAIR SELECTED</NiceButton>
                </Stack>
            </NiceBoxThing>
        </Popover>
    )
})
