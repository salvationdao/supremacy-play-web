import { Box, Stack } from "@mui/material"
import { BattleAbility } from "./BattleAbility/BattleAbility"
import { PlayerAbilities } from "./PlayerAbilities/PlayerAbilities"
import { QuickPlayerAbilities } from "./QuickPlayerAbilities/QuickPlayerAbilities"

export const BattleArena = () => {
    return (
        <Box sx={{ position: "relative", height: "100%", pl: "1.6rem", pr: ".8rem", py: "1.4rem", backgroundColor: (theme) => theme.factionTheme.background }}>
            <Box
                sx={{
                    height: "100%",
                    overflowY: "auto",
                    overflowX: "hidden",
                    pr: ".8rem",
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
                        <BattleAbility />
                        <PlayerAbilities />
                        <QuickPlayerAbilities />
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}
