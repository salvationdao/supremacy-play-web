import { Box, Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { useAuth, useSupremacy, useUI } from "../../../containers"
import { fonts } from "../../../theme/theme"
import { BattleAbility } from "./BattleAbility/BattleAbility"
import { PlayerAbilities } from "./PlayerAbilities/PlayerAbilities"
import { QuickPlayerAbilities } from "./QuickPlayerAbilities/QuickPlayerAbilities"
import { UnauthPrompt } from "./Common/UnauthPrompt"
import { ArenaSelector } from "./ArenaSelector/ArenaSelector"
import { AIMatchBanner } from "./AIMatchBanner"

export const BattleArena = () => {
    const { setSmallDisplayRef } = useUI()
    const { battleIdentifier } = useSupremacy()
    const { userID } = useAuth()

    const content = useMemo(() => {
        return (
            <>
                <ArenaSelector />

                {/* The minimap or the stream will mount here */}
                <Box ref={setSmallDisplayRef} sx={{ flexShrink: 0, mt: "1rem" }} />
                <AIMatchBanner />

                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        my: ".5rem",
                        mr: ".5rem",
                        pr: ".5rem",
                        pl: "1rem",
                        direction: "ltr",
                        scrollbarWidth: "none",
                        "::-webkit-scrollbar": {
                            width: "1rem",
                        },
                        "::-webkit-scrollbar-track": {
                            background: "#FFFFFF15",
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: (theme) => theme.factionTheme.primary,
                        },
                    }}
                >
                    <Box sx={{ direction: "ltr", height: 0 }}>
                        <Stack>
                            {!userID && <UnauthPrompt />}
                            <BattleAbility />
                            <PlayerAbilities />
                            <QuickPlayerAbilities />
                        </Stack>
                    </Box>
                </Box>
            </>
        )
    }, [setSmallDisplayRef, userID])

    return useMemo(() => {
        return (
            <Stack sx={{ position: "relative", height: "100%", backgroundColor: (theme) => theme.factionTheme.background }}>
                {content}

                {battleIdentifier && (
                    <Box sx={{ p: ".4rem 1rem", borderTop: (theme) => `${theme.factionTheme.primary}30 1px solid` }}>
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>BATTLE ID #{battleIdentifier.toString().padStart(4, "0")}</Typography>
                    </Box>
                )}
            </Stack>
        )
    }, [battleIdentifier, content])
}
