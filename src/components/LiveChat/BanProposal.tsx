import { Box, Divider, Slide, Stack, Typography } from "@mui/material"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { FancyButton, TooltipHelper } from ".."
import { SvgCooldown, SvgInfoCircular } from "../../assets"
import { useChat, useGameServerWebsocket } from "../../containers"
import { snakeToTitle } from "../../helpers"
import { GameServerKeys } from "../../keys"
import { colors } from "../../theme/theme"

const LineItem = ({ title, children, color }: { title: string; children: ReactNode; color?: string }) => {
    return (
        <Stack direction="row" spacing=".7rem" alignItems="center">
            <Typography
                sx={{
                    width: "7rem",
                    textAlign: "center",
                    backgroundColor: `${color || colors.red}70`,
                }}
            >
                {title}
            </Typography>
            {children}
        </Stack>
    )
}

export const BanProposal = () => {
    // const { banProposal } = useChat()
    const { state, send } = useGameServerWebsocket()
    const [outOfTime, setOutOfTime] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState("")

    const banProposal = {
        id: "123",
        punish_option_id: "456",
        reason: "string",
        faction_id: "789",
        issued_by_id: "123456",
        issued_by_username: "jayli3n",
        reported_player_id: "456789",
        reported_player_username: "darren_hung",
        status: "PENDING",
        started_at: new Date(),
        ended_at: new Date(new Date().getTime() + 30000),
        punishOption: {
            id: "456",
            description: "Limits the user from using map target select for 24 hours.",
            key: "limit_location_select",
            punish_duration_hours: 24,
        },
    }

    // Clean up when out of time
    useEffect(() => {
        if (outOfTime) {
            setSubmitted(false)
            setError("")
        }
    }, [outOfTime])

    useEffect(() => {
        setOutOfTime(false)
    }, [banProposal])

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
                    setError("")
                }
            } catch (e) {
                setError(typeof e === "string" ? e : "Failed to submit your vote.")
            }
        },
        [state, send, banProposal],
    )

    if (!banProposal) return null

    return (
        <Slide in={true} direction="down">
            <Box sx={{ m: ".5rem", border: `${colors.red} 2px solid` }}>
                <Typography
                    sx={{
                        px: "1rem",
                        py: ".2rem",
                        textAlign: "center",
                        backgroundColor: colors.red,
                    }}
                >
                    PUNISHMENT PROPOSAL
                </Typography>

                <Box sx={{ px: "1.2rem", py: ".9rem" }}>
                    <Stack spacing=".3rem">
                        <LineItem title="FROM" color={colors.green}>
                            <Typography>{banProposal.issued_by_username}</Typography>
                        </LineItem>

                        <LineItem title="AGAINST">
                            <Typography>{banProposal.reported_player_username}</Typography>
                        </LineItem>

                        <LineItem title="PUNISH">
                            <Typography>{snakeToTitle(banProposal.punishOption.key)}</Typography>
                            <TooltipHelper placement="right-start" text={banProposal.punishOption.description}>
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
                                <Typography>{banProposal.punishOption.punish_duration_hours} Hrs</Typography>
                            </Stack>
                        </LineItem>
                    </Stack>

                    <Divider sx={{ mt: "1.2rem", mb: ".7rem" }} />

                    <Stack spacing=".4rem">
                        <Typography>Do you agree with this proposal?</Typography>

                        <Stack direction="row" spacing=".6rem">
                            <FancyButton
                                excludeCaret
                                clipSize="4px"
                                sx={{ pt: ".4rem", pb: ".1rem", minWidth: "5rem" }}
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
                                sx={{ pt: ".4rem", pb: ".1rem", minWidth: "5rem" }}
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
                    </Stack>
                </Box>
            </Box>
        </Slide>
    )
}
