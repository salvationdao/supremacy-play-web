import { Box, Stack, styled, Typography } from "@mui/material"
import { useDimension, useGlobalNotifications, useSupremacy, useUI } from "../../../containers"
import { Faction } from "../../../types"

import { ArrowForward } from "@mui/icons-material"
import { useCallback, useEffect } from "react"
import { TRAINING_ASSETS } from "../../../constants"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { LEFT_DRAWER_ARRAY } from "../../../routes"
import { colors, fonts } from "../../../theme/theme"
import { FancyButton } from "../../Common/FancyButton"

export enum FactionLabel {
    BostonCybernetics = "Boston Cybernetics",
    ZaibatsuHeavyIndustries = "Zaibatsu Heavy Industries",
    RedMountainOffworldMiningCorporation = "Red Mountain Offworld Mining Corporation",
}

export const FactionSelect = () => {
    const { factionsAll } = useSupremacy()
    const { triggerReset } = useDimension()

    useEffect(() => {
        triggerReset()
    }, [triggerReset])

    return (
        <Stack id="game-ui-container" sx={{ width: "100%", height: "100%", userSelect: "none" }}>
            <Typography variant="h1" textAlign="center" sx={{ fontSize: "4rem", my: "4rem" }}>
                Select Your Faction
            </Typography>
            <Box sx={{ display: "flex", width: "100%", height: "100%", gap: "5px" }}>
                {Object.values(factionsAll)
                    .sort((a, b) => a.label.localeCompare(b.label))
                    .map((f) => (
                        <FactionBox key={f.id} faction={f} />
                    ))}
            </Box>
        </Stack>
    )
}

const getFactionInfo = (factionLabel: string) => {
    if (factionLabel === "Zaibatsu Heavy Industries") {
        return {
            logo: "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/factions/zai-alt-logo.svg",
            description:
                "Zaibatsu is the industrial leader within the Supremacy Era, with territories on the islands formerly known as Japan. Zaibatsu’s economy is built on production, as well as the development of cloud cities.",
            wiki: "https://supremacy.game/wiki/zaibatsu-lore",
            fleetImages: [
                `${TRAINING_ASSETS}/factions/zhi/zhi-fleet1.png`,
                `${TRAINING_ASSETS}/factions/zhi/zhi-fleet2.png`,
                `${TRAINING_ASSETS}/factions/zhi/zhi-fleet3.png`,
            ],
            abilities: [
                {
                    title: "Faction Buff",
                    description: "Shield Regen",
                    image: `${TRAINING_ASSETS}/factions/icons/shield.svg`,
                },
                {
                    title: "Unique Weapon",
                    description: "Lightning Gun",
                    image: `${TRAINING_ASSETS}/factions/zhi/lightning-gun.png`,
                },
            ],
            colorOverlay: "#000000",
            wallpaper: "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/factions/zai-wall.png",
        }
    }

    if (factionLabel === "Red Mountain Offworld Mining Corporation") {
        return {
            logo: "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/factions/rm-alt-logo.svg",
            description:
                "Red Mountain is the leader in autonomous mining operations in the Supremacy Era. It controls territory on Mars, as well as secure city locations on the continent formerly known as Australia on Earth.",
            wiki: "https://supremacy.game/wiki/red-mountain-lore",
            fleetImages: [
                `${TRAINING_ASSETS}/factions/rm/rm-fleet1.png`,
                `${TRAINING_ASSETS}/factions/rm/rm-fleet2.png`,
                `${TRAINING_ASSETS}/factions/rm/rm-fleet3.png`,
            ],
            abilities: [
                {
                    title: "Faction Buff",
                    description: "health",
                    image: `${TRAINING_ASSETS}/factions/icons/health.svg`,
                },
                {
                    title: "Unique Weapon",
                    description: "Flamethrower",
                    image: `${TRAINING_ASSETS}/factions/rm/flamethrower.png`,
                },
            ],
            colorOverlay: "#330315",
            wallpaper: "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/factions/rm-wall.png",
        }
    }

    return {
        logo: "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/factions/bc-alt-logo.svg",
        description:
            "Boston Cybernetics is the major commercial leader within the Supremacy Era. It has secure territories comprising 275 districts located on the east coast of the former United States. ",
        wiki: "https://supremacy.game/wiki/boston-cybernetics-lore",
        fleetImages: [
            `${TRAINING_ASSETS}/factions/bc/bc-fleet1.png`,
            `${TRAINING_ASSETS}/factions/bc/bc-fleet2.png`,
            `${TRAINING_ASSETS}/factions/bc/bc-fleet3.png`,
        ],
        abilities: [
            {
                title: "Faction Buff",
                description: "speed",
                image: `${TRAINING_ASSETS}/factions/icons/speed.svg`,
            },
            {
                title: "Unique Weapon",
                description: "BFG",
                image: `${TRAINING_ASSETS}/factions/bc/bfg.png`,
            },
        ],
        wallpaper: "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/factions/bc-wall.png",
        colorOverlay: "#110333",
    }
}

