import { Box, Fade, Stack } from "@mui/material"
import { useMemo } from "react"
import { BattleAbilityItem, FactionAbilities, MoveableResizable } from ".."
import { BribeStageResponse, useAuth, useGame } from "../../containers"
import { useTheme } from "../../containers/theme"
import { ContributorAmount } from "../BattleStats/ContributorAmount"
import { MoveableResizableConfig } from "../Common/MoveableResizable/MoveableResizableContainer"
import { PlayerAbilities } from "./PlayerAbilities/PlayerAbilities"
import { FeatureName } from "../../types"

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
    const { factionID, userHasFeature } = useAuth()
    const isBattleStarted = useMemo(() => bribeStage && bribeStage.phase !== "HOLD", [bribeStage])

    const config: MoveableResizableConfig = useMemo(
        () => ({
            localStoragePrefix: "votingSystem",
            // Defaults
            defaultPosX: 0,
            defaultPosY: 0,
            defaultWidth: 320,
            defaultHeight: 480,
            // Position limits
            minPosX: 0,
            minPosY: 0,
            // Size limits
            minWidth: 320,
            // minHeight: 168,
            maxWidth: 500,
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
            <Box>
                <MoveableResizable config={config}>
                    <Stack sx={{ position: "relative" }}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing="1.2rem"
                            sx={{
                                height: "3.1rem",
                                pt: ".4rem",
                                px: "1.8rem",
                                backgroundColor: "#000000BF",
                                borderBottom: `${theme.factionTheme.primary}80 .25rem solid`,
                            }}
                        >
                            <ContributorAmount />
                        </Stack>

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
                            <Stack spacing="1rem" sx={{ direction: "ltr", pt: ".4rem", pb: "1.2rem" }}>
                                <BattleAbilityItem key={factionID} />
                                <FactionAbilities />
                                {userHasFeature(FeatureName.playerAbility) && userID && <PlayerAbilities />}
                            </Stack>
                        </Box>
                    </Stack>
                </MoveableResizable>
            </Box>
        </Fade>
    )
}
