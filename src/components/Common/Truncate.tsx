import { Box, Typography } from "@mui/material"
import { ReactNode } from "react"
import { fonts } from "../../theme/theme"

// Super light weight wrapper, use it!
export const Truncate = ({ children }: { children: ReactNode }) => {
    return (
        <Typography
            sx={{
                width: "250px",
                fontFamily: fonts.nostromoBlack,
                overflow: "hidden",
                whiteSpace: "nowrap",

                ":active, :hover": {
                    span: {
                        width: "auto",

                        span: {
                            transition: "left 4s linear",
                            left: `calc(250px - 15px - 100%)`,
                        },
                    },
                },
            }}
        >
            <Box
                component="span"
                sx={{
                    display: "inline-block",
                    width: "100%",
                }}
            >
                <Box
                    component="span"
                    sx={{
                        display: "inline-block",
                        width: "100%",
                        position: "relative",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        left: "0px",
                        verticalAlign: "middle",
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Typography>
    )
}