const FactionBox = ({ faction }: { faction: Faction }) => {
    const { setLeftDrawerActiveTabID } = useUI()
    const { description, fleetImages, abilities, wallpaper, colorOverlay, wiki, logo } = getFactionInfo(faction.label)
    const { gameUIDimensions } = useDimension()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsUser("/user_commander")

    const enlistFaction = useCallback(async () => {
        try {
            await send<null, { faction_id: string }>(GameServerKeys.EnlistFaction, { faction_id: faction.id })
            newSnackbarMessage("Successfully enlisted into faction.", "success")
            setLeftDrawerActiveTabID(LEFT_DRAWER_ARRAY[0]?.id)
        } catch (err) {
            newSnackbarMessage(typeof err === "string" ? err : "Failed to enlist into faction.", "error")
            console.error(err)
        }
        return
    }, [send, faction.id, newSnackbarMessage, setLeftDrawerActiveTabID])

    // Responsiveness
    const shortHeight = gameUIDimensions.height <= 850 && gameUIDimensions.height > 0
    const mediumScreen = gameUIDimensions.width <= 1300 && gameUIDimensions.width > 0

    return (
        <InnerFaction colorOverlay={colorOverlay} wallpaper1={faction.wallpaper_url} wallpaper2={wallpaper} mediumScreen={mediumScreen}>
            {/* logo + statement*/}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4rem",
                    width: "100%",
                }}
            >
                <Box component="img" src={logo} alt={`${faction.label}'s logo`} />
                <Typography variant="h2">{faction.label}</Typography>
            </Box>
            <InnerStack id="inner-stack" shortScreen={shortHeight} color={faction.primary_color} mediumScreen={mediumScreen}>
                {/* descrioption */}
                <Typography
                    sx={{
                        textAlign: "left",
                        fontSize: "2rem",
                        position: "relative",
                        zIndex: 1,
                        maxWidth: "480px",
                        mx: "auto",
                    }}
                >
                    {description}
                    <br />
                    <a href={wiki} target="_blank" rel="noreferrer" style={{ fontSize: "1.8rem" }}>
                        Learn more <ArrowForward />
                    </a>
                </Typography>
                {/*  fleet */}
                <Stack
                    gap="1rem"
                    sx={{
                        width: "100%",
                        background: `${colorOverlay}99`,
                        p: "2rem",
                        mt: "2rem",
                    }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            fontSize: "2rem",
                            textAlign: "center",
                            letterSpacing: "2px",
                        }}
                    >
                        Fleet
                    </Typography>
                    <Box sx={{ display: "flex", gap: "2rem", justifyContent: "center", alignItems: "center", width: "100%" }}>
                        {fleetImages.map((f, idx) => {
                            return (
                                <Box
                                    key={idx}
                                    component="img"
                                    src={f}
                                    alt={`${faction.label}'s fleet`}
                                    sx={{
                                        flexGrow: 1,
                                        flexBasis: 0,
                                        objectFit: "contain",
                                        width: `calc(100%/${fleetImages.length})`,
                                        height: "15rem",
                                    }}
                                />
                            )
                        })}
                    </Box>
                </Stack>
                {/* ability */}
                <Box sx={{ display: "flex", justifyContent: "center", gap: "4rem", alignItems: "center" }}>
                    {abilities.map((f, idx) => {
                        return (
                            <Stack key={idx} gap="2rem">
                                <Typography component="span" sx={{ fontFamily: fonts.nostromoBlack, fontSize: "1.4rem" }}>
                                    {f.title}
                                </Typography>

                                <Box
                                    component="img"
                                    src={f.image}
                                    alt={`${faction.label}'s fleet`}
                                    sx={{
                                        height: "8rem",
                                        objectFit: "contain",
                                    }}
                                />
                                <Typography component="span" sx={{ fontFamily: fonts.nostromoBlack, fontSize: "1.4rem" }}>
                                    {f.description}
                                </Typography>
                            </Stack>
                        )
                    })}
                </Box>
            </InnerStack>
            <Box id="enlist-button">
                <FancyButton
                    clipThingsProps={{
                        clipSize: "9px",
                        backgroundColor: colors.darkNavyBlue,
                        opacity: 1,
                        border: { borderColor: faction.primary_color, borderThickness: "1px" },
                        sx: {
                            position: "relative",
                        },
                    }}
                    onClick={enlistFaction}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            position: "relative",
                            zIndex: 2,
                            padding: "0 2em",
                            textAlign: "center !important",
                            color: faction.primary_color,
                            fontSize: "2.5rem",
                            fontFamily: fonts.nostromoBold,
                        }}
                    >
                        ENLIST IN FACTION
                    </Typography>
                </FancyButton>
            </Box>
        </InnerFaction>
    )
}

