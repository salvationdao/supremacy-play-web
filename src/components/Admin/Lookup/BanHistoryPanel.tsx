import { Box, Stack, Typography } from "@mui/material"
import { dateFormatter } from "../../../helpers"
import { Faction } from "../../../types"
import { AdminPlayerBan } from "../../../types/admin"
import { ClipThing } from "../../Common/ClipThing"

export const BanHistoryPanel = ({ faction, playerBans }: { faction: Faction; playerBans: AdminPlayerBan[] }) => {
    return (
        <Box sx={{ p: "1rem", height: "100%", maxHeight: "4rem" }}>
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
                        <Stack sx={{ height: "100%" }} spacing="0.2rem">
                            <Typography sx={{ p: "1rem", width: "100%" }}>
                                Banned By: {playerBan.banned_by.username} #{playerBan.banned_by.gid}
                            </Typography>
                            <Typography sx={{ p: "1rem", width: "100%" }}>
                                Banned On: {dateFormatter(playerBan.banned_at)} {playerBan.banned_at.toLocaleDateString()}
                            </Typography>
                            <Typography sx={{ p: "1rem", width: "100%" }}>
                                Banned End Time: {dateFormatter(playerBan.end_at)} {playerBan.end_at.toLocaleDateString()}
                            </Typography>
                            <Typography sx={{ p: "1rem", width: "100%" }}>Reason: {playerBan.reason}</Typography>
                        </Stack>
                    </ClipThing>
                )
            })}
        </Box>
    )
}
