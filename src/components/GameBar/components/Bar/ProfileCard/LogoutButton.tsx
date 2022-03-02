import { useState, useCallback } from "react"
import { Button } from "@mui/material"
import { useAuth } from "../../../containers"
import { colors } from "../../../theme"
import { useEffect } from "react"
import { SvgLogout } from "../../../assets"

interface LogoutButtonProps {
    passportWeb: string
}

export const LogoutButton = ({ passportWeb }: LogoutButtonProps) => {
    const [isProcessing, setIsProcessing] = useState(false)
    const [passportPopup, setPassportPopup] = useState<Window | null>(null)
    const { user, sessionID } = useAuth()

    // Check if login in the iframe has been successful (widnow closed), do clean up
    useEffect(() => {
        if (!passportPopup) return

        const popupCheckTimer = setInterval(() => {
            if (!passportPopup) return

            if (passportPopup.closed) {
                popupCheckTimer && clearInterval(popupCheckTimer)
                setIsProcessing(false)
                setPassportPopup(null)
                window.location.reload()
            }
        }, 1000)

        return () => clearInterval(popupCheckTimer)
    }, [passportPopup])

    const onClick = useCallback(async () => {
        if (isProcessing) return

        setIsProcessing(true)

        const href = `${passportWeb}nosidebar/logout?sessionID=${sessionID}`
        const width = 520
        const height = 730
        const top = window.screenY + (window.outerHeight - height) / 2.5
        const left = window.screenX + (window.outerWidth - width) / 2
        const popup = window.open(
            href,
            "Logging out of XSYN Passport...",
            `width=${width},height=${height},left=${left},top=${top},popup=1`,
        )
        if (!popup) {
            setIsProcessing(false)
            return
        }

        setPassportPopup(popup)
    }, [isProcessing, sessionID, passportWeb])

    useEffect(() => {
        if (!user && passportPopup) {
            passportPopup.close()
        }
    }, [user, passportPopup])

    if (!user) {
        return null
    }
    return (
        <Button
            startIcon={<SvgLogout size="16px" fill={colors.text} sx={{ ml: 0.1 }} />}
            onClick={onClick}
            sx={{
                justifyContent: "flex-start",
                width: "100%",
                color: colors.text,
                ":hover": {
                    backgroundColor: colors.red,
                },
            }}
        >
            Logout
        </Button>
    )
}
