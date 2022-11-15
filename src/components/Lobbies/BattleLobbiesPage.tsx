import { Stack } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { useGameServerSubscriptionFaction } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { BattleLobby } from "../../types/battle_queue"
import { useUrlQuery } from "../../hooks"
import { NavTabs } from "../Common/NavTabs/NavTabs"
import { useTheme } from "../../containers/theme"
import { snakeToTitle } from "../../helpers"
import { CreateLobby } from "./Createlobby/CreateLobby"

enum LobbyTabs {
    JoinLobbies = "JOIN_LOBBIES",
    CreateALobby = "CREATE_A_LOBBY",
}

export const BattleLobbiesPage = () => {
    const theme = useTheme()
    const [query, updateQuery] = useUrlQuery()

    const [activeTabID, setActiveTabID] = useState<string | undefined>(LobbyTabs.CreateALobby)
    const tabs = useMemo(() => Object.values(LobbyTabs).map((t) => ({ id: t, label: snakeToTitle(t) })), [])
    const prevTab = useCallback(
        (_activeTabID: string) => {
            const curIndex = tabs.findIndex((tab) => tab.id === _activeTabID)
            const newIndex = curIndex - 1 < 0 ? tabs.length - 1 : curIndex - 1
            setActiveTabID(tabs[newIndex].id)
        },
        [tabs],
    )

    const nextTab = useCallback(
        (_activeTabID: string) => {
            const curIndex = tabs.findIndex((routeGroup) => routeGroup.id === _activeTabID)
            const newIndex = (curIndex + 1) % tabs.length
            setActiveTabID(tabs[newIndex].id)
        },
        [tabs],
    )

    // load battle lobbies
    const [battleLobbies, setBattleLobbies] = useState<BattleLobby[]>([])
    useGameServerSubscriptionFaction<BattleLobby[]>(
        {
            URI: `/battle_lobbies`,
            key: GameServerKeys.SubBattleLobbyListUpdate,
        },
        (payload) => {
            if (!payload) return
            setBattleLobbies((bls) => {
                if (bls.length === 0) return payload

                // replace current list
                const list = bls.map((bl) => payload.find((p) => p.id === bl.id) || bl)

                // append new list
                payload.forEach((p) => {
                    // if already exists
                    if (list.some((b) => b.id === p.id)) {
                        return
                    }
                    // otherwise, push to the list
                    list.push(p)
                })

                // remove any finished lobby
                return list.filter((bl) => !bl.ended_at && !bl.deleted_at)
            })
        },
    )

    return (
        <Stack
            alignItems="center"
            spacing="3rem"
            sx={{
                p: "4rem 5rem",
                mx: "auto",
                position: "relative",
                height: "100%",
                backgroundColor: theme.factionTheme.background,
                background: `url()`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                width: "100%",
            }}
        >
            <NavTabs activeTabID={activeTabID} setActiveTabID={setActiveTabID} tabs={tabs} prevTab={prevTab} nextTab={nextTab} />
            <CreateLobby />
        </Stack>
    )
}

// export const BattleLobbyList = () => {
//     return (
//         <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} flex={1} sx={{ width: "100%" }}>
//             <CentralQueue battleLobbies={battleLobbies} />
//             <BattleLobbies battleLobbies={battleLobbies} />
//         </Stack>
//     )
// }
