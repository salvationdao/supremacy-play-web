import { Modal, Box, Stack, Typography, Button } from "@mui/material"
import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import { SvgContentCopyIcon } from "../../../assets"
import { TELEGRAM_BOT_URL } from "../../../constants"
import { useToggle } from "../../../hooks"
import { useGameServerSubscriptionUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { ClipThing } from "../../Common/ClipThing"

export const TelegramRegisterModal = ({ open, onClose, code }: { open: boolean; onClose: () => void; code: string }) => {
    const [copySuccess, toggleCopySuccess] = useToggle()
    const [userTelegramShortcodeRegistered, setUserTelegramShortcodeRegistered] = useState<boolean | undefined>(undefined)

    // Subscribe on telegram shortcode registered status
    useGameServerSubscriptionUser<string>(
        {
            URI: "",
            key: GameServerKeys.UserTelegramShortcodeRegistered,
        },
        (payload) => {
            if (!payload) return
            setUserTelegramShortcodeRegistered(!!payload)
        },
    )

    // copy shortcode
    useEffect(() => {
        if (copySuccess) {
            setTimeout(() => {
                toggleCopySuccess(false)
            }, 900)
        }
    }, [copySuccess, toggleCopySuccess])

    if (!TELEGRAM_BOT_URL) return <></>
    return (
        <Modal open={open}>
            <>
                {userTelegramShortcodeRegistered ? (
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "63rem",
                        }}
                    >
                        <ClipThing
                            clipSize="10px"
                            border={{
                                isFancy: true,
                                borderColor: colors.neonBlue,
                                borderThickness: ".3rem",
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing="1.6rem"
                                sx={{
                                    position: "relative",
                                    pl: "1.76rem",
                                    pr: "2.56rem",
                                    py: "2.4rem",
                                    backgroundColor: colors.darkNavyBlue,
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "relative",
                                        flexShrink: 0,
                                        px: ".64rem",
                                        py: "1.2rem",
                                        borderRadius: 0.6,
                                        boxShadow: "inset 0 0 12px 6px #00000055",
                                    }}
                                >
                                    <Stack
                                        spacing=".48rem"
                                        direction="row"
                                        alignItems="center"
                                        sx={{
                                            position: "absolute",
                                            bottom: "1.2rem",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                        }}
                                    ></Stack>
                                </Box>

                                <Stack spacing=".8rem" sx={{ flex: 1 }}>
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontFamily: "Nostromo Regular Bold",
                                                marginBottom: "1rem",
                                                fontSize: "2rem",
                                            }}
                                        >
                                            Registered Successfully!
                                        </Typography>
                                    </Box>

                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setUserTelegramShortcodeRegistered(false)
                                            onClose()
                                        }}
                                        sx={{
                                            justifySelf: "flex-end",
                                            mt: "auto",
                                            ml: 3,
                                            pt: ".7rem",
                                            pb: ".4rem",
                                            width: "9rem",
                                            color: colors.neonBlue,
                                            backgroundColor: colors.darkNavy,
                                            borderRadius: 0.7,
                                            fontFamily: "Nostromo Regular Bold",
                                            border: `${colors.neonBlue} 1px solid`,
                                            ":hover": {
                                                opacity: 0.8,
                                                border: `${colors.neonBlue} 1px solid`,
                                            },
                                        }}
                                    >
                                        Close
                                    </Button>
                                </Stack>
                            </Stack>
                        </ClipThing>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "73rem",
                        }}
                    >
                        <ClipThing
                            clipSize="10px"
                            border={{
                                isFancy: true,
                                borderColor: colors.neonBlue,
                                borderThickness: ".3rem",
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing="1.6rem"
                                sx={{
                                    position: "relative",
                                    pl: "1.76rem",
                                    pr: "2.56rem",
                                    py: "2.4rem",
                                    backgroundColor: colors.darkNavyBlue,
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "relative",
                                        flexShrink: 0,
                                        px: ".64rem",
                                        py: "1.2rem",
                                        borderRadius: 0.6,
                                        boxShadow: "inset 0 0 12px 6px #00000055",
                                    }}
                                >
                                    <Stack
                                        spacing=".48rem"
                                        direction="row"
                                        alignItems="center"
                                        sx={{
                                            position: "absolute",
                                            bottom: "1.2rem",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                        }}
                                    ></Stack>
                                </Box>

                                <Stack spacing=".8rem" sx={{ flex: 1 }}>
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontFamily: "Nostromo Regular Bold",
                                                marginBottom: "1rem",
                                                fontSize: "2rem",
                                            }}
                                        >
                                            Telegram Notifications
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography
                                            sx={{
                                                fontFamily: "Nostromo Regular Bold",
                                                marginBottom: "1rem",
                                            }}
                                        >
                                            Steps to enable Telegram notifications:
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex" }}>
                                        <Typography
                                            sx={{
                                                fontFamily: "Nostromo Regular Bold",
                                                marginRight: ".3rem",
                                            }}
                                        >
                                            1) Open The Supremacy Telegram bot:{" "}
                                        </Typography>
                                        <a href={TELEGRAM_BOT_URL} rel="noreferrer" target="_blank">
                                            <Typography
                                                sx={{
                                                    fontFamily: "Nostromo Regular Bold",
                                                    WebkitBoxOrient: "vertical",
                                                    textDecoration: "underline",
                                                    ":hover": {
                                                        color: colors.blue,
                                                    },
                                                }}
                                            >
                                                {TELEGRAM_BOT_URL}
                                            </Typography>
                                        </a>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontFamily: "Nostromo Regular Bold" }}>Or Scan QR code:</Typography>
                                    </Box>

                                    <Box style={{ textAlign: "center", marginBottom: "1rem" }}>
                                        <QRCode size={228} value={TELEGRAM_BOT_URL || ""} />
                                    </Box>

                                    <Box>
                                        <Typography
                                            sx={{
                                                fontFamily: "Nostromo Regular Bold",
                                            }}
                                        >
                                            2) Click Start (if first time using the bot)
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography
                                            sx={{
                                                fontFamily: "Nostromo Regular Bold",
                                            }}
                                        >
                                            3) type /register
                                        </Typography>
                                    </Box>

                                    <Box
                                        onClick={() => {
                                            navigator.clipboard.writeText(code).then(
                                                () => toggleCopySuccess(true),
                                                () => toggleCopySuccess(false),
                                            )
                                        }}
                                        sx={{
                                            display: "flex",
                                            ":hover": {
                                                cursor: "pointer",
                                                opacity: 0.6,
                                            },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontFamily: "Nostromo Regular Bold",
                                                display: "-webkit-box",
                                            }}
                                        >
                                            4) Enter Shortcode:{" "}
                                            <Typography marginLeft={".5rem"} marginRight={".5rem"} marginTop={"-.5rem"} fontSize={"2rem"}>
                                                {code}
                                            </Typography>
                                        </Typography>

                                        <SvgContentCopyIcon size="1.3rem" />
                                        {copySuccess && (
                                            <Typography
                                                sx={{
                                                    fontFamily: "Nostromo Regular Bold",
                                                    marginTop: ".5rem",
                                                    marginLeft: "1rem",
                                                }}
                                            >
                                                Copied!
                                            </Typography>
                                        )}
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setUserTelegramShortcodeRegistered(false)
                                            onClose()
                                        }}
                                        sx={{
                                            justifySelf: "flex-end",
                                            mt: "auto",
                                            ml: 3,
                                            pt: ".7rem",
                                            pb: ".4rem",
                                            width: "9rem",
                                            color: colors.neonBlue,
                                            backgroundColor: colors.darkNavy,
                                            borderRadius: 0.7,
                                            fontFamily: "Nostromo Regular Bold",
                                            border: `${colors.neonBlue} 1px solid`,
                                            ":hover": {
                                                opacity: 0.8,
                                                border: `${colors.neonBlue} 1px solid`,
                                            },
                                        }}
                                    >
                                        Close
                                    </Button>
                                </Stack>
                            </Stack>
                        </ClipThing>
                    </Box>
                )}
            </>
        </Modal>
    )
}
