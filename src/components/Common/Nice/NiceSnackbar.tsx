import { IconButton, Snackbar, SnackbarProps, Stack, Typography } from "@mui/material"
import React, { ReactNode } from "react"
import { SvgClose2, SvgInfoCircular } from "../../../assets"
import { colors } from "../../../theme/theme"
import { NiceBoxThing } from "./NiceBoxThing"

interface NiceSnackBarProps extends SnackbarProps {
    icon?: ReactNode
    message?: string
    color?: string
}

export const NiceSnackBar = React.memo(function NiceSnackbar({ icon, message, color, ...props }: NiceSnackBarProps) {
    return (
        <Snackbar {...props}>
            <NiceBoxThing
                border={{ color: color || colors.blue }}
                background={{ color: [`${color || colors.blue}60`, `${color || colors.blue}90`] }}
                sx={{
                    mb: "-1rem",
                    ml: "-1rem",
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing="1rem"
                    sx={{
                        px: "1.6rem",
                        pt: ".7rem",
                        pb: ".4rem",
                        pr: ".9rem",
                        borderRadius: 0.4,
                        boxShadow: 23,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "bold", lineHeight: 1.75 }}>
                        {icon || <SvgInfoCircular inline size="1.4rem" />} {message}
                    </Typography>

                    <IconButton size="small" onClick={() => props.onClose}>
                        <SvgClose2 size="1.4rem" sx={{ opacity: 0.8, ":hover": { opacity: 1 } }} />
                    </IconButton>
                </Stack>
            </NiceBoxThing>
        </Snackbar>
    )
})
