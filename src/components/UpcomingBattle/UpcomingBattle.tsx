import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { useSupremacy } from "../../containers"
import { useGameServerSubscription } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { opacityEffect, shake } from "../../theme/keyframes"
import { colors, fonts } from "../../theme/theme"
import { MechCard } from "./MechCard"
import { FancyButton } from "../Common/FancyButton"
import { BattleLobbiesMech, BattleLobby } from "../../types/battle_queue"
import { FactionIDs } from "../../constants"

export const UpcomingBattle = () => {
    const [nextBattle, setNextBattle] = useState<BattleLobby | undefined>()

    // Subscribe on battle end information
    useGameServerSubscription<BattleLobby>(
        {
            URI: `/public/upcoming_battle`,
            key: GameServerKeys.NextBattleDetails,
        },
        (payload) => {
            if (!payload) return
            setNextBattle(payload)
        },
    )

    const content = useMemo(() => {
        if (!nextBattle) {
            return (
                <Stack justifyContent="center" alignItems="center" sx={{ height: "6rem" }}>
                    <CircularProgress size="3rem" sx={{ color: "#FFFFFF" }} />
                </Stack>
            )
        }

        const bcMechs: BattleLobbiesMech[] = []
        const zaiMechs: BattleLobbiesMech[] = []
        const rmMechs: BattleLobbiesMech[] = []
        nextBattle.battle_lobbies_mechs.forEach((m) => {
            switch (m.owner.faction_id) {
                case FactionIDs.ZHI:
                    zaiMechs.push(m)
                    break
                case FactionIDs.BC:
                    bcMechs.push(m)
                    break
                case FactionIDs.RM:
                    rmMechs.push(m)
            }
        })

        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "nowrap",
                    flex: 1,
                    height: "100%",
                    width: "100%",
                    maxHeight: "600px",
                    maxWidth: "95%",
                    minWidth: "300px",
                    overflow: "auto",
                    gap: "1rem",
                }}
            >
                <CardGroup mechs={bcMechs} factionID={FactionIDs.BC} />
                <CardGroup mechs={zaiMechs} factionID={FactionIDs.ZHI} />
                <CardGroup mechs={rmMechs} factionID={FactionIDs.RM} />
            </Box>
        )
    }, [nextBattle])

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center",
                maxWidth: "100%",
                maxHeight: "100%",
                width: "100%",
                height: "100%",
                backgroundColor: colors.darkNavy,
                backgroundImage: `url(${nextBattle?.game_map?.background_url})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                animation: `${opacityEffect} .2s ease-in`,
            }}
        >
            <Typography
                variant="h4"
                gutterBottom={true}
                sx={{
                    lineHeight: 1,
                    textAlign: "center",
                    fontFamily: fonts.nostromoBlack,
                }}
            >
                <i>COMING UP... {nextBattle?.game_map?.name || ""}</i>
            </Typography>
            {content}
        </Box>
    )
}

const CardGroup = ({ factionID, mechs }: { factionID: string; mechs: BattleLobbiesMech[] }) => {
    const { getFaction } = useSupremacy()
    const faction = getFaction(factionID)

    return (
        <Box
            sx={{
                display: "flex",
                flex: 1,
                width: "100%",
                maxWidth: "700px",
                margin: "auto",
            }}
        >
            <Grid container spacing={0} direction="row" sx={{ width: "100%", height: "100%" }}>
                {mechs.map((m) => (
                    <Grid
                        item
                        xs={4}
                        sm={3}
                        sx={{
                            maxHeight: {
                                xs: "80%",
                                sm: "100%",
                            },
                        }}
                    >
                        <MechCard mech={m} faction={faction} />
                    </Grid>
                ))}

                <Grid
                    item
                    xs={12}
                    sm={3}
                    sx={{
                        maxHeight: "100%",
                        display: "flex",
                        justifyContent: "space-evenly",
                        flexWrap: "wrap",
                        flex: 1,
                        gap: "0.5rem",
                        overflow: "hidden",
                        minWidth: "100px",
                    }}
                >
                    <Typography variant={"h3"} textAlign={"center"} sx={{ width: "100%" }}>
                        Support Team
                    </Typography>
                    <OptInButton />
                    <OptInButton />
                    <OptInButton />
                    <OptInButton />
                    <OptInButton />
                </Grid>
            </Grid>
        </Box>
    )
}

const OptInButton = () => {
    const optIn = () => {
        //todo - add backend call to opt in for team support
    }

    return (
        <Box sx={{ flex: 1, minWidth: "45%", maxWidth: "200px", minHeight: "36px" }}>
            <FancyButton
                // disabled={disabled}
                clipThingsProps={{
                    clipSize: "5px",
                    backgroundColor: colors.green,
                    border: { borderColor: colors.green, borderThickness: "1px" },
                    // sx: { position: "relative", animation: !disabled ? `${shake(0.38)} 1s infinite` : "unset" },
                    sx: {
                        position: "relative",
                        animation: `${shake(0.38)} 1s infinite`,
                        flex: 1,
                        minWidth: "45%",
                        maxWidth: "200px",
                        minHeight: "36px",
                    },
                }}
                sx={{ px: "1rem", pt: 0, pb: ".1rem", minWidth: "7rem", color: "#FFFFFF" }}
                onClick={optIn}
            >
                <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack, margin: "auto" }}>
                    OPT IN
                    {/*{isOptedIn ? "OPTED IN" : "OPT IN"}*/}
                </Typography>
            </FancyButton>
        </Box>
    )
}
