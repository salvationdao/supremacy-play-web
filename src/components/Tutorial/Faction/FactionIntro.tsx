import { Box, Stack, Typography } from "@mui/material"
import { TRAINING_ASSETS } from "../../../constants"
import { useSupremacy } from "../../../containers"
import { colors, fonts } from "../../../theme/theme"
import { Faction } from "../../../types"

export const FactionIntro = () => {
    const { factionsAll } = useSupremacy()
    return (
        <Box
            sx={{
                display: "flex",
                width: "90%",
                maxWidth: "2000px",
                height: "70%",
                background: colors.darkNavy,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                gap: "5px",
                "& *": {
                    userSelect: "none",
                },
            }}
        >
            {Object.values(factionsAll)
                .sort((a, b) => a.label.localeCompare(b.label))
                .map((f) => (
                    <FactionBox key={f.id} faction={f} />
                ))}
        </Box>
    )
}

const getFactionInfo = (factionLabel: string) => {
    if (factionLabel === "Boston Cybernetics") {
        return {
            description:
                "Boston Cybernetics is the major commercial leader within the Supremacy Era. It has secure territories comprising 275 districts located on the east coast of the former United States. ",
            mechImage: `${TRAINING_ASSETS}/factions/bc/bc-mech.png`,
            wallpaper: "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/factions/bc-wall.png",
            colorOverlay: "#110333",
        }
    }

    if (factionLabel === "Zaibatsu Heavy Industries") {
        return {
            description:
                "Zaibatsu is the industrial leader within the Supremacy Era, with territories on the islands formerly known as Japan. Zaibatsu’s economy is built on production, as well as the development of cloud cities.",
            mechImage: `${TRAINING_ASSETS}/factions/zhi/zhi-mech.png`,
            colorOverlay: "#000000",
            wallpaper: "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/factions/zai-wall.png",
        }
    }

    if (factionLabel === "Red Mountain Offworld Mining Corporation") {
        return {
            description:
                "Red Mountain is the leader in autonomous mining operations in the Supremacy Era. It controls territory on Mars, as well as secure city locations on the continent formerly known as Australia on Earth.",
            mechImage: `${TRAINING_ASSETS}/factions/rm/rm-mech.png`,
            colorOverlay: "#330315",
            wallpaper: "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/factions/rm-wall.png",
        }
    }

    return {
        description: "Some information about what territories we have a hold of, some information about mechs and weapons? ",
        mechImage: `${TRAINING_ASSETS}/factions/bc/bc-mech.png`,
        colorOverlay: "#000000",
        wallpaper: "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/factions/zai-wall.png",
    }
}

const FactionBox = ({ faction }: { faction: Faction }) => {
    const { description, mechImage, colorOverlay, wallpaper } = getFactionInfo(faction.label)
    return (
        <Stack
            sx={{
                height: "100%",
                flexGrow: 1,
                flexBasis: 0,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                gap: "5%",
                p: "2em",
                alignItems: "center",
                "&, & *": {
                    transition: "all .5s",
                },
                "@media (max-width:900px)": {
                    "&:hover": {
                        flexGrow: 3,
                        "& h3": {
                            fontSize: "2vmin",
                        },
                        "& p": {
                            fontSize: "2vmin",
                        },
                        "&>div img:first-of-type": {
                            height: "15rem",
                            mt: 0,
                        },
                        "&>img:last-of-type": {
                            width: "100%",
                            height: "auto",
                            bottom: 0,
                        },
                    },
                },
                "&::before": {
                    content: "''",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${faction.wallpaper_url || wallpaper})`,
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
                    background: colorOverlay,
                    opacity: 0.5,
                },
                "& h2": {
                    fontFamily: fonts.nostromoBlack,
                    fontSize: "1.9vmin",
                    "@media (max-width:900px)": {
                        fontSize: 0,
                    },
                },
                "& p": {
                    fontSize: "2vmin",
                    position: "relative",
                    zIndex: 1,
                    maxWidth: "480px",
                    "@media (max-width:900px)": {
                        fontSize: 0,
                    },
                },
                "&>div img:first-of-type": {
                    height: "15rem",
                    objectFit: "contain",
                    "@media (max-width:900px)": {
                        height: "20rem",
                        mt: "30%",
                    },
                },
                "&>img:last-of-type": {
                    width: "100%",
                    zIndex: 2,
                    position: "absolute",
                    bottom: 0,
                    transform: "translateY(40%)",
                    overflowX: "hidden",
                    objectFit: "contain",
                    "@media (max-width:900px)": {
                        bottom: "15%",
                        width: "auto",
                        height: "80%",
                    },
                },
            }}
        >
            {/* logo */}
            <Stack sx={{ position: "relative", zIndex: 1, gap: "1rem" }}>
                <Box component="img" src={faction.logo_url} alt={`${faction.label}'s logo`} />

                {/* statement */}
                <Typography variant="h2">{faction.label}</Typography>
            </Stack>

            {/* descrioption */}
            <Typography>{description}</Typography>

            {/* mech image */}

            <Box component="img" src={mechImage} alt={`${faction.label}'s mech`} />
        </Stack>
    )
}
