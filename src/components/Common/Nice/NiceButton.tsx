import { Box, ButtonBaseProps, CircularProgress, SxProps } from "@mui/material"
import React, { HTMLAttributeAnchorTarget } from "react"
import { NiceBoxThing, NiceBoxThingProps } from "./NiceBoxThing"

type Bruh = ButtonBaseProps & NiceBoxThingProps

export interface NiceButtonProps extends Omit<Bruh, "sx"> {
    to?: string
    href?: string
    target?: HTMLAttributeAnchorTarget | undefined
    loading?: boolean
    sx?: SxProps
}

export const NiceButton = React.forwardRef<HTMLButtonElement, NiceButtonProps>(function NiceButton(
    { to, href, loading, disabled, sx, children, ...props },
    ref,
) {
    const buttonDisabled = loading || disabled

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Nice = NiceBoxThing as any

    return (
        <Nice
            ref={ref}
            component="button"
            sx={
                {
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                    backgroundColor: "transparent",
                    cursor: disabled ? "auto" : "pointer",
                    "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                    },
                    "&:active": {
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                    },
                    ...sx,
                } as SxProps
            }
            disabled={buttonDisabled}
            {...props}
        >
            {children}
            {loading && (
                <Box
                    sx={{
                        zIndex: 1,
                        position: "aboslute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {loading && <CircularProgress />}
                </Box>
            )}
        </Nice>
    )
})
