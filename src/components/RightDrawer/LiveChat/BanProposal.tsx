import { Box, Divider, Grow, Stack, Typography } from "@mui/material"
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { FancyButton, TooltipHelper } from "../.."
import { SvgCooldown, SvgInfoCircular, SvgSupToken } from "../../../assets"
import { useChat, useGameServerAuth, useGameServerWebsocket } from "../../../containers"
import { getUserRankDeets, snakeToTitle, supFormatterNoFixed } from "../../../helpers"
import { useTimer, useToggle } from "../../../hooks"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { BanProposalStruct } from "../../../types/chat"

export const BanProposal = () => {
    const { banProposal } = useChat()
    const [render, toggleRender] = useToggle()
    const [outOfTime, toggleOutOfTime] = useToggle()

    // When new proposal comes in, reset the out of timer, and render it
    useEffect(() => {
        if (!banProposal) return
        toggleOutOfTime(banProposal.ended_at < new Date())
        toggleRender(banProposal.ended_at > new Date())
    }, [banProposal, toggleOutOfTime, toggleRender])

    useEffect(() => {
        if (!banProposal) toggleOutOfTime(true)
    }, [banProposal, toggleOutOfTime])

    // When out of time, give inner some time to animate, then stop render
    useEffect(() => {
        if (outOfTime) {
            const timeout = setTimeout(() => {
                toggleRender(false)
            }, 250)

            return () => clearTimeout(timeout)
        }
    }, [outOfTime, toggleRender])

    if (!banProposal || !render) return null

    return <BanProposalInner banProposal={banProposal} outOfTime={outOfTime} toggleOutOfTime={toggleOutOfTime} />
}

