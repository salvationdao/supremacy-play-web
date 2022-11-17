import { Box, IconButton, Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { SvgContentCopyIcon, SvgGlobal, SvgLock, SvgSupToken, SvgUserDiamond } from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"
import { supFormatter } from "../../../helpers"
import { TruncateTextLines } from "../../../theme/styles"
import { colors, fonts } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"
import { PrizePool } from "./PrizePool"

export const LobbyItem = React.memo(function LobbyItem({ lobby, accessCode }: { lobby: BattleLobby; accessCode?: string }) {
    const { userID } = useAuth()
    const { getFaction } = useSupremacy()

    const ownerFaction = useMemo(() => getFaction(lobby.host_by.faction_id), [getFaction, lobby.host_by.faction_id])

    const entryFeeDisplay = useMemo(() => {
        const hasFee = lobby.entry_fee !== "0"

        if (!hasFee) {
            return null
        }

        return (
            <Typography>
                <SvgSupToken inline size="1.7rem" fill={colors.gold} />
                {supFormatter(lobby.entry_fee, 2)} ENTRY FEE
            </Typography>
        )
    }, [lobby.entry_fee])

    const displayAccessCode = useMemo(() => lobby.access_code || accessCode, [accessCode, lobby.access_code])

    return (
        <NiceBoxThing border={{ color: "#FFFFFF20", thickness: "very-lean" }} background={{ colors: ["#FFFFFF"], opacity: 0.06 }} sx={{ p: "1rem 1.5rem" }}>
            {/* Lobby details */}
            <Stack>
                <Stack direction="row" alignItems="center" spacing="2rem">
                    {/* Lobby name */}
                    <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{lobby.name || `Lobby #${lobby.number}`}</Typography>

                    {/* Lobby private or public */}
                    {lobby.is_private ? (
                        <Typography color={colors.orange}>
                            <SvgLock inline size="1.6rem" fill={colors.orange} /> PRIVATE
                        </Typography>
                    ) : (
                        <Typography color={colors.green}>
                            <SvgGlobal inline size="1.6rem" fill={colors.green} /> PUBLIC
                        </Typography>
                    )}

                    {/* Entry fees */}
                    {entryFeeDisplay}

                    <Box flex={1} />

                    {/* Access code */}
                    {displayAccessCode && userID === lobby.host_by_id && (
                        <Stack direction="row" alignItems="center">
                            <Typography color={colors.neonBlue}>{displayAccessCode}</Typography>
                            <IconButton
                                size="small"
                                sx={{ opacity: 0.6, ":hover": { opacity: 1 } }}
                                onClick={() => {
                                    navigator.clipboard.writeText(displayAccessCode || "")
                                }}
                            >
                                <SvgContentCopyIcon inline size="1.3rem" />
                            </IconButton>
                        </Stack>
                    )}
                </Stack>

                <Stack direction="row" spacing="2rem" sx={{ mt: "1.4rem" }}>
                    <Stack spacing="1.4rem">
                        {/* Host name */}
                        <Typography
                            variant="h6"
                            sx={{
                                color: ownerFaction.primary_color,
                                fontWeight: "bold",
                                ...TruncateTextLines(1),
                            }}
                        >
                            <SvgUserDiamond size="2.2rem" inline fill={ownerFaction.primary_color} />{" "}
                            {lobby.generated_by_system ? "The Overseer" : `${lobby.host_by.username}#${lobby.host_by.gid}`}
                        </Typography>

                        {/* Reward pool */}
                        <PrizePool lobby={lobby} />
                    </Stack>
                </Stack>
            </Stack>
        </NiceBoxThing>
    )
})
