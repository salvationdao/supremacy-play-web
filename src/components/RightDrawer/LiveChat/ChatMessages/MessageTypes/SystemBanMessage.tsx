import { Box, Stack, Typography } from "@mui/material"
import { SvgAnnouncement, SvgCooldown } from "../../../../../assets"
import { dateFormatter } from "../../../../../helpers"
import { colors } from "../../../../../theme/theme"
import { SystemBanMessageData } from "../../../../../types"
import { Player } from "../../../../Common/Player"
import { LineItem } from "../../BanProposal/BanProposal"

export const SystemBanMessage = ({ data, sentAt, fontSize }: { data?: SystemBanMessageData; sentAt: Date; fontSize: number }) => {
    if (!data) return null

    const { banned_user, ban_duration, is_permanent_ban, reason, restrictions } = data

    return (
        <Box>
            <Box sx={{ mx: "-0.6rem", mb: ".5rem", backgroundColor: "#00000040" }}>
                <Stack
                    spacing={".4rem"}
                    sx={{
                        pt: "1rem",
                        pb: ".6rem",
                        px: "1.5rem",
                    }}
                >
                    <Stack direction="row" spacing=".8rem" sx={{ opacity: 0.7 }} alignItems="center">
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

                    <Stack
                        spacing=".3rem"
                        sx={{
                            backgroundColor: "#00000020",
                            ".MuiTypography-root": {
                                display: "inline",
                                lineHeight: 1,
                                fontSize: fontSize ? `${1.35 * fontSize}rem` : "1.35rem",
                            },
                        }}
                    >
                        <LineItem title="REASON" color={colors.green}>
                            <Typography>{reason}</Typography>
                        </LineItem>

                        <LineItem title="AGAINST">
                            <Player player={banned_user} />
                        </LineItem>

                        <LineItem title="RESTRICTED">
                            <Box>
                                {restrictions.map((res, i) => (
                                    <Typography key={res + i} sx={{ display: "block !important" }}>
                                        • {res}
                                    </Typography>
                                ))}
                            </Box>
                        </LineItem>

                        <LineItem title="DURATION">
                            <Stack spacing=".24rem" direction="row" alignItems="center" justifyContent="center">
                                <SvgCooldown component="span" size="1.4rem" sx={{ pb: ".25rem" }} />
                                <Typography>{is_permanent_ban ? "PERMANENT" : ban_duration}</Typography>
                            </Stack>
                        </LineItem>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    )
}
