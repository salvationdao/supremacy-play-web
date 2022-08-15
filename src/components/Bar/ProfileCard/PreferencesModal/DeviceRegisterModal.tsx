import { Box, IconButton, Modal, Skeleton, Stack, Typography } from "@mui/material"
import { SvgClose } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { colors, fonts } from "../../../../theme/theme"
import { ClipThing } from "../../../Common/ClipThing"
import QRCode from "react-qr-code"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { useEffect, useState } from "react"
import { GameServerKeys } from "../../../../keys"
import { FancyButton } from "../../../Common/FancyButton"

const QR_CODE_SIZE = 180

interface DeviceRegisterModalProps {
    onClose: () => void
}

// DeviceRegisterModal displays instructions and a QR code to log a player into the companion app
export const DeviceRegisterModal = ({ onClose }: DeviceRegisterModalProps) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [error, setError] = useState<string>()
    const [loading, setLoading] = useState(false)

    // Generate one time token (used to create the QR code)
    const [token, setToken] = useState("")
    useEffect(() => {
        const errorMessage = "Failed to generate QR code, please try again or contact support."

        ;(async () => {
            try {
                setLoading(true)
                const resp = await send<{ token: string }>(GameServerKeys.AuthGenOneTimeToken)
                if (!resp) setError(errorMessage)
                setToken(resp.token)
            } catch (err) {
                setError(typeof err === "string" ? err : errorMessage)
            } finally {
                setLoading(false)
            }
        })()
    }, [send])

    return (
        <Modal open onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "54rem",
                    boxShadow: 24,
                    outline: "none",
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".3rem",
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={theme.factionTheme.background}
                >
                    <Stack spacing=".7rem" sx={{ position: "relative", px: "1.8rem", py: "1.6rem" }}>
                        {/* Modal title */}
                        <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                            ADD DEVICE
                        </Typography>

                        {/* Instructions on how to set up companion app */}
                        <Stack spacing="1.3rem" sx={{ px: "1.5rem", py: "1.3rem", pb: "1.8rem", backgroundColor: "#FFFFFF08" }}>
                            <Typography gutterBottom sx={{ color: colors.lightGrey }}>
                                COMPLETE THE FOLLOWING STEPS TO CONFIGURE YOUR MOBILE APP:
                            </Typography>

                            <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold", paddingLeft: 2 }}>
                                1. Install the Supremacy companion app for Android or iOS.
                            </Typography>
                            <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold", paddingLeft: 2 }}>
                                {`2. In the app, click the "Scan QR" button.`}
                            </Typography>
                            <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold", paddingLeft: 2 }}>3. Scan the image below.</Typography>

                            {/* QR Code - displays skeleton while it is loading */}
                            <Box sx={{ ml: "2rem !important" }}>
                                {loading ? (
                                    <Skeleton variant={"rectangular"} width={QR_CODE_SIZE} height={QR_CODE_SIZE} />
                                ) : (
                                    token && (
                                        <Box
                                            sx={{
                                                width: QR_CODE_SIZE,
                                                height: QR_CODE_SIZE,
                                                backgroundColor: "#FFFFFF",
                                            }}
                                        >
                                            <QRCode size={QR_CODE_SIZE} value={token} />
                                        </Box>
                                    )
                                )}
                            </Box>

                            {error && (
                                <Typography variant="body2" sx={{ color: colors.red, pt: "1rem" }}>
                                    {error}
                                </Typography>
                            )}
                        </Stack>

                        {/* "Done" button */}
                        <FancyButton
                            clipThingsProps={{
                                clipSize: "9px",
                                backgroundColor: theme.factionTheme.primary,
                                opacity: 1,
                                border: { borderColor: theme.factionTheme.primary, borderThickness: "2px" },
                                sx: { position: "relative", ml: "2rem", width: "9rem" },
                            }}
                            sx={{ py: ".3rem", color: theme.factionTheme.secondary, minWidth: 0 }}
                            onClick={onClose}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: theme.factionTheme.secondary,
                                    fontFamily: fonts.nostromoBlack,
                                }}
                            >
                                DONE
                            </Typography>
                        </FancyButton>
                    </Stack>

                    {/* Close modal icon button */}
                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="1.9rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
