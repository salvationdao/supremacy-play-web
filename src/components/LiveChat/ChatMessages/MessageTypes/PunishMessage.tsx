import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { LineItem, StyledImageText, TooltipHelper } from "../../.."
import { SvgAnnouncement, SvgCooldown, SvgFastRepair, SvgInfoCircular } from "../../../../assets"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../../constants"
import { FactionsAll } from "../../../../containers"
import { dateFormatter, snakeToTitle } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { colors } from "../../../../theme/theme"
import { PunishMessageData } from "../../../../types/chat"

export const PunishMessage = ({
    data,
    sentAt,
    fontSize,
    factionsAll,
}: {
    data?: PunishMessageData
    sentAt: Date
    fontSize: number
    factionsAll: FactionsAll
}) => {
    const [isExpanded, toggleIsExpanded] = useToggle()
    const factionColor = useMemo(
        () => (data?.issued_by_user.faction_id ? factionsAll[data?.issued_by_user.faction_id]?.theme.primary : "#FFFFFF"),
        [data?.issued_by_user.faction_id, factionsAll],
    )

    if (!data) return null

    const { issued_by_user, reported_user, is_passed, agreed_player_number, disagreed_player_number, punish_option, punish_reason, total_player_number } = data

    return (
        <Box>
            <Box sx={{ ml: "-.4rem", mb: ".5rem", backgroundColor: "#00000030" }}>
                <Stack
                    sx={{
                        pt: "1rem",
                        pb: ".6rem",
                        px: "1.5rem",
                    }}
                >
                    <Stack direction="row" spacing=".6rem" sx={{ mb: ".5rem", opacity: 0.7 }} alignItems="center">
                        <SvgAnnouncement size="1.1rem" sx={{ pb: ".35rem" }} />
                        <Typography sx={{ fontWeight: "fontWeightBold" }}>SYSTEM</Typography>

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
                        <StyledImageText
                            text={`${reported_user.username}#${reported_user.gid}`}
                            color={factionColor || "#FFFFFF"}
                            imageUrl={
                                factionsAll[issued_by_user.faction_id]
                                    ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[issued_by_user.faction_id].logo_blob_id}`
                                    : undefined
                            }
                            imageMb={-0.2}
                            imageSize={1.4}
                        />
                        <Typography>&nbsp;{is_passed ? "was" : "was not"} punished with&nbsp;</Typography>

                        <TooltipHelper placement="left" text={punish_option.description}>
                            <Typography sx={{ color: colors.lightNeonBlue, ":hover": { opacity: 0.8 } }}>{snakeToTitle(punish_option.key, true)}</Typography>
                        </TooltipHelper>

                        {is_passed && (
                            <>
                                <Typography>&nbsp;for&nbsp;</Typography>
                                <Typography sx={{ color: colors.lightNeonBlue }}>{punish_option.punish_duration_hours}</Typography>
                                <Typography>&nbsp;hours</Typography>
                            </>
                        )}

                        <Typography>.</Typography>
                    </Box>
                </Stack>

                <Box
                    onClick={() => toggleIsExpanded()}
                    sx={{
                        p: 0,
                        py: ".2rem",
                        width: "100%",
                        cursor: "pointer",
                        backgroundColor: "#00000020",
                        borderRadius: 0,
                        opacity: isExpanded ? 1 : 0.3,
                        ":hover": { opacity: 1 },
                    }}
                >
                    <SvgFastRepair size=".8rem" sx={{ transform: `scaleY(${isExpanded ? 1 : -1})` }} />
                </Box>

                {isExpanded && (
                    <Stack
                        spacing=".3rem"
                        sx={{
                            py: "1rem",
                            px: "1.5rem",
                            backgroundColor: "#00000020",
                            ".MuiTypography-root": {
                                display: "inline",
                                lineHeight: 1,
                                fontSize: fontSize ? `${1.35 * fontSize}rem` : "1.35rem",
                            },
                        }}
                    >
                        <LineItem title="INITIATOR" color={colors.green}>
                            <Typography>{`${issued_by_user.username}#${issued_by_user.gid}`}</Typography>
                        </LineItem>

                        <LineItem title="AGAINST">
                            <Typography>{`${reported_user.username}#${reported_user.gid}`}</Typography>
                        </LineItem>

                        <LineItem title="PUNISH">
                            <Typography>{snakeToTitle(punish_option.key)}</Typography>
                            <TooltipHelper placement="bottom" text={punish_option.description}>
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

                        <LineItem title="VOTES">
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
                    </Stack>
                )}
            </Box>
        </Box>
    )
}