const InnerFaction = styled("div")(
    (props: { colorOverlay: string; wallpaper1: string; wallpaper2: string; color?: string; mediumScreen?: boolean; isMobile?: boolean }) => {
        return {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            flexGrow: 1,
            flexBasis: 0,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            gap: "4rem",
            padding: "4rem 3rem",
            alignItems: "center",
            "&, & *": {
                transition: "all .5s ease-out, opacity 2s ease-out, visibility .2s",
            },
            "& > *": {
                maxWidth: "700px",
            },
            "&::before": {
                content: "''",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: `url(${props.wallpaper1 || props.wallpaper2})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                opacity: 0.5,
            },
            "&::after": {
                content: "''",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: props.colorOverlay,
                opacity: 0.5,
            },
            "&>*": {
                zIndex: 1,
            },
            "&:hover, &:active": {
                flexGrow: props.mediumScreen ? 5 : 1,
                "& #inner-stack": {
                    width: "100%",
                    opacity: 1,
                },
                "&>div:first-of-type img:first-of-type": {
                    height: "15rem",
                    objectFit: "contain",
                    position: "unset",
                    transform: "unset",
                },
                "&>div h2": {
                    fontSize: "3rem",
                },
                "& #enlist-button": {
                    visibility: "unset",
                    width: "auto",
                },
            },

            "&>div h2": {
                textAlign: "left",
                fontSize: props.mediumScreen ? 0 : "3rem",
                fontFamily: fonts.nostromoBlack,
                WebkitTextStrokeWidth: "1px",
                WebkitTextStrokeColor: colors.black2,
                textShadow: `1px 3px ${colors.black2}`,
            },
            "&>div:first-of-type img:first-of-type": {
                height: props.mediumScreen ? "8vw" : "15rem",
                objectFit: "contain",
                position: props.mediumScreen ? "absolute" : "unset",
                top: "40%",
                left: "50%",
                transform: props.mediumScreen ? "translate(-50%,-50%)" : "unset",
            },
            "& #enlist-button": {
                visibility: props.mediumScreen ? "hidden" : "unset",
                width: props.mediumScreen ? 0 : "auto",
            },
        }
    },
)

const InnerStack = styled("div")((props: { shortScreen: boolean; color: string; mediumScreen?: boolean }) => {
    return {
        display: "flex",
        flexDirection: "column",
        maxHeight: props.shortScreen ? "400px" : "unset",
        gap: "4rem",
        overflowY: "auto",
        scrollbarWidth: "none",
        width: props.mediumScreen ? 0 : "100%",
        opacity: props.mediumScreen ? 0 : 1,
        "::-webkit-scrollbar": {
            width: ".4rem",
        },
        "::-webkit-scrollbar-track": {
            background: "#FFFFFF15",
            borderRadius: 3,
        },
        "::-webkit-scrollbar-thumb": {
            background: props.color,
            borderRadius: 3,
        },
    }
})
