import { Box, Stack, Typography } from "@mui/material"
import { dateFormatter } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { FactionWithPalette } from "../../../types"
import { AdminPlayerBan } from "../../../types/admin"
import { ClipThing } from "../../Common/Deprecated/ClipThing"

export const BanHistoryPanel = ({ faction, playerBans }: { faction: FactionWithPalette; playerBans: AdminPlayerBan[] }) => {
    return (
        <Stack sx={{ flex: 2, p: "1rem" }} spacing={"1rem"}>
            {playerBans.map((playerBan) => {
                return (
                    <ClipThing
                        clipSize="5px"
                        border={{
                            borderColor: faction.palette.primary,
                            borderThickness: ".3rem",
                        }}
                        backgroundColor={faction.palette.background}
                        opacity={0.9}
                        sx={{ flex: 1 }}
                        key={playerBan.id}
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
                                            backgroundColor: faction.palette.background,
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
                        <Stack sx={{ width: "100%", p: "1rem" }}>
                            <Stack justifyContent={"space-between"} direction="row-reverse" alignItems="center">
                                <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
                                    <Typography>Status:</Typography>

                                    <Typography
                                        sx={{ color: playerBan.manually_unbanned ? colors.green : playerBan.end_at > new Date() ? colors.red : colors.green }}
                                    >
                                        {playerBan.manually_unbanned ? "Unbanned Manually" : playerBan.end_at > new Date() ? "Banned" : "Unbanned"}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack sx={{ p: "1rem" }}>
                            <Typography sx={{ ml: "0.3rem", fontWeight: "700", userSelect: "none" }}>Reason:</Typography>
                            <Typography sx={{ ml: "0.3rem", userSelect: "none" }}>{playerBan.reason}</Typography>
                        </Stack>

                        {playerBan.manually_unbanned_reason && (
                            <Stack sx={{ p: "1rem" }}>
                                <Typography sx={{ ml: "0.3rem", fontWeight: "700", userSelect: "none" }}>Unban Reason:</Typography>
                                <Typography sx={{ ml: "0.3rem", userSelect: "none" }}>{playerBan.manually_unbanned_reason}</Typography>
                            </Stack>
                        )}
                    </ClipThing>
                )
            })}
        </Stack>
    )
}
