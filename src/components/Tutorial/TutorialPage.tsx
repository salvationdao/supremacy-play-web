import { Box, Button, Modal, Stack, Typography } from "@mui/material"
import { useTour } from "@reactour/tour"
import { useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet"
import { ClipThing, FancyButton, LeftDrawerBT, MiniMapBT, TrainingBattleAbility, TrainingMechAbility, TrainingPlayerAbility } from ".."
import { BattleTrainingBG } from "../../assets"
import { LINK, TRAINING_ASSETS } from "../../constants"
import { GAME_UI_ID, TrainingProvider, useDimension, useTraining } from "../../containers"
import { useAuth } from "../../containers/auth"
import { useUrlQuery } from "../../hooks"
import { opacityEffect } from "../../theme/keyframes"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { BattleAbilityStages, CompletedTraining, MechAbilityStages, TrainingLobby } from "../../types"
import { PlayerAbilityStages } from "../../types/training"
import { FactionIntro } from "./Faction/FactionIntro"
import { Intro } from "./Intro"
import { WarMachineStatsBT } from "./WarMachine/WarMachineStatsBT"

export const TutorialPage = () => (
    <>
        <Helmet>
            <title>Tutorial</title>
            <link rel="canonical" href={`${LINK}/tutorial`} />
        </Helmet>

        <TrainingProvider>
            <TutorialPageInner />
        </TrainingProvider>
    </>
)

const TutorialPageInner = () => {
    const { user } = useAuth()
    const [query] = useUrlQuery()
    const { trainingStage, setTutorialRef } = useTraining()
    const { triggerReset } = useDimension()
    const [lobbyStage, setLobbyStage] = useState<TrainingLobby>(TrainingLobby.Intro)

    useEffect(() => {
        triggerReset()
    }, [triggerReset])

    useEffect(() => {
        if (query.get("skip") === "true") {
            setLobbyStage(TrainingLobby.FactionIntro)
        }
        setTutorialRef(undefined)
    }, [user, setTutorialRef, setLobbyStage, query])

    const component = useMemo(() => {
        if (lobbyStage === TrainingLobby.Intro) {
            return (
                <Intro
                    toggleTrainingIntro={() => {
                        setLobbyStage(TrainingLobby.FactionIntro)
                    }}
                />
            )
        }
        if (lobbyStage === TrainingLobby.All || lobbyStage === TrainingLobby.FactionIntro) {
            return (
                <>
                    <LeftDrawerBT />
                    <Stack id="battle-arena-all" sx={{ width: "100%", height: "100%", zIndex: siteZIndex.RoutePage }}>
                        <Box id={GAME_UI_ID} sx={{ position: "relative", flex: 1 }}>
                            <MiniMapBT />
                            {(trainingStage in MechAbilityStages || trainingStage === TrainingLobby.MechAbility) && <WarMachineStatsBT />}
                            <Modal
                                open={lobbyStage === TrainingLobby.FactionIntro}
                                BackdropProps={{
                                    style: {
                                        background: "rgba(0,0,0,0.7)",
                                    },
                                }}
                                onBackdropClick={() => {
                                    setLobbyStage(TrainingLobby.All)
                                }}
                            >
                                <Stack gap="2rem">
                                    <FactionIntro />
                                    <FancyButton
                                        onClick={() => setLobbyStage(TrainingLobby.All)}
                                        clipThingsProps={{
                                            clipSize: "10px",
                                            backgroundColor: colors.neonBlue,
                                            opacity: 1,
                                            border: { borderColor: colors.neonBlue, borderThickness: "1px" },
                                            sx: { position: "absolute", bottom: "5%", left: "50%", transform: "translate(-50%, -50%)", gap: "5px" },
                                        }}
                                        sx={{ px: "2em", py: 0, color: colors.darkestNeonBlue }}
                                    >
                                        <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBold, color: colors.darkestNeonBlue, fontSize: "3rem" }}>
                                            Enter Battle Training
                                        </Typography>
                                    </FancyButton>
                                </Stack>
                            </Modal>
                            <BattleTraining />
                        </Box>
                    </Stack>
                </>
            )
        }

        return null
    }, [lobbyStage, trainingStage])

    return (
        <Box
            key={trainingStage === TrainingLobby.All ? lobbyStage : "training"}
            sx={{ width: "100%", height: "100%", display: "flex", animation: `${opacityEffect} 1s`, position: "relative" }}
        >
            {component}
        </Box>
    )
}

