import { Box, Typography, TypographyProps } from "@mui/material"
import { useMemo, useState } from "react"

const TRANSITION_SPEED = 60

// Super light weight wrapper, only CSS, use it!
export const TypographyTruncated = ({ children, sx, ...props }: TypographyProps) => {
    const [spanRef, setSpanRef] = useState<HTMLSpanElement | null>(null)

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
    }, [spanRef])

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
