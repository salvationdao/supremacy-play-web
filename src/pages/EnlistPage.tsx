import { Box, Fade, Stack, Typography, useMediaQuery } from "@mui/material"
import { useCallback, useState } from "react"
import { HangarBg } from "../assets"
import { ClipThing, FancyButton } from "../components"
import { useGlobalNotifications, useSupremacy } from "../containers"
import { useGameServerCommandsUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { fonts, siteZIndex } from "../theme/theme"
import { Faction } from "../types"

export const EnlistPage = () => {
    const { factionsAll } = useSupremacy()
    const below1200 = useMediaQuery("(max-width:1200px)")

    if (Object.keys(factionsAll).length < 3) return null

    return (
        <Stack
            alignItems="center"
            sx={{
                height: "100%",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${HangarBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                boxShadow: `inset 0 0 50px 60px #00000090`,
            }}
        >
            <Stack alignItems="center" sx={{ my: "auto" }}>
                <Typography variant="h1" sx={{ fontFamily: fonts.nostromoBlack, fontSize: "3rem" }}>
                    Choose Your Faction
                </Typography>
                <Stack direction="row" spacing="3rem" justifyContent="space-between" sx={{ p: "5rem" }}>
                    {below1200 ? (
                        <ExtendedFactionCarousel factions={Object.values(factionsAll)} />
                    ) : (
                        Object.values(factionsAll).map((f) => <ExtendedFactionEnlist key={f.id} faction={f} />)
                    )}
                </Stack>
            </Stack>
        </Stack>
    )
}

const renderLastDescription = (faction: Faction) => {
    switch (faction.label) {
        case "Boston Cybernetics":
            return "By enlisting in Boston Cybernetics, you are joining a financial and commercial superpower with plans for space colonization."
        case "Zaibatsu Heavy Industries":
            return "By enlisting in Zaibatsu, you are joining a powerhouse in city construction and industrial production."
        case "Red Mountain Offworld Mining Corporation":
            return "By enlisting in Red Mountain, you are joining the greatest interplanetary mining faction ever assembled."
    }
}

const ExtendedFactionEnlist = ({ faction }: { faction: Faction }) => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsUser("/user_commander")
    const below1250 = useMediaQuery("(max-width:1250px)")

    const enlistFaction = useCallback(async () => {
        try {
            await send<null, { faction_id: string }>(GameServerKeys.EnlistFaction, { faction_id: faction.id })
            newSnackbarMessage("Successfully enlisted into faction.", "success")
        } catch (err) {
            newSnackbarMessage(typeof err === "string" ? err : "Failed to enlist into faction.", "error")
            console.error(err)
        }
        return
    }, [send, faction.id, newSnackbarMessage])

    return (
        <Fade in key={faction.id}>
            <Box sx={{ maxHeight: "65vh" }}>
                <ClipThing
                    clipSize="10px"
                    corners={{
                        topRight: true,
                        bottomLeft: true,
                    }}
                    border={{
                        borderColor: faction.primary_color,
                        borderThickness: ".3rem",
                    }}
                    sx={{
                        position: "relative",
                        height: "100%",
                    }}
                    backgroundColor={faction.background_color}
                    opacity={0.9}
                >
                    <Stack
                        alignItems="center"
                        justifyContent="space-around"
                        spacing="3rem"
                        sx={{
                            py: below1250 ? "3rem" : "4rem",
                            px: below1250 ? "3rem" : "5rem",
                            textAlign: "center",
                            height: "100%",
                        }}
                    >
                        <Box component={"img"} src={faction.logo_url} alt={faction.label} sx={{ height: below1250 ? "10rem" : "13rem" }} />

                        <Typography variant={"h1"} sx={{ fontFamily: fonts.nostromoBlack, fontSize: "2rem" }}>
                            {faction.label}
                        </Typography>

                        <Box
                            sx={{
                                flex: 1,
                                overflowY: "auto",
                                overflowX: "hidden",
                                ml: "1.9rem",
                                mr: ".5rem",
                                pr: "1.4rem",
                                my: "1rem",
                                direction: "ltr",
                                scrollbarWidth: "none",
                                "::-webkit-scrollbar": {
                                    width: "1rem",
                                },
                                "::-webkit-scrollbar-track": {
                                    background: "#FFFFFF15",
                                },
                                "::-webkit-scrollbar-thumb": {
                                    background: faction.primary_color,
                                },
                            }}
                        >
                            <Box sx={{ direction: "ltr", height: "0" }}>
                                <Typography variant={"subtitle1"} sx={{ fontSize: "2rem", textAlign: "left" }}>
                                    {faction.description}
                                    <br />
                                    <br />
                                    {renderLastDescription(faction)}
                                </Typography>
                            </Box>
                        </Box>

                        <FancyButton
                            clipThingsProps={{
                                clipSize: "9px",
                                backgroundColor: faction.primary_color,
                                opacity: 1,
                                border: { isFancy: true, borderColor: faction.primary_color, borderThickness: "2px" },
                                sx: { position: "relative" },
                            }}
                            sx={{ px: "8rem", py: "1rem", color: faction.secondary_color }}
                            onClick={enlistFaction}
                        >
                            <Typography variant="caption" sx={{ color: faction.secondary_color, fontFamily: fonts.nostromoBlack }}>
                                Enlist
                            </Typography>
                        </FancyButton>
                    </Stack>

                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            opacity: 0.1,
                            zIndex: -2,
                            background: `url(${faction.background_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                    />

                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            opacity: 0.1,
                            zIndex: -1,
                            background: `linear-gradient(0deg, #FFFFFF20 26%, ${faction.primary_color})`,
                        }}
                    />
                </ClipThing>
            </Box>
        </Fade>
    )
}

const ExtendedFactionCarousel = ({ factions }: { factions: Faction[] }) => {
    const [openedFaction, setOpenedFaction] = useState<Faction>(factions[0])
    const [unselectedFactions, setUnselectedFactions] = useState<Faction[]>(factions.slice(1))

    const onSelect = (faction: Faction) => {
        const newUnselected = factions.filter((el) => {
            return el.id != faction.id
        })
        setUnselectedFactions(newUnselected)
        setOpenedFaction(faction)
    }

    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
            <FactionLogoSelector onClick={onSelect} faction={unselectedFactions[0]} />
            <Box sx={{ maxWidth: "60%" }}>
                <ExtendedFactionEnlist faction={openedFaction} />
            </Box>
            <FactionLogoSelector onClick={onSelect} faction={unselectedFactions[1]} />
        </Box>
    )
}

const FactionLogoSelector = ({ faction, onClick }: { faction: Faction; onClick: (faction: Faction) => void }) => {
    return (
        <Box
            component={"img"}
            src={faction.logo_url}
            sx={{ height: "15rem", "&:hover": { cursor: "pointer", transform: "scale(1.3)", transition: "all .2s ease-in-out" } }}
            tabIndex={0}
            onClick={() => {
                onClick(faction)
            }}
        />
    )
}
