import { Box, Stack } from "@mui/material"
import { QuickDeploy } from "./QuickDeploy/QuickDeploy"
import { QuickPlayerAbilities } from "./QuickPlayerAbilities/QuickPlayerAbilities"
import { VotingSystem } from "./VotingSystem/VotingSystem"

export const BattleArena = () => {
    return (
        <Box sx={{ height: "100%", pl: "1.9rem", pr: ".8rem", py: "1.8rem", backgroundColor: (theme) => theme.factionTheme.background }}>
            <Box
                sx={{
                    height: "100%",
                    overflowY: "auto",
                    overflowX: "hidden",
                    pr: "1.4rem",
                    direction: "ltr",
                    scrollbarWidth: "none",
                    "::-webkit-scrollbar": {
                        width: ".4rem",
                    },
                    "::-webkit-scrollbar-track": {
                        background: "#FFFFFF15",
                        borderRadius: 3,
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: (theme) => theme.factionTheme.primary,
                        borderRadius: 3,
                    },
                }}
            >
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Stack spacing="2rem">
                        <VotingSystem />
                        <QuickPlayerAbilities />
                        <QuickDeploy />
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}
