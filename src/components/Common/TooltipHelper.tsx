import { Stack, Tooltip, Typography, useTheme } from "@mui/material"
import { ReactElement } from "react"
import { ClipThing } from ".."
import { fonts, siteZIndex } from "../../theme/theme"

export const TooltipHelper = ({
    text,
    children,
    isCentered,
    placement,
    open,
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
    open?: boolean
}) => {
    const theme = useTheme()

    if (!text) return <>{children}</>

    return (
        <Tooltip
            open={open}
            arrow
            placement={placement || (isCentered ? "bottom" : "bottom-start")}
            sx={{
                zIndex: `${siteZIndex.Tooltip} !important`,
                ".MuiTooltip-popper": {
                    zIndex: `${siteZIndex.Tooltip} !important`,
                },
            }}
            title={
                <ClipThing
                    clipSize="6px"
                    clipSlantSize="3px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".15rem",
                    }}
                    corners={{
                        topRight: true,
                        bottomLeft: true,
                    }}
                    opacity={0.99}
                    backgroundColor={theme.factionTheme.background}
                    sx={{ height: "100%" }}
                >
                    <Stack sx={{ height: "100%", px: "1.1rem", py: ".6rem" }}>
                        <Typography variant="body1" sx={{ fontFamily: fonts.shareTech, textAlign: isCentered ? "center" : "start" }}>
                            {text}
                        </Typography>
                    </Stack>
                </ClipThing>
            }
            componentsProps={{
                popper: {
                    style: { filter: "drop-shadow(0 3px 3px #00000050)", zIndex: 999999 },
                },
                arrow: { sx: { color: theme.factionTheme.primary } },
                tooltip: { sx: { padding: "0 !important", maxWidth: "25rem", background: "unset" } },
            }}
        >
            {children}
        </Tooltip>
    )
}
