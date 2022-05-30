import LoadingButton, { LoadingButtonProps } from "@mui/lab/LoadingButton"
import { Box, styled, SxProps } from "@mui/system"
import { HTMLAttributeAnchorTarget } from "react"
import { fonts } from "../../theme/theme"
import { ClipThing, ClipThingProps } from "./ClipThing"

const Triangle = styled("div")({
    position: "absolute",
    bottom: "3px",
    right: "3px",
    clipPath: "polygon(100% 0, 0% 100%, 100% 100%)",
    height: "1rem",
    width: "1rem",
})

interface FancyButtonProps extends LoadingButtonProps {
    excludeCaret?: boolean
    sx?: SxProps
    innerSx?: SxProps
    caretColor?: string
    clipThingsProps?: ClipThingProps
    href?: string
    target?: HTMLAttributeAnchorTarget | undefined
}

export const FancyButton = ({ sx, innerSx, excludeCaret = false, disabled, caretColor, clipThingsProps, children, ...props }: FancyButtonProps) => {
    return (
        <ClipThing {...clipThingsProps}>
            {disabled && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "#050c12",
                        opacity: 0.3,
                        zIndex: 99,
                    }}
                />
            )}
            <LoadingButton
                sx={{
                    borderRadius: 0,
                    fontFamily: fonts.shareTech,
                    fontWeight: "fontWeightBold",
                    color: "white",
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
                    ...sx,
                }}
                fullWidth
                {...props}
            >
                <Box sx={{ pt: ".3rem", height: "100%", width: "100%", ...innerSx }}>
                    {children}
                    {!excludeCaret && <Triangle sx={{ backgroundColor: caretColor }} />}
                </Box>
            </LoadingButton>
        </ClipThing>
    )
}
