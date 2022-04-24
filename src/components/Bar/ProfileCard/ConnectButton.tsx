import { useCallback, useMemo, useState } from "react"
import { Box, Button, Dialog, Typography } from "@mui/material"
import { useEffect } from "react"
import { useTour } from "@reactour/tour"
import { usePassportServerAuth } from "../../../containers"
import { GAMEBAR_AUTO_SIGNIN_WAIT_SECONDS, PASSPORT_WEB } from "../../../constants"
import { colors } from "../../../theme/theme"
import { useToggle } from "../../../hooks"

export const ConnectButton = () => {
    const [isProcessing, setIsProcessing] = useState(false)
    const [passportPopup, setPassportPopup] = useState<Window | null>(null)
    const { sessionID, authRingCheckError, setAuthRingCheckError } = usePassportServerAuth()
    const [renderConnectButton, toggleRenderConnectButton] = useToggle()
    const { setIsOpen } = useTour()

    // Don't show the connect button for couple seconds as it tries to do the auto login
    useEffect(() => {
        const timeout = setTimeout(() => {
            toggleRenderConnectButton(true)
        }, GAMEBAR_AUTO_SIGNIN_WAIT_SECONDS)

        return () => clearTimeout(timeout)
    }, [])

    const href = useMemo(() => `${PASSPORT_WEB}nosidebar/login?omitSideBar=true&&sessionID=${sessionID}`, [sessionID])

    // Check if login in the iframe has been successful (widnow closed), do clean up
    useEffect(() => {
        if (!passportPopup) return

        const popupCheckInterval = setInterval(() => {
            if (!passportPopup) return

            if (passportPopup.closed) {
                popupCheckInterval && clearInterval(popupCheckInterval)
                setIsProcessing(false)
                setPassportPopup(null)
            }
        }, 1000)

        return () => clearInterval(popupCheckInterval)
    }, [passportPopup])

    // Open iframe to passport web to login
    const onClick = useCallback(async () => {
        if (isProcessing) return
        setIsProcessing(true)

        setIsOpen(false)

        const width = 520
        const height = 730
        const top = window.screenY + (window.outerHeight - height) / 2.5
        const left = window.screenX + (window.outerWidth - width) / 2
        const popup = window.open(href, "Connect Gamebar to XSYN Passport", `width=${width},height=${height},left=${left},top=${top},popup=1`)
        if (!popup) {
            setIsProcessing(false)
            return
        }

        setPassportPopup(popup)
    }, [isProcessing, href])

    return (
        <>
            {renderConnectButton ? (
                <Button
                    id="tutorial-connect"
                    sx={{
                        ml: "2.4rem",
                        px: "1.76rem",
                        pt: ".32rem",
                        pb: ".16rem",
                        flexShrink: 0,
                        justifyContent: "flex-start",
                        whiteSpace: "nowrap",
                        borderRadius: 0.2,
                        border: `1px solid ${colors.neonBlue}`,
                        fontFamily: "Nostromo Regular Bold",
                        color: colors.darkestNeonBlue,
                        backgroundColor: colors.neonBlue,
                        ":hover": {
                            opacity: 0.75,
                            color: colors.darkestNeonBlue,
                            backgroundColor: colors.neonBlue,
                            transition: "all .2s",
                        },
                    }}
                    disabled={isProcessing}
                    onClick={onClick}
                >
                    Connect
                </Button>
            ) : (
                <Typography sx={{ mr: "1.6rem", fontFamily: "Nostromo Regular Bold" }} variant="caption">
                    Signing in...
                </Typography>
            )}

            {/* Auto login */}
            {!!sessionID && (
                <Box sx={{ display: "none" }}>
                    <iframe src={href}></iframe>
                </Box>
            )}

            {!authRingCheckError && (
                <Dialog
                    maxWidth="xs"
                    PaperProps={{ sx: { borderRadius: 1 } }}
                    BackdropProps={{ sx: { backgroundColor: "#00000030" } }}
                    onClose={() => setAuthRingCheckError(undefined)}
                    open={!!authRingCheckError}
                >
                    <Box sx={{ px: "2.4rem", py: "2rem", pb: "2.4rem", backgroundColor: colors.darkNavy }}>
                        <Typography variant="h6" gutterBottom sx={{ fontFamily: "Nostromo Regular Bold" }}>
                            Login Failed...
                        </Typography>
                        <Typography variant="body1">The account that you have entered is invalid.</Typography>
                    </Box>
                </Dialog>
            )}
        </>
    )
}
