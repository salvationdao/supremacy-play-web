import { Box, Typography, TypographyProps } from "@mui/material"
import { useEffect, useMemo, useState } from "react"

const TRANSITION_SPEED = 60

// Light weight wrapper on Typography, parent's width needs to be confined
export const TypographyTruncated = ({ children, sx, ...props }: TypographyProps) => {
    const [spanRef, setSpanRef] = useState<HTMLSpanElement | null>(null)
    const [reRender, setReRender] = useState(new Date().toISOString())

    // Trigger re-calculation of widths when typography when children changes
    useEffect(() => {
        setReRender(new Date().toISOString())
    }, [children])

    const { selfWidth, parentWidth } = useMemo(() => {
        if (!spanRef) {
            return {
                selfWidth: 0,
                parentWidth: 0,
            }
        }

        // This is make it overflow so we can get self width properly
        spanRef.style.width = "auto"
        const selfWidth = spanRef.clientWidth || 0
        const parentWidth = spanRef.parentElement?.clientWidth || 0
        spanRef.style.width = ""

        return {
            selfWidth,
            parentWidth,
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spanRef, reRender])

    return (
        <Typography
            sx={{
                ...sx,
                display: "grid",

                ".innerSpan": {
                    display: "inline-block",
                    width: "100%",
                    verticalAlign: "middle",
                    overflow: "hidden",
                },

                ".innerSpan2": {
                    display: "inline-block",
                    width: "100%",
                    verticalAlign: "middle",
                    overflow: "hidden",

                    position: "relative",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    left: "0px",
                },

                ":active, :hover": {
                    ".innerSpan": {
                        width: "auto",
                    },

                    ".innerSpan2": {
                        width: "auto",
                        transform: selfWidth > parentWidth ? `translateX(calc(-100% + ${parentWidth}px - 5px))` : "none",
                        transition: `all ${(selfWidth - parentWidth) / TRANSITION_SPEED}s linear`,
                    },
                },
            }}
            {...props}
        >
            <Box component="span" className="innerSpan">
                <Box ref={setSpanRef} className="innerSpan2" component="span">
                    {children}
                </Box>
            </Box>
        </Typography>
    )
}
