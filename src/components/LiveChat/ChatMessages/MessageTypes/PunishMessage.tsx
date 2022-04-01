import { Box, Stack, Typography } from "@mui/material"
import { LineItem, TooltipHelper } from "../../.."
import { SvgAnnouncement, SvgCooldown, SvgInfoCircular } from "../../../../assets"
import { dateFormatter, snakeToTitle } from "../../../../helpers"
import { colors } from "../../../../theme/theme"
import { PunishMessageData } from "../../../../types/chat"

export const PunishMessage = ({ data, sentAt, fontSize }: { data?: PunishMessageData; sentAt: Date; fontSize: number }) => {
    if (!data) return null

    const {
        issued_by_player_username,
        reported_player_username,
        is_passed,
        agreed_player_number,
        disagreed_player_number,
        punish_option,
        punish_reason,
        total_player_number,
    } = data

    return (
        <Box>
            <Stack
                sx={{
                    mb: ".5rem",
                    pt: ".8rem",
                    pb: "1rem",
                    borderTop: `${colors.grey}20 2px solid`,
                    borderBottom: `${colors.grey}20 2px solid`,
                }}
            >
                <Stack direction="row" spacing=".5rem" sx={{ mb: ".5rem", opacity: 0.7 }} alignItems="center">
                    <SvgAnnouncement size="1.1rem" sx={{ pb: ".25rem" }} />
                    <Typography sx={{ fontWeight: "fontWeightBold" }}>SYSTEM ANNOUCEMENT</Typography>

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
                        ".MuiTypography-root": {
                            display: "inline",
                            lineHeight: 1,
                            fontSize: fontSize ? `${1.35 * fontSize}rem` : "1.35rem",
                        },
                    }}
                >
                    <LineItem title="FROM" color={colors.green}>
                        <Typography>{issued_by_player_username}</Typography>
                    </LineItem>

                    <LineItem title="AGAINST">
                        <Typography>{reported_player_username}</Typography>
                    </LineItem>

                    <LineItem title="PUNISH">
                        <Typography>{snakeToTitle(punish_option.key)}</Typography>
                        <TooltipHelper placement="right-start" text={punish_option.description}>
                            <Box>
                                <SvgInfoCircular size="1.1rem" sx={{ pt: 0, pb: 0, opacity: 0.4, ":hover": { opacity: 1 } }} />
                            </Box>
                        </TooltipHelper>
                    </LineItem>

                    <LineItem title="DURATION">
                        <Stack spacing=".24rem" direction="row" alignItems="center" justifyContent="center">
                            <SvgCooldown component="span" size="1.4rem" sx={{ pb: ".25rem" }} />
                            <Typography>{punish_option.punish_duration_hours} Hrs</Typography>
                        </Stack>
                    </LineItem>

                    <LineItem title="REASON">
                        <Typography>{punish_reason}</Typography>
                    </LineItem>

                    <LineItem title="VOTES" color={colors.neonBlue}>
                        <Box>
                            <Typography sx={{ color: colors.green }}>
                                {agreed_player_number}/{total_player_number} AGREED
                            </Typography>
                            <Typography>&nbsp;</Typography>
                            <Typography sx={{ color: colors.red }}>
                                {disagreed_player_number}/{total_player_number} DISAGREED
                            </Typography>
                        </Box>
                    </LineItem>

                    <LineItem title="RESULT" color={colors.neonBlue}>
                        <Typography sx={{ fontWeight: "fontWeightBold" }}>{is_passed ? "PUNISHED" : "NOT PUNISHED"}</Typography>
                    </LineItem>
                </Stack>
            </Stack>
        </Box>
    )
}
