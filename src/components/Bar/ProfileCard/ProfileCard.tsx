import { Avatar, Box, Button, IconButton, Modal, Popover, Stack, Typography } from "@mui/material"
import { MutableRefObject, useEffect, useRef, useState } from "react"
import QRCode from "react-qr-code"
import { BarExpandable, ClipThing, ConnectButton, LogoutButton, NavButton, PunishmentList } from "../.."
import { SvgAssets, SvgContentCopyIcon, SvgInfoCircular, SvgProfile, SvgSettings, SvgShop } from "../../../assets"
import { GAMEBAR_AUTO_SIGNIN_WAIT_SECONDS, PASSPORT_SERVER_HOST_IMAGES, PASSPORT_WEB, TELEGRAM_BOT_URL } from "../../../constants"
import { useGameServerAuth, useGameServerWebsocket, usePassportServerAuth } from "../../../containers"
import { shadeColor } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { UserData } from "../../../types/passport"
import { PreferencesModal } from "../PreferencesModal/PreferencesModal"

export const ProfileCard = () => {
    const { user } = usePassportServerAuth()
    const { punishments } = useGameServerAuth()
    const [renderConnectButton, toggleRenderConnectButton] = useToggle()

    const popoverRef = useRef(null)
    const [isPopoverOpen, toggleIsPopoverOpen] = useToggle()
    const [isPunishmentsOpen, toggleIsPunishmentsOpen] = useToggle()

    // Don't show the connect button for couple seconds as it tries to do the auto login
    useEffect(() => {
        setTimeout(() => {
            toggleRenderConnectButton(true)
        }, GAMEBAR_AUTO_SIGNIN_WAIT_SECONDS)
    }, [])

    if (!user) {
        return <ConnectButton renderButton={renderConnectButton} />
    }

    const { username, faction } = user

    return (
        <>
            <BarExpandable
                noDivider
                barName={"profile"}
                iconComponent={
                    <Avatar
                        src={faction ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${faction.logo_blob_id}` : ""}
                        alt={`${username}'s Avatar`}
                        sx={{
                            height: "2.9rem",
                            width: "2.9rem",
                            borderRadius: 1,
                            border: `${faction ? faction.theme.primary : colors.neonBlue} 2px solid`,
                            backgroundColor: faction ? faction.theme.primary : "transparent",
                        }}
                        variant="square"
                    />
                }
            >
                <Stack
                    ref={popoverRef}
                    onClick={() => toggleIsPopoverOpen()}
                    direction="row"
                    alignItems="center"
                    spacing=".96rem"
                    sx={{
                        mx: "1.2rem",
                        height: "100%",
                        cursor: "pointer",
                        ":hover p": { opacity: 0.7 },
                        overflowX: "auto",
                        overflowY: "hidden",
                        scrollbarWidth: "none",
                        "::-webkit-scrollbar": {
                            height: ".4rem",
                        },
                        "::-webkit-scrollbar-track": {
                            background: "#FFFFFF15",
                            borderRadius: 3,
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: colors.darkNeonBlue,
                            borderRadius: 3,
                        },
                    }}
                >
                    <Avatar
                        src={faction ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${faction.logo_blob_id}` : ""}
                        alt={`${username}'s Avatar`}
                        sx={{
                            height: "2.6rem",
                            width: "2.6rem",
                            borderRadius: 0.8,
                            border: `${faction ? faction.theme.primary : colors.neonBlue} 2px solid`,
                            backgroundColor: faction ? faction.theme.primary : "transparent",
                        }}
                        variant="square"
                    />

                    <Typography
                        variant="body2"
                        sx={{
                            mt: ".29rem !important",
                            lineHeight: 1,
                            fontFamily: "Nostromo Regular Black",
                            color: faction ? faction.theme.primary : "#FFFFFF",
                        }}
                    >
                        {username}
                    </Typography>
                </Stack>
            </BarExpandable>

            {punishments && punishments.length > 0 && (
                <IconButton size="small" onClick={() => toggleIsPunishmentsOpen()}>
                    <SvgInfoCircular size="1.2rem" fill={colors.red} sx={{ pb: ".2rem" }} />
                </IconButton>
            )}

            {isPunishmentsOpen && <PunishmentList open={isPunishmentsOpen} onClose={() => toggleIsPunishmentsOpen(false)} punishments={punishments} />}

            {isPopoverOpen && <ProfilePopover open={isPopoverOpen} popoverRef={popoverRef} onClose={() => toggleIsPopoverOpen(false)} user={user} />}
        </>
    )
}

const ProfilePopover = ({ open, popoverRef, onClose, user }: { open: boolean; popoverRef: MutableRefObject<null>; onClose: () => void; user: UserData }) => {
    const [localOpen, toggleLocalOpen] = useToggle(open)
    const [preferencesModalOpen, togglePreferencesModalOpen] = useToggle()

    const [telegramShortcode, setTelegramShortcode] = useState<string>("")

    useEffect(() => {
        if (!localOpen && !preferencesModalOpen) {
            setTimeout(() => {
                onClose()
            }, 300)
        }
    }, [localOpen])

    return (
        <>
            <Popover
                open={localOpen}
                anchorEl={popoverRef.current}
                onClose={() => toggleLocalOpen(false)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                sx={{
                    mt: ".8rem",
                    zIndex: 10000,
                    ".MuiPaper-root": {
                        background: "none",
                        backgroundColor: user.faction ? shadeColor(user.faction.theme.primary, -95) : colors.darkNavy,
                        border: "#FFFFFF50 1px solid",
                    },
                }}
            >
                <Stack spacing=".32rem" sx={{ p: ".8rem" }}>
                    <NavButton href={`${PASSPORT_WEB}collections/${user.username}`} startIcon={<SvgAssets sx={{ pb: ".5rem" }} size="1.6rem" />}>
                        My Inventory
                    </NavButton>
                    <NavButton href={`${PASSPORT_WEB}stores`} startIcon={<SvgShop sx={{ pb: ".5rem" }} size="1.6rem" />}>
                        Purchase Assets
                    </NavButton>
                    <NavButton href={`${PASSPORT_WEB}profile/${user.username}/edit`} startIcon={<SvgProfile sx={{ pb: ".5rem" }} size="1.6rem" />}>
                        Edit Profile
                    </NavButton>
                    <NavButton
                        onClick={() => {
                            togglePreferencesModalOpen(true)
                            toggleLocalOpen(false)
                        }}
                        startIcon={<SvgSettings sx={{ pb: ".5rem" }} size="1.6rem" />}
                    >
                        Preferences
                    </NavButton>
                    <LogoutButton />
                </Stack>
            </Popover>

            {/* preferences modal */}
            <PreferencesModal open={preferencesModalOpen} toggle={togglePreferencesModalOpen} setTelegramShortcode={setTelegramShortcode} />

            {/* telegram register modal */}
            <TelegramShortcodeModal open={!!telegramShortcode} code={telegramShortcode} onClose={() => setTelegramShortcode("")} />
        </>
    )
}

export const TelegramShortcodeModal = ({ open, onClose, code }: { open: boolean; onClose: () => void; code: string }) => {
    const { state, subscribe } = useGameServerWebsocket()
    const [copySuccess, toggleCopySuccess] = useToggle()
    const [userTelegramShortcodeRegistered, setUserTelegramShortcodeRegistered] = useState<boolean | undefined>(undefined)

    // copy shortcode
    useEffect(() => {
        if (copySuccess) {
            setTimeout(() => {
                toggleCopySuccess(false)
            }, 900)
        }
    }, [copySuccess])

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<boolean | undefined>(
            GameServerKeys.UserTelegramShortcodeRegistered,
            (payload: boolean | undefined) => {
                setUserTelegramShortcodeRegistered(!!payload)
            },
            null,
        )
    }, [state, subscribe])

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
                                            Steps to enable Telegram notification:
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
