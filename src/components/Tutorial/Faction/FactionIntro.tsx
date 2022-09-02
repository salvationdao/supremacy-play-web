import { Box, Stack, Typography, useMediaQuery } from "@mui/material"
import { useState } from "react"
import { TRAINING_ASSETS } from "../../../constants"
import { useSupremacy } from "../../../containers"
import { Faction } from "../../../types"
import { FactionLabel } from "./FactionSelect"

export const FactionIntro = () => {
    const { factionsAll } = useSupremacy()
    const below950 = useMediaQuery(`(max-width:1380px)`)

    // for mobile view (enlarges the faction being viewed)
    const [viewing, setViewing] = useState<FactionLabel>()
    return (
        <Stack sx={{ display: "flex", width: "100%", height: "100%" }}>
            <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
                {Object.values(factionsAll).map((f) => (
                    <FactionBox
                        mobileView={!!below950}
                        viewing={below950 ? viewing : undefined}
                        setViewing={setViewing}
                        width={below950 ? (f.label === viewing ? "70%" : "15%") : "33%"}
                        key={f.id}
                        faction={f}
                    />
                ))}
            </Box>
        </Stack>
    )
}

const getFactionInfo = (factionLabel: string) => {
    if (factionLabel === "Boston Cybernetics") {
        return {
            statement: "bc statement here",
            description:
                "Some information about what territories we have a hold of, some information about mechs and weapons? Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            mechImage: `${TRAINING_ASSETS}/factions/bc/bc-mech.png`,
        }
    }

    if (factionLabel === "Zaibatsu Heavy Industries") {
        return {
            statement: "zhi statement here",
            description:
                "Some information about what territories we have a hold of, some information about mechs and weapons? Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            mechImage: `${TRAINING_ASSETS}/factions/zhi/zhi-mech.png`,
        }
    }

    if (factionLabel === "Red Mountain Offworld Mining Corporation") {
        return {
            statement: "rm statement here",
            description:
                "Some information about what territories we have a hold of, some information about mechs and weapons? Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            mechImage: `${TRAINING_ASSETS}/factions/rm/rm-mech.png`,
        }
    }

    return {
        statement: "bc statement here",
        description:
            "Some information about what territories we have a hold of, some information about mechs and weapons? Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        mechImage: `${TRAINING_ASSETS}/factions/bc/bc-mech.png`,
    }
}

const FactionBox = ({
    width,
    faction,
    setViewing,
    viewing,
    mobileView,
}: {
    width: string
    faction: Faction
    viewing?: FactionLabel
    setViewing: (b?: FactionLabel) => void
    mobileView: boolean
}) => {
    const { statement, description, mechImage } = getFactionInfo(faction.label)
    const beingViewed = viewing === faction.label && mobileView

    return (
        <Stack
            sx={{
                ml: "1.2rem",
                height: "100%",
                width: width,
                // transition: "all 1s linear",
                position: "relative",
                textAlign: "center",
                cursor: beingViewed || !mobileView ? "" : "pointer",
            }}
            onClick={() => {
                setViewing(faction.label as FactionLabel)
            }}
        >
            <Stack
                sx={{
                    zIndex: "1",
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    textAlign: "center",
                    filter: "brightness(55%)",
                    opacity: ".5",

                    backgroundImage: `url(${faction.wallpaper_url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            />

            {/* logo */}
            <Box sx={{ zIndex: 2, mt: "3rem" }}>
                <Box
                    component="img"
                    src={faction.logo_url}
                    alt={`${faction.label}'s logo`}
                    sx={{
                        height: mobileView ? "12rem" : "23rem",
                    }}
                />
            </Box>

            {/* statement */}
            {(beingViewed || !mobileView) && (
                <Box sx={{ zIndex: 2 }}>
                    <Typography variant="h3">{statement}</Typography>
                </Box>
            )}

            {/* descrioption */}
            {(beingViewed || !mobileView) && (
                <Box sx={{ zIndex: 2 }}>
                    <Typography variant="h5" p="4rem" fontSize="2.5rem">
                        {description}
                    </Typography>
                </Box>
            )}

            {/* mech image */}
            <Box
                sx={{
                    transition: "none",
                    zIndex: 2,
                    position: "absolute",
                    bottom: mobileView && viewing !== faction.label ? "0" : "-29rem",
                    overflowX: "hidden",
                }}
            >
                <Box
                    component="img"
                    src={mechImage}
                    alt={`${faction.label}'s mech`}
                    sx={{
                        width: mobileView ? (viewing !== faction.label ? "230%" : "80%") : "100%",
                        transition: "none",
                    }}
                />
            </Box>
        </Stack>
    )
}
