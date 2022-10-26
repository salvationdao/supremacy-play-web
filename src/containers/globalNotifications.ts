import { useCallback, useRef } from "react"
import { createContainer } from "unstated-next"
import { SupremacyPNG } from "../assets"

export type Severity = "error" | "info" | "success" | "warning"

export interface SnackBarMessage {
    key: number
    message: string
    severity: Severity
}

export const GlobalNotificationsContainer = createContainer(() => {
    // Global snackbar
    const snackBarMessages = useRef<SnackBarMessage[]>([])
    const snakbarComponentCallback = useRef<undefined | ((snackBarMessages: SnackBarMessage[]) => void)>()

    const newSnackbarMessage = useCallback((message: string, severity: Severity = "info") => {
        snackBarMessages.current = [...snackBarMessages.current, { key: new Date().getTime(), message, severity }]
        if (!snakbarComponentCallback.current) return
        snakbarComponentCallback.current(snackBarMessages.current)
    }, [])

    // Browser notification
    const sendBrowserNotification = useRef((title: string, body: string, timeOpen?: number) => {
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
    })

    return {
        snakbarComponentCallback,
        sendBrowserNotification,
        newSnackbarMessage,
    }
})

export const GlobalNotificationsProvider = GlobalNotificationsContainer.Provider
export const useGlobalNotifications = GlobalNotificationsContainer.useContainer
