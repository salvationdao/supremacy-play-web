import { Box, Fade, Stack } from "@mui/material"
import { useMemo } from "react"
import { BattleAbilityItem, MoveableResizable } from ".."
import { useAuth, useGame, useMobile } from "../../containers"
import { useTheme } from "../../containers/theme"
import { MoveableResizableConfig } from "../Common/MoveableResizable/MoveableResizableContainer"
import { PlayerAbilities } from "./PlayerAbilities/PlayerAbilities"

export const VotingSystem = () => {
    const theme = useTheme()
    const { factionID } = useAuth()
    const { isMobile } = useMobile()
    const { bribeStage } = useGame()
    const isBattleStarted = useMemo(() => bribeStage && bribeStage.phase !== "HOLD", [bribeStage])

    const config: MoveableResizableConfig = useMemo(
        () => ({
            localStoragePrefix: "votingSystem1",
            // Defaults
            defaultPosX: 0,
            defaultPosY: 0,
            defaultWidth: 360,
            defaultHeight: 480,
            // Position limits
            minPosX: 0,
            minPosY: 0,
            // Size limits
            minWidth: 360,
            // minHeight: 168,
            maxWidth: 400,
            // maxHeight: 900,
            // Others
            infoTooltipText: "Vote for game abilities and fight for your Faction!",
            autoFit: true,
        }),
        [],
    )

    if (!bribeStage) return null

    return (
        <Fade in={isBattleStarted}>
            <Box sx={{ ...(isMobile ? { backgroundColor: "#FFFFFF12", boxShadow: 2, border: "#FFFFFF20 1px solid" } : {}) }}>
                <MoveableResizable config={config}>
                    <Box
                        sx={{
                            maxHeight: "100vh",
                            overflowY: "auto",
                            overflowX: "hidden",
                            ml: "1.9rem",
                            mr: ".5rem",
                            pr: "1.4rem",
                            mt: "1rem",
                            direction: "ltr",
                            "::-webkit-scrollbar": {
                                width: ".4rem",
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
                        <Stack spacing="1rem" sx={{ direction: "ltr", pt: ".4rem", pb: "1.2rem", minWidth: 360 }}>
                            <BattleAbilityItem key={factionID} />
                            {/* <FactionAbilities /> */}
                            <PlayerAbilities />
                        </Stack>
                    </Box>
                </MoveableResizable>
            </Box>
        </Fade>
    )
}
