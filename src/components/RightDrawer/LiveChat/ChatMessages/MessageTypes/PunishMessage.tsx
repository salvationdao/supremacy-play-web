import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { LineItem, NiceTooltip } from "../../../.."
import { SvgAnnouncement, SvgCooldown, SvgFastRepair, SvgInfoCircular } from "../../../../../assets"
import { dateFormatter, getUserRankDeets, snakeToTitle } from "../../../../../helpers"
import { useToggle } from "../../../../../hooks"
import { colors } from "../../../../../theme/theme"
import { PunishMessageData } from "../../../../../types/chat"
import { PlayerNameGid } from "../../../../Common/PlayerNameGid"

export const PunishMessage = ({ data, sentAt, fontSize }: { data?: PunishMessageData; sentAt: Date; fontSize: number }) => {
    const [isExpanded, toggleIsExpanded] = useToggle()

    const votedByRender = useMemo(() => {
        if (!data) return null

        const { agreed_player_number, total_player_number } = data

        return (
            <Box>
                <Typography sx={{ color: agreed_player_number > total_player_number / 2 ? colors.green : colors.red }}>
                    {agreed_player_number}/{total_player_number} AGREED
                </Typography>
            </Box>
        )
    }, [data])

    const commanderVoteRender = useMemo(() => {
        if (!data) return null

        const { instant_pass_by_users } = data
        if (!instant_pass_by_users || instant_pass_by_users.length == 0) return null

        return (
            <Box>
                <Stack direction="column">
                    {instant_pass_by_users.map((ipu, i) => {
                        const rankDeets = getUserRankDeets(ipu.rank, "1rem", "1.3rem")
                        return (
                            <Stack direction="row" key={i} sx={{ pb: ".2rem" }}>
                                {rankDeets?.icon}
                                <Typography sx={{ ml: ".2rem" }}>
                                    {`${ipu.username}`}
                                    <span style={{ marginLeft: ".2rem", opacity: 0.7 }}>{`#${ipu.gid}`}</span>
                                </Typography>
                            </Stack>
                        )
                    })}
                </Stack>
            </Box>
        )
    }, [data])

    if (!data) return null

    const { issued_by_user, reported_user, is_passed, punish_option, punish_reason, instant_pass_by_users, agreed_player_number, total_player_number } = data

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
                    <Stack direction="row" spacing=".8rem" sx={{ mb: ".5rem", opacity: 0.7 }} alignItems="center">
                        <SvgAnnouncement size="1.1rem" sx={{ pb: ".35rem" }} />
                        <Typography sx={{ fontWeight: "bold" }}>PLAYER BAN</Typography>

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
                        <PlayerNameGid player={reported_user} />
                        <Typography>&nbsp;{is_passed ? "was" : "was not"} punished with&nbsp;</Typography>

                        <NiceTooltip placement="left" text={punish_option.description}>
                            <Typography sx={{ color: colors.lightNeonBlue, ":hover": { opacity: 0.8 } }}>{snakeToTitle(punish_option.key, true)}</Typography>
                        </NiceTooltip>

                        {is_passed && (
                            <>
                                <Typography>&nbsp;for&nbsp;</Typography>
                                <Typography sx={{ color: colors.lightNeonBlue }}>{punish_option.punish_duration_hours}</Typography>
                                <Typography>&nbsp;mins</Typography>
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
                            <PlayerNameGid player={issued_by_user} />
                        </LineItem>

                        <LineItem title="AGAINST">
                            <PlayerNameGid player={reported_user} />
                        </LineItem>

                        <LineItem title="PUNISH">
                            <Typography>{snakeToTitle(punish_option.key)}</Typography>
                            <NiceTooltip placement="bottom" text={punish_option.description}>
                                <Box>
                                    <SvgInfoCircular size="1.1rem" sx={{ pt: 0, pb: 0, opacity: 0.4, ":hover": { opacity: 1 } }} />
                                </Box>
                            </NiceTooltip>
                        </LineItem>

                        <LineItem title="DURATION">
                            <Stack spacing=".24rem" direction="row" alignItems="center" justifyContent="center">
                                <SvgCooldown component="span" size="1.4rem" sx={{ pb: ".25rem" }} />
                                <Typography>{punish_option.punish_duration_hours} mins</Typography>
                            </Stack>
                        </LineItem>

                        <LineItem title="REASON">
                            <Typography>{punish_reason}</Typography>
                        </LineItem>

                        <LineItem title="VOTES" color={agreed_player_number > total_player_number / 2 ? colors.green : colors.red}>
                            {votedByRender}
                        </LineItem>

                        {instant_pass_by_users && instant_pass_by_users.length > 0 && (
                            <LineItem title={"COMMAND OVERRIDE"} color={instant_pass_by_users.length >= 5 ? colors.green : colors.red}>
                                {commanderVoteRender}
                            </LineItem>
                        )}

                        <LineItem title="RESULT" color={is_passed ? colors.green : colors.red}>
                            <Typography sx={{ color: is_passed ? colors.green : colors.red }}>{is_passed ? "PUNISHED" : "NOT PUNISHED"}</Typography>
                        </LineItem>
                    </Stack>
                )}
            </Box>
        </Box>
    )
}
