import { useState, useEffect } from 'react'
import { createContainer } from 'unstated-next'

type Severity = 'error' | 'info' | 'success' | 'warning'

interface SnackBarMessage {
    key: number
    message: string
    severity: Severity
}

export const SnackBarContainer = createContainer(() => {
    const [open, setOpen] = useState(false)
    const [snackBarMessages, setSnackBarMessages] = useState<SnackBarMessage[]>([])
    const [messageInfo, setMessageInfo] = useState<SnackBarMessage | undefined>(undefined)

    const newMessage = (message: string, severity: Severity = 'info') => {
        setSnackBarMessages((prev) => [...prev, { key: new Date().getTime(), message, severity }])
    }

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
        open,
        setOpen,
        newMessage,
        messageInfo,
        setMessageInfo,
    }
})

export const SnackBarProvider = SnackBarContainer.Provider
