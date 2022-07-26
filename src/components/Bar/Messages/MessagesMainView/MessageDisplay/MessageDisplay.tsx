/* eslint-disable no-case-declarations */
import { Box, createTheme, Divider, Stack, ThemeProvider, Typography } from "@mui/material"
import MuiMarkdown from "mui-markdown"
import { useMemo } from "react"
import { useTheme } from "../../../../../containers/theme"
import { colors, fonts } from "../../../../../theme/theme"
import { SystemMessageDataMechBattleComplete, SystemMessageDataType } from "../../../../../types"
import { SystemMessageDisplayable } from "../../Messages"
import { MechBattleCompleteDetails } from "./MechBattleCompleteDetails"

export interface MessageDisplayProps {
    message: SystemMessageDisplayable
}

export const MessageDisplay = ({ message }: MessageDisplayProps) => {
    const theme = useTheme()

    const details = useMemo(() => {
        switch (message.data_type) {
            case SystemMessageDataType.MechBattleComplete:
                if (!message.data) break
                const data = message.data as SystemMessageDataMechBattleComplete

                return <MechBattleCompleteDetails message={message.message} data={data} />
        }

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
                    {message.message}
                </MuiMarkdown>
            </ThemeProvider>
        )
    }, [message])

    return (
        <Stack height="100%">
            <Stack direction="row" alignItems="baseline">
                <Typography
                    variant="h4"
                    sx={{
                        fontFamily: fonts.shareTechMono,
                        fontWeight: "fontWeightBold",
                    }}
                >
                    {message.title}
                </Typography>
                <Typography
                    sx={{
                        ml: "auto",
                        color: colors.grey,
                    }}
                >
                    {message.sent_at.toLocaleTimeString()}, {message.sent_at.toDateString()}
                </Typography>
            </Stack>
            <Stack direction="row" spacing=".4rem">
                <Typography
                    sx={{
                        color: colors.grey,
                    }}
                >
                    From:
                </Typography>
                <Typography
                    sx={{
                        fontFamily: fonts.shareTechMono,
                    }}
                >
                    {message.sender.username}
                </Typography>
            </Stack>
            <Divider
                sx={{
                    backgroundColor: colors.darkGrey,
                    my: "1rem",
                }}
            />
            <Box
                sx={{
                    overflowY: "auto",
                    overflowX: "hidden",
                    direction: "ltr",
                    scrollbarWidth: "none",
                    "::-webkit-scrollbar": {
                        width: ".4rem",
                    },
                    "::-webkit-scrollbar-track": {
                        background: "#FFFFFF15",
                        borderRadius: 3,
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: theme.factionTheme.primary,
                        borderRadius: 3,
                    },
                }}
            >
                {details}
            </Box>
        </Stack>
    )
}
