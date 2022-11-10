import { Box, IconButton, Snackbar, SnackbarCloseReason, Stack, Typography } from "@mui/material"
import { ReactNode, SyntheticEvent, useCallback, useEffect, useMemo, useState } from "react"
import { SvgClose2, SvgInfoCircular, SvgSuccess, SvgWarnTriangle } from "../../assets"
import { SnackBarMessage, useGlobalNotifications } from "../../containers"
import { colors } from "../../theme/theme"
import { NiceBoxThing } from "./Nice/NiceBoxThing"

export const GlobalSnackbar = () => {
    const [open, setOpen] = useState(false)
    const [messageInfo, setMessageInfo] = useState<SnackBarMessage | undefined>(undefined)
    const { snackBarComponentCallback } = useGlobalNotifications()
    const [messages, setMessages] = useState<SnackBarMessage[]>([])

    useEffect(() => {
        snackBarComponentCallback.current = (snackBarMessages) => {
            setMessages(snackBarMessages)
        }
    }, [snackBarComponentCallback])

    useEffect(() => {
        if (messages.length && !messageInfo) {
            // Set a new snack when we don't have an active one
            setMessageInfo({ ...messages[0] })
            setMessages((prev) => {
                const newValue = prev.slice(1)
                return newValue
            })
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
        let icon = <SvgInfoCircular inline size="1.4rem" />

        switch (messageInfo?.severity) {
            case "error":
                color = colors.red
                break
            case "success":
                color = colors.green
                icon = <SvgSuccess inline size="1.4rem" />
                break
            case "warning":
                color = colors.orange
                icon = <SvgWarnTriangle inline size="1.4rem" />
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
                    <NiceBoxThing
                        border={{ color: severityDeets.color }}
                        background={{ color: [`${severityDeets.color}60`, `${severityDeets.color}90`] }}
                        sx={{
                            mb: "-1rem",
                            ml: "-1rem",
                        }}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing=".9rem"
                            sx={{
                                px: "1.6rem",
                                pt: ".7rem",
                                pb: ".4rem",
                                pr: ".9rem",
                                borderRadius: 0.4,
                                boxShadow: 23,
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                {severityDeets.icon} {messageInfo ? messageInfo.message : undefined}
                            </Typography>

                            <IconButton size="small" onClick={handleClose}>
                                <SvgClose2 size="1.4rem" sx={{ opacity: 0.8, ":hover": { opacity: 1 } }} />
                            </IconButton>
                        </Stack>
                    </NiceBoxThing>
                </Box>
            </Snackbar>
        ),
        [handleClose, handleExited, messageInfo, open, severityDeets.color, severityDeets.icon],
    )
}
