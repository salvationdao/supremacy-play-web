// @ts-nocheck //TODO: remove this and fix
import LoadingButton, { LoadingButtonProps } from "@mui/lab/LoadingButton"
import { Box, styled, SxProps } from "@mui/system"
import React from "react"
import { colors } from "../../theme/theme"
import { ClipThing, ClipThingProps } from "./ClipThing"
import { Theme } from "@mui/material/styles"

const Base = styled(LoadingButton)({
    borderRadius: 0,
    fontFamily: "Share Tech, sans serif",
    fontWeight: "fontWeightBold",
    backgroundColor: colors.darkNeonBlue,
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
        fontFamily: "Share Tech, sans serif",
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

interface FancyButtonProps extends LoadingButtonProps, ClipThingProps {
    borderColor?: string
    backgroundColor?: string
    excludeCaret?: boolean
    sx?: SxProps<Theme>
    clipSx?: SxProps<Theme>
}

export const FancyButton: React.FC<FancyButtonProps> = ({
    children,
    borderColor,
    backgroundColor,
    clipSize,
    clipSx,
    sx,
    fullWidth,
    border,
    excludeCaret = false,
    disabled,
    ...props
}) => {
    return (
        <ClipThing
            clipSize={clipSize}
            sx={{
                display: "inline-block",
                width: fullWidth ? "100%" : "auto",
                ...clipSx,
                position: "relative",
            }}
            border={{
                ...border,
                isFancy: true,
                borderColor: borderColor,
            }}
            innerSx={{
                backgroundColor,
                "&:hover": {
                    ".fancy-button-hover": { opacity: 0.2 },
                },
            }}
        >
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

            <Box
                className="fancy-button-hover"
                sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "black",
                    opacity: 0,
                    pointerEvents: "none",
                    transition: "all .2s",
                    zIndex: 9,
                }}
            />

            <Base
                sx={{
                    ...sx,
                    backgroundColor,
                }}
                fullWidth
                {...props}
            >
                {children}
                {!excludeCaret && (
                    <Triangle
                        sx={{
                            backgroundColor: borderColor,
                        }}
                    />
                )}
            </Base>
        </ClipThing>
    )
}