const BanProposalInner = ({
    banProposal,
    outOfTime,
    toggleOutOfTime,
}: {
    banProposal: BanProposalStruct
    outOfTime: boolean
    toggleOutOfTime: (value?: boolean | undefined) => void
}) => {
    const { state, send } = useGameServerWebsocket()
    const { userStat, userRank } = useGameServerAuth()
    const [submitted, setSubmitted] = useState(!!banProposal.decision)
    const [submittedVote, setSubmittedVote] = useState(banProposal.decision?.is_agreed)
    const [error, setError] = useState("")

    const rankDeets = useMemo(() => (userRank ? getUserRankDeets(userRank, "1rem", "1.2rem") : undefined), [userRank])

    const submitVote = useCallback(
        async (isAgree: boolean) => {
            if (state !== WebSocket.OPEN || !send) return
            try {
                const resp = await send<boolean, { punish_vote_id: string; is_agreed: boolean }>(GameServerKeys.SubmitBanVote, {
                    punish_vote_id: banProposal.id,
                    is_agreed: isAgree,
                })

                if (resp) {
                    setSubmitted(true)
                    setSubmittedVote(isAgree)
                    setError("")
                }
            } catch (e) {
                setError(typeof e === "string" ? e : "Failed to submit your vote.")
            }
        },
        [state, send, banProposal],
    )

    const submitInstantBan = useCallback(
        async (isAgree: boolean) => {
            if (state !== WebSocket.OPEN || !send) return
            try {
                const resp = await send<boolean, { punish_vote_id: string }>(GameServerKeys.SubmitInstantBan, {
                    punish_vote_id: banProposal.id,
                })

                if (resp) {
                    setSubmitted(true)
                    setSubmittedVote(isAgree)
                    setError("")
                }
            } catch (e) {
                setError(typeof e === "string" ? e : "Failed to submit your vote.")
            }
        },
        [banProposal.id, send, state],
    )

    const bottomSection = useMemo(() => {
        if (!userStat || (userStat.last_seven_days_kills < 5 && userStat.ability_kill_count < 100 && userRank !== "GENERAL")) {
            return (
                <Typography sx={{ opacity: 0.6 }}>
                    <i>You need at least 100 ability kills OR 5 ability kills in the past 7 days to be eligible to vote.</i>
                </Typography>
            )
        }

        if (submitted) {
            return (
                <Typography>
                    <i>
                        You {submittedVote ? <strong style={{ color: colors.green }}>agreed</strong> : <strong style={{ color: colors.red }}>disagreed</strong>}{" "}
                        with this proposal.
                    </i>
                </Typography>
            )
        }

        return (
            <>
                <Typography>Do you agree with this proposal?</Typography>

                <Stack direction="row" spacing=".6rem">
                    <FancyButton
                        excludeCaret
                        clipThingsProps={{
                            clipSize: "4px",
                            backgroundColor: colors.darkNavyBlue,
                            border: { borderColor: userRank !== "GENERAL" ? "#FFFFFF90" : "#FFFFFF", borderThickness: "2px" },
                            sx: { flex: 2.8, position: "relative" },
                        }}
                        sx={{ pt: ".2rem", pb: 0, minWidth: "5rem" }}
                        onClick={() => submitInstantBan(true)}
                        disabled={userRank !== "GENERAL"}
                    >
                        {rankDeets?.icon}
                        <Typography variant="body2" sx={{ ml: ".5rem", fontWeight: "fontWeightBold" }}>
                            INSTANT PUNISH
                        </Typography>

                        <SvgSupToken size="1.2rem" sx={{ ml: ".5rem" }} />
                        <Typography variant="body2" sx={{ fontWeight: "fontWeightBold" }}>
                            ({supFormatterNoFixed(banProposal.instant_pass_fee, 0)})
                        </Typography>
                    </FancyButton>

                    <FancyButton
                        excludeCaret
                        clipThingsProps={{
                            clipSize: "4px",
                            backgroundColor: colors.green,
                            border: { borderColor: colors.green, borderThickness: "2px" },
                            sx: { flex: 1, position: "relative" },
                        }}
                        sx={{ pt: ".2rem", pb: 0, minWidth: "5rem" }}
                        onClick={() => submitVote(true)}
                    >
                        <Typography variant="body2">YES</Typography>
                    </FancyButton>

                    <FancyButton
                        excludeCaret
                        clipThingsProps={{
                            clipSize: "4px",
                            backgroundColor: colors.red,
                            border: { borderColor: colors.red, borderThickness: "2px" },
                            sx: { flex: 1, position: "relative" },
                        }}
                        sx={{ pt: ".2rem", pb: 0, minWidth: "5rem" }}
                        onClick={() => submitVote(false)}
                    >
                        <Typography variant="body2">NO</Typography>
                    </FancyButton>
                </Stack>

                {error && (
                    <Typography variant="body2" sx={{ mt: ".3rem", color: colors.red }}>
                        {error}
                    </Typography>
                )}
            </>
        )
    }, [userStat, userRank, submitted, rankDeets?.icon, banProposal.instant_pass_fee, error, submittedVote, submitInstantBan, submitVote])

    return (
        <Grow in={!outOfTime} timeout={250}>
            <Box sx={{ m: ".5rem", border: `${colors.red} 2px solid` }}>
                <Stack
                    sx={{
                        px: "1rem",
                        py: ".2rem",
                        backgroundColor: colors.red,
                    }}
                    direction="row"
                    justifyContent="space-between"
                >
                    <Typography sx={{ fontWeight: "fontWeightBold" }}>PUNISHMENT PROPOSAL</Typography>
                    <Typography sx={{ fontWeight: "fontWeightBold", px: "1rem", backgroundColor: "#00000090" }}>
                        <Countdown endTime={banProposal.ended_at} toggleOutOfTime={toggleOutOfTime} />s
                    </Typography>
                </Stack>

                <Box sx={{ px: "1.2rem", py: ".9rem" }}>
                    <Stack spacing=".3rem">
                        <LineItem title="INITIATOR" color={colors.green}>
                            <Typography sx={{ lineHeight: 1 }}>
                                {`${banProposal.issued_by_username}`}
                                <span style={{ marginLeft: ".2rem", opacity: 0.7 }}>{`#${banProposal.issued_by_gid}`}</span>
                            </Typography>
                        </LineItem>

                        <LineItem title="AGAINST">
                            <Typography sx={{ lineHeight: 1 }}>
                                {`${banProposal.reported_player_username}`}
                                <span style={{ marginLeft: ".2rem", opacity: 0.7 }}>{`#${banProposal.reported_player_gid}`}</span>
                            </Typography>
                        </LineItem>

                        <LineItem title="PUNISH">
                            <Typography sx={{ lineHeight: 1 }}>{snakeToTitle(banProposal.punish_option.key)}</Typography>
                            <TooltipHelper placement="bottom" text={banProposal.punish_option.description}>
                                <Box>
                                    <SvgInfoCircular size="1.1rem" sx={{ pt: 0, pb: 0, opacity: 0.4, ":hover": { opacity: 1 } }} />
                                </Box>
                            </TooltipHelper>
                        </LineItem>

                        <LineItem title="DURATION">
                            <Stack spacing=".24rem" direction="row" alignItems="center" justifyContent="center">
                                <SvgCooldown component="span" size="1.4rem" sx={{ pb: ".25rem" }} />
                                <Typography sx={{ lineHeight: 1 }}>{banProposal.punish_option.punish_duration_hours} Hrs</Typography>
                            </Stack>
                        </LineItem>

                        <LineItem title="REASON">
                            <Typography sx={{ lineHeight: 1 }}>{banProposal.reason}</Typography>
                        </LineItem>
                    </Stack>

                    <Divider sx={{ mt: "1.1rem", mb: ".7rem" }} />

                    <Stack spacing=".4rem">{bottomSection}</Stack>
                </Box>
            </Box>
        </Grow>
    )
}

export const LineItem = ({ title, children, color }: { title: string; children: ReactNode; color?: string }) => {
    return (
        <Stack direction="row" spacing=".7rem" alignItems="start">
            <Typography
                sx={{
                    py: ".2rem",
                    flexShrink: 0,
                    width: "7rem",
                    textAlign: "center",
                    lineHeight: 1,
                    backgroundColor: `${color || colors.red}70`,
                }}
            >
                {title}
            </Typography>
            <Stack direction="row" spacing=".7rem" alignItems="center" sx={{ mt: ".2rem !important", alignSelf: "stretch" }}>
                {children}
            </Stack>
        </Stack>
    )
}

const Countdown = ({ endTime, toggleOutOfTime }: { endTime: Date; toggleOutOfTime: (value?: boolean | undefined) => void }) => {
    const { totalSecRemain } = useTimer(endTime)

    useEffect(() => {
        if (totalSecRemain <= 0) toggleOutOfTime(true)
    }, [toggleOutOfTime, totalSecRemain])

    return <>{totalSecRemain}</>
}
