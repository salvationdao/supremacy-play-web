import { useRef } from "react"
import { Avatar, Stack, Typography, Popover } from "@mui/material"
import { BarExpandable, ConnectButton, LogoutButton, NavButton, PreferencesModal } from "../.."
import { useEffect } from "react"
import { SvgAssets, SvgProfile, SvgShop, SvgSettings } from "../../../assets"
import { GAMEBAR_AUTO_SIGNIN_WAIT_SECONDS, PASSPORT_SERVER_HOST_IMAGES, PASSPORT_WEB } from "../../../constants"
import { usePassportServerAuth } from "../../../containers"
import { useToggle } from "../../../hooks"
import { colors } from "../../../theme/theme"
import { shadeColor } from "../../../helpers"

export const ProfileCard = () => {
    const { user } = usePassportServerAuth()
    const [renderConnectButton, toggleRenderConnectButton] = useToggle()

    const popoverRef = useRef(null)
    const [isPopoverOpen, toggleIsPopoverOpen] = useToggle()
    const [preferencesModalOpen, togglePreferencesModalOpen] = useToggle()

    // Don't show the connect button for couple seconds as it tries to do the auto login
    useEffect(() => {
        setTimeout(() => {
            toggleRenderConnectButton(true)
        }, GAMEBAR_AUTO_SIGNIN_WAIT_SECONDS)
    }, [])

    if (!user) {
        return <ConnectButton renderButton={renderConnectButton} />
    }

    const { username, avatar_id, faction } = user

    return (
        <>
            <BarExpandable
                noDivider
                barName={"profile"}
                iconComponent={
                    <Avatar
                        src={avatar_id ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${avatar_id}` : ""}
                        alt={`${username}'s Avatar`}
                        sx={{
                            height: "2.9rem",
                            width: "2.9rem",
                            borderRadius: 1,
                            border: `${faction ? faction.theme.primary : colors.neonBlue} 2px solid`,
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
                        src={avatar_id ? `${PASSPORT_WEB}api/files/${avatar_id}` : ""}
                        alt={`${username}'s Avatar`}
                        sx={{
                            height: "2.6rem",
                            width: "2.6rem",
                            borderRadius: 0.8,
                            border: `${faction ? faction.theme.primary : colors.neonBlue} 2px solid`,
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

            <Popover
                open={isPopoverOpen}
                anchorEl={popoverRef.current}
                onClose={() => {
                    toggleIsPopoverOpen(false)
                    togglePreferencesModalOpen(false)
                }}
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
                        backgroundColor:
                            user && user.faction ? shadeColor(user.faction.theme.primary, -95) : colors.darkNavy,
                        border: "#FFFFFF50 1px solid",
                    },
                }}
            >
                <Stack spacing=".32rem" sx={{ p: ".8rem" }}>
                    <NavButton
                        href={`${PASSPORT_WEB}collections/${user.username}`}
                        startIcon={<SvgAssets sx={{ pb: ".5rem" }} size="1.6rem" />}
                    >
                        My Inventory
                    </NavButton>
                    <NavButton
                        href={`${PASSPORT_WEB}stores`}
                        startIcon={<SvgShop sx={{ pb: ".5rem" }} size="1.6rem" />}
                    >
                        Purchase Assets
                    </NavButton>
                    <NavButton
                        href={`${PASSPORT_WEB}profile/${user.username}/edit`}
                        startIcon={<SvgProfile sx={{ pb: ".5rem" }} size="1.6rem" />}
                    >
                        Edit Profile
                    </NavButton>
                    {/*<NavButton*/}
                    {/*    onClick={() => {*/}
                    {/*        togglePreferencesModalOpen(true)*/}
                    {/*        toggleIsPopoverOpen(false)*/}
                    {/*    }}*/}
                    {/*    startIcon={<SvgSettings sx={{ pb: ".5rem" }} size="1.6rem" />}*/}
                    {/*>*/}
                    {/*    Preferences*/}
                    {/*</NavButton>*/}
                    <LogoutButton />
                </Stack>
            </Popover>

            {isPopoverOpen ||
                (preferencesModalOpen && (
                    <PreferencesModal open={preferencesModalOpen} toggle={togglePreferencesModalOpen} />
                ))}
        </>
    )
}
