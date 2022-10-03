import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material"
import React, { useCallback, useMemo, useState } from "react"
import { useAuth, useGlobalNotifications, useSupremacy } from "../../containers"
import { useGameServerCommandsFaction, useGameServerSubscription } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { opacityEffect } from "../../theme/keyframes"
import { colors } from "../../theme/theme"
import { getCardStyles, MechCard } from "./MechCard"
import { BattleLobbiesMech, BattleLobby, BattleLobbySupporter } from "../../types/battle_queue"
import { FactionIDs } from "../../constants"
import { Avatar } from "../Avatar"
import { SvgPlus } from "../../assets"
import QuestionMarkIcon from "@mui/icons-material/QuestionMark"

const avatarsToShow = 16

export const UpcomingBattle = () => {
    const { factionID: usersFactionID } = useAuth()
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
                    // maxHeight: "600px",
                    maxWidth: "95%",
                    minWidth: "300px",
                    overflow: "auto",
                    gap: "1rem",
                }}
            >
                <CardGroup
                    mechs={bcMechs}
                    factionID={FactionIDs.BC}
                    usersFactionID={usersFactionID}
                    battleLobbyID={nextBattle.id}
                    optedInSupporters={nextBattle.opted_in_bc_supporters || []}
                />
                <CardGroup
                    mechs={zaiMechs}
                    factionID={FactionIDs.ZHI}
                    usersFactionID={usersFactionID}
                    battleLobbyID={nextBattle.id}
                    optedInSupporters={nextBattle.opted_in_zai_supporters || []}
                />
                <CardGroup
                    mechs={rmMechs}
                    factionID={FactionIDs.RM}
                    usersFactionID={usersFactionID}
                    battleLobbyID={nextBattle.id}
                    optedInSupporters={nextBattle.opted_in_rm_supporters || []}
                />
            </Box>
        )
    }, [nextBattle, usersFactionID])

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
            {content}
        </Box>
    )
}

const CardGroup = ({
    factionID,
    mechs,
    battleLobbyID,
    optedInSupporters,
    usersFactionID,
}: {
    battleLobbyID: string | undefined
    factionID: string
    usersFactionID: string
    mechs: BattleLobbiesMech[]
    optedInSupporters: BattleLobbySupporter[]
}) => {
    const { getFaction } = useSupremacy()
    const faction = getFaction(factionID)
    const usersFaction = factionID === usersFactionID

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                width: "100%",
                maxWidth: "800px",
                gap: "0.5rem",
                margin: "auto",
            }}
        >
            <Grid container spacing={0} direction="row" sx={{ width: "100%", maxHeight: "70%", flexWrap: "nowrap" }}>
                {mechs.map((m) => (
                    <Grid key={`${m.mech_id}-${m.is_destroyed}-${m.battle_lobby_id}`} item sm={4} maxHeight={"100%"}>
                        <MechCard mech={m} faction={faction} />
                    </Grid>
                ))}
            </Grid>
            {!usersFaction && (
                <Box
                    sx={{
                        maxHeight: "100%",
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        flexWrap: "wrap",
                        flex: 1,
                        gap: "0.5rem",
                    }}
                >
                    {5 - optedInSupporters.length > 0 &&
                        new Array(5 - optedInSupporters.length).fill(0).map((_, i) => <QuestionMark key={`${i}-question`} factionID={factionID} />)}
                </Box>
            )}
            {usersFaction && (
                <Box
                    sx={{
                        maxHeight: "100%",
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        flexWrap: "wrap",
                        flex: 1,
                        gap: "0.5rem",
                    }}
                >
                    {optedInSupporters.map((sup, i) => {
                        if (i >= avatarsToShow) return null
                        return (
                            <Avatar
                                key={`${sup.id}`}
                                username={sup.username}
                                factionID={sup.faction_id}
                                avatarURL={sup.avatar_url}
                                customAvatarID={sup.custom_avatar_id}
                            />
                        )
                    })}
                    {5 - optedInSupporters.length > 0 &&
                        new Array(5 - optedInSupporters.length)
                            .fill(0)
                            .map((_, i) => <OptInButton key={`${factionID}-add-${i}`} battleLobbyID={battleLobbyID} factionID={factionID} />)}
                    {optedInSupporters.length >= avatarsToShow && <CountButton factionID={factionID} count={optedInSupporters.length - avatarsToShow} />}
                    <OptInButton key={`${factionID}-add-extra-one`} battleLobbyID={battleLobbyID} factionID={factionID} />
                </Box>
            )}
        </Box>
    )
}

const CountButton = ({ factionID, count }: { factionID: string; count: number }) => {
    const { border } = getCardStyles(factionID)

    return (
        <Box
            sx={{
                position: "relative",
                height: "75px",
                width: "75px",
                overflow: "hidden",
            }}
        >
            <Box
                component={"img"}
                src={border}
                sx={{
                    height: "100%",
                    width: "100%",
                    maxHeight: "100%",
                    maxWidth: "100%",
                    zIndex: 3,
                    overflow: "hidden",
                    pointerEvents: "none",
                    position: "absolute",
                }}
            />
            <Typography
                variant={"h4"}
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
                color={"primary"}
            >
                + {count}
            </Typography>
        </Box>
    )
}

const OptInButton = ({ battleLobbyID, factionID }: { battleLobbyID: string | undefined; factionID: string }) => {
    const { border } = getCardStyles(factionID)
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { newSnackbarMessage } = useGlobalNotifications()

    const optIn = useCallback(async () => {
        if (!battleLobbyID) return
        try {
            await send(GameServerKeys.JoinBattleLobbySupporter, { battle_lobby_id: battleLobbyID })
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to opt in to support battle."
            console.error(message)
            newSnackbarMessage(message, "error")
        }
    }, [send, battleLobbyID, newSnackbarMessage])

    return (
        <Box
            sx={{
                position: "relative",
                height: "75px",
                width: "75px",
                overflow: "hidden",
                cursor: "pointer",
            }}
            onClick={optIn}
        >
            <Box
                component={"img"}
                src={border}
                sx={{
                    height: "100%",
                    width: "100%",
                    maxHeight: "100%",
                    maxWidth: "100%",
                    zIndex: 3,
                    overflow: "hidden",
                    pointerEvents: "none",
                    position: "absolute",
                }}
            />
            <SvgPlus
                sx={{
                    scale: 2,
                    height: "100%",
                    width: "100%",
                    zIndex: 3,
                    overflow: "hidden",
                    pointerEvents: "none",
                    position: "absolute",
                }}
            />
        </Box>
    )
}

const QuestionMark = ({ factionID }: { factionID: string }) => {
    const { border } = getCardStyles(factionID)
    return (
        <Box
            sx={{
                position: "relative",
                height: "75px",
                width: "75px",
                overflow: "hidden",
            }}
        >
            <Box
                component={"img"}
                src={border}
                sx={{
                    height: "100%",
                    width: "100%",
                    maxHeight: "100%",
                    maxWidth: "100%",
                    zIndex: 3,
                    overflow: "hidden",
                    pointerEvents: "none",
                    position: "absolute",
                }}
            />
            <QuestionMarkIcon
                color={"warning"}
                sx={{
                    height: "60%",
                    width: "60%",
                    zIndex: 3,
                    overflow: "hidden",
                    pointerEvents: "none",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            />
        </Box>
    )
}
