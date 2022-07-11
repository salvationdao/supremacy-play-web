import { Box, Stack, Typography } from "@mui/material"
import { Faction, SystemBanMessageData } from "../../../../../types"
import { dateFormatter } from "../../../../../helpers"
import { SvgAnnouncement } from "../../../../../assets"
import { StyledImageText } from "../../../../Notifications/Common/StyledImageText"
import { colors } from "../../../../../theme/theme"
import { useMemo } from "react"

export const SystemBanMessage = ({
    data,
    sentAt,
    fontSize,
    getFaction,
}: {
    data?: SystemBanMessageData
    sentAt: Date
    fontSize: number
    getFaction: (factionID: string) => Faction
}) => {
    const factionColor = useMemo(() => (data?.faction_id ? getFaction(data.faction_id).primary_color : "#FFFFFF"), [data?.faction_id, getFaction])
    const factionLogoUrl = useMemo(() => (data?.faction_id ? getFaction(data.faction_id).logo_url : ""), [data?.faction_id, getFaction])

    if (!data) return null

    const { banned_user, ban_duration, is_permanent_ban, reason, restrictions } = data

    return (
        <Box>
            <Box sx={{ mx: "-0.6rem", mb: ".5rem", backgroundColor: "#00000040" }}>
                <Stack
                    sx={{
                        pt: "1rem",
                        pb: ".6rem",
                        px: "1.5rem",
                    }}
                >
                    <Stack direction="row" spacing=".6rem" sx={{ mb: ".5rem", opacity: 0.7 }} alignItems="center">
                        <SvgAnnouncement size="1.1rem" sx={{ pb: ".35rem" }} />
                        <Typography sx={{ fontWeight: "fontWeightBold" }}>SYSTEM BAN</Typography>

                        <Typography
                            variant="caption"
                            sx={{
                                display: "inline",
                                ml: ".4rem",
                                color: "grey",
                                opacity: 0.5,
                                fontSize: fontSize ? `${1 * fontSize}rem !important` : "1rem !important",
                            }}
                        >
                            {dateFormatter(sentAt)}
                        </Typography>
                    </Stack>

                    <Box
                        sx={{
                            ".MuiTypography-root": {
                                display: "inline",
                                fontSize: fontSize ? `${1.3 * fontSize}rem` : "1.3rem",
                            },
                        }}
                    >
                        <Typography sx={{ strong: { color: colors.offWhite } }}>
                            <strong>REASON:</strong> {reason}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            ".MuiTypography-root": {
                                display: "inline",
                                fontSize: fontSize ? `${1.3 * fontSize}rem` : "1.3rem",
                            },
                        }}
                    >
                        <Typography sx={{ strong: { color: colors.offWhite } }}>
                            <strong>PLAYER:</strong>{" "}
                            <StyledImageText
                                text={
                                    <>
                                        {`${banned_user.username}`}
                                        <span style={{ marginLeft: ".2rem", opacity: 0.7 }}>{`#${banned_user.gid}`}</span>
                                    </>
                                }
                                color={factionColor || "#FFFFFF"}
                                imageUrl={factionLogoUrl}
                                imageMb={-0.2}
                                imageSize={1.4}
                            />
                        </Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ strong: { color: colors.offWhite } }}>
                            <strong>DURATION:</strong> {is_permanent_ban ? "PERMANENT" : ban_duration}
                        </Typography>
                    </Box>
                    <Typography sx={{ strong: { color: colors.offWhite } }}>
                        <strong>RESTRICTION{restrictions.length === 1 ? "" : "S"}:</strong>
                    </Typography>
                    <Box>
                        {restrictions.map((res, i) => (
                            <Typography key={res + i} sx={{ pl: 1.5 }}>
                                • {res}
                            </Typography>
                        ))}
                    </Box>
                </Stack>
            </Box>
        </Box>
    )
}
