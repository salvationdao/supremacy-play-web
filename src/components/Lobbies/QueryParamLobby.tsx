import { Stack, Typography } from "@mui/material"
import React, { useState } from "react"
import { SvgInfoCircular } from "../../assets"
import { useUrlQuery } from "../../hooks"
import { useGameServerSubscriptionFaction } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { BattleLobby } from "../../types/battle_queue"
import { NiceModal } from "../Common/Nice/NiceModal"
import { TypographyTruncated } from "../Common/TypographyTruncated"
import { TopUpModal } from "../LeftDrawer/CentralQueue/CentralQueueItem"
import { CentralQueueItemTooltipRender } from "../LeftDrawer/CentralQueue/CentralQueueItemTooltipRender"
import { JoinLobbyModal } from "./LobbyItem/JoinLobbyModal"

export const QueryParamLobby = React.memo(function QueryParamLobby() {
    const [query] = useUrlQuery()
    const [dismissed, setDismissed] = useState(false)

    const lobbyID = query.get("join")
    const accessCode = query.get("code")

    if ((!lobbyID && !accessCode) || dismissed) {
        return null
    }

    return (
        <QueryParamLobbyInner
            key={`query-param-lobby-${lobbyID}`}
            lobbyID={lobbyID || undefined}
            accessCode={accessCode || undefined}
            onClose={() => setDismissed(true)}
        />
    )
})

const QueryParamLobbyInner = ({ lobbyID, accessCode, onClose }: { lobbyID?: string; accessCode?: string; onClose: () => void }) => {
    const [battleLobby, setBattleLobby] = useState<BattleLobby>()
    const [showJoinLobbyModal, setShowJoinLobbyModal] = useState(false)

    // For sponsoring battle with more sups
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)

    // If lobby id is populated and access code is blank, use this
    useGameServerSubscriptionFaction<BattleLobby>(
        {
            URI: `/battle_lobby/${lobbyID}`,
            key: GameServerKeys.SubBattleLobby,
            ready: !!lobbyID && !accessCode,
        },
        (payload) => {
            if (!payload) return
            setBattleLobby(payload)
        },
    )

    // If access code is populated, use this one
    useGameServerSubscriptionFaction<BattleLobby>(
        {
            URI: `/private_battle_lobby/${accessCode}`,
            key: GameServerKeys.SubPrivateBattleLobby,
            ready: !!accessCode,
        },
        (payload) => {
            if (!payload) return
            setBattleLobby(payload)
        },
    )
    if (!battleLobby) {
        return null
    }

    return (
        <>
            <NiceModal open={true} onClose={onClose} backdropColor="rgba(0,0,0,.8)" sx={{ p: "1.8rem 2.5rem", maxHeight: "calc(100vh - 20rem)" }}>
                <Stack>
                    <Typography variant="h6" fontFamily={fonts.nostromoBlack} mb=".6rem">
                        Battle Lobby
                    </Typography>

                    <TypographyTruncated variant="h6" sx={{ color: colors.neonBlue, fontWeight: "bold", mb: "1.3rem" }}>
                        <SvgInfoCircular inline size="1.8rem" fill={colors.neonBlue} /> Deploy your mechs in order to join the battle lobby
                    </TypographyTruncated>

                    <CentralQueueItemTooltipRender
                        battleLobby={battleLobby}
                        displayAccessCode={accessCode}
                        width="100%"
                        setShowJoinLobbyModal={setShowJoinLobbyModal}
                        setIsTopUpModalOpen={setIsTopUpModalOpen}
                    />
                </Stack>
            </NiceModal>

            {showJoinLobbyModal && (
                <JoinLobbyModal open={showJoinLobbyModal} onClose={() => setShowJoinLobbyModal(false)} battleLobby={battleLobby} accessCode={accessCode} />
            )}

            {isTopUpModalOpen && <TopUpModal lobbyID={battleLobby.id} onClose={() => setIsTopUpModalOpen(false)} />}
        </>
    )
}
