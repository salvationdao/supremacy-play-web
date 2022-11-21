import { Avatar, IconButton, Typography } from "@mui/material"
import { useRef } from "react"
import { ConnectButton, PunishmentList } from "../.."
import { SvgInfoCircular } from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"
import { truncateTextLines } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { User } from "../../../types"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { ProfilePopover } from "./ProfilePopover/ProfilePopover"

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
            <NiceButton ref={popoverRef} onClick={() => toggleIsPopoverOpen()}>
                <Avatar
                    src={getFaction(faction_id).logo_url}
                    alt={`${username}'s Avatar`}
                    sx={{
                        height: "3rem",
                        width: "3rem",
                        mr: ".5rem",
                    }}
                    variant="square"
                />

                <Typography
                    variant="body2"
                    sx={{
                        mt: ".29rem !important",
                        fontFamily: fonts.nostromoBlack,
                        color: (theme) => theme.factionTheme.primary,
                        ...truncateTextLines(2),
                    }}
                >
                    {username}
                </Typography>
            </NiceButton>

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
