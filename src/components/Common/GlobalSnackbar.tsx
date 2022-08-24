import { Box, IconButton, Snackbar, SnackbarCloseReason, Stack, Typography } from "@mui/material"
import { ReactNode, SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ClipThing } from ".."
import { SvgClose2, SvgInfoCircular, SvgSuccess, SvgWarnTriangle } from "../../assets"
import { SnackBarMessage, useGlobalNotifications } from "../../containers"
import { useInterval } from "../../hooks"
import { colors } from "../../theme/theme"

export const GlobalSnackbar = () => {
    const [open, setOpen] = useState(false)
    const [messageInfo, setMessageInfo] = useState<SnackBarMessage | undefined>(undefined)
    const { snackBarMessages } = useGlobalNotifications()
    const prevSnackBarMessages = useRef<SnackBarMessage[]>(snackBarMessages.current)
    const [messages, setMessages] = useState<SnackBarMessage[]>([])

    // Poll for new snackbar messages, using state on the container causes all other components that use it to re-render
    useInterval(() => {
        if (prevSnackBarMessages.current !== snackBarMessages.current) {
            setMessages(snackBarMessages.current)
            prevSnackBarMessages.current = snackBarMessages.current
        }
    }, 1000)

    useEffect(() => {
        if (messages.length && !messageInfo) {
            // Set a new snack when we don't have an active one
            setMessageInfo({ ...messages[0] })
            setMessages((prev) => prev.slice(1))
            setOpen(true)
        } else if (messages.length && messageInfo && open) {
            // Close an active snack when a new one is added
            setOpen(false)
        }
    }, [messages, messageInfo, open, setMessages])

    const handleClose = useCallback(
        (_event: Event | SyntheticEvent<unknown, Event>, reason?: SnackbarCloseReason) => {
            if (reason === "clickaway") return
            setOpen(false)
        },
        [setOpen],
    )

    const handleExited = useCallback(() => {
        setMessageInfo(undefined)
    }, [setMessageInfo])

    const severityDeets: { color: string; icon: ReactNode } = useMemo(() => {
        let color = colors.blue
        let icon = <SvgInfoCircular size="1.4rem" />

        switch (messageInfo?.severity) {
            case "error":
                color = colors.red
                break
            case "success":
                color = colors.green
                icon = <SvgSuccess size="1.4rem" />
                break
            case "warning":
                color = colors.orange
                icon = <SvgWarnTriangle size="1.4rem" />
                break
            case "info":
            default:
                break
        }

        return { color, icon }
    }, [messageInfo])

    return useMemo(
        () => (
            <Snackbar
                key={messageInfo ? `global-snackbar-${messageInfo.key}` : undefined}
                open={open}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                autoHideDuration={4000}
                onClose={handleClose}
                TransitionProps={{ onExited: handleExited }}
            >
                <Box>
                    <ClipThing
                        clipSize="9px"
                        border={{
                            borderThickness: ".25rem",
                            borderColor: "#FFFFFF",
                        }}
                        corners={{
                            topRight: true,
                            bottomLeft: true,
                        }}
                        sx={{
                            mb: "-1rem",
                            ml: "1.5rem",
                        }}
                        backgroundColor={severityDeets.color}
                        opacity={0.99}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing=".9rem"
                            sx={{
                                px: "1.4rem",
                                pt: ".6rem",
                                pb: ".5rem",
                                pr: ".9rem",
                                borderRadius: 0.4,
                                boxShadow: 23,
                            }}
                        >
                            {severityDeets.icon}

                            <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>
                                {messageInfo ? messageInfo.message : undefined}
                            </Typography>

                            <IconButton size="small" onClick={handleClose}>
                                <SvgClose2 size="1.4rem" sx={{ opacity: 0.8, ":hover": { opacity: 1 } }} />
                            </IconButton>
                        </Stack>
                    </ClipThing>
                </Box>
            </Snackbar>
        ),
        [handleClose, handleExited, messageInfo, open, severityDeets.color, severityDeets.icon],
    )
}
