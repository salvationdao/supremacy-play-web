import { Stack, SxProps, Tooltip, TooltipProps, Typography } from "@mui/material"
import { ReactElement } from "react"
import { useTheme } from "../../../containers/theme"
import { fonts, siteZIndex } from "../../../theme/theme"
import { NiceBoxThing } from "./NiceBoxThing"

interface NiceTooltipProps extends Omit<TooltipProps, "title"> {
    text?: string
    renderNode?: React.ReactNode
    children: ReactElement
    placement?: TooltipPlacement
    color?: string
    textColor?: string
    tooltipSx?: SxProps
}

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

export const NiceTooltip = ({ text, renderNode, children, placement, color, textColor, tooltipSx, ...props }: NiceTooltipProps) => {
    const theme = useTheme()
    if (!text && !renderNode) return <>{children}</>

    const primaryColor = color || "#555555"

    return (
        <Tooltip
            arrow
            placement={placement || "bottom-start"}
            sx={{
                zIndex: `${siteZIndex.Tooltip} !important`,
                ".MuiTooltip-popper": {
                    backgroundColor: primaryColor,
                    zIndex: `${siteZIndex.Tooltip} !important`,
                },
            }}
            title={
                <NiceBoxThing
                    border={{
                        color: `${primaryColor}50`,
                        thickness: "very-lean",
                    }}
                    background={{ colors: [theme.factionTheme.background] }}
                    sx={{ height: "100%" }}
                >
                    <Stack sx={{ height: "100%", backgroundColor: "#FFFFFF10" }}>
                        {renderNode || (
                            <Typography
                                variant="body1"
                                sx={{
                                    p: ".5rem 1.2rem",
                                    color: textColor || "#FFFFFF",
                                    fontFamily: fonts.rajdhaniMedium,
                                    lineHeight: 1.5,
                                    textAlign: "start",
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
                arrow: { sx: { color: `${primaryColor}80` } },
                tooltip: { sx: { padding: "0 !important", maxWidth: renderNode ? "unset" : "25rem", background: "unset", ...tooltipSx } },
            }}
            {...props}
        >
            {children}
        </Tooltip>
    )
}
