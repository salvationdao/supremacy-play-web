import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import FlipMove from "react-flip-move"
import { SvgLobbies } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { useGameServerSubscriptionFaction, useGameServerSubscriptionSecuredUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { HeaderProps } from "../../../routes"
import { colors, fonts } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceTab, NiceTabs } from "../../Common/Nice/NiceTabs"
import { NiceTooltip } from "../../Common/Nice/NiceTooltip"
import { VirtualizedGrid } from "../../Common/VirtualizedGrid"
import { CentralQueueItem } from "../../Lobbies/CentralQueue/CentralQueueItem"

const tabs: NiceTab[] = [
    {
        value: 0,
        label: "Server",
    },
    { value: 1, label: "Exhibition" },
]

export const MyLobbies = () => {
    const theme = useTheme()
    const [involvedLobbies, setInvolvedLobbies] = useState<BattleLobby[]>([])
    const [allLobbies, setAllLobbies] = useState<BattleLobby[]>([])
    const [displayLobbies, setDisplayLobbies] = useState<BattleLobby[]>([])
    const [tabValue, setTabValue] = useState(0)

    // Own lobbies
    useGameServerSubscriptionSecuredUser<BattleLobby[]>(
        {
            URI: "/involved_battle_lobbies",
            key: GameServerKeys.SubInvolvedBattleLobbiesUpdate,
        },
        (payload) => {
            if (!payload) return
            setInvolvedLobbies((prev) => {
                if (prev.length === 0) return payload.filter((bl) => !bl.ended_at && !bl.deleted_at).sort((a, b) => (a.stage_order > b.stage_order ? 1 : -1))

                const list = prev.map((bl) => payload.find((p) => p.id === bl.id) || bl)

                payload.forEach((p) => {
                    // If already exists
                    if (list.some((b) => b.id === p.id)) {
                        return
                    }

                    // Otherwise, push to the list
                    list.push(p)
                })

                return list.filter((bl) => !bl.ended_at && !bl.deleted_at).sort((a, b) => (a.stage_order > b.stage_order ? 1 : -1))
            })
        },
    )

    // All lobbies
    useGameServerSubscriptionFaction<BattleLobby[]>(
        {
            URI: `/battle_lobbies`,
            key: GameServerKeys.SubBattleLobbyListUpdate,
        },
        (payload) => {
            if (!payload) return

            setAllLobbies((prev) => {
                if (prev.length === 0) {
                    return payload
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

                // Remove any finished lobby
                return list.filter((p) => !p.ended_at && !p.deleted_at)
            })
        },
    )

    // Apply sort, search, and filters
    useEffect(() => {
        let filteredLobbies = [...allLobbies]

        // Filter for the system or exhibition lobbies
        switch (tabValue) {
            case 0:
                filteredLobbies = filteredLobbies.filter((lobby) => lobby.generated_by_system)
                break
            case 1:
                filteredLobbies = filteredLobbies.filter((lobby) => !lobby.generated_by_system)
                break
        }

        setDisplayLobbies(filteredLobbies.filter((p) => !p.ready_at && !involvedLobbies.some((b) => b.id === p.id)))
    }, [allLobbies, involvedLobbies, tabValue])

    const renderIndex = useCallback(
        (index) => {
            console.log(index)
            const battleLobby = displayLobbies[index]
            if (!battleLobby) {
                return null
            }
            return <CentralQueueItem battleLobby={battleLobby} />
        },
        [displayLobbies],
    )

    // Own lobbies
    const involvedLobbiesContent = useMemo(() => {
        if (involvedLobbies.length === 0) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", p: "1rem" }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: colors.grey,
                            fontFamily: fonts.nostromoBold,
                            textAlign: "center",
                        }}
                    >
                        Your lobbies will appear here
                    </Typography>
                </Stack>
            )
        }

        return (
            <FlipMove>
                {involvedLobbies.map((battleLobby) => {
                    return (
                        <Box
                            key={`battle-lobby-${battleLobby.id}`}
                            sx={{
                                "&:not(:last-child)": {
                                    mb: ".8rem",
                                },
                            }}
                        >
                            <CentralQueueItem battleLobby={battleLobby} />
                        </Box>
                    )
                })}
            </FlipMove>
        )
    }, [involvedLobbies])

    // Public lobbies
    const publicLobbiesContent = useMemo(() => {
        if (displayLobbies.length === 0) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", p: "1rem" }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: colors.grey,
                            fontFamily: fonts.nostromoBold,
                            textAlign: "center",
                        }}
                    >
                        Public lobbies will appear here
                    </Typography>
                </Stack>
            )
        }

        return (
            <VirtualizedGrid
                uniqueID="all-lobbies"
                itemWidthConfig={{ columnCount: 1 }}
                itemHeight={8.6}
                totalItems={displayLobbies.length}
                renderIndex={renderIndex}
            />
        )
    }, [displayLobbies.length, renderIndex])

    return (
        <>
            <Stack spacing="1.2rem" sx={{ position: "relative", height: "100%", overflow: "hidden" }}>
                {/* Involved lobbies */}
                <Stack
                    sx={{
                        p: "1rem",
                        flex: involvedLobbies.length === 0 ? 0.4 : 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                    }}
                >
                    {involvedLobbiesContent}
                </Stack>

                {/* Public lobbies */}
                <Stack flex={displayLobbies.length === 0 ? 0.4 : 1}>
                    <NiceTabs tabs={tabs} value={tabValue} onChange={(newValue) => setTabValue(newValue)} />
                    <Stack
                        sx={{
                            p: "1rem",
                            pr: 0,
                            flex: 1,
                            overflowY: "auto",
                            overflowX: "hidden",
                        }}
                    >
                        {publicLobbiesContent}
                    </Stack>
                </Stack>

                {/* Some buttons */}
                <NiceButton buttonColor={theme.factionTheme.primary} sx={{ p: ".2rem 1rem", pt: ".4rem" }} route={{ to: "/lobbies" }}>
                    <Typography variant="subtitle1" fontFamily={fonts.nostromoBold}>
                        Go to lobbies
                    </Typography>
                </NiceButton>
            </Stack>
        </>
    )
}

