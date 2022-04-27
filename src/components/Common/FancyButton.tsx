import LoadingButton, { LoadingButtonProps } from "@mui/lab/LoadingButton"
import { Box, styled, SxProps } from "@mui/system"
import { fonts } from "../../theme/theme"
import { ClipThing, ClipThingProps } from "./ClipThing"

const Base = styled(LoadingButton)({
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
    "& > *": {
        fontFamily: fonts.shareTech,
        fontWeight: "fontWeightBold",
    },
})

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
    caretColor?: string
    clipThingsProps?: ClipThingProps
}

export const FancyButton = ({ sx, excludeCaret = false, disabled, caretColor, clipThingsProps, children, ...props }: FancyButtonProps) => {
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
                        opacity: 0.5,
                        zIndex: 99,
                    }}
                />
            )}
            <Base sx={{ ...sx }} fullWidth {...props}>
                {children}
                {!excludeCaret && <Triangle sx={{ backgroundColor: caretColor }} />}
            </Base>
        </ClipThing>
    )
}
