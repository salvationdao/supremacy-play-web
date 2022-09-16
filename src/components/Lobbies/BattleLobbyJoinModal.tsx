import { BattleLobby } from "../../types/battle_queue"
import React, { useCallback, useMemo, useState } from "react"
import { ConfirmModal } from "../Common/ConfirmModal"
import { useBattleLobby } from "../../containers/battleLobby"
import { Box, Stack } from "@mui/material"
import { NewQuickDeployItem } from "../LeftDrawer/QuickDeploy/NewQuickDeployItem"
import { GameServerKeys } from "../../keys"
import { useGameServerCommandsFaction } from "../../hooks/useGameServer"

interface BattleLobbyJoinModalProps {
    selectedBattleLobby: BattleLobby
    setSelectedBattleLobby: (value: BattleLobby | undefined) => void
}

export const BattleLobbyJoinModal = ({ selectedBattleLobby, setSelectedBattleLobby }: BattleLobbyJoinModalProps) => {
    const { mechsWithQueueStatus } = useBattleLobby()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [selectedMechIDs, setSelectedMechIDs] = useState<string[]>([])

    const CanDeployedMechs = useMemo(() => {
        return mechsWithQueueStatus.filter((mq) => mq.can_deploy)
    }, [mechsWithQueueStatus])

    const joinBattleLobby = useCallback(
        async (battleLobbyID: string, mechIDs: string[], password?: string) => {
            try {
                await send(GameServerKeys.JoinBattleLobby, {
                    battle_lobby_id: battleLobbyID,
                    mech_ids: mechIDs,
                    password,
                })
                setSelectedBattleLobby(undefined)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to opt in battle ability."
                console.error(message)
            }
        },
        [send],
    )

    // filter
    return (
        <ConfirmModal
            title={`JOIN BATTLE LOBBY #${selectedBattleLobby.number}`}
            disableConfirm={!selectedMechIDs.length}
            onConfirm={() => joinBattleLobby(selectedBattleLobby.id, selectedMechIDs)}
            onClose={() => setSelectedBattleLobby(undefined)}
            isLoading={false}
            error={""}
        >
            {mechsWithQueueStatus.length > 0 && (
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        my: ".8rem",
                        mr: ".7rem",
                        pr: ".7rem",
                        pl: "1.4rem",
                        direction: "ltr",
                        scrollbarWidth: "none",
                        "::-webkit-scrollbar": {
                            width: "1rem",
                        },
                        "::-webkit-scrollbar-track": {
                            background: "#FFFFFF15",
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: (theme) => theme.factionTheme.primary,
                        },
                    }}
                >
                    <Box sx={{ direction: "ltr", height: "60vh" }}>
                        <Stack spacing=".3rem" sx={{ height: "100%" }}>
                            {CanDeployedMechs.map((mech) => {
                                return (
                                    <NewQuickDeployItem
                                        key={mech.id}
                                        isSelected={selectedMechIDs.includes(mech.id)}
                                        toggleIsSelected={() => {
                                            setSelectedMechIDs((prev) => {
                                                // remove, if exists
                                                if (prev.includes(mech.id)) {
                                                    return prev.filter((id) => id !== mech.id)
                                                }

                                                // otherwise, append
                                                return prev.concat(mech.id)
                                            })
                                        }}
                                        mech={mech}
                                    />
                                )
                            })}
                        </Stack>
                    </Box>
                </Box>
            )}
        </ConfirmModal>
    )
}
