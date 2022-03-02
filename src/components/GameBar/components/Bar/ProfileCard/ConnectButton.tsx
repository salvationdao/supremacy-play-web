import { useState } from "react"
import { Box, Button, Dialog, Typography } from "@mui/material"
import { useAuth } from "../../../containers"
import { colors } from "../../../theme"
import { useEffect } from "react"

export const ConnectButton = ({ renderButton, passportWeb }: { renderButton: boolean; passportWeb: string }) => {
    const [isProcessing, setIsProcessing] = useState(false)
    const [passportPopup, setPassportPopup] = useState<Window | null>(null)
    const { sessionID, authRingCheckError, setAuthRingCheckError } = useAuth()

    const href = `${passportWeb}nosidebar/login?omitSideBar=true&&sessionID=${sessionID}`

    // Check if login in the iframe has been successful (widnow closed), do clean up
    useEffect(() => {
        if (!passportPopup) return

        const popupCheckTimer = setInterval(() => {
            if (!passportPopup) return

            if (passportPopup.closed) {
                popupCheckTimer && clearInterval(popupCheckTimer)
                setIsProcessing(false)
                setPassportPopup(null)
            }
        }, 1000)

        return () => clearInterval(popupCheckTimer)
    }, [passportPopup])

    // Open iframe to passport web to login
    const onClick = async () => {
        if (isProcessing) return
        setIsProcessing(true)

        const width = 520
        const height = 730
        const top = window.screenY + (window.outerHeight - height) / 2.5
        const left = window.screenX + (window.outerWidth - width) / 2
        const popup = window.open(
            href,
            "Connect Gamebar to XSYN Passport",
            `width=${width},height=${height},left=${left},top=${top},popup=1`,
        )
        if (!popup) {
            setIsProcessing(false)
            return
        }

        setPassportPopup(popup)
    }

    return (
        <>
            {renderButton ? (
                <Button
                    sx={{
                        ml: 3,
                        px: 2.2,
                        pt: 0.4,
                        pb: 0.2,
                        flexShrink: 0,
                        justifyContent: "flex-start",
                        whiteSpace: "nowrap",
                        borderRadius: 0.2,
                        border: `1px solid ${colors.neonBlue}`,
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
                <Typography sx={{ mr: 2 }} variant="caption">
                    Signing in...
                </Typography>
            )}

            {/* Auto login */}
            <Box sx={{ display: "none" }}>
                <iframe src={href}></iframe>
            </Box>

            {!authRingCheckError && (
                <Dialog
                    maxWidth="xs"
                    PaperProps={{ sx: { borderRadius: 1 } }}
                    BackdropProps={{ sx: { backgroundColor: "#00000030" } }}
                    onClose={() => setAuthRingCheckError(undefined)}
                    open={!!authRingCheckError}
                >
                    <Box sx={{ px: 3, py: 2.5, pb: 3, backgroundColor: colors.darkNavy }}>
                        <Typography variant="h6" gutterBottom>
                            Login Failed...
                        </Typography>
                        <Typography sx={{ fontFamily: "Share Tech" }} variant="body1">
                            The account that you have entered is invalid.
                        </Typography>
                    </Box>
                </Dialog>
            )}
        </>
    )
}
