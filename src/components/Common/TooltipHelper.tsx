import { Stack, Tooltip, Typography } from "@mui/material"
import { ReactElement } from "react"
import { ClipThing } from ".."
import { autoTextColor } from "../../helpers"
import { fonts, siteZIndex } from "../../theme/theme"

export const TooltipHelper = ({
    text,
    children,
    isCentered,
    placement,
    open,
    color,
    textColor: tColor,
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
    color?: string
    textColor?: string
}) => {
    if (!text) return <>{children}</>

    const primaryColor = color || "#555555"
    const textColor = tColor || autoTextColor(primaryColor)

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
                        borderColor: primaryColor,
                        borderThickness: "1.2px",
                    }}
                    corners={{
                        topRight: true,
                        bottomLeft: true,
                    }}
                    opacity={0.99}
                    backgroundColor={primaryColor}
                    sx={{ height: "100%" }}
                >
                    <Stack sx={{ height: "100%", px: "1.1rem", py: ".6rem" }}>
                        <Typography
                            variant="body1"
                            sx={{ color: textColor || "#FFFFFF", fontFamily: fonts.shareTech, textAlign: isCentered ? "center" : "start" }}
                        >
                            <strong>{text}</strong>
                        </Typography>
                    </Stack>
                </ClipThing>
            }
            componentsProps={{
                popper: {
                    style: { filter: "drop-shadow(0 3px 3px #00000050)", zIndex: 999999 },
                },
                arrow: { sx: { color: primaryColor } },
                tooltip: { sx: { padding: "0 !important", maxWidth: "25rem", background: "unset" } },
            }}
        >
            {children}
        </Tooltip>
    )
}
