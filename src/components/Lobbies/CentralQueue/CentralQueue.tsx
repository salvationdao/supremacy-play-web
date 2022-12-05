import { Divider, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { colors, fonts } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"
import { VirtualizedGrid } from "../../Common/VirtualizedGrid"
import { CentralQueueItem } from "./CentralQueueItem"

export const CentralQueue = ({ lobbies }: { lobbies: BattleLobby[] }) => {
    const [displayLobbies, setDisplayLobbies] = useState<BattleLobby[]>([])

    useEffect(() => {
        setDisplayLobbies((prev) => {
            // Only ready stuff
            const bls = [...lobbies].filter((bl) => !!bl.ready_at)

            if (prev.length === 0)
                return bls
                    .filter((bl) => !bl.ended_at && !bl.deleted_at)
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

            prev = prev.map((p) => bls.find((bl) => bl.id === p.id) || p)

            bls.forEach((bl) => {
                if (prev.some((p) => p.id === bl.id)) return
                prev.push(bl)
            })

            return prev
                .filter((p) => !p.ended_at && !p.deleted_at)
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
    }, [lobbies])

    const renderIndex = useCallback(
        (index) => {
            const battleLobby = displayLobbies[index]
            if (!battleLobby) {
                return null
            }
            return <CentralQueueItem battleLobby={battleLobby} />
        },
        [displayLobbies],
    )

    const content = useMemo(() => {
        if (displayLobbies.length === 0) {
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
                totalItems={displayLobbies.length}
                renderIndex={renderIndex}
            />
        )
    }, [displayLobbies.length, renderIndex])

    return (
        <NiceBoxThing
            border={{ color: "#FFFFFF28", thickness: "very-lean" }}
            background={{ colors: ["#FFFFFF", "#FFFFFF"], opacity: 0.06 }}
            sx={{
                width: "38rem",
                mr: "2.5rem",
                overflowY: "hidden",
                transition: "all .3s",
                flexShrink: 0,
            }}
        >
            <Stack sx={{ overflow: "hidden", height: "100%" }}>
                {/* Heading */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: "1.2rem 2rem", pr: "1rem" }}>
                    <Typography fontFamily={fonts.nostromoBlack}>CENTRAL QUEUE</Typography>
                </Stack>

                <Divider />

                <Stack sx={{ p: "1rem", flex: 1, overflowY: "auto", overflowX: "hidden" }}>{content}</Stack>
            </Stack>
        </NiceBoxThing>
    )
}