const battleTrainingOptions = [
    {
        title: "Battle Abilities",
        description: "The Overseer selects worthy citizens from two factions to deploy an airstrike, nuke or a repair crate.",
        video: `/nuke.mp4`,
        image: `/nuke.avif`,
        stage: TrainingLobby.BattleAbility,
        completedState: CompletedTraining.BattleAbility,
    },
    {
        title: "Mech Abilities",
        description: "Citizens are able to control their mechs, to turn the tide of battle in their favour.",
        video: `/overcharge.mp4`,
        image: `/overcharge.avif`,
        stage: TrainingLobby.MechAbility,
        completedState: CompletedTraining.MechAbility,
    },
    {
        title: "Player Abilities",
        description: "Help your faction using a player ability. Use it against the opposing factions or empower your faction's mechs. ",
        video: `/player_ability/3.mp4`,
        image: `/dogs.avif`,
        stage: TrainingLobby.PlayerAbility,
        completedState: CompletedTraining.PlayerAbility,
    },
]

const BattleTraining = () => {
    const { isOpen } = useTour()
    const { trainingStage, setTrainingStage, completed, setBigDisplayRef } = useTraining()
    const { gameUIDimensions } = useDimension()

    const smallScreen = gameUIDimensions.width <= 1140 && gameUIDimensions.width > 0

    const Lobby = useMemo(
        () => (
            <Stack
                sx={{
                    width: "100%",
                    height: "100%",
                    background: `url(${BattleTrainingBG})`,
                    backgroundSize: "cover",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5rem",
                    filter: isOpen ? "blur(10px)" : "unset",
                }}
            >
                <Stack alignItems="center">
                    <Typography
                        variant="h2"
                        sx={{
                            fontFamily: fonts.nostromoHeavy,
                            fontSize: "8rem",
                            WebkitTextStrokeWidth: "1px",
                            WebkitTextStrokeColor: colors.black2,
                            textShadow: `1px 3px ${colors.black2}`,
                        }}
                    >
                        Battle Training
                    </Typography>
                    <Typography sx={{ fontFamily: fonts.nostromoMedium }}>Select one of options below</Typography>
                </Stack>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        px: "4rem",
                        alignItems: "stretch",
                        maxWidth: "2560px",
                        flexWrap: "wrap",
                        gap: smallScreen ? "2rem" : "4rem",
                    }}
                >
                    {battleTrainingOptions.map((t, i) => (
                        <Button
                            key={i}
                            sx={{
                                height: smallScreen ? "25vh" : "auto",
                                width: smallScreen ? "100%" : `calc((100% / ${battleTrainingOptions.length}) - 4rem)`,
                                maxWidth: smallScreen ? "750px" : "500px",
                                minWidth: "300px",
                                transition: "all .5s",
                                opacity: isOpen ? 0 : 1,
                                position: "relative",
                                filter: "drop-shadow(5px 10px 3px rgba(0,0,0,0.5))",
                            }}
                            onClick={() => {
                                setTrainingStage(t.stage)
                            }}
                        >
                            {completed[t.completedState] && (
                                <Typography
                                    component="span"
                                    sx={{
                                        fontSize: "3rem",
                                        fontFamily: fonts.nostromoBlack,
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: smallScreen ? "translate(-50%,-50%)" : "translate(-50%,calc(-50% - 75px))",
                                        background: `${colors.darkNavy}99`,
                                        p: "1rem 2rem",
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
                                <Stack sx={{ width: "100%", height: "100%", background: colors.black2, position: "relative" }}>
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
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                    <Stack
                                        sx={{
                                            width: "100%",
                                            position: "absolute",
                                            bottom: 0,
                                            background: "rgba(0,0,0,0.7)",
                                            p: "2rem",
                                            textAlign: "left",
                                            gap: "1rem",
                                            minHeight: smallScreen ? "unset" : "150px",
                                            height: "max-content",
                                        }}
                                    >
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                fontFamily: fonts.nostromoBlack,
                                                fontSize: "3rem",
                                                width: "100%",
                                                borderBottom: `1px solid ${colors.darkGrey}99`,
                                                pb: "1rem",
                                            }}
                                        >
                                            {t.title}
                                        </Typography>
                                        <Typography sx={{ fontFamily: fonts.rajdhaniMedium, textTransform: "none", fontSize: "2rem" }}>
                                            {t.description}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </ClipThing>
                        </Button>
                    ))}
                </Box>
            </Stack>
        ),
        [completed, isOpen, setTrainingStage, smallScreen],
    )

    return trainingStage === TrainingLobby.All ? (
        Lobby
    ) : (
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
}
