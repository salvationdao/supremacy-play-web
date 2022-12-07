import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { SvgLobbies } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { useGameServerSubscriptionFaction, useGameServerSubscriptionSecuredUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { HeaderProps } from "../../../routes"
import { colors, fonts } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { VirtualizedGrid } from "../../Common/VirtualizedGrid"
import { CentralQueueItem } from "./CentralQueueItem"

export const CentralQueue = () => {
    const theme = useTheme()
    const [involvedLobbies, setInvolvedLobbies] = useState<BattleLobby[]>([])
    const [readyLobbies, setReadyLobbies] = useState<BattleLobby[]>([])

    // Own lobbies
    useGameServerSubscriptionSecuredUser<BattleLobby[]>(
        {
            URI: "/involved_battle_lobbies",
            key: GameServerKeys.SubInvolvedBattleLobbiesUpdate,
        },
        (payload) => {
            if (!payload) return
            setInvolvedLobbies((prev) => {
                if (prev.length === 0) return payload.filter((bl) => !bl.ended_at && !bl.deleted_at)

                const list = prev.map((bl) => payload.find((p) => p.id === bl.id) || bl)

                payload.forEach((p) => {
                    // If already exists
                    if (list.some((b) => b.id === p.id)) {
                        return
                    }

                    // Otherwise, push to the list
                    list.push(p)
                })

                return list.filter((bl) => !bl.ended_at && !bl.deleted_at)
            })
        },
    )

    useGameServerSubscriptionFaction<BattleLobby[]>(
        {
            URI: `/battle_lobbies`,
            key: GameServerKeys.SubBattleLobbyListUpdate,
        },
        (payload) => {
            if (!payload) return

            setReadyLobbies((prev) => {
                if (prev.length === 0) {
                    return payload
                        .filter((bl) => !!bl.ready_at && !bl.deleted_at && !bl.ended_at)
                        .sort((a, b) => {
                            if (a.ready_at && b.ready_at) {
                                return a.ready_at > b.ready_at ? 1 : -1
                            }

                            if (a.ready_at) {
                                return -1
                            }

                            if (b.ready_at) {
                                return 1
                            }

                            return a.created_at > b.created_at ? 1 : -1
                        })
                }

                // Replace current list
                const list = prev.map((lobby) => payload.find((p) => p.id === lobby.id) || lobby)

                // Append new list
                payload.forEach((p) => {
                    // If already exists
                    if (list.some((lobby) => lobby.id === p.id)) {
                        return
                    }
                    // Otherwise, push to the list
                    list.push(p)
                })

                return list
                    .filter((bl) => !!bl.ready_at && !bl.deleted_at && !bl.ended_at)
                    .sort((a, b) => {
                        if (a.ready_at && b.ready_at) {
                            return a.ready_at > b.ready_at ? 1 : -1
                        }

                        if (a.ready_at) {
                            return -1
                        }

                        if (b.ready_at) {
                            return 1
                        }

                        return a.created_at > b.created_at ? 1 : -1
                    })
            })
        },
    )

    const renderIndex = useCallback(
        (index) => {
            const battleLobby = readyLobbies[index]
            if (!battleLobby) {
                return null
            }
            return <CentralQueueItem battleLobby={battleLobby} isInvolved={!!involvedLobbies.find((l) => l.id === battleLobby.id)} />
        },
        [involvedLobbies, readyLobbies],
    )

    const content = useMemo(() => {
        if (readyLobbies.length === 0) {
            return (
                <Stack justifyContent="center" height="100%">
                    <Typography variant="body2" sx={{ color: colors.grey, textAlign: "center", fontFamily: fonts.nostromoBold }}>
                        No lobby is ready
                    </Typography>
                </Stack>
            )
        }

        return (
            <VirtualizedGrid
                uniqueID="central-queue"
                itemWidthConfig={{ columnCount: 1 }}
                itemHeight={11.5}
                totalItems={readyLobbies.length}
                renderIndex={renderIndex}
            />
        )
    }, [readyLobbies.length, renderIndex])

    return (
        <Stack sx={{ position: "relative", height: "100%" }}>
            <Box sx={{ p: "1rem", flex: 1, overflow: "hidden" }}>{content}</Box>

            {/* Some button */}
            <NiceButton
                buttonColor={theme.factionTheme.primary}
                sx={{ mt: "auto !important", p: ".2rem 1rem", pt: ".4rem", opacity: 0.74 }}
                route={{ to: "/lobbies" }}
            >
                <Typography variant="subtitle1" fontFamily={fonts.nostromoBold}>
                    Go to lobbies
                </Typography>
            </NiceButton>
        </Stack>
    )
}

const Header = ({ isOpen, isDrawerOpen, onClose }: HeaderProps) => {
    const theme = useTheme()
    const [readyLobbies, setReadyLobbies] = useState<BattleLobby[]>([])

    useGameServerSubscriptionFaction<BattleLobby[]>(
        {
            URI: `/battle_lobbies`,
            key: GameServerKeys.SubBattleLobbyListUpdate,
        },
        (payload) => {
            if (!payload) return

            setReadyLobbies((prev) => {
                if (prev.length === 0) {
                    return payload.filter((bl) => !!bl.ready_at && !bl.deleted_at && !bl.ended_at)
                }

                // Replace current list
                const list = prev.map((lobby) => payload.find((p) => p.id === lobby.id) || lobby)

                // Append new list
                payload.forEach((p) => {
                    // If already exists
                    if (list.some((lobby) => lobby.id === p.id)) {
                        return
                    }
                    // Otherwise, push to the list
                    list.push(p)
                })

                return list.filter((bl) => !!bl.ready_at && !bl.deleted_at && !bl.ended_at)
            })
        },
    )

    return (
        <Stack
            spacing="1rem"
            direction={isDrawerOpen ? "row" : "row-reverse"}
            sx={{
                width: "100%",
                p: "1rem",
                alignItems: "center",
                opacity: isOpen ? 1 : 0.7,
                background: isOpen ? `linear-gradient(${theme.factionTheme.s500}70 26%, ${theme.factionTheme.s600})` : theme.factionTheme.s800,
                transition: "background-color .2s ease-out",
            }}
        >
            <NiceButton
                onClick={onClose}
                buttonColor={theme.factionTheme.primary}
                corners
                sx={{
                    p: ".8rem",
                    pb: ".6rem",
                }}
            >
                <SvgLobbies size="2.6rem" />
            </NiceButton>

            <Typography sx={{ fontFamily: fonts.nostromoBlack, fontSize: "1.6rem" }}>Central Queue</Typography>

            <Box flex={1} />

            <Typography>{readyLobbies.length} in queue</Typography>
        </Stack>
    )
}
CentralQueue.Header = Header
