import { Box, Typography, TypographyProps } from "@mui/material"
import { fonts } from "../../theme/theme"

// Super light weight wrapper, only CSS, use it!
export const TypographyTruncated = ({ children, sx, ...props }: TypographyProps) => {
    return (
        <Typography
            sx={{
                fontFamily: fonts.nostromoBlack,

                ...sx,
                display: "grid",

                span: {
                    display: "inline-block",
                    width: "100%",
                    verticalAlign: "middle",
                    overflow: "hidden",

                    span: {
                        position: "relative",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        left: "0px",
                    },
                },

                ":active, :hover": {
                    span: {
                        width: "auto",

                        span: {
                            left: `100%`,
                            transform: "translateX(calc(-100% - 2rem))",
                            transition: "all 2s linear",
                        },
                    },
                },
            }}
            {...props}
        >
            <Box component="span">
                <Box component="span">{children}</Box>
            </Box>
        </Typography>
    )
}
