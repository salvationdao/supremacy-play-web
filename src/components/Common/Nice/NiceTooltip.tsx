import { Stack, SxProps, Tooltip, Typography } from "@mui/material"
import { ReactElement } from "react"
import { autoTextColor } from "../../../helpers"
import { fonts, siteZIndex } from "../../../theme/theme"
import { NiceBoxThing } from "./NiceBoxThing"

export type TooltipPlacement =
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

export const NiceTooltip = ({
    text,
    renderNode,
    children,
    isCentered,
    placement,
    open,
    color,
    textColor: tColor,
    tooltipSx,
}: {
    text?: string
    renderNode?: React.ReactNode
    children: ReactElement
    isCentered?: boolean
    placement?: TooltipPlacement
    open?: boolean
    color?: string
    textColor?: string
    tooltipSx?: SxProps
}) => {
    if (!text && !renderNode) return <>{children}</>

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
                    backgroundColor: primaryColor,
                    zIndex: `${siteZIndex.Tooltip} !important`,
                },
            }}
            title={
                <NiceBoxThing border={{ color: primaryColor }} background={{ colors: [primaryColor] }} sx={{ height: "100%" }}>
                    <Stack sx={{ height: "100%", p: ".5rem 1.2rem", backgroundColor: "#00000090" }}>
                        {renderNode || (
                            <Typography
                                variant="body1"
                                sx={{
                                    color: textColor || "#FFFFFF",
                                    fontFamily: fonts.shareTech,
                                    lineHeight: 1.5,
                                    textAlign: isCentered ? "center" : "start",
                                }}
                            >
                                <strong>{text}</strong>
                            </Typography>
                        )}
                    </Stack>
                </NiceBoxThing>
            }
            componentsProps={{
                popper: {
                    style: { filter: "drop-shadow(0 3px 3px #00000050)", zIndex: 999999 },
                },
                arrow: { sx: { color: primaryColor } },
                tooltip: { sx: { padding: "0 !important", maxWidth: "25rem", background: "unset", ...tooltipSx } },
            }}
        >
            {children}
        </Tooltip>
    )
}
