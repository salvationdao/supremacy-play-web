import { useState } from "react"
import { Avatar, Stack, Typography, Link, Popover } from "@mui/material"
import { BarExpandable, ConnectButton, LogoutButton, NavButton } from "../.."
import { useAuth } from "../../../containers"
import { GameBarBaseProps } from "../../../GameBar"
import { colors } from "../../../theme"
import { useEffect } from "react"
import { SvgAssets, SvgProfile, SvgShop } from "../../../assets"
import { GAMEBAR_AUTO_SIGNIN_WAIT_SECONDS, PASSPORT_SERVER_HOST_IMAGES } from "../../../../../constants"
import { useToggle } from "../../../hooks"

export const ProfileCard = ({ passportWeb }: GameBarBaseProps) => {
    const { user } = useAuth()
    const [renderConnectButton, toggleRenderConnectButton] = useToggle()
    const [anchorEl, setAnchorEl] = useState<HTMLAnchorElement | null>(null)

    // Don't show the connect button for couple seconds as it tries to do the auto login
    useEffect(() => {
        setTimeout(() => {
            toggleRenderConnectButton(true)
        }, GAMEBAR_AUTO_SIGNIN_WAIT_SECONDS)
    }, [])

    if (!user) {
        return <ConnectButton renderButton={renderConnectButton} passportWeb={passportWeb} />
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
                    sx={{ height: "100%", ":hover p": { opacity: 0.7 } }}
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
                            src={avatarID ? `${passportWeb}api/files/${avatarID}` : ""}
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
                        href={`${passportWeb}collections/${user.username}`}
                        startIcon={<SvgAssets size="16px" fill={colors.text} />}
                    >
                        My Inventory
                    </NavButton>
                    <NavButton href={`${passportWeb}stores`} startIcon={<SvgShop size="16px" fill={colors.text} />}>
                        Purchase Assets
                    </NavButton>
                    <NavButton
                        href={`${passportWeb}profile/${user.username}/edit`}
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
