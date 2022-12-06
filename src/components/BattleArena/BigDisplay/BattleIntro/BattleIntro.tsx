import { Box, Fade, Slide, Stack } from "@mui/material"
import { useMemo } from "react"
import { SvgUserDiamond } from "../../../../assets"
import { FactionIDs } from "../../../../constants"
import { useAuth, useDimension, useSupremacy } from "../../../../containers"
import { pulseEffect } from "../../../../theme/keyframes"
import { colors, fonts, siteZIndex } from "../../../../theme/theme"
import { BattleLobby } from "../../../../types/battle_queue"
import { TypographyTruncated } from "../../../Common/TypographyTruncated"
import { Supporters } from "../../../Lobbies/CentralQueue/Supporters"
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
        <Fade in>
            <Box
                sx={{
                    zIndex: siteZIndex.Modal,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    overflowY: "auto",
                }}
            >
                <Stack
                    sx={{
                        minHeight: "100%",
                        width: "100%",
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
            </Box>
        </Fade>
    )
}

interface FactionRowProps {
    index: number
    lobby: FactionLobbySlots
}

const FactionRow = ({ index, lobby }: FactionRowProps) => {
    const { getFaction } = useSupremacy()
    const { userID, factionID } = useAuth()
    const { gameUIDimensions } = useDimension()

    const theme = getFaction(lobby.faction.id).palette
    const { details } = lobby

    const isTablet = gameUIDimensions.width < 900

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
                            maxWidth: 140,
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
                        <Stack alignItems="center" spacing="1.4rem">
                            <Supporters battleLobby={details} factionID={lobby.faction.id} size="4rem" />

                            {factionID === lobby.faction.id && (
                                <TypographyTruncated
                                    fontFamily={fonts.nostromoBlack}
                                    sx={{
                                        p: ".2rem 1rem",
                                        color: "#000000",
                                        backgroundColor: `${colors.neonBlue}`,
                                        animation: `${pulseEffect} 3s infinite`,
                                        animationDelay: ".3s",
                                    }}
                                >
                                    JOIN AS SUPPORTER!
                                </TypographyTruncated>
                            )}
                        </Stack>
                    </Stack>
                    {lobby.mechSlots.map((ms, index) => (
                        <Stack
                            key={index}
                            sx={{
                                width: "100%",
                                maxWidth: 200,
                            }}
                        >
                            <Stack direction={isTablet ? "column" : "row"} spacing=".5rem">
                                {/* Mech avatar */}
                                <Box
                                    component="img"
                                    src={ms.avatar_url}
                                    sx={{
                                        width: "100%",
                                        maxWidth: isTablet ? "100%" : 160,
                                        height: isTablet ? "8rem" : undefined,
                                        objectFit: "cover",
                                        border: `1px solid ${colors.black2}`,
                                    }}
                                />

                                {/* Weapon slots */}
                                <Stack spacing=".5rem" direction={isTablet ? "row" : "column"} flex={1}>
                                    {ms.weapon_slots &&
                                        ms.weapon_slots.map((w, index) => {
                                            if (!w.weapon) return null
                                            return (
                                                <Box
                                                    key={index}
                                                    component="img"
                                                    src={w.weapon.avatar_url || w.weapon.image_url}
                                                    alt={`Weapon - ${w.weapon.label}`}
                                                    sx={{
                                                        height: "4rem",
                                                        width: "100%",
                                                        maxWidth: isTablet ? "4rem" : undefined,
                                                        objectFit: "contain",
                                                        backgroundColor: theme.background,
                                                        border: `1px solid ${colors.black2}`,
                                                    }}
                                                />
                                            )
                                        })}
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
