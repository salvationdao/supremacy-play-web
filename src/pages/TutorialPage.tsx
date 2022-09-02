import { Box, Button, Stack, Typography } from "@mui/material"
import { useTour } from "@reactour/tour"
import { useEffect } from "react"
import { BattleTrainingBG } from "../assets"
import { ClipThing, LeftDrawerBT, MiniMapBT, TrainingBattleAbility, TrainingMechAbility, TrainingPlayerAbility } from "../components"
import { FactionIntro } from "../components/Tutorial/Faction/FactionIntro"
import { FactionSelect } from "../components/Tutorial/Faction/FactionSelect"
import { Intro } from "../components/Tutorial/Intro"
import { WarMachineStatsBT } from "../components/Tutorial/WarMachine/WarMachineStatsBT"
import { TRAINING_ASSETS } from "../constants"
import { TrainingProvider, useDimension, useTraining } from "../containers"
import { useAuth } from "../containers/auth"
import { useToggle } from "../hooks"
import { colors, fonts, siteZIndex } from "../theme/theme"
import { BattleAbilityStages, CompletedTraining, MechAbilityStages, TrainingLobby } from "../types"
import { PlayerAbilityStages } from "../types/training"

const searchParams = new URLSearchParams(window.location.search)

export const TutorialPage = () => (
    <TrainingProvider>
        <TutorialPageInner />
    </TrainingProvider>
)

const TutorialPageInner = () => {
    const { trainingStage } = useTraining()
    const { triggerReset } = useDimension()

    useEffect(() => {
        triggerReset()
    }, [triggerReset])

    return (
        <Box sx={{ width: "100%", height: "100%", display: "flex" }}>
            <LeftDrawerBT />
            <Stack id="battle-arena-all" sx={{ width: "100%", height: "100%", zIndex: siteZIndex.RoutePage }}>
                <Box id="game-ui-container" sx={{ position: "relative", flex: 1 }}>
                    <MiniMapBT />
                    {(trainingStage in MechAbilityStages || trainingStage === TrainingLobby.MechAbility) && <WarMachineStatsBT />}

                    <BattleTraining />
                </Box>
            </Stack>
        </Box>
    )
}

const battleTrainingOptions = [
    {
        title: "Battle Abilities",
        description: "Learn about blah blah blah blah blah blah blah blah blah",
        video: `/nuke.mp4`,
        image: `/nuke.avif`,
        stage: TrainingLobby.BattleAbility,
        completedState: CompletedTraining.BattleAbility,
    },
    {
        title: "Mech Abilities",
        description: "Learn about blah blah blah blah blah blah blah blah blah",
        video: `/overcharge.mp4`,
        image: `/overcharge.avif`,
        stage: TrainingLobby.MechAbility,
        completedState: CompletedTraining.MechAbility,
    },
    {
        title: "Player Abilities",
        description: "Learn about blah blah blah blah blah blah blah blah blah",
        video: `/dogs.mp4`,
        image: `/dogs.avif`,
        stage: TrainingLobby.PlayerAbility,
        completedState: CompletedTraining.PlayerAbility,
    },
]

const BattleTraining = () => {
    const { isOpen } = useTour()
    const { user } = useAuth()
    const { trainingStage, setTrainingStage, completed, setBigDisplayRef } = useTraining()
    const [showIntro, toggleShowIntro] = useToggle(true)

    useEffect(() => {
        if (user.training_completed || searchParams.get("skip") === "true") {
            toggleShowIntro(false)
        }
    }, [user, toggleShowIntro])

    // if (showIntro) return <FactionIntro />
    if (showIntro) return <FactionSelect />
    // if (showIntro) return <Intro toggleTrainingIntro={toggleShowIntro} />

    if (!(trainingStage === TrainingLobby.All))
        return (
            <Box
                ref={setBigDisplayRef}
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    width: "100%",
                    height: "100%",
                    border: (theme) => `1px solid ${theme.factionTheme.primary}`,
                }}
            >
                {(trainingStage === TrainingLobby.BattleAbility || trainingStage in BattleAbilityStages) && <TrainingBattleAbility />}
                {(trainingStage === TrainingLobby.MechAbility || trainingStage in MechAbilityStages) && <TrainingMechAbility />}
                {(trainingStage === TrainingLobby.PlayerAbility || trainingStage in PlayerAbilityStages) && <TrainingPlayerAbility />}
            </Box>
        )

    return (
        <Stack
            sx={{
                width: "100%",
                height: "100%",
                background: `url(${BattleTrainingBG})`,
                backgroundSize: "cover",
                alignItems: "center",
                justifyContent: "center",
                gap: "2rem",
                filter: isOpen ? "blur(10px)" : "unset",
            }}
        >
            <Typography variant="h2">Battle Training</Typography>
            <Box sx={{ display: "flex", justifyContent: "space-evenly", width: "100%", px: "5vw", alignItems: "stretch", maxWidth: "1800px" }}>
                {battleTrainingOptions.map((t, i) => (
                    <Button
                        key={i}
                        sx={{
                            height: "auto",
                            width: `calc((100% / ${battleTrainingOptions.length}) - 2vw)`,
                            transition: "all .5s",
                            opacity: isOpen ? 0 : 1,
                            position: "relative",
                        }}
                        onClick={() => {
                            setTrainingStage(t.stage)
                        }}
                    >
                        {completed[t.completedState] && (
                            <Typography
                                component="span"
                                sx={{
                                    fontSize: "2rem",
                                    fontFamily: fonts.nostromoBlack,
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    background: `${colors.darkNavy}99`,
                                    p: "1em",
                                    width: "calc(100% - 2rem)",
                                    zIndex: 10,
                                }}
                            >
                                Completed
                            </Typography>
                        )}
                        <ClipThing
                            sx={{
                                width: "100%",
                                height: "100%",
                                opacity: completed[t.completedState] ? 0.8 : 1,
                                filter: completed[t.completedState] ? "grayscale(.9)" : "unset",
                            }}
                        >
                            <Stack sx={{ width: "100%", height: "100%", background: colors.black2 }}>
                                <video
                                    src={`${TRAINING_ASSETS}${t.video}`}
                                    poster={`${TRAINING_ASSETS}${t.image}`}
                                    disableRemotePlayback
                                    playsInline
                                    muted
                                    loop
                                    autoPlay
                                    controlsList="nodownload"
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                    }}
                                />
                                <Stack sx={{ p: "2em" }}>
                                    <Typography variant="h3">{t.title}</Typography>
                                    <Typography>{t.description}</Typography>
                                </Stack>
                            </Stack>
                        </ClipThing>
                    </Button>
                ))}
            </Box>
        </Stack>
    )
}
