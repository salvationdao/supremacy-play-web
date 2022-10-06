import { Box, Stack, Typography } from "@mui/material"
import { dateFormatter } from "../../../helpers"
import { Faction } from "../../../types"
import { AdminPlayerBan } from "../../../types/admin"
import { ClipThing } from "../../Common/ClipThing"
import { colors, fonts } from "../../../theme/theme"
import { FancyButton } from "../../Common/FancyButton"
import React, { useCallback } from "react"
import { GameServerKeys } from "../../../keys"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"

export const BanHistoryPanel = ({
    faction,
    playerBans,
    setModalOpen,
    setPlayerUnban,
}: {
    faction: Faction
    playerBans: AdminPlayerBan[]
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setPlayerUnban: (value: ((prevState: AdminPlayerBan | undefined) => AdminPlayerBan | undefined) | AdminPlayerBan | undefined) => void
}) => {
    return (
        <Stack sx={{ flex: 1, p: "1rem" }} spacing={"1rem"}>
            {playerBans.map((playerBan, i) => {
                return (
                    <ClipThing
                        clipSize="5px"
                        border={{
                            borderColor: faction.primary_color,
                            borderThickness: ".3rem",
                        }}
                        backgroundColor={faction.background_color}
                        opacity={0.9}
                        sx={{ flex: 1, width: "100%" }}
                        key={i}
                    >
                        <Stack sx={{ width: "100%", p: "1rem" }}>
                            <Stack justifyContent={"space-between"} direction="row" alignItems="center">
                                <Stack direction="row">
                                    <Box
                                        sx={{
                                            alignSelf: "flex-start",
                                            flexShrink: 0,
                                            width: "2rem",
                                            height: "2rem",
                                            background: `url(${faction.logo_url})`,
                                            backgroundColor: faction.background_color,
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center",
                                            backgroundSize: "contain",
                                        }}
                                    />
                                    <Typography sx={{ ml: "0.3rem", fontWeight: "700", userSelect: "none" }}>
                                        Banned by: {playerBan.banned_by.username}
                                    </Typography>
                                </Stack>
                                <Typography sx={{ color: colors.lightGrey, userSelect: "none" }}>
                                    Ban end time: {playerBan.end_at.toLocaleDateString()} {dateFormatter(playerBan.end_at)}
                                </Typography>
                            </Stack>
                        </Stack>
                        <Stack sx={{ p: "1rem" }}>
                            <Typography sx={{ ml: "0.3rem", fontWeight: "700", userSelect: "none" }}>Reason:</Typography>
                            <Typography sx={{ ml: "0.3rem", userSelect: "none" }}>{playerBan.reason}</Typography>
                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "9px",
                                    backgroundColor: colors.green,
                                    opacity: 1,
                                    border: { borderColor: colors.green, borderThickness: "2px" },
                                }}
                                sx={{ px: "1.6rem", py: ".2rem", color: "#FFFFFF" }}
                                disabled={playerBan.manually_unbanned}
                                onClick={() => {
                                    setModalOpen(true)
                                    setPlayerUnban(playerBan)
                                }}
                            >
                                <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                                    Unban
                                </Typography>
                            </FancyButton>
                        </Stack>
                    </ClipThing>
                )
            })}
        </Stack>
    )
}
