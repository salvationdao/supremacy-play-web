import React, { useEffect } from "react"
import { useGlobalNotifications } from "../../containers"

export const GlobalBrowserNotifications = React.memo(function GlobalBrowserNotifications() {
    const { sendBrowserNotification } = useGlobalNotifications()

    useEffect(() => {
        setTimeout(() => {
            sendBrowserNotification.current({ title: "title please", text: "taggg" })
        }, 5000)
    }, [sendBrowserNotification])

    return null
})
