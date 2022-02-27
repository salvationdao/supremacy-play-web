import { useState, useCallback } from "react"
import { Avatar, Box, Button, Dialog, Stack, Typography, Link, Popover, SxProps, Theme, Tooltip } from "@mui/material"
import { BarExpandable } from ".."
import { useAuth } from "../../containers"
import { GameBarBaseProps } from "../../GameBar"
import { colors } from "../../theme"
import { useEffect } from "react"
import { SvgAssets, SvgLogout, SvgProfile, SvgShop } from "../../assets"
import { GAMEBAR_AUTO_SIGNIN_WAIT_SECONDS, PASSPORT_SERVER_HOST_IMAGES } from "../../../../constants"
import { useToggle } from "../../hooks"

const ConnectButton = ({ passportWeb }: { passportWeb: string }) => {
    const [isProcessing, setIsProcessing] = useState(false)
    const [passportPopup, setPassportPopup] = useState<Window | null>(null)
    const { sessionID, authRingCheckError, setAuthRingCheckError } = useAuth()
    const [renderButton, toggleRenderButton] = useToggle()

    const href = `${passportWeb}/nosidebar/login?omitSideBar=true&&sessionID=${sessionID}`

    // Don't show the connect button for couple seconds as it tries to do the auto login
    useEffect(() => {
        setTimeout(() => {
            toggleRenderButton(true)
        }, GAMEBAR_AUTO_SIGNIN_WAIT_SECONDS)
    }, [])

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

            {authRingCheckError && (
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

export const ProfileCard = ({ passportWeb }: GameBarBaseProps) => {
    const { user } = useAuth()
    const [anchorEl, setAnchorEl] = useState<HTMLAnchorElement | null>(null)

    if (!user) {
        return <ConnectButton passportWeb={passportWeb} />
    }

    const { username, avatarID, faction } = user
    const profileDropdownID = "profile_dropdown"

    return (
        <>
            <BarExpandable
                noDivider
                barName={"profile"}
                iconComponent={
                    <Avatar
                        src={avatarID ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${avatarID}` : ""}
                        alt={`${username}'s Avatar`}
                        sx={{
                            height: 29,
                            width: 29,
                            borderRadius: 1,
                            border: `${faction ? faction.theme.primary : colors.neonBlue} 2px solid`,
                        }}
                        variant="square"
                    />
                }
            >
                <Link
                    aria-describedby={profileDropdownID}
                    href={"#"}
                    sx={{ ":hover p": { color: colors.neonBlue } }}
                    onClick={(e) => {
                        e.preventDefault()
                        setAnchorEl(e.currentTarget.closest("a"))
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.2}
                        sx={{
                            mx: 1.5,
                            height: "100%",
                            overflowX: "auto",
                            overflowY: "hidden",
                            scrollbarWidth: "none",
                            "::-webkit-scrollbar": {
                                height: 4,
                            },
                            "::-webkit-scrollbar-track": {
                                boxShadow: `inset 0 0 5px ${colors.darkerNeonBlue}`,
                                borderRadius: 3,
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: colors.darkNeonBlue,
                                borderRadius: 3,
                            },
                        }}
                    >
                        <Avatar
                            src={avatarID ? `${passportWeb}/api/files/${avatarID}` : ""}
                            alt={`${username}'s Avatar`}
                            sx={{
                                height: 26,
                                width: 26,
                                borderRadius: 0.8,
                                border: `${faction ? faction.theme.primary : colors.neonBlue} 2px solid`,
                            }}
                            variant="square"
                        />

                        <Typography
                            variant="body2"
                            sx={{
                                mt: "2.8px !important",
                                lineHeight: 1,
                                color: faction ? faction.theme.primary : colors.text,
                            }}
                        >
                            {username}
                        </Typography>
                    </Stack>
                </Link>
            </BarExpandable>
            <Popover
                id={profileDropdownID}
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                sx={{
                    mt: 1,
                    zIndex: 10000,
                    ".MuiPaper-root": {
                        backgroundColor: colors.darkNavy,
                    },
                }}
            >
                <Stack spacing={0.4} sx={{ p: 1, backgroundColor: colors.darkNavy }}>
                    <NavButton
                        href={`${passportWeb}/collections`}
                        startIcon={<SvgAssets size="16px" fill={colors.text} />}
                    >
                        My Inventory
                    </NavButton>
                    <NavButton href={`${passportWeb}/stores`} startIcon={<SvgShop size="16px" fill={colors.text} />}>
                        Purchase Assets
                    </NavButton>
                    <NavButton
                        href={`${passportWeb}/profile/${user.username}/edit`}
                        startIcon={<SvgProfile size="16px" fill={colors.text} />}
                    >
                        Edit Profile
                    </NavButton>
                    <LogoutButton passportWeb={passportWeb} />
                </Stack>
            </Popover>
        </>
    )
}

interface NavButtonProps {
    href: string
    active?: boolean
    sx?: SxProps<Theme>
    startIcon?: React.ReactNode
    onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

const NavButton: React.FC<NavButtonProps> = ({ href, active, sx, startIcon, onClick, children }) => {
    return (
        <Button
            sx={{
                alignItems: "center",
                justifyContent: "start",
                color: colors.text,
                backgroundColor: active ? colors.darkNavyBlue : undefined,
                ":hover": {
                    backgroundColor: colors.darkerNeonBlue,
                },
                ...sx,
            }}
            component={"a"}
            href={href}
            target={"_blank"}
            startIcon={startIcon}
            onClick={onClick}
        >
            {children}
        </Button>
    )
}

interface LogoutButtonProps {
    passportWeb: string
}

const LogoutButton = ({ passportWeb }: LogoutButtonProps) => {
    const [isProcessing, setIsProcessing] = useState(false)
    const [passportPopup, setPassportPopup] = useState<Window | null>(null)
    const { user, sessionID } = useAuth()

    const click = useCallback(async () => {
        if (isProcessing) {
            return
        }

        setIsProcessing(true)

        const href = `${passportWeb}/logout`
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

        setTimeout(() => {
            popup.close()
            window.location.reload()
        }, 3000)

        setPassportPopup(popup)
    }, [isProcessing, sessionID, passportWeb])

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
            startIcon={<SvgLogout size="16px" fill={colors.text} sx={{ ml: 0.1 }} />}
            onClick={click}
            sx={{
                justifyContent: "flex-start",
                width: "100%",
                color: colors.text,
                ":hover": {
                    backgroundColor: colors.red,
                },
            }}
        >
            Logout
        </Button>
    )
}
