import { Box, Divider, Grow, Stack, Typography } from "@mui/material"
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { FancyButton, TooltipHelper } from ".."
import { SvgCooldown, SvgInfoCircular } from "../../assets"
import { useChat, useGameServerAuth, useGameServerWebsocket } from "../../containers"
import { snakeToTitle } from "../../helpers"
import { useTimer, useToggle } from "../../hooks"
import { GameServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { BanProposalStruct } from "../../types"

const LineItem = ({ title, children, color }: { title: string; children: ReactNode; color?: string }) => {
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
            <Stack direction="row" spacing=".7rem" alignItems="center" sx={{ mt: ".2rem !important" }}>
                {children}
            </Stack>
        </Stack>
    )
}

const Countdown = ({
    endTime,
    toggleOutOfTime,
}: {
    endTime: Date
    toggleOutOfTime: (value?: boolean | undefined) => void
}) => {
    const { totalSecRemain } = useTimer(endTime)

    useEffect(() => {
        if (totalSecRemain <= 0) toggleOutOfTime(true)
    }, [totalSecRemain])

    return <>{totalSecRemain}</>
}

export const BanProposal = () => {
    const { banProposal } = useChat()
    const [render, toggleRender] = useToggle()
    const [outOfTime, toggleOutOfTime] = useToggle()

    // When new proposal comes in, reset the out of timer, and render it
    useEffect(() => {
        if (!banProposal) return
        toggleOutOfTime(banProposal.ended_at < new Date())
        toggleRender(banProposal.ended_at > new Date())
    }, [banProposal])

    // When out of time, give inner some time to animate, then stop render
    useEffect(() => {
        if (outOfTime) {
            setTimeout(() => {
                toggleRender(false)
            }, 250)
        }
    }, [outOfTime])

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
    const { userStat } = useGameServerAuth()
    const [submitted, setSubmitted] = useState(false)
    const [submittedVote, setSubmittedVote] = useState(false)
    const [error, setError] = useState("")

    const submitVote = useCallback(
        async (isAgree: boolean) => {
            if (state !== WebSocket.OPEN || !send) return
            try {
                const resp = await send<boolean, { punish_vote_id: string; is_agreed: boolean }>(
                    GameServerKeys.SubmitBanVote,
                    {
                        punish_vote_id: banProposal.id,
                        is_agreed: isAgree,
                    },
                )

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

    const bottomSection = useMemo(() => {
        if (!userStat || userStat.kill_count <= 0) {
            return (
                <Typography sx={{ opacity: 0.6 }}>
                    <i>You need ability kills to be eligible to vote.</i>
                </Typography>
            )
        }

        if (submitted) {
            return (
                <Typography>
                    <i>
                        You{" "}
                        {submittedVote ? (
                            <strong style={{ color: colors.green }}>agreed</strong>
                        ) : (
                            <strong style={{ color: colors.red }}>disagreed</strong>
                        )}{" "}
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
                        clipSize="4px"
                        sx={{ pt: ".3rem", pb: 0, minWidth: "5rem" }}
                        clipSx={{ flex: 1, position: "relative" }}
                        backgroundColor={colors.red}
                        borderColor={colors.red}
                        onClick={() => submitVote(true)}
                    >
                        <Typography variant="body2">NO</Typography>
                    </FancyButton>

                    <FancyButton
                        excludeCaret
                        clipSize="4px"
                        sx={{ pt: ".3rem", pb: 0, minWidth: "5rem" }}
                        clipSx={{ flex: 1, position: "relative" }}
                        backgroundColor={colors.green}
                        borderColor={colors.green}
                        onClick={() => submitVote(false)}
                    >
                        <Typography variant="body2">YES</Typography>
                    </FancyButton>
                </Stack>

                {error && (
                    <Typography variant="body2" sx={{ mt: ".3rem", color: colors.red }}>
                        {error}
                    </Typography>
                )}
            </>
        )
    }, [submitted, submittedVote, submitVote, error, userStat])

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
                        <LineItem title="FROM" color={colors.green}>
                            <Typography sx={{ lineHeight: 1 }}>{banProposal.issued_by_username}</Typography>
                        </LineItem>

                        <LineItem title="AGAINST">
                            <Typography sx={{ lineHeight: 1 }}>{banProposal.reported_player_username}</Typography>
                        </LineItem>

                        <LineItem title="PUNISH">
                            <Typography sx={{ lineHeight: 1 }}>
                                {snakeToTitle(banProposal.punish_option.key)}
                            </Typography>
                            <TooltipHelper placement="right-start" text={banProposal.punish_option.description}>
                                <Box>
                                    <SvgInfoCircular
                                        size="1.1rem"
                                        sx={{ pt: ".1rem", pb: 0, opacity: 0.4, ":hover": { opacity: 1 } }}
                                    />
                                </Box>
                            </TooltipHelper>
                        </LineItem>

                        <LineItem title="DURATION">
                            <Stack spacing=".24rem" direction="row" alignItems="center" justifyContent="center">
                                <SvgCooldown component="span" size="1.4rem" sx={{ pb: ".25rem" }} />
                                <Typography sx={{ lineHeight: 1 }}>
                                    {banProposal.punish_option.punish_duration_hours} Hrs
                                </Typography>
                            </Stack>
                        </LineItem>
                    </Stack>

                    <Divider sx={{ mt: "1.1rem", mb: ".7rem" }} />

                    <Stack spacing=".4rem">{bottomSection}</Stack>
                </Box>
            </Box>
        </Grow>
    )
}
