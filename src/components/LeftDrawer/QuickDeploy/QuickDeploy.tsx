import { Stack, Typography } from "@mui/material"
import { useAuth } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"
import { ChallengeFundsRemain } from "./ChallengeFundsRemain"

export interface PlayerQueueStatus {
    total_queued: number
    queue_limit: number
}

export const QuickDeploy = () => {
    const { userID } = useAuth()
    if (!userID) return null
    return <QuickDeployInner />
}

const QuickDeployInner = () => {
    const theme = useTheme()
    return (
        <>
            <Stack sx={{ position: "relative", height: "100%", backgroundColor: theme.factionTheme.background }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                        flexShrink: 0,
                        px: "2.2rem",
                        height: "5rem",
                        background: `linear-gradient(${theme.factionTheme.primary} 26%, ${theme.factionTheme.primary}95)`,
                        boxShadow: 1.5,
                    }}
                >
                    <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, color: theme.factionTheme.secondary }}>
                        QUICK DEPLOY
                    </Typography>
                </Stack>

                <Stack sx={{ flex: 1 }}>
                    <ChallengeFundsRemain />
                </Stack>
            </Stack>
        </>
    )
}
