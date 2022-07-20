import { Badge, Box, Button, IconButton, Popover, Stack, Typography } from "@mui/material"
import { useMemo, useRef } from "react"
import { SvgMail } from "../../assets"
import { useSystemMessaging } from "../../containers/systemMessaging"
import { useTheme } from "../../containers/theme"
import { useToggle } from "../../hooks"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { ClipThing } from "../Common/ClipThing"

export const Messages = () => {
    const theme = useTheme()
    const { messages, dismissMessage } = useSystemMessaging()

    const popoverRef = useRef(null)
    const [localOpen, toggleLocalOpen] = useToggle(false)

    const content = useMemo(() => {
        if (messages.length === 0) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "10rem", p: "1rem" }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: colors.grey,
                            fontFamily: fonts.nostromoBold,
                            opacity: 0.9,
                            textAlign: "center",
                            textTransform: "uppercase",
                        }}
                    >
                        You do not have any messages at the moment.
                    </Typography>
                </Stack>
            )
        }

        return (
            <Stack spacing=".32rem" sx={{ p: ".8rem" }}>
                {messages.map((m, index) => {
                    return (
                        <Button key={index} onClick={() => dismissMessage(index)}>
                            {m.message}
                        </Button>
                    )
                })}
            </Stack>
        )
    }, [messages, dismissMessage])

    return (
        <>
            <Stack
                ref={popoverRef}
                direction="row"
                alignItems="center"
                sx={{
                    mx: "1.2rem",
                    height: "100%",
                }}
            >
                <Box>
                    <Badge
                        badgeContent={messages.length}
                        color="error"
                        sx={{
                            "& .MuiBadge-badge": {
                                top: 10,
                                right: 6,
                                height: 14,
                                minWidth: 14,
                                fontSize: "1.2rem",
                            },
                        }}
                    >
                        <IconButton onClick={() => toggleLocalOpen(true)}>
                            <SvgMail size="2.2rem" />
                        </IconButton>
                    </Badge>
                </Box>
            </Stack>
            <Popover
                open={localOpen}
                anchorEl={popoverRef.current}
                onClose={() => toggleLocalOpen(false)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                sx={{
                    mt: ".5rem",
                    zIndex: siteZIndex.Popover,
                    ".MuiPaper-root": {
                        background: "none",
                        boxShadow: 0,
                    },
                }}
            >
                <ClipThing
                    clipSize="10px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".3rem",
                    }}
                    backgroundColor={theme.factionTheme.background}
                    sx={{
                        height: "100%",
                        width: "100%",
                        maxWidth: "40rem",
                    }}
                >
                    {content}
                </ClipThing>
            </Popover>
        </>
    )
}
