import { SnackbarCloseReason } from "@mui/material"
import { ReactNode, SyntheticEvent, useCallback, useEffect, useMemo, useState } from "react"
import { SvgInfoCircular, SvgSuccess, SvgWarnTriangle } from "../../assets"
import { SnackBarMessage, useGlobalNotifications } from "../../containers"
import { colors } from "../../theme/theme"
import { NiceSnackBar } from "./Nice/NiceSnackbar"

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
        let icon = <SvgInfoCircular inline size="1.8rem" />

        switch (messageInfo?.severity) {
            case "error":
                color = colors.red
                break
            case "success":
                color = colors.green
                icon = <SvgSuccess inline size="1.8rem" />
                break
            case "warning":
                color = colors.orange
                icon = <SvgWarnTriangle inline size="1.8rem" />
                break
            case "info":
            default:
                break
        }

        return { color, icon }
    }, [messageInfo])

    return (
        <NiceSnackBar
            key={messageInfo ? `global-snackbar-${messageInfo.key}` : undefined}
            open={open}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            autoHideDuration={6000}
            onClose={handleClose}
            TransitionProps={{ onExited: handleExited }}
            icon={severityDeets.icon}
            message={messageInfo?.message}
            color={severityDeets.color}
        />
    )
}
