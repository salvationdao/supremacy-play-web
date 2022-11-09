import { Stack } from "@mui/material"
import { useState } from "react"
import { HangarBg } from "../../assets"
import { useGameServerSubscriptionFaction } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { siteZIndex } from "../../theme/theme"
import { BattleLobby } from "../../types/battle_queue"
import { BattleLobbies } from "./BattleLobbies/BattleLobbies"
import { CentralQueue } from "./CentralQueue"

export const BattleLobbiesPage = () => {
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
            sx={{
                height: "100%",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${HangarBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                boxShadow: `inset 0 0 50px 60px #00000090`,
                width: "100%",
                p: "1rem",
            }}
        >
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} flex={1} sx={{ width: "100%" }}>
                <CentralQueue battleLobbies={battleLobbies} />
                <BattleLobbies battleLobbies={battleLobbies} />
            </Stack>
        </Stack>
    )
}
