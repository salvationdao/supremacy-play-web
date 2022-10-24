import { Box, ButtonBaseProps, CircularProgress, SxProps } from "@mui/material"
import React, { HTMLAttributeAnchorTarget } from "react"
import { Link } from "react-router-dom"
import { BackgroundOpacity, NiceBoxThing, NiceBoxThingProps } from "./NiceBoxThing"

type Bruh = ButtonBaseProps & NiceBoxThingProps

interface CommonProps extends Omit<Bruh, "sx"> {
    loading?: boolean
    sx?: SxProps
}

// Conditional props
type LinkProps =
    | {
          link?: {
              href: string
              target: HTMLAttributeAnchorTarget | undefined
          }
          route?: never
      }
    | {
          link?: never
          route?: {
              to: string
              target: HTMLAttributeAnchorTarget | undefined
          }
      }

type NiceButtonProps = CommonProps & LinkProps

const OVERLAY_CLASSNAME = "NiceButtonOverlay"

export const NiceButton = React.forwardRef<HTMLButtonElement, NiceButtonProps>(function NiceButton(
    { link, route, loading, disabled, sx, children, ...props },
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
                    [`&:hover .${OVERLAY_CLASSNAME}`]: {
                        opacity: 0.3,
                    },
                    [`&:active .${OVERLAY_CLASSNAME}`]: {
                        opacity: 0.7,
                    },
                    ...sx,
                } as SxProps
            }
            background={{
                opacity: BackgroundOpacity.MoreTransparent,
            }}
            disabled={buttonDisabled}
            enableBoxShadow
            {...props}
        >
            {route ? (
                <Link to={route.to} target={route.target}>
                    {children}
                </Link>
            ) : link ? (
                <a href={link.href} target={link.target}>
                    {children}
                </a>
            ) : (
                children
            )}
            <Box
                className={OVERLAY_CLASSNAME}
                sx={{
                    zIndex: 1,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "black",
                    opacity: 0,
                }}
            />
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
