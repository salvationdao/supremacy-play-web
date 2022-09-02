import { Box, Stack, Typography, useMediaQuery } from "@mui/material"
import { useState } from "react"
import { TRAINING_ASSETS } from "../../../constants"
import { useSupremacy } from "../../../containers"
import { colors } from "../../../theme/theme"
import { Faction } from "../../../types"
import { FactionLabel } from "./FactionSelect"

export const FactionIntro = () => {
    const { factionsAll } = useSupremacy()
    const below950 = useMediaQuery(`(max-width:1380px)`)

    // for mobile view (enlarges the faction being viewed)
    const [viewing, setViewing] = useState<FactionLabel>()
    return (
        <Box
            sx={{
                display: "flex",
                width: "80%",
                height: "80%",
                maxHeight: "700px",
                background: colors.black2,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            }}
        >
            {Object.values(factionsAll)
                .sort((a, b) => a.label.localeCompare(b.label))
                .map((f) => (
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
    )
}

const getFactionInfo = (factionLabel: string) => {
    if (factionLabel === "Boston Cybernetics") {
        return {
            statement: factionLabel,
            description:
                "Boston Cybernetics is the major commercial leader within the Supremacy Era. It has secure territories comprising 275 districts located on the east coast of the former United States. ",
            mechImage: `${TRAINING_ASSETS}/factions/bc/bc-mech.png`,
        }
    }

    if (factionLabel === "Zaibatsu Heavy Industries") {
        return {
            statement: factionLabel,
            description: "Some information about what territories we have a hold of, some information about mechs and weapons? ",
            mechImage: `${TRAINING_ASSETS}/factions/zhi/zhi-mech.png`,
        }
    }

    if (factionLabel === "Red Mountain Offworld Mining Corporation") {
        return {
            statement: factionLabel,
            description: "Some information about what territories we have a hold of, some information about mechs and weapons? ",
            mechImage: `${TRAINING_ASSETS}/factions/rm/rm-mech.png`,
        }
    }

    return {
        statement: factionLabel,
        description: "Some information about what territories we have a hold of, some information about mechs and weapons? ",
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
                height: "100%",
                width: width,
                textAlign: "center",
                position: "relative",
                cursor: beingViewed || !mobileView ? "" : "pointer",
                overflow: "hidden",
                "&::before": {
                    content: "''",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${faction.wallpaper_url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    opacity: 0.5,
                    filter: "brightness(55%)",
                },
            }}
            onClick={() => {
                setViewing(faction.label as FactionLabel)
            }}
        >
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
