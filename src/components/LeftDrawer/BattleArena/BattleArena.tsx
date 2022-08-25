import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useSupremacy, useUI } from "../../../containers"
import { fonts } from "../../../theme/theme"
import { BattleAbility } from "./BattleAbility/BattleAbility"
import { PlayerAbilities } from "./PlayerAbilities/PlayerAbilities"
import { QuickPlayerAbilities } from "./QuickPlayerAbilities/QuickPlayerAbilities"

export const BattleArena = () => {
    const { setSmallDisplayRef } = useUI()
    const { battleIdentifier } = useSupremacy()

    const content = useMemo(() => {
        return (
            <>
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
                        py: "1rem",
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
            </>
        )
    }, [setSmallDisplayRef])

    return useMemo(() => {
        return (
            <Stack spacing="1rem" sx={{ position: "relative", height: "100%", backgroundColor: (theme) => theme.factionTheme.background }}>
                {content}

                {battleIdentifier && (
                    <Box sx={{ pb: ".4rem", pl: "1rem" }}>
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>BATTLE ID #{battleIdentifier.toString().padStart(4, "0")}</Typography>
                    </Box>
                )}
            </Stack>
        )
    }, [battleIdentifier, content])
}
