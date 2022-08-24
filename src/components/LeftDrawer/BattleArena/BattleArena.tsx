import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { useUI } from "../../../containers"
import { BattleAbility } from "./BattleAbility/BattleAbility"
import { PlayerAbilities } from "./PlayerAbilities/PlayerAbilities"
import { QuickPlayerAbilities } from "./QuickPlayerAbilities/QuickPlayerAbilities"

export const BattleArena = () => {
    const { setSmallDisplayRef } = useUI()

    return useMemo(() => {
        return (
            <Stack sx={{ position: "relative", height: "100%", backgroundColor: (theme) => theme.factionTheme.background }}>
                {/* The minimap or the stream will mount here */}
                <Box ref={setSmallDisplayRef} sx={{ flexShrink: 0 }} />

                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        my: "1rem",
                        mr: ".8rem",
                        pr: ".8rem",
                        pl: "1.6rem",
                        py: "1.4rem",
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
            </Stack>
        )
    }, [setSmallDisplayRef])
}
