import { Avatar, IconButton, Stack, Typography } from "@mui/material"
import { useRef } from "react"
import { ConnectButton, PunishmentList } from "../.."
import { SvgInfoCircular } from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"
import { useToggle } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { User } from "../../../types"
import { ProfilePopover } from "./ProfilePopover/ProfilePopover"
import { CropMaxLengthText } from "../../../theme/styles"

export const ProfileCard = ({ userID, user }: { userID?: string; user: User }) => {
    const { punishments } = useAuth()
    const { getFaction } = useSupremacy()
    const popoverRef = useRef(null)
    const [isPopoverOpen, toggleIsPopoverOpen] = useToggle()
    const [isPunishmentsOpen, toggleIsPunishmentsOpen] = useToggle()

    if (!userID) return <ConnectButton />

    const { username, faction_id } = user

    return (
        <>
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

                    "::-webkit-scrollbar": {
                        height: ".6rem",
                    },
                    "::-webkit-scrollbar-track": {
                        background: "#FFFFFF15",
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: "#FFFFFF50",
                    },
                }}
            >
                <Avatar
                    src={getFaction(faction_id).logo_url}
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
                        fontFamily: fonts.nostromoBlack,
                        color: (theme) => theme.factionTheme.primary,
                        ...CropMaxLengthText,
                        WebkitLineClamp: 2,
                    }}
                >
                    {username}
                </Typography>
            </Stack>

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