const Header = ({ isOpen, onClose }: HeaderProps) => {
    const theme = useTheme()
    const [involvedLobbies, setInvolvedLobbies] = useState<BattleLobby[]>([])

    useGameServerSubscriptionSecuredUser<BattleLobby[]>(
        {
            URI: "/involved_battle_lobbies",
            key: GameServerKeys.SubInvolvedBattleLobbiesUpdate,
        },
        (payload) => {
            if (!payload) return
            setInvolvedLobbies((prev) => {
                if (prev.length === 0) return payload.filter((bl) => !bl.ended_at && !bl.deleted_at).sort((a, b) => (a.stage_order > b.stage_order ? 1 : -1))

                const list = prev.map((bl) => payload.find((p) => p.id === bl.id) || bl)

                payload.forEach((p) => {
                    // If already exists
                    if (list.some((b) => b.id === p.id)) {
                        return
                    }
                    // Otherwise, push to the list
                    list.push(p)
                })

                return list.filter((bl) => !bl.ended_at && !bl.deleted_at).sort((a, b) => (a.stage_order > b.stage_order ? 1 : -1))
            })
        },
    )

    return (
        <Stack
            spacing="1rem"
            direction="row"
            sx={{
                width: "100%",
                p: "1rem",
                alignItems: "center",
                opacity: isOpen ? 1 : 0.7,
                background: isOpen ? `linear-gradient(${theme.factionTheme.s500}70 26%, ${theme.factionTheme.s600})` : theme.factionTheme.s800,
                transition: "background-color .2s ease-out",
            }}
        >
            <NiceTooltip text="My Lobbies" placement="left">
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
            </NiceTooltip>
            <Typography
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    fontSize: "1.6rem",
                }}
            >
                My Lobbies
            </Typography>

            <Box flex={1} />

            <Typography>
                in {involvedLobbies.length} {involvedLobbies.length === 1 ? "lobby" : "lobbies"}
            </Typography>
        </Stack>
    )
}
MyLobbies.Header = Header
