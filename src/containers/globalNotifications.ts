import { useState, useEffect, useCallback } from "react"
import { createContainer } from "unstated-next"
import { SupremacyPNG } from "../assets"

export type Severity = "error" | "info" | "success" | "warning"

interface SnackBarMessage {
    key: number
    message: string
    severity: Severity
}

export const GlobalNotificationsContainer = createContainer(() => {
    // Browser notification
    const sendBrowserNotification = useCallback((title: string, body: string, timeOpen?: number) => {
        if (!("Notification" in window)) {
            return
        }

        const n = new Notification(title, { body: body, badge: SupremacyPNG, icon: SupremacyPNG, image: SupremacyPNG })
        n.onclick = (e) => {
            e.preventDefault()
            window.parent.parent.focus()
        }

        if (timeOpen) {
            setTimeout(() => n.close(), timeOpen)
        }

        if (document.visibilityState === "visible") {
            n.close()
        }
    }, [])

    // Global snackbar
    const [open, setOpen] = useState(false)
    const [snackBarMessages, setSnackBarMessages] = useState<SnackBarMessage[]>([])
    const [messageInfo, setMessageInfo] = useState<SnackBarMessage | undefined>(undefined)

    const newSnackbarMessage = useCallback((message: string, severity: Severity = "info") => {
        setSnackBarMessages((prev) => [...prev, { key: new Date().getTime(), message, severity }])
    }, [])

    useEffect(() => {
        if (snackBarMessages.length && !messageInfo) {
            // Set a new snack when we don't have an active one
            setMessageInfo({ ...snackBarMessages[0] })
            setSnackBarMessages((prev) => prev.slice(1))
            setOpen(true)
        } else if (snackBarMessages.length && messageInfo && open) {
            // Close an active snack when a new one is added
            setOpen(false)
        }
    }, [snackBarMessages, messageInfo, open])

    return {
        sendBrowserNotification,
        open,
        setOpen,
        newSnackbarMessage,
        messageInfo,
        setMessageInfo,
    }
})

export const GlobalNotificationsProvider = GlobalNotificationsContainer.Provider
export const useGlobalNotifications = GlobalNotificationsContainer.useContainer
