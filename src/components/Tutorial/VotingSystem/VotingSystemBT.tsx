import { Box, Fade, Stack } from "@mui/material"
import { useEffect, useMemo, useRef } from "react"
import { useMobile, useTraining } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { TrainingVotingSystem } from "../../../types"
import { PlayerAbilityStages, TrainingLobby } from "../../../types/training"
import { MoveableResizableBT } from "../MoveableResizableBT"
import { MoveableResizableConfig } from "../MoveableResizeableContainerBT"
import { PlayerAbilitiesBT } from "../PlayerAbilities/PlayerAbilitiesBT"
import { BattleAbilityItemBT } from "./BattleAbility/BattleAbilityItemBT"

export const VotingSystemBT = () => {
    const theme = useTheme()
    const { isMobile } = useMobile()
    // Map
    const ref = useRef<HTMLDivElement>(null)
    const playerAbilityRef = useRef<HTMLDivElement>(null)
    const { bribeStage, trainingStage, setTutorialRef } = useTraining()

    const config: MoveableResizableConfig = useMemo(
        () => ({
            localStoragePrefix: "votingSystem1",
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
            maxWidth: 400,
            // maxHeight: 900,
            // Others
            infoTooltipText: "Vote for game abilities and fight for your Faction!",
            autoFit: true,
        }),
        [],
    )

    useEffect(() => {
        if (trainingStage in PlayerAbilityStages) setTutorialRef(playerAbilityRef)
        else if (trainingStage in TrainingVotingSystem) setTutorialRef(ref)
    }, [trainingStage, setTutorialRef])

    if (!bribeStage) return null

    return (
        <Fade in={true}>
            <Box sx={{ ...(isMobile ? { backgroundColor: "#FFFFFF12", boxShadow: 2, border: "#FFFFFF20 1px solid" } : {}) }}>
                <MoveableResizableBT config={config}>
                    <Stack ref={ref} sx={{ position: "relative" }}>
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
                            {/* <ContributorAmount /> */}
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
                                <BattleAbilityItemBT />
                                {(trainingStage in PlayerAbilityStages || trainingStage === TrainingLobby.PlayerAbility) && (
                                    <Box ref={playerAbilityRef}>
                                        <PlayerAbilitiesBT />
                                    </Box>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                </MoveableResizableBT>
            </Box>
        </Fade>
    )
}
