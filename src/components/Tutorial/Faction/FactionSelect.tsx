import { Box, Stack, Typography, useMediaQuery } from "@mui/material"
import { useSupremacy } from "../../../containers"
import { Faction } from "../../../types"

import { useState } from "react"
import { TRAINING_ASSETS } from "../../../constants"
import { colors } from "../../../theme/theme"
import { FancyButton } from "../../Common/FancyButton"

export enum FactionLabel {
    BostonCybernetics = "Boston Cybernetics",
    ZaibatsuHeavyIndustries = "Zaibatsu Heavy Industries",
    RedMountainOffworldMiningCorporation = "Red Mountain Offworld Mining Corporation",
}

export const FactionSelect = () => {
    const { factionsAll } = useSupremacy()
    const below950 = useMediaQuery(`(max-width:2350px)`)

    // for mobile view (enlarges the faction being viewed)
    const [viewing, setViewing] = useState<FactionLabel>()
    return (
        <Stack sx={{ display: "flex", width: "100%", height: "100%" }}>
            <Typography variant="h2" textAlign="center" mb="1rem" mt="1rem">
                Select Your Faction
            </Typography>
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
    if (factionLabel === "Zaibatsu Heavy Industries") {
        return {
            statement: "zhi A Statement as to what we stand for",
            territoryDescription: "Some information about what territories we have a hold of, some information about mechs and weapons?",
            otherInformation: "Some information about what territories we have a hold of, some information about mechs and weapons?",
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
                {
                    title: "Faction Abillity",
                    description: "Drone Swarm",
                    image: `${TRAINING_ASSETS}/factions/zhi/drones.png`,
                },
            ],
        }
    }

    if (factionLabel === "Red Mountain Offworld Mining Corporation") {
        return {
            statement: "rm A Statement as to what we stand for",
            territoryDescription: "Some information about what territories we have a hold of, some information about mechs and weapons?",
            otherInformation: "Some information about what territories we have a hold of, some information about mechs and weapons?",
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
                {
                    title: "Faction Abillity",
                    description: "Turret",
                    image: `${TRAINING_ASSETS}/factions/rm/turret.png`,
                },
            ],
        }
    }

    return {
        statement: "bc A Statement as to what we stand for",
        territoryDescription: "Some information about what territories we have a hold of, some information about mechs and weapons?",
        otherInformation: "Some information about what territories we have a hold of, some information about mechs and weapons?",
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
            {
                title: "Faction Abillity",
                description: "Dogs",
                image: `${TRAINING_ASSETS}/factions/bc/dogs.png`,
            },
        ],
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
    const { statement, territoryDescription, otherInformation, fleetImages, abilities } = getFactionInfo(faction.label)

    const beingViewed = viewing === faction.label && mobileView
    return (
        <Stack
            sx={{
                ml: "1.2rem",
                height: "100%",
                width: width,
                transition: "all .5s linear",
                position: "relative",
                textAlign: "center",
                cursor: !mobileView || beingViewed ? "" : "pointer",
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
                    filter: "brightness(55%)",
                    opacity: ".5",

                    backgroundImage: `url(${faction.wallpaper_url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            />

            {/* logo + statement*/}
            <Box
                sx={{
                    pl: "3rem",
                    pr: "3rem",
                    zIndex: 2,
                    mt: "3rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "left !important",
                }}
            >
                <Box
                    component="img"
                    src={faction.logo_url}
                    alt={`${faction.label}'s logo`}
                    sx={{
                        height: "12rem",
                        mr: "1rem",
                    }}
                />
                {(beingViewed || !mobileView) && (
                    <Typography textTransform="uppercase" variant="h4">
                        {statement}
                    </Typography>
                )}
            </Box>
            {(beingViewed || !mobileView) && (
                <>
                    {/* Territory */}
                    <Box sx={{ zIndex: 2, pl: "3rem", pr: "3rem" }}>
                        <Typography variant="h5" mt="2rem" mb="2rem" textTransform={"uppercase"}>
                            Territory
                        </Typography>
                        <Typography variant="h5" fontSize="2.5rem">
                            {territoryDescription}
                        </Typography>
                    </Box>

                    {/* Other info */}
                    <Box sx={{ zIndex: 2, pl: "3rem", pr: "3rem" }}>
                        <Typography variant="h5" mt="2rem" mb="2rem" textTransform={"uppercase"}>
                            Other Information
                        </Typography>
                        <Typography variant="h5" fontSize="2.5rem">
                            {otherInformation}
                        </Typography>
                    </Box>

                    {/*  fleet */}
                    <Box sx={{ zIndex: 2, pl: "3rem", pr: "3rem" }}>
                        <Typography variant="h5" mt="2rem" mb="2rem" textTransform={"uppercase"}>
                            Fleet
                        </Typography>
                        <Box>
                            {fleetImages.map((f, idx) => {
                                return (
                                    <Box
                                        key={idx}
                                        component="img"
                                        src={f}
                                        alt={`${faction.label}'s fleet`}
                                        sx={{
                                            height: "14rem",
                                            ml: "3rem",
                                        }}
                                    />
                                )
                            })}
                        </Box>
                    </Box>

                    {/* ability */}
                    <Box sx={{ mt: "2rem", zIndex: 2, pl: "3rem", pr: "3rem" }}>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            {abilities.map((f, idx) => {
                                return (
                                    <Box key={idx} ml="3rem">
                                        <Typography variant="h5" mt="3rem" textTransform={"uppercase"}>
                                            {f.title}
                                        </Typography>

                                        <Box
                                            component="img"
                                            src={f.image}
                                            alt={`${faction.label}'s fleet`}
                                            sx={{
                                                height: "10rem",
                                                my: "2rem",
                                            }}
                                        />
                                        <Typography variant="h5" textTransform={"uppercase"}>
                                            {f.description}
                                        </Typography>
                                    </Box>
                                )
                            })}
                        </Box>
                    </Box>
                    {/* statement */}
                    <Box
                        sx={{
                            zIndex: 2,
                            pl: "3rem",
                            pr: "3rem",
                            position: "absolute",
                            bottom: "2rem",

                            left: 0,
                            right: 0,
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: "30rem",
                            textAlign: "center",
                        }}
                    >
                        <FancyButton
                            clipThingsProps={{
                                clipSize: "9px",
                                clipSlantSize: "0px",
                                backgroundColor: colors.darkNavyBlue,
                                opacity: 1,
                                border: { borderColor: faction.primary_color, borderThickness: "1px" },
                                sx: {
                                    position: "relative",

                                    textAlign: "center",
                                },
                            }}
                            onClick={() => {
                                console.log("clicking")
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: "fontWeightBold",
                                    textAlign: "center !important",
                                    color: faction.primary_color,
                                    fontSize: "2rem",
                                }}
                            >
                                ENLIST IN FACTION
                            </Typography>
                        </FancyButton>
                    </Box>
                </>
            )}
        </Stack>
    )
}
