import { useState, useCallback } from "react"
import { Button } from "@mui/material"
import { useEffect } from "react"
import { SvgLogout } from "../../../assets"
import { usePassportServerAuth } from "../../../containers"
import { PASSPORT_WEB } from "../../../constants"
import { colors } from "../../../theme/theme"

export const LogoutButton = () => {
    const [isProcessing, setIsProcessing] = useState(false)
    const [passportPopup, setPassportPopup] = useState<Window | null>(null)
    const { user, sessionID } = usePassportServerAuth()

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

        const href = `${PASSPORT_WEB}nosidebar/logout?sessionID=${sessionID}`
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
    }, [isProcessing, sessionID])

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
            startIcon={<SvgLogout size="1.6rem" sx={{ ml: ".08rem" }} />}
            onClick={onClick}
            sx={{
                justifyContent: "flex-start",
                width: "100%",
                color: "#FFFFFF",
                ":hover": {
                    backgroundColor: colors.red,
                },
                fontFamily: "Nostromo Regular Bold",
            }}
        >
            Logout
        </Button>
    )
}
