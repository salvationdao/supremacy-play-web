import { Box, Tooltip, Typography } from "@mui/material"
import { ReactElement } from "react"

export const TooltipHelper = ({ text, children }: { text: string; children: ReactElement }) => {
    if (!text) return <>{children}</>

    return (
        <Tooltip
            arrow
            placement={"bottom-start"}
            title={
                <Box sx={{ px: 0.5, py: 0.2 }}>
                    <Typography variant="body1" sx={{ color: "#FFFFFF", fontFamily: "Share Tech" }}>
                        {text}
                    </Typography>
                </Box>
            }
            componentsProps={{
                popper: {
                    style: { filter: "drop-shadow(0 3px 3px #00000050)", zIndex: 999999, opacity: 0.92 },
                },
                arrow: { sx: { color: "#333333" } },
                tooltip: { sx: { maxWidth: 250, background: "#333333" } },
            }}
        >
            {children}
        </Tooltip>
    )
}
