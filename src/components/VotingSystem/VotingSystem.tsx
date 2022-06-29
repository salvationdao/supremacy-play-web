import { Box, Fade, Stack } from "@mui/material"
import { useMemo } from "react"
import { BattleAbilityItem, FactionAbilities, MoveableResizable } from ".."
import { STAGING_OR_DEV_ONLY } from "../../constants"
import { BribeStageResponse, useAuth, useGame } from "../../containers"
import { useTheme } from "../../containers/theme"
import { MoveableResizableConfig } from "../Common/MoveableResizable/MoveableResizableContainer"
import { PlayerAbilities } from "./PlayerAbilities/PlayerAbilities"

export const VotingSystem = () => {
    const { userID } = useAuth()
    const { bribeStage } = useGame()
    return <VotingSystemInner userID={userID} bribeStage={bribeStage} />
}

interface VotingSystemInnerProps {
    // useAuth
    userID?: string
    // useGame
    bribeStage?: BribeStageResponse
}

const VotingSystemInner = ({ userID, bribeStage }: VotingSystemInnerProps) => {
    const theme = useTheme()
    const { factionID } = useAuth()
    const isBattleStarted = useMemo(() => bribeStage && bribeStage.phase !== "HOLD", [bribeStage])

    const config: MoveableResizableConfig = useMemo(
        () => ({
            localStoragePrefix: "votingSystem",
            // Defaults
            defaultPosX: 10,
            defaultPosY: 10,
            defaultWidth: 390,
            defaultHeight: 360,
            // Size limits
            minWidth: 300,
            minHeight: 168,
            maxWidth: 500,
            maxHeight: 900,
            // Others
            infoTooltipText: "Vote for game abilities and fight for your Syndicate!",
        }),
        [],
    )

    if (!bribeStage) return null

    return (
        <Fade in={isBattleStarted}>
            <Box>
                <MoveableResizable config={config}>
                    <Stack sx={{ position: "relative", height: "100%" }}>
                        <Box
                            sx={{
                                height: "100%",
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
                            <Stack spacing="2rem" sx={{ direction: "ltr", pt: ".4rem", pb: "1rem" }}>
                                <BattleAbilityItem key={factionID} />
                                <FactionAbilities />
                                {STAGING_OR_DEV_ONLY && userID && <PlayerAbilities />}
                            </Stack>
                        </Box>
                    </Stack>
                </MoveableResizable>
            </Box>
        </Fade>
    )
}
