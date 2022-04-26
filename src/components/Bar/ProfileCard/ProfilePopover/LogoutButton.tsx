import { useState, useCallback } from "react"
import { useEffect } from "react"
import { SvgLogout } from "../../../../assets"
import { usePassportServerAuth } from "../../../../containers"
import { PASSPORT_WEB } from "../../../../constants"
import { colors } from "../../../../theme/theme"
import { NavButton } from "./NavButton"

export const LogoutButton = () => {
    const [passportPopup, setPassportPopup] = useState<Window | null>(null)
    const { user, sessionID } = usePassportServerAuth()
    const [isProcessing, setIsProcessing] = useState(false)

    // Check if login in the iframe has been successful (widnow closed), do clean up
    useEffect(() => {
        if (!passportPopup) return

        const popupCheckInterval = setInterval(() => {
            if (!passportPopup) return

            if (passportPopup.closed) {
                popupCheckInterval && clearInterval(popupCheckInterval)
                setIsProcessing(false)
                setPassportPopup(null)
                window.location.reload()
            }
        }, 1000)

        return () => clearInterval(popupCheckInterval)
    }, [passportPopup])

    const onClick = useCallback(async () => {
        if (isProcessing) return

        setIsProcessing(true)

        const href = `${PASSPORT_WEB}nosidebar/logout?sessionID=${sessionID}`
        const width = 520
        const height = 730
        const top = window.screenY + (window.outerHeight - height) / 2.5
        const left = window.screenX + (window.outerWidth - width) / 2
        const popup = window.open(href, "Logging out of XSYN Passport...", `width=${width},height=${height},left=${left},top=${top},popup=1`)
        if (!popup) {
            setIsProcessing(false)
            return
        }
        window.localStorage.removeItem("ring_check_token")
        setPassportPopup(popup)
    }, [isProcessing, sessionID])

    useEffect(() => {
        if (!user && passportPopup) {
            passportPopup.close()
        }
    }, [user, passportPopup])

    if (!user) return null

    return (
        <NavButton
            onClick={onClick}
            startIcon={<SvgLogout sx={{ pb: ".5rem" }} size="1.6rem" />}
            sx={{
                ":hover": {
                    backgroundColor: colors.red,
                },
            }}
        >
            Logout
        </NavButton>
    )
}
