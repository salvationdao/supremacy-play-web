import { Modal, Box, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import { FancyButton } from "../../.."
import { SvgContentCopyIcon } from "../../../../assets"
import { TELEGRAM_BOT_URL } from "../../../../constants"
import { useTheme } from "../../../../containers/theme"
import { useToggle } from "../../../../hooks"
import { useGameServerSubscriptionUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { ClipThing } from "../../../Common/ClipThing"

export const TelegramRegisterModal = ({ onClose, code }: { onClose: () => void; code: string }) => {
    const theme = useTheme()
    const [copySuccess, toggleCopySuccess] = useToggle()
    const [userTelegramShortcodeRegistered, setUserTelegramShortcodeRegistered] = useState<boolean>()

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

    // Copy shortcode
    useEffect(() => {
        if (copySuccess) {
            setTimeout(() => {
                toggleCopySuccess(false)
            }, 900)
        }
    }, [copySuccess, toggleCopySuccess])

    if (!TELEGRAM_BOT_URL) return null

    if (userTelegramShortcodeRegistered) {
        return (
            <Modal open>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "63rem",
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
                            direction="row"
                            spacing="1.6rem"
                            sx={{
                                position: "relative",
                                pl: "1.76rem",
                                pr: "2.56rem",
                                py: "2.4rem",
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
                                            fontFamily: fonts.nostromoBold,
                                            marginBottom: "1rem",
                                            fontSize: "2rem",
                                        }}
                                    >
                                        Registered Successfully!
                                    </Typography>
                                </Box>

                                <FancyButton
                                    excludeCaret
                                    clipThingsProps={{
                                        clipSize: "5px",
                                        backgroundColor: colors.darkNavy,
                                        opacity: 1,
                                        border: { isFancy: true, borderColor: colors.neonBlue, borderThickness: "2px" },
                                        sx: { position: "relative", mt: "auto", ml: 3, width: "9rem" },
                                    }}
                                    sx={{ px: "1.6rem", py: ".6rem", color: colors.neonBlue }}
                                    onClick={() => {
                                        setUserTelegramShortcodeRegistered(false)
                                        onClose()
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: colors.neonBlue,
                                            fontFamily: fonts.nostromoBlack,
                                        }}
                                    >
                                        CLOSE
                                    </Typography>
                                </FancyButton>
                            </Stack>
                        </Stack>
                    </ClipThing>
                </Box>
            </Modal>
        )
    }

    return (
        <Modal open>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "73rem",
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
                        direction="row"
                        spacing="1.6rem"
                        sx={{
                            position: "relative",
                            pl: "1.76rem",
                            pr: "2.56rem",
                            py: "2.4rem",
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
                                        fontFamily: fonts.nostromoBold,
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
                                        fontFamily: fonts.nostromoBold,
                                        marginBottom: "1rem",
                                    }}
                                >
                                    Steps to enable Telegram notifications:
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex" }}>
                                <Typography
                                    sx={{
                                        fontFamily: fonts.nostromoBold,
                                        marginRight: ".3rem",
                                    }}
                                >
                                    1) Open The Supremacy Telegram bot:{" "}
                                </Typography>
                                <a href={TELEGRAM_BOT_URL} rel="noreferrer" target="_blank">
                                    <Typography
                                        sx={{
                                            fontFamily: fonts.nostromoBold,
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
                                <Typography sx={{ fontFamily: fonts.nostromoBold }}>Or Scan QR code:</Typography>
                            </Box>

                            <Box style={{ textAlign: "center", marginBottom: "1rem" }}>
                                <QRCode size={228} value={TELEGRAM_BOT_URL || ""} />
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        fontFamily: fonts.nostromoBold,
                                    }}
                                >
                                    2) Click Start (if first time using the bot)
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        fontFamily: fonts.nostromoBold,
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
                                        fontFamily: fonts.nostromoBold,
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
                                            fontFamily: fonts.nostromoBold,
                                            marginTop: ".5rem",
                                            marginLeft: "1rem",
                                        }}
                                    >
                                        Copied!
                                    </Typography>
                                )}
                            </Box>

                            <FancyButton
                                excludeCaret
                                clipThingsProps={{
                                    clipSize: "9px",
                                    backgroundColor: colors.darkNavy,
                                    opacity: 1,
                                    border: { isFancy: true, borderColor: colors.neonBlue, borderThickness: "2px" },
                                    sx: { position: "relative", mt: "auto", ml: 3, width: "9rem" },
                                }}
                                sx={{ px: "1.6rem", py: ".6rem", color: colors.neonBlue }}
                                onClick={() => {
                                    setUserTelegramShortcodeRegistered(false)
                                    onClose()
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: colors.neonBlue,
                                        fontFamily: fonts.nostromoBlack,
                                    }}
                                >
                                    CLOSE
                                </Typography>
                            </FancyButton>
                        </Stack>
                    </Stack>
                </ClipThing>
            </Box>
        </Modal>
    )
}
