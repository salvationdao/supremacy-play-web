import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material"
import React, { useCallback, useMemo } from "react"
import { useAuth, useGlobalNotifications, useSupremacy } from "../../containers"
import { opacityEffect } from "../../theme/keyframes"
import { colors } from "../../theme/theme"
import { getCardStyles, MechCard } from "./MechCard"
import { BattleLobbiesMech, BattleLobby, BattleLobbySupporter } from "../../types/battle_queue"
import { FactionIDs } from "../../constants"
import { Avatar } from "../Avatar"
import { useGameServerCommandsFaction } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { SvgPlus } from "../../assets"
import QuestionMarkIcon from "@mui/icons-material/QuestionMark"

const avatarsToShow = 10

export const UpcomingBattle = ({ nextBattle }: { nextBattle: BattleLobby }) => {
    const { factionID: usersFactionID } = useAuth()

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
                    factionLabel={"Boston Cybernetics"}
                    usersFactionID={usersFactionID}
                    battleLobbyID={nextBattle.id}
                    optedInSupporters={nextBattle.opted_in_bc_supporters || []}
                    selectedSupporters={nextBattle.selected_bc_supporters || []}
                />
                <CardGroup
                    mechs={zaiMechs}
                    factionID={FactionIDs.ZHI}
                    factionLabel={"Zaibatsu Heavy Industries"}
                    usersFactionID={usersFactionID}
                    battleLobbyID={nextBattle.id}
                    optedInSupporters={nextBattle.opted_in_zai_supporters || []}
                    selectedSupporters={nextBattle.selected_zai_supporters || []}
                />
                <CardGroup
                    mechs={rmMechs}
                    factionID={FactionIDs.RM}
                    factionLabel={"Red Mountain Offworld Mining Corporation"}
                    usersFactionID={usersFactionID}
                    battleLobbyID={nextBattle.id}
                    optedInSupporters={nextBattle.opted_in_rm_supporters || []}
                    selectedSupporters={nextBattle.selected_rm_supporters || []}
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
    factionLabel,
    mechs,
    battleLobbyID,
    optedInSupporters,
    selectedSupporters,
    usersFactionID,
}: {
    battleLobbyID: string | undefined
    factionID: string
    factionLabel: string
    usersFactionID: string
    mechs: BattleLobbiesMech[]
    optedInSupporters: BattleLobbySupporter[]
    selectedSupporters: BattleLobbySupporter[]
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
            <Grid container spacing={0} direction="row" sx={{ width: "100%", flexWrap: "nowrap", justifyContent: "space-evenly" }}>
                {mechs.map((m) => (
                    <Grid key={`${m.mech_id}-${m.is_destroyed}-${m.battle_lobby_id}`} item sm={4} maxHeight={"100%"}>
                        <MechCard mech={m} faction={faction} />
                    </Grid>
                ))}
            </Grid>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    flex: 1,
                    gap: "0.5rem",
                    padding: "0 40px",
                    margin: "auto",
                }}
            >
                {/*title*/}
                {usersFaction && selectedSupporters.length === 0 && <Typography variant={"h4"}>{factionLabel} Sign up for Support</Typography>}
                {usersFaction && selectedSupporters.length > 0 && <Typography variant={"h4"}>{factionLabel} Selected Supporters</Typography>}
                {!usersFaction && <Typography variant={"h4"}>{factionLabel}</Typography>}

                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "start",
                        flexWrap: "nowrap",
                        flex: 1,
                        gap: "0.5rem",
                        padding: "0 40px",
                    }}
                >
                    {/* not the users faction, display ? */}
                    {!usersFaction && new Array(5).fill(0).map((_, i) => <QuestionMark key={`${i}-question`} factionID={factionID} />)}

                    {/* users faction and no selected supporters, display opted in users and join buttons*/}
                    {usersFaction &&
                        selectedSupporters.length === 0 &&
                        optedInSupporters.map((sup, i) => {
                            if (i >= avatarsToShow) return null
                            return (
                                <Avatar
                                    marginLeft={optedInSupporters.length > avatarsToShow ? -10 : 0}
                                    zIndexAdded={i}
                                    key={`${sup.id}`}
                                    username={sup.username}
                                    factionID={sup.faction_id}
                                    avatarURL={sup.avatar_url}
                                    customAvatarID={sup.custom_avatar_id}
                                />
                            )
                        })}
                    {/* users faction, display opt in buttons*/}
                    {usersFaction &&
                        selectedSupporters.length === 0 &&
                        5 - optedInSupporters.length > 0 &&
                        new Array(5 - optedInSupporters.length)
                            .fill(0)
                            .map((_, i) => <OptInButton key={`${factionID}-add-${i}`} battleLobbyID={battleLobbyID} factionID={factionID} />)}
                    {/* users faction and more than 5 opted in supporters, display count */}
                    {usersFaction && selectedSupporters.length === 0 && 5 - optedInSupporters.length > 0 && optedInSupporters.length >= avatarsToShow && (
                        <CountButton
                            factionID={factionID}
                            count={optedInSupporters.length - avatarsToShow}
                            marginLeft={optedInSupporters.length > avatarsToShow ? -10 : 0}
                            zIndexAdded={optedInSupporters.length + 1}
                        />
                    )}
                    {/* users faction, display opt in button */}
                    {usersFaction && selectedSupporters.length === 0 && (
                        <OptInButton key={`${factionID}-add-extra-one`} battleLobbyID={battleLobbyID} factionID={factionID} />
                    )}

                    {/* if users faction and we have some selected supporter, display the supporters */}
                    {usersFaction &&
                        selectedSupporters.length > 0 &&
                        selectedSupporters.map((sup, i) => {
                            return (
                                <Box key={`selected-${sup.id}`} sx={{ display: "flex", flexDirection: "row" }}>
                                    <Typography>{i + 1}. </Typography>
                                    <Avatar
                                        marginLeft={0}
                                        zIndexAdded={i}
                                        username={sup.username}
                                        factionID={sup.faction_id}
                                        avatarURL={sup.avatar_url}
                                        customAvatarID={sup.custom_avatar_id}
                                    />
                                </Box>
                            )
                        })}
                </Box>
            </Box>
        </Box>
    )
}

const CountButton = ({ factionID, count, marginLeft, zIndexAdded }: { factionID: string; count: number; zIndexAdded: number; marginLeft: number }) => {
    const { border } = getCardStyles(factionID)

    return (
        <Box
            sx={{
                position: "relative",
                height: "75px",
                width: "75px",
                overflow: "hidden",
                zIndex: zIndexAdded,
                marginLeft: marginLeft,
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
                    zIndex: zIndexAdded + 2,
                    overflow: "hidden",
                    pointerEvents: "none",
                    position: "absolute",
                }}
            />
            <Box
                sx={{
                    height: "100%",
                    width: "100%",
                    maxHeight: "100%",
                    maxWidth: "100%",
                    zIndex: zIndexAdded + 1,
                    overflow: "hidden",
                    pointerEvents: "none",
                    position: "absolute",
                    backgroundColor: "black",
                    clipPath: "polygon(11% 4%, 90% 4%, 97% 11%, 97% 93%, 2% 93%, 2% 11%)",
                }}
            />
            <Typography
                variant={"h5"}
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    zIndex: zIndexAdded + 2,
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
