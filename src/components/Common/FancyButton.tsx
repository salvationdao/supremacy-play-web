import LoadingButton, { LoadingButtonProps } from "@mui/lab/LoadingButton"
import { Box, SxProps } from "@mui/system"
import { HTMLAttributeAnchorTarget } from "react"
import { Link } from "react-router-dom"
import { mergeDeep } from "../../helpers"
import { colors, fonts } from "../../theme/theme"
import { ClipThing, ClipThingProps } from "./ClipThing"
interface FancyButtonProps extends LoadingButtonProps {
    sx?: SxProps
    innerSx?: SxProps
    clipThingsProps?: ClipThingProps
    href?: string
    to?: string
    target?: HTMLAttributeAnchorTarget | undefined
}

export const FancyButton = ({ sx, innerSx, disabled, clipThingsProps, children, loading, to, href, target, ...props }: FancyButtonProps) => {
    const isDisabled = loading || disabled
    return (
        <ClipThing
            corners={{
                topRight: true,
                bottomLeft: true,
            }}
            {...mergeDeep(
                { clipSlantSize: "2px" },
                clipThingsProps,
                { opacity: disabled ? 0.5 : clipThingsProps?.opacity },
                isDisabled ? { sx: { filter: "grayscale(60%)" } } : {},
            )}
        >
            {isDisabled && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "#050c12",
                        opacity: 0.5,
                        zIndex: 99,
                    }}
                />
            )}

            <LoadingButton
                disabled={isDisabled}
                sx={{
                    borderRadius: 0,
                    fontFamily: fonts.shareTech,
                    fontWeight: "fontWeightBold",
                    color: "#FFFFFF",
                    textTransform: "uppercase",
                    "&:focus": {
                        boxShadow: "none",
                    },
                    "&:active": {
                        opacity: 0.75,
                    },
                    "& .MuiLoadingButton-loadingIndicator": {
                        color: "#FFFFFF",
                    },
                    ".MuiCircularProgress-root": {
                        color: colors.offWhite,
                    },
                    ...sx,
                }}
                fullWidth
                loading={loading}
                {...props}
            >
                <Box sx={{ pt: ".3rem", height: "100%", width: "100%", ...innerSx }}>
                    {to ? (
                        <Link to={to} target={target}>
                            {children}
                        </Link>
                    ) : href ? (
                        <a href={href} target={target}>
                            {children}
                        </a>
                    ) : (
                        children
                    )}
                </Box>
            </LoadingButton>
        </ClipThing>
    )
}
