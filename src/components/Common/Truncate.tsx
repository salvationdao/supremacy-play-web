import { Box } from "@mui/material"
import { ReactNode } from "react"

// Super light weight wrapper, only CSS, use it!
export const Truncate = ({ children }: { children: ReactNode }) => {
    return (
        <Box
            component="span"
            sx={{
                display: "inline-block",
                width: "250px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                verticalAlign: "middle",

                span: {
                    display: "inline-block",
                    width: "100%",
                    verticalAlign: "middle",

                    span: {
                        position: "relative",
                        left: "0px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    },
                },

                ":active, :hover": {
                    span: {
                        width: "auto",

                        span: {
                            left: `calc(250px - 15px - 100%)`,
                            transition: "left 4s linear",
                        },
                    },
                },
            }}
        >
            <Box component="span">
                <Box component="span">{children}</Box>
            </Box>
        </Box>
    )
}
