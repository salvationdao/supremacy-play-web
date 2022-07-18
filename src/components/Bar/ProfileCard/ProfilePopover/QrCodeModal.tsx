import { Box, IconButton, Modal, Stack, Typography } from "@mui/material"
import { SvgClose } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"
import { ClipThing } from "../../../Common/ClipThing"
import QRCode from "react-qr-code"
import { TELEGRAM_BOT_URL } from "../../../../constants"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { useEffect, useState } from "react"
import { GameServerKeys } from "../../../../keys"
// import {QRCodeSVG} from 'qrcode.react';

interface QrCodeModalProps {
    onClose: () => void
}

export const QrCodeModal = ({ onClose }: QrCodeModalProps) => {
    const theme = useTheme()

    const { send } = useGameServerCommandsUser("/user_commander")
    const [token, setToken] = useState("")
    const [expiredAt, setExpiredAt] = useState<Date>()

    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<{ token: string; expired_at: Date }>(GameServerKeys.AuthGenOneTimeToken)
                if (!resp) return
                console.log(resp)
                setToken(resp.token)
                setExpiredAt(resp.expired_at)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get key card listings."
                console.error(err)
            }
        })()
    }, [send])

    // create device token

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
                        <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                            QR CODE
                        </Typography>

                        <div style={{ background: "white", padding: "16px" }}>
                            <QRCode size={228} value={token} />
                        </div>
                    </Stack>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="1.9rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
