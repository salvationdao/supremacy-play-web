import { Box, Tooltip, Typography } from "@mui/material"
import { ReactElement } from "react"

export const TooltipHelper = ({
    text,
    children,
    isCentered,
    placement,
}: {
    text: string | React.ReactNode
    children: ReactElement
    isCentered?: boolean
    placement?:
        | "bottom-end"
        | "bottom-start"
        | "bottom"
        | "left-end"
        | "left-start"
        | "left"
        | "right-end"
        | "right-start"
        | "right"
        | "top-end"
        | "top-start"
        | "top"
}) => {
    if (!text) return <>{children}</>

    return (
        <Tooltip
            arrow
            placement={placement || (isCentered ? "bottom" : "bottom-start")}
            sx={{
                zIndex: "9999999 !important",
                ".MuiTooltip-popper": {
                    zIndex: "9999999 !important",
                },
            }}
            title={
                <Box sx={{ px: ".4rem", py: ".16rem" }}>
                    <Typography
                        variant="body1"
                        sx={{ fontFamily: "Share Tech", textAlign: isCentered ? "center" : "start" }}
                    >
                        {text}
                    </Typography>
                </Box>
            }
            componentsProps={{
                popper: {
                    style: { filter: "drop-shadow(0 3px 3px #00000050)", zIndex: 999999, opacity: 0.92 },
                },
                arrow: { sx: { color: "#333333" } },
                tooltip: { sx: { maxWidth: "25rem", background: "#333333" } },
            }}
        >
            {children}
        </Tooltip>
    )
}
