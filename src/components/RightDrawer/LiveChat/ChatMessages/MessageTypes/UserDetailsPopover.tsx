import { Box, Popover, Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import { ClipThing, FancyButton } from "../../../.."
import { SvgSkull2, SvgAbility, SvgDeath, SvgView } from "../../../../../assets"
import { truncate } from "../../../../../helpers"
import { useToggle } from "../../../../../hooks"
import { colors, fonts, siteZIndex } from "../../../../../theme/theme"
import { User, UserStat } from "../../../../../types"

export const UserDetailsPopover = ({
    faction_logo_url,
    factionColor,
    factionSecondaryColor,
    fromUserFactionID,
    messageColor,
    username,
    gid,
    userStat,
    popoverRef,
    open,
    onClose,
    user,
    toggleBanModalOpen,
}: {
    faction_logo_url?: string
    factionColor?: string
    factionSecondaryColor?: string
    fromUserFactionID?: string
    messageColor?: string
    username: string
    gid: number
    userStat?: UserStat
    popoverRef: React.MutableRefObject<null>
    open: boolean
    onClose: () => void
    user: User
    toggleBanModalOpen: (value?: boolean | undefined) => void
}) => {
    const [localOpen, toggleLocalOpen] = useToggle(open)

    useEffect(() => {
        if (!localOpen) {
            const timeout = setTimeout(() => {
                onClose()
            }, 300)

            return () => clearTimeout(timeout)
        }
    }, [localOpen, onClose])

    if (!userStat) return null

    return (
        <>
            <Popover
                open={localOpen}
                anchorEl={popoverRef.current}
                onClose={() => toggleLocalOpen(false)}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                sx={{
                    mt: "-.3rem",
                    ml: "-1rem",
                    zIndex: siteZIndex.Popover,
                    ".MuiPaper-root": {
                        background: "none",
                    },
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: factionColor || colors.neonBlue,
                        borderThickness: ".2rem",
                    }}
                    corners={{
                        topRight: true,
                        bottomLeft: true,
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={colors.darkNavy}
                >
                    <Stack sx={{ minWidth: "20rem", px: "1.5rem", py: "1.2rem" }}>
                        <Stack direction="row" spacing=".5rem" sx={{ mt: ".3rem", mb: ".7rem" }}>
                            {faction_logo_url && (
                                <Box
                                    sx={{
                                        mt: "-0.1rem !important",
                                        width: "1.7rem",
                                        height: "1.7rem",
                                        flexShrink: 0,
                                        backgroundImage: `url(${faction_logo_url})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "contain",
                                        backgroundColor: factionColor,
                                        borderRadius: 0.8,
                                        border: `${factionColor} 1px solid`,
                                    }}
                                />
                            )}
                            <Typography sx={{ color: messageColor, fontWeight: "fontWeightBold" }}>
                                {`${truncate(username, 20)}`}
                                <span style={{ marginLeft: ".2rem", opacity: 0.7 }}>{`#${gid}`}</span>
                            </Typography>
                        </Stack>

                        <Stack spacing=".3rem" sx={{ ml: ".2rem" }}>
                            <Stack direction="row" spacing=".5rem">
                                <SvgAbility size="1.1rem" sx={{ pb: ".4rem" }} />
                                <Typography variant="body2">
                                    <strong>ABILITIES:</strong> {userStat.total_ability_triggered}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing=".5rem">
                                <SvgSkull2 size="1.1rem" sx={{ pb: ".4rem" }} />
                                <Typography variant="body2">
                                    <strong>MECH KILLS:</strong> {userStat.mech_kill_count}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing=".5rem">
                                <SvgDeath size="1.1rem" sx={{ pb: ".4rem" }} />
                                <Typography variant="body2">
                                    <strong>ABILITY KILLS:</strong> {userStat.ability_kill_count}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing=".5rem">
                                <SvgDeath size="1.1rem" sx={{ pb: ".4rem" }} />
                                <Typography variant="body2">
                                    <strong>ABILITY KILLS (7 DAYS):</strong> {userStat.last_seven_days_kills}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing=".5rem">
                                <SvgView size="1.1rem" />
                                <Typography variant="body2">
                                    <strong>SPECTATED:</strong> {userStat.view_battle_count}
                                </Typography>
                            </Stack>
                        </Stack>

                        {fromUserFactionID === user.faction_id && (
                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: factionColor,
                                    opacity: 1,
                                    border: { isFancy: true, borderColor: factionColor, borderThickness: "2px" },
                                    sx: { position: "relative", mt: ".7rem" },
                                }}
                                sx={{ px: "1.6rem", py: ".1rem", color: factionSecondaryColor }}
                                onClick={() => {
                                    toggleBanModalOpen()
                                    toggleLocalOpen(false)
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: factionSecondaryColor,
                                        fontFamily: fonts.nostromoBlack,
                                    }}
                                >
                                    PUNISH
                                </Typography>
                            </FancyButton>
                        )}
                    </Stack>
                </ClipThing>
            </Popover>
        </>
    )
}
