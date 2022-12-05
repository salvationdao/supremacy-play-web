import { useCallback, useRef } from "react"
import { createContainer } from "unstated-next"
import { SupremacyPNG } from "../assets"

export type Severity = "error" | "info" | "success" | "warning"

export interface SnackBarMessage {
    key: number
    message: string
    severity: Severity
}

export interface BrowserNotificationConfig {
    title: string
    text: string
    imageUrl?: string
    requireInteraction?: boolean
    timeOpen?: number
    onClick?: () => void
}

export const GlobalNotificationsContainer = createContainer(() => {
    // Global snackbar
    const snackBarMessages = useRef<SnackBarMessage[]>([])
    const snackBarComponentCallback = useRef<undefined | ((snackBarMessages: SnackBarMessage[]) => void)>()

    const newSnackbarMessage = useCallback((message: string, severity: Severity = "info") => {
        snackBarMessages.current = [...snackBarMessages.current, { key: new Date().getTime(), message, severity }]

        if (snackBarComponentCallback.current) {
            snackBarComponentCallback.current(snackBarMessages.current)
        }
    }, [])

    // Browser notification
    const sendBrowserNotification = useRef(({ title, text, imageUrl, requireInteraction, timeOpen, onClick }: BrowserNotificationConfig) => {
        if (!("Notification" in window)) {
            return
        }

        const n = new Notification(title, {
            badge: imageUrl || SupremacyPNG,
            icon: imageUrl || SupremacyPNG,
            image: imageUrl || SupremacyPNG,
            body: text,
            requireInteraction,
        })

        n.onclick = (e) => {
            e.preventDefault()
            onClick ? onClick() : window.parent.parent.focus()
        }

        if (timeOpen) {
            setTimeout(() => n.close(), timeOpen)
        }

        if (document.visibilityState === "visible") {
            n.close()
        }
    })

    return {
        snackBarComponentCallback,
        sendBrowserNotification,
        newSnackbarMessage,
    }
})

export const GlobalNotificationsProvider = GlobalNotificationsContainer.Provider
export const useGlobalNotifications = GlobalNotificationsContainer.useContainer
