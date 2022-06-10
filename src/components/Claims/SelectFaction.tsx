import { useSnackbar, useSupremacy } from "../../containers"
import { Faction } from "../../types"
import { ClipThing } from "../Common/ClipThing"
import { fonts } from "../../theme/theme"
import { Box, Fade, Stack, Typography, useMediaQuery } from "@mui/material"
import { useCallback, useState } from "react"
import { GameServerKeys } from "../../keys"
import { useGameServerCommandsUser } from "../../hooks/useGameServer"
import { FancyButton } from "../Common/FancyButton"

export const SelectFaction = () => {
    return <SelectFactionInner />
}

const SelectFactionInner = () => {
    const { factionsAll } = useSupremacy()
    const belowQuery = useMediaQuery("(max-width:1000px)")
    return (
        <Stack alignItems={"center"}>
            <Typography variant={"h1"} sx={{ fontSize: "3rem", mt: "3rem" }}>
                Choose Your Syndicate
            </Typography>
            <Stack
                direction={"row"}
                spacing={"3rem"}
                sx={{
                    display: "flex",
                    padding: "5rem",
                    justifyContent: "space-around",
                }}
            >
                {belowQuery ? (
                    <ExtendedFactionCarousel factions={Object.values(factionsAll)} />
                ) : (
                    Object.values(factionsAll).map((f) => <ExtendedFactionEnlist key={f.id} faction={f} />)
                )}
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
            return "By enlisting in Red Mountain, you are joining the greatest interplanetary mining syndicate ever assembled."
    }
}

interface ExtendedFactionEnlistProps {
    faction: Faction
}

const ExtendedFactionEnlist = ({ faction }: ExtendedFactionEnlistProps) => {
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsUser("/user_commander")

    const belowQuery = useMediaQuery("(max-width:1250px)")

    const enlistFaction = useCallback(async () => {
        try {
            await send<null, { faction_id: string }>(GameServerKeys.EnlistFaction, { faction_id: faction.id })
            newSnackbarMessage("Successfully enlisted into syndicate.", "success")
        } catch (e) {
            newSnackbarMessage(typeof e === "string" ? e : "Failed to enlist into syndicate.", "error")
            console.debug(e)
        }
        return
    }, [send, faction.id, newSnackbarMessage])

    return (
        <Fade in key={faction.id}>
            <Box>
                <ClipThing
                    clipSize="8px"
                    corners={{
                        topRight: true,
                        bottomLeft: true,
                    }}
                    border={{
                        borderColor: faction.primary_color,
                        borderThickness: ".1rem",
                    }}
                    sx={{
                        position: "relative",
                        py: belowQuery ? "2rem" : "3rem",
                        px: belowQuery ? "3rem" : "5rem",
                        height: "100%",
                    }}
                    backgroundColor={faction.background_color}
                    opacity={0.7}
                >
                    <Stack
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            height: "100%",
                            justifyContent: "space-around",
                        }}
                    >
                        <Box component={"img"} src={faction.logo_url} sx={{ height: belowQuery ? "10rem" : "15rem", mb: "3rem" }} />
                        <Typography variant={"h1"} sx={{ fontSize: "2rem", mb: "2rem" }}>
                            {faction.label}
                        </Typography>
                        <Typography variant={"subtitle1"} sx={{ fontSize: "2rem", mb: belowQuery ? "2rem" : "4rem", lineHeight: "1.5", textAlign: "left" }}>
                            {faction.description}
                        </Typography>
                        <Typography variant={"subtitle1"} sx={{ fontSize: "2rem", mb: "4rem", lineHeight: "1.5", textAlign: "left" }}>
                            {renderLastDescription(faction)}
                        </Typography>
                        <FancyButton
                            onClick={enlistFaction}
                            clipThingsProps={{
                                clipSize: "8px",
                                opacity: 0.8,
                                backgroundColor: faction.background_color,
                                border: { borderColor: faction.primary_color },
                                sx: { mr: "1rem" },
                            }}
                            sx={{ px: "8rem", py: "1rem" }}
                        >
                            <Typography sx={{ fontFamily: fonts.nostromoBold, fontSize: "2rem" }}>Enlist</Typography>
                        </FancyButton>
                    </Stack>
                </ClipThing>
            </Box>
        </Fade>
    )
}

interface ExtendedFactionCarouselProps {
    factions: Faction[]
}

const ExtendedFactionCarousel = ({ factions }: ExtendedFactionCarouselProps) => {
    const [openedFaction, setOpenedFaction] = useState<Faction>(factions[0])
    const [unselectedFactions, setUnselectedFactions] = useState<Faction[]>([factions[1], factions[2]])

    const onSelect = (faction: Faction) => {
        const newUnselected = factions.filter((el) => {
            return el.id != faction.id
        })
        setUnselectedFactions(newUnselected)
        setOpenedFaction(faction)
    }

    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <FactionLogoSelector onClick={onSelect} faction={unselectedFactions[0]} />
            <Box sx={{ maxWidth: "60%" }}>
                <ExtendedFactionEnlist faction={openedFaction} />
            </Box>
            <FactionLogoSelector onClick={onSelect} faction={unselectedFactions[1]} />
        </Box>
    )
}

interface LogoSelectorProps extends ExtendedFactionEnlistProps {
    onClick: (faction: Faction) => void
}
const FactionLogoSelector = ({ faction, onClick }: LogoSelectorProps) => {
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
