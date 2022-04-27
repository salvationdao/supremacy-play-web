import { Avatar, IconButton, Stack, Typography } from "@mui/material"
import { useRef } from "react"
import { BarExpandable, ConnectButton, PunishmentList } from "../.."
import { SvgInfoCircular } from "../../../assets"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { useGameServerAuth, usePassportServerAuth } from "../../../containers"
import { useToggle } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { ProfilePopover } from "./ProfilePopover/ProfilePopover"

export const ProfileCard = () => {
    const { user } = usePassportServerAuth()
    const { punishments } = useGameServerAuth()
    const popoverRef = useRef(null)
    const [isPopoverOpen, toggleIsPopoverOpen] = useToggle()
    const [isPunishmentsOpen, toggleIsPunishmentsOpen] = useToggle()

    if (!user) return <ConnectButton />

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
                            border: (theme) => `${theme.factionTheme.primary} 2px solid`,
                            backgroundColor: (theme) => theme.factionTheme.primary,
                        }}
                        variant="square"
                    />
                }
            >
                <Stack
                    id="tutorial-passport"
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
                            height: ".3rem",
                        },
                        "::-webkit-scrollbar-track": {
                            background: "#FFFFFF15",
                            borderRadius: 3,
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: "#FFFFFF50",
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
                            border: (theme) => `${theme.factionTheme.primary} 2px solid`,
                            backgroundColor: (theme) => theme.factionTheme.primary,
                        }}
                        variant="square"
                    />

                    <Typography
                        variant="body2"
                        sx={{
                            mt: ".29rem !important",
                            lineHeight: 1,
                            fontFamily: fonts.nostromoBlack,
                            color: (theme) => theme.factionTheme.primary,
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
