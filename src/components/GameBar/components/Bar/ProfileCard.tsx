import { useState, useCallback } from "react"
import { Avatar, Box, Button, Dialog, Stack, Typography, Link, Popover, SxProps, Theme, Tooltip } from "@mui/material"
import { BarExpandable } from ".."
import { useAuth } from "../../containers"
import { GameBarBaseProps } from "../../GameBar"
import { PassportLogin } from "../../passportLogin"
import { colors } from "../../theme"
import { useEffect } from "react"
import { SvgAssets, SvgLogout, SvgProfile, SvgShop } from "../../assets"
import { PASSPORT_SERVER_HOST_IMAGES } from '../../../../constants'

export const ProfileCard = (props: GameBarBaseProps) => {
    const { passportWeb } = props
    const { user, authRingCheckError, setAuthRingCheckError } = useAuth()
    const [anchorEl, setAnchorEl] = useState<HTMLAnchorElement | null>(null)

    if (!user) {
        return (
            <>
                <PassportLogin
                    passportWeb={passportWeb}
                    render={(props) => (
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
                                    color:
                                        props.isDisabled || props.isProcessing
                                            ? `${colors.darkestNeonBlue}50 !important`
                                            : colors.darkestNeonBlue,
                                    backgroundColor: colors.neonBlue,
                                    transition: "all .2s",
                                },
                            }}
                            onClick={props.onClick}
                            disabled={props.isDisabled || props.isProcessing}
                        >
                            Connect
                        </Button>
                    )}
                />

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
                            src={avatarID ? `${props.passportWeb}/api/files/${avatarID}` : ""}
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
                        href={`${props.passportWeb}/collections`}
                        startIcon={<SvgAssets size="16px" fill={colors.text} />}
                    >
                        My Inventory
                    </NavButton>
                    <NavButton
                        href={`${props.passportWeb}/stores`}
                        startIcon={<SvgShop size="16px" fill={colors.text} />}
                    >
                        Purchase Assets
                    </NavButton>
                    <NavButton
                        href={`${props.passportWeb}/profile/${user.username}/edit`}
                        startIcon={<SvgProfile size="16px" fill={colors.text} />}
                    >
                        Edit Profile
                    </NavButton>
                    <LogoutButton passportWeb={props.passportWeb} />
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

        const href = `${passportWeb}/nosidebar/logout?omitSideBar=true&&sessionID=${sessionID}`
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