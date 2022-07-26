import { Box, IconButton, Modal, Stack, Typography } from "@mui/material"
import { SvgClose } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { colors, fonts } from "../../../../theme/theme"
import { ClipThing } from "../../../Common/ClipThing"
import QRCode from "react-qr-code"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { useEffect, useState } from "react"
import { GameServerKeys } from "../../../../keys"
import { FancyButton } from "../../../Common/FancyButton"

const QR_CODE_SIZE = 228
const QR_CODE_PADDING = 5

interface DeviceRegisterModalProps {
    onClose: () => void
}

export const DeviceRegisterModal = ({ onClose }: DeviceRegisterModalProps) => {
    const theme = useTheme()

    const { send } = useGameServerCommandsUser("/user_commander")
    const [token, setToken] = useState("")
    const [expiredAt, setExpiredAt] = useState<Date>()

    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<{ token: string; expired_at: Date }>(GameServerKeys.AuthGenOneTimeToken)
                if (!resp) return
                setToken(resp.token)
                setExpiredAt(resp.expired_at)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get device token."
                console.error(err)
            }
        })()
    }, [send])

    // Display the modal once the token has been created
    if (!token) return null

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
                    <Stack
                        spacing=".7rem"
                        sx={{
                            position: "relative",
                            px: "1.8rem",
                            py: "1.6rem",
                            pb: "1.6rem",
                        }}
                    >
                        {/* Modal title */}
                        <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                            ADD DEVICE
                        </Typography>

                        {/* Instructions on how to set up companion app */}
                        <Stack spacing="1.3rem" sx={{ px: "1.5rem", py: ".8rem", backgroundColor: "#FFFFFF08" }}>
                            <Typography gutterBottom sx={{ color: colors.lightGrey }}>
                                COMPLETE THE FOLLOWING STEPS TO CONFIGURE YOUR MOBILE APP:
                            </Typography>

                            <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold", paddingLeft: 2 }}>
                                1. Install the Supremacy companion app for Android or iOS.
                            </Typography>
                            <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold", paddingLeft: 2 }}>
                                {`2. In the app, click on the "Scan QR" button.`}
                            </Typography>
                            <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold", paddingLeft: 2 }}>3. Scan the image below.</Typography>

                            {/* QR Code */}
                            <Box
                                style={{
                                    marginLeft: 30,
                                    padding: QR_CODE_PADDING,
                                    width: QR_CODE_SIZE + QR_CODE_PADDING * 2,
                                    height: QR_CODE_SIZE + QR_CODE_PADDING * 2,
                                    backgroundColor: "white",
                                }}
                            >
                                <QRCode size={QR_CODE_SIZE} value={token} />
                            </Box>

                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "9px",
                                    backgroundColor: colors.darkNavy,
                                    opacity: 1,
                                    border: { isFancy: true, borderColor: colors.neonBlue, borderThickness: "2px" },
                                    sx: { position: "relative", mt: "auto", ml: 3, width: "9rem" },
                                }}
                                sx={{ px: "1.6rem", py: ".6rem", color: colors.neonBlue }}
                                onClick={onClose}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: colors.neonBlue,
                                        fontFamily: fonts.nostromoBlack,
                                    }}
                                >
                                    DONE
                                </Typography>
                            </FancyButton>
                        </Stack>
                    </Stack>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="1.9rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
