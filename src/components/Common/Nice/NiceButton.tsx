import { Box, ButtonBaseProps, CircularProgress, SxProps } from "@mui/material"
import React, { HTMLAttributeAnchorTarget, useMemo } from "react"
import { Link } from "react-router-dom"
import { SvgButtonCorner } from "../../../assets"
import { autoTextColor } from "../../../helpers"
import { sheenMovement } from "../../../theme/keyframes"
import { fonts } from "../../../theme/theme"
import { NiceBoxThing, NiceBoxThingProps } from "./NiceBoxThing"

type Bruh = ButtonBaseProps & NiceBoxThingProps

interface SheenOptions {
    sheenSpeedFactor?: number
    autoSheen?: boolean
    opacity?: number
}

// Below are the key props
interface CommonProps extends Omit<Bruh, "sx" | "border" | "background"> {
    sx?: SxProps
    loading?: boolean
    sheen?: SheenOptions | boolean // Shiny sheen effect
    corners?: boolean
    flat?: boolean // Whether to have gradient or not
    fill?: boolean // Whether the color will look solid and have filled background
    buttonColor?: string // Sets the main button color, use this!
    disableAutoColor?: boolean // Button automatically determines a contrasting text color on hover and fill etc.
}

// Conditional props for routing and linking to other pages
// Link takes you to external pages, use route for internal pages
export type LinkProps =
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

export type NiceButtonProps = CommonProps & LinkProps

const OVERLAY_CLASSNAME = "NiceButtonOverlay"

const CORNER_CLASSNAME = "NiceButtonCorner"

export const NiceButton = React.forwardRef<HTMLButtonElement, NiceButtonProps>(function NiceButton(
    { link, route, loading, sheen, corners, disabled, sx, children, buttonColor, flat, fill, disableAutoColor = false, ...props },
    ref,
) {
    const buttonDisabled = loading || disabled

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Nice = NiceBoxThing as any

    const fillColor = useMemo(() => buttonColor || "#00000030", [buttonColor])
    const contrastTextColor = useMemo(() => (fillColor ? autoTextColor(fillColor) : "#FFFFFF"), [fillColor])

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
            fontFamily: fonts.nostromoBold,
            fontSize: "1.4rem",
            color: "#FFFFFF",
            cursor: buttonDisabled ? "auto" : "pointer",
            flexShrink: 0,
            whiteSpace: "nowrap",
            borderRadius: 0,
            transition: "all .1s",
            mt: "1px",
            mb: "1px",
            ml: "1px",
            mr: "1px",

            ...(buttonColor ? {} : { border: "none" }),

            ":hover": {
                [`.${CORNER_CLASSNAME}`]: {
                    opacity: 0,
                },

                [`&, *`]: !disableAutoColor
                    ? {
                          color: `${contrastTextColor} !important`,
                          fill: `${contrastTextColor} !important`,
                      }
                    : {},
            },

            ":disabled": {
                [`.${CORNER_CLASSNAME}`]: {
                    opacity: 0,
                },
            },

            [`&:disabled .${OVERLAY_CLASSNAME}`]: {
                opacity: 0.6,
                backgroundColor: "#000000",
                zIndex: 6,
            },
            [`&:hover:enabled .${OVERLAY_CLASSNAME}`]: {
                opacity: 1,
            },
            [`&:active:enabled .${OVERLAY_CLASSNAME}`]: {
                opacity: 0.4,
            },

            ...sx,

            // Please use the props to set button colors
            background: "unset",
            backgroundColor: "unset",
            ...(fill && !disableAutoColor
                ? {
                      [`&, *`]: {
                          transition: "all .1s",
                          color: `${contrastTextColor} !important`,
                          fill: `${contrastTextColor} !important`,
                      },
                  }
                : {}),
        }
    }, [disableAutoColor, buttonColor, buttonDisabled, contrastTextColor, fill, sx])

    const sheenStyles = useMemo(
        () => ({
            // Sheen effect
            ...(sheen
                ? {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      overflow: "hidden",
                      pointerEvents: "none",
                      zIndex: 5,
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
        }),
        [buttonDisabled, sheen, sheenOptions.autoSheen, sheenOptions.opacity, sheenOptions.sheenSpeedFactor],
    )

    // Override the nice box thing border
    const niceBoxBorder = useMemo(() => {
        const bb = { thickness: "very-lean", color: `${buttonColor}` || "#FFFFFF" }
        return bb
    }, [buttonColor])

    // Override the nice box thing background
    const niceBoxBackground = useMemo(() => {
        let colors: string[] = []

        if (buttonColor) {
            colors = fillColor ? [fillColor, `${fillColor}${fill ? "BB" : "30"}`] : [buttonColor, `${buttonColor}20`]
            if (flat) colors = [colors[0]]
        }

        return {
            colors,
            opacity: fill ? 1 : flat ? 0.2 : 0.4,
            linearGradientDegrees: 180,
        }
    }, [buttonColor, flat, fill, fillColor])

    const fourCorners = useMemo(() => {
        if (fill || !corners) return null
        return (
            <>
                <SvgButtonCorner
                    className={CORNER_CLASSNAME}
                    size="9px"
                    fill={`${buttonColor || "#FFFFFF"} !important`}
                    sx={{
                        pointerEvents: "none",
                        position: "absolute",
                        top: "-2px",
                        left: "-2px",
                        transform: "scaleX(-1)",
                        zIndex: 3,
                    }}
                />
                <SvgButtonCorner
                    className={CORNER_CLASSNAME}
                    size="9px"
                    fill={`${buttonColor || "#FFFFFF"} !important`}
                    sx={{
                        pointerEvents: "none",
                        position: "absolute",
                        top: "-2px",
                        right: "-2px",
                        zIndex: 3,
                    }}
                />
                <SvgButtonCorner
                    className={CORNER_CLASSNAME}
                    size="9px"
                    fill={`${buttonColor || "#FFFFFF"} !important`}
                    sx={{
                        pointerEvents: "none",
                        position: "absolute",
                        bottom: "-2px",
                        right: "-2px",
                        transform: "scaleY(-1)",
                        zIndex: 3,
                    }}
                />
                <SvgButtonCorner
                    className={CORNER_CLASSNAME}
                    size="9px"
                    fill={`${buttonColor || "#FFFFFF"} !important`}
                    sx={{
                        pointerEvents: "none",
                        position: "absolute",
                        bottom: "-2px",
                        left: "-2px",
                        transform: "scale(-1)",
                        zIndex: 3,
                    }}
                />
            </>
        )
    }, [buttonColor, corners, fill])

    return (
        <Nice
            ref={ref}
            component="button"
            sx={getStyles}
            disabled={buttonDisabled}
            enableBoxShadow
            color={buttonDisabled}
            border={niceBoxBorder}
            background={niceBoxBackground}
            {...props}
        >
            {route && <Link style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 3 }} to={route.to} target={route.target}></Link>}

            {link && <a style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 3 }} href={link.href} target={link.target}></a>}

            {children}

            {/* Sheen effect */}
            <Box sx={sheenStyles} />

            <Box
                className={OVERLAY_CLASSNAME}
                sx={{
                    pointerEvents: "none",
                    position: "absolute",
                    top: "-1px",
                    left: "-1px",
                    right: "-1px",
                    bottom: "-1px",
                    backgroundColor: fillColor,
                    opacity: 0,
                    zIndex: -1,
                    transition: "all .1s",
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
                    {loading && <CircularProgress size="1.2rem" sx={{ color: buttonColor }} />}
                </Box>
            )}

            {/* Button border 4 corners */}
            {fourCorners}
        </Nice>
    )
})
