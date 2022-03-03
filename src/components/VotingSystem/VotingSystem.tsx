import { Box, Slide, Stack } from "@mui/material"
import { Theme } from "@mui/material/styles"
import { useTheme } from "@mui/styles"
import { ClipThing, BattleAbilityItem, Prices, FactionAbilities } from ".."
import { useDimension, useGame, VotingStateResponse } from "../../containers"
import { useAuth } from "../../containers"

export const VotingSystem = () => {
    const { votingState } = useGame()
    return <VotingSystemInner votingState={votingState} />
}

interface VotingSystemProps {
    votingState?: VotingStateResponse
}

const VotingSystemInner = ({ votingState }: VotingSystemProps) => {
    const { user } = useAuth()
    const theme = useTheme<Theme>()
    const {
        streamDimensions: { height },
    } = useDimension()

    const isBattleStarted = votingState && votingState.phase !== "HOLD" && votingState.phase !== "WAIT_MECH_INTRO"

    if (!user || !user.faction) return null

    return (
        <Stack
            sx={{
                position: "absolute",
                top: 10,
                left: 10,
                zIndex: 14,
                overflow: "hidden",
                filter: "drop-shadow(0 3px 3px #00000050)",
                minWidth: 390,
            }}
        >
            <Slide in={isBattleStarted} direction="right">
                <Box>
                    <ClipThing border={{ isFancy: true, borderThickness: "3px" }} clipSize="10px">
                        <Box sx={{ backgroundColor: theme.factionTheme.background, pl: 0.9, pr: 2, pt: 1.8, pb: 2 }}>
                            <Box sx={{ ml: 1, mb: 1 }}>
                                <Prices />
                            </Box>

                            <Box
                                sx={{
                                    flex: 1,
                                    // 100vh, 160px gap bottom, 10px gap above, 56px for the title
                                    maxHeight: `calc(${height}px - 160px - 10px - 56px)`,
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    pl: 1.1,
                                    py: 0.2,
                                    direction: "rtl",
                                    scrollbarWidth: "none",
                                    "::-webkit-scrollbar": {
                                        width: 4,
                                    },
                                    "::-webkit-scrollbar-track": {
                                        background: "#FFFFFF15",
                                        borderRadius: 3,
                                    },
                                    "::-webkit-scrollbar-thumb": {
                                        background: theme.factionTheme.primary,
                                        borderRadius: 3,
                                    },
                                }}
                            >
                                <Stack spacing={2.5} sx={{ direction: "ltr" }}>
                                    <BattleAbilityItem />
                                    <FactionAbilities />
                                </Stack>
                            </Box>
                        </Box>
                    </ClipThing>
                </Box>
            </Slide>
        </Stack>
    )
}
