import { Box, Slide, Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { SvgCheckMark, SvgPlus, SvgQuestionMark2, SvgUserDiamond } from "../../../../assets"
import { FactionIDs } from "../../../../constants"
import { useAuth, useGlobalNotifications, useSupremacy } from "../../../../containers"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { pulseEffect } from "../../../../theme/keyframes"
import { colors, fonts } from "../../../../theme/theme"
import { BattleLobby } from "../../../../types/battle_queue"
import { NiceBoxThing } from "../../../Common/Nice/NiceBoxThing"
import { NiceButton } from "../../../Common/Nice/NiceButton"
import { TypographyTruncated } from "../../../Common/TypographyTruncated"
import { FactionLobbySlots } from "../../../Lobbies/LobbyItem/LobbyItem"

export interface BattleIntroProps {
    currentBattle: BattleLobby
}

export const BattleIntro = ({ currentBattle }: BattleIntroProps) => {
    const { factionsAll } = useSupremacy()

    const factions = useMemo(() => {
        if (!currentBattle) return
        const lobbies: FactionLobbySlots[] = []

        Object.values(factionsAll)
            .sort((a, b) => a.label.localeCompare(b.label))
            .forEach((f) => {
                const bls: FactionLobbySlots = {
                    details: currentBattle,
                    faction: f,
                    mechSlots: [],
                    selectedSupporterSlots: [],
                    optedInSupporterSlots: [],
                }

                currentBattle.battle_lobbies_mechs.forEach((blm) => {
                    // Skip, if not in the same faction
                    if (blm.faction_id !== f.id) return

                    // Parse data
                    bls.mechSlots.push(blm)
                })

                // since supporters are already split up by faction, use a switch to add the right one to this object
                switch (f.id) {
                    case FactionIDs.ZHI:
                        bls.selectedSupporterSlots.push(...(currentBattle.selected_zai_supporters || []))
                        bls.optedInSupporterSlots.push(...(currentBattle.opted_in_zai_supporters || []))
                        break
                    case FactionIDs.BC:
                        bls.selectedSupporterSlots.push(...(currentBattle.selected_bc_supporters || []))
                        bls.optedInSupporterSlots.push(...(currentBattle.opted_in_bc_supporters || []))
                        break
                    case FactionIDs.RM:
                        bls.selectedSupporterSlots.push(...(currentBattle.selected_rm_supporters || []))
                        bls.optedInSupporterSlots.push(...(currentBattle.opted_in_rm_supporters || []))
                        break
                }

                lobbies.push(bls)
            })

        return lobbies
    }, [currentBattle, factionsAll])

    return (
        <Stack
            sx={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: `url(${currentBattle?.game_map?.background_url})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            {factions?.map((f, index) => (
                <FactionRow key={index} index={index} lobby={f} />
            ))}
        </Stack>
    )
}

interface FactionRowProps {
    index: number
    lobby: FactionLobbySlots
}

const MAX_SUPPORTER_SLOTS = 5
const MAX_SUPPORTERS_TO_SHOW = 5

const FactionRow = ({ index, lobby }: FactionRowProps) => {
    const { getFaction } = useSupremacy()
    const { userID, factionID } = useAuth()

    const theme = getFaction(lobby.faction.id).palette
    const { details, selectedSupporterSlots, optedInSupporterSlots } = lobby

    // Opt-in
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { newSnackbarMessage } = useGlobalNotifications()
    const [optInError, setOptInError] = useState<string>()
    const onOptIn = useCallback(async () => {
        try {
            await send(GameServerKeys.JoinBattleLobbySupporter, { battle_lobby_id: details.id, access_code: details.access_code })
            setOptInError(undefined)
            newSnackbarMessage(`Successfully opted-in to lobby ${details.name} as a supporter`, "success")
        } catch (err) {
            let message = "Failed to opt in to support battle."
            if (typeof err === "string") {
                message = err
            } else if (err instanceof Error) {
                message = err.message
            }
            setOptInError(message)
        }
    }, [details.access_code, details.id, details.name, newSnackbarMessage, send])

    const supporterContent = useMemo(() => {
        const isMyFaction = factionID === lobby.faction.id
        const boxSize = "4rem"
        if (!isMyFaction) {
            return new Array(MAX_SUPPORTER_SLOTS).fill(null).map((_, index) => (
                <NiceBoxThing
                    key={index}
                    border={{
                        color: theme.primary,
                        thickness: "lean",
                    }}
                    background={{
                        colors: [theme.background],
                    }}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: boxSize,
                        width: boxSize,
                    }}
                >
                    <SvgQuestionMark2 fill={theme.s700} />
                </NiceBoxThing>
            ))
        }

        if (selectedSupporterSlots.length === 0) {
            return (
                <>
                    {optedInSupporterSlots.map((os, index) => {
                        if (index > MAX_SUPPORTERS_TO_SHOW) return
                        return (
                            <Box
                                key={index}
                                component="img"
                                src={os.avatar_url}
                                alt={`${os.username}'s avatar`}
                                sx={{
                                    height: boxSize,
                                    width: boxSize,
                                    border: `1px solid ${theme.primary}`,
                                }}
                            />
                        )
                    })}
                    {new Array(MAX_SUPPORTER_SLOTS - optedInSupporterSlots.length).fill(null).map((_, index) => (
                        <NiceButton
                            key={`${index}-empty`}
                            onClick={onOptIn}
                            buttonColor={theme.primary}
                            sx={{
                                height: boxSize,
                                width: boxSize,
                                animation: `${pulseEffect} 1s infinite`,
                            }}
                        >
                            <SvgPlus fill={theme.s700} />
                        </NiceButton>
                    ))}
                    {optedInSupporterSlots.length - MAX_SUPPORTERS_TO_SHOW > 0 && (
                        <Typography
                            sx={{
                                height: boxSize,
                                width: boxSize,
                            }}
                        >
                            +{optedInSupporterSlots.length - MAX_SUPPORTERS_TO_SHOW} more
                        </Typography>
                    )}
                    {optInError && (
                        <TypographyTruncated
                            sx={{
                                color: colors.red,
                            }}
                        >
                            {optInError}
                        </TypographyTruncated>
                    )}
                </>
            )
        }
        return (
            <>
                {selectedSupporterSlots.map((ss, index) => (
                    <NiceBoxThing
                        key={index}
                        border={{
                            color: theme.primary,
                            thickness: "lean",
                        }}
                        background={{
                            colors: [theme.background],
                        }}
                        sx={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: boxSize,
                            width: boxSize,
                        }}
                    >
                        {ss.avatar_url && (
                            <Box
                                component="img"
                                src={ss.avatar_url}
                                alt={`${ss.username}'s avatar`}
                                sx={{
                                    width: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        )}
                        <Stack
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <SvgCheckMark fill={colors.green} />
                        </Stack>
                    </NiceBoxThing>
                ))}
            </>
        )
    }, [factionID, lobby.faction.id, onOptIn, optInError, optedInSupporterSlots, selectedSupporterSlots, theme.background, theme.primary, theme.s700])

    return (
        <Slide in direction={index % 2 === 0 ? "left" : "right"}>
            <Stack
                sx={{
                    flex: 1,
                    width: "100%",
                    p: "2rem 4rem",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: `${theme.s600}66`,
                    "&:not(:last-child)": {
                        borderBottom: `1px solid ${colors.black2}aa`,
                    },
                }}
            >
                <Stack
                    direction="row"
                    spacing="2rem"
                    sx={{
                        width: "100%",
                        maxWidth: 1100,
                        m: "0 auto",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Stack
                        alignItems="center"
                        spacing="1rem"
                        sx={{
                            width: "100%",
                            maxWidth: 150,
                        }}
                    >
                        {/* Faction logo */}
                        <Box
                            component="img"
                            src={lobby.faction.logo_url}
                            sx={{
                                width: "100%",
                                objectFit: "contain",
                            }}
                        />
                        {/* Supporters */}
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "1rem",
                            }}
                        >
                            {supporterContent}
                        </Box>
                    </Stack>
                    {lobby.mechSlots.map((ms, index) => (
                        <Stack
                            key={index}
                            sx={{
                                width: "100%",
                                maxWidth: 200,
                            }}
                        >
                            <Stack direction="row" spacing=".5rem">
                                {/* Mech avatar */}
                                <Box
                                    component="img"
                                    src={ms.avatar_url}
                                    sx={{
                                        width: "100%",
                                        maxWidth: 160,
                                        objectFit: "cover",
                                        border: `1px solid ${colors.black2}`,
                                    }}
                                />
                                {/* Weapon slots */}
                                <Stack spacing=".5rem" flex={1}>
                                    {ms.weapon_slots &&
                                        ms.weapon_slots.map((w, index) => (
                                            <Box
                                                key={index}
                                                component="img"
                                                src={w.weapon?.avatar_url}
                                                sx={{
                                                    width: "100%",
                                                    objectFit: "contain",
                                                    backgroundColor: theme.background,
                                                    border: `1px solid ${colors.black2}`,
                                                }}
                                            />
                                        ))}
                                </Stack>
                            </Stack>
                            {/* Mech label */}
                            <TypographyTruncated
                                sx={{
                                    fontFamily: fonts.nostromoBold,
                                    fontSize: "2rem",
                                }}
                            >
                                {ms.name || ms.label}
                            </TypographyTruncated>
                            {/* Owner */}
                            <TypographyTruncated
                                variant="h6"
                                sx={{
                                    color: ms.owner_id === userID ? colors.gold : "white",
                                    fontWeight: "bold",
                                    mt: ".3rem !important",
                                }}
                            >
                                <SvgUserDiamond size="2.5rem" inline fill={ms.owner_id === userID ? colors.gold : lobby.faction.palette.primary} />{" "}
                                {ms.owner.username}#{ms.owner.gid}
                            </TypographyTruncated>
                        </Stack>
                    ))}
                </Stack>
            </Stack>
        </Slide>
    )
}
