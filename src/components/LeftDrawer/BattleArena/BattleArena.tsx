import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useAuth, useGame, useSupremacy, useUI } from "../../../containers"
import { colors, fonts } from "../../../theme/theme"
import { ArenaSelector } from "./ArenaSelector/ArenaSelector"
import { UnauthPrompt } from "./Common/UnauthPrompt"
import { PlayerAbilities } from "./PlayerAbilities/PlayerAbilities"
import { QuickPlayerAbilities } from "./QuickPlayerAbilities/QuickPlayerAbilities"
import { SupporterAbilities } from "./SupporterAbilities/SupporterAbilities"

export const BattleArena = () => {
    const { isAIDrivenMatch } = useGame()
    const { setSmallDisplayRef } = useUI()
    const { battleIdentifier } = useSupremacy()
    const { userID } = useAuth()

    const content = useMemo(() => {
        return (
            <>
                <ArenaSelector />

                {/* The minimap or the stream will mount here */}
                <Box ref={setSmallDisplayRef} sx={{ flexShrink: 0, mt: ".5rem" }} />

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
                    }}
                >
                    <Stack>
                        {!userID && <UnauthPrompt />}
                        <SupporterAbilities />
                        <PlayerAbilities />
                        <QuickPlayerAbilities />
                    </Stack>
                </Box>
            </>
        )
    }, [setSmallDisplayRef, userID])

    return useMemo(() => {
        return (
            <Stack sx={{ position: "relative", height: "100%", backgroundColor: (theme) => theme.factionTheme.background }}>
                {content}

                {battleIdentifier && (
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                            p: ".4rem 1rem",
                            backgroundColor: isAIDrivenMatch ? colors.green : colors.red,
                        }}
                    >
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>BATTLE ID #{battleIdentifier.toString().padStart(4, "0")}</Typography>
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{isAIDrivenMatch ? "AI MATCH" : "PvP"}</Typography>
                    </Stack>
                )}
            </Stack>
        )
    }, [battleIdentifier, content, isAIDrivenMatch])
}
