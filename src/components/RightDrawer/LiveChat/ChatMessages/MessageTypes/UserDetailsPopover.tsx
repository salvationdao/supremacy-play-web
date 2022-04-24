import { Box, Button, Popover, Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import { ClipThing } from "../../../.."
import { SvgSkull2, SvgAbility, SvgDeath, SvgView } from "../../../../../assets"
import { NullUUID, PASSPORT_SERVER_HOST_IMAGES } from "../../../../../constants"
import { truncate } from "../../../../../helpers"
import { useToggle } from "../../../../../hooks"
import { colors } from "../../../../../theme/theme"
import { User, UserStat } from "../../../../../types"

export const UserDetailsPopover = ({
    factionLogoBlobID,
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
    factionLogoBlobID?: string
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
    user?: User
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
    }, [localOpen])

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
                    zIndex: 10000,
                    ".MuiPaper-root": {
                        background: "none",
                    },
                }}
            >
                <ClipThing
                    clipSize="0"
                    border={{
                        isFancy: true,
                        borderColor: factionColor || colors.neonBlue,
                        borderThickness: ".15rem",
                    }}
                    innerSx={{ position: "relative" }}
                >
                    <Stack sx={{ minWidth: "20rem", px: "1.2rem", py: ".8rem", backgroundColor: colors.darkNavy }}>
                        <Stack direction="row" spacing=".5rem" sx={{ mt: ".3rem", mb: ".7rem" }}>
                            {factionLogoBlobID && factionLogoBlobID != NullUUID && (
                                <Box
                                    sx={{
                                        mt: "-0.1rem !important",
                                        width: "1.7rem",
                                        height: "1.7rem",
                                        flexShrink: 0,
                                        backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionLogoBlobID})`,
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

                        {user && fromUserFactionID === user.faction_id && (
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => {
                                    toggleBanModalOpen()
                                    toggleLocalOpen(false)
                                }}
                                sx={{
                                    mt: ".7rem",
                                    px: ".8rem",
                                    pt: ".48rem",
                                    pb: ".3rem",
                                    backgroundColor: factionColor,
                                    border: `${factionColor} 1px solid`,
                                    borderRadius: 0.3,
                                    ":hover": { backgroundColor: `${factionColor}90` },
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        lineHeight: 1,
                                        fontWeight: "fontWeightBold",
                                        color: factionSecondaryColor,
                                    }}
                                >
                                    PUNISH
                                </Typography>
                            </Button>
                        )}
                    </Stack>
                </ClipThing>
            </Popover>
        </>
    )
}
