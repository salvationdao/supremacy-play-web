import { ThemeProvider } from "@emotion/react"
import { createTheme } from "@mui/material"
import MuiMarkdown from "mui-markdown"
import { fonts } from "../../../theme/theme"

export interface MessageRendererProps {
    markdown?: string
}

export const MessageRenderer = ({ markdown }: MessageRendererProps) => {
    return (
        <ThemeProvider
            theme={createTheme({
                typography: {
                    h1: {
                        fontFamily: fonts.nostromoBlack,
                        fontSize: "4rem",
                    },
                    h2: {
                        fontFamily: fonts.nostromoBold,
                        fontSize: "3rem",
                    },
                    h3: {
                        fontFamily: fonts.shareTech,
                        fontSize: "2.5rem",
                    },
                    h4: {
                        fontFamily: fonts.shareTech,
                        fontSize: "2.3rem",
                    },
                    h5: {
                        fontFamily: fonts.shareTech,
                        fontSize: "2.1rem",
                    },
                    h6: {
                        fontFamily: fonts.shareTech,
                        fontSize: "2rem",
                    },
                    body1: {
                        fontFamily: fonts.shareTech,
                        fontSize: "1.6rem",
                    },
                    body2: {
                        fontFamily: fonts.shareTech,
                        fontSize: "1.4rem",
                    },
                    subtitle1: {
                        fontFamily: fonts.shareTech,
                        fontSize: "1.3rem",
                        textAlign: "center",
                    },
                    subtitle2: {
                        fontFamily: fonts.shareTech,
                        fontSize: "1.3rem",
                    },
                    caption: {
                        fontFamily: fonts.shareTech,
                        fontSize: "1.2rem",
                    },
                },
            })}
        >
            <MuiMarkdown
                overrides={{
                    span: {
                        props: {
                            style: {
                                fontSize: "16px",
                            },
                        },
                    },
                }}
            >
                {markdown}
            </MuiMarkdown>
        </ThemeProvider>
    )
}
