import { Box, ButtonBaseProps, CircularProgress, SxProps } from "@mui/material"
import React, { HTMLAttributeAnchorTarget, useMemo } from "react"
import { Link } from "react-router-dom"
import { sheenMovement } from "../../../theme/keyframes"
import { fonts } from "../../../theme/theme"
import { NiceBoxThing, NiceBoxThingProps } from "./NiceBoxThing"

type Bruh = ButtonBaseProps & NiceBoxThingProps

interface SheenOptions {
    sheenSpeedFactor?: number
    autoSheen?: boolean
    opacity?: number
}

interface CommonProps extends Omit<Bruh, "sx"> {
    loading?: boolean
    sheen?: SheenOptions | boolean
    sx?: SxProps
}

// Conditional props
type LinkProps =
    | {
          link?: {
              href: string
              target?: HTMLAttributeAnchorTarget | undefined
          }
          route?: never
      }
    | {
          link?: never
          route?: {
              to: string
              target?: HTMLAttributeAnchorTarget | undefined
          }
      }

type NiceButtonProps = CommonProps & LinkProps

const OVERLAY_CLASSNAME = "NiceButtonOverlay"

export const NiceButton = React.forwardRef<HTMLButtonElement, NiceButtonProps>(function NiceButton(
    { link, route, loading, sheen, disabled, sx, children, ...props },
    ref,
) {
    const buttonDisabled = loading || disabled

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Nice = NiceBoxThing as any

    const sheenOptions = useMemo(() => {
        if (!sheen || typeof sheen === "boolean") {
            return {
                sheenSpeedFactor: 1,
                autoSheen: false,
                opacity: 1,
            }
        } else {
            return sheen
        }
    }, [sheen])

    const getStyles = useMemo(() => {
        return {
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            p: ".8rem 1.2rem",
            backgroundColor: "transparent",
            cursor: buttonDisabled ? "auto" : "pointer",
            fontFamily: fonts.nostromoBold,
            fontSize: "1.5rem",
            flexShrink: 0,
            color: "#FFFFFF",
            whiteSpace: "nowrap",
            boxShadow: 0.5,
            [`&:hover:enabled .${OVERLAY_CLASSNAME}`]: {
                opacity: 0.15,
            },
            [`&:active:enabled .${OVERLAY_CLASSNAME}`]: {
                opacity: 0.4,
            },

            // Sheen effect
            ...(sheen
                ? {
                      overflow: "hidden",
                      ":before, :after": {
                          content: "''",
                          position: "absolute",
                          top: "-110%",
                          left: "-230%",
                          width: "300%",
                          height: "200%",
                          opacity: 0,
                          transform: "rotate(-70deg)",
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          background: `linear-gradient(to right, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(128,186,232,0) 99%,rgba(125,185,232,0) 100%)`,
                          filter: "blur(20px)",
                          zIndex: 99,
                          animationFillMode: "forwards",
                          animation: sheenOptions.autoSheen
                              ? `${sheenMovement("30%", buttonDisabled ? 0 : 0.1 * (sheenOptions.opacity || 1), 30)} ${
                                    2 / (sheenOptions.sheenSpeedFactor || 1)
                                }s linear infinite`
                              : "unset",
                      },

                      ":before": {
                          left: "-150%",
                          width: "200%",
                          animation: sheenOptions.autoSheen
                              ? `${sheenMovement("130%", buttonDisabled ? 0 : sheenOptions.opacity || 1, 30)} ${
                                    2 / (sheenOptions.sheenSpeedFactor || 1)
                                }s linear infinite`
                              : "unset",
                      },

                      ":hover:before": {
                          animation: `${sheenMovement("130%", buttonDisabled ? 0 : sheenOptions.opacity || 1)} ${
                              0.7 / (sheenOptions.sheenSpeedFactor || 1)
                          }s linear`,
                      },

                      ":hover:after": {
                          animation: `${sheenMovement("30%", buttonDisabled ? 0 : 0.1 * (sheenOptions.opacity || 1))} ${
                              0.7 / (sheenOptions.sheenSpeedFactor || 1)
                          }s linear`,
                      },
                  }
                : {}),

            ...sx,
        }
    }, [buttonDisabled, sheen, sheenOptions.autoSheen, sheenOptions.opacity, sheenOptions.sheenSpeedFactor, sx])

    return (
        <Nice
            ref={ref}
            component="button"
            sx={getStyles}
            background={{
                opacity: "more-transparent",
            }}
            disabled={buttonDisabled}
            enableBoxShadow
            {...props}
        >
            {route && <Link style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 3 }} to={route.to} target={route.target}></Link>}

            {link && <a style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 3 }} href={link.href} target={link.target}></a>}

            {children}

            <Box
                className={OVERLAY_CLASSNAME}
                sx={{
                    pointerEvents: "none",
                    zIndex: 1,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "#000000",
                    borderRadius: 0.3,
                    transition: ".2s all",
                    opacity: 0,
                }}
            />

            {loading && (
                <Box
                    sx={{
                        pointerEvents: "none",
                        zIndex: 1,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {loading && (
                        <CircularProgress
                            size="1.2rem"
                            sx={{ color: typeof props.background !== "boolean" && props.background?.color ? props.background?.color[0] : "undefined" }}
                        />
                    )}
                </Box>
            )}
        </Nice>
    )
})
