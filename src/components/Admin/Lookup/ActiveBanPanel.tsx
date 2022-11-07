import { Checkbox, Stack, Typography } from "@mui/material"
import { dateFormatter } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { Faction } from "../../../types"
import { AdminPlayerBan } from "../../../types/admin"
import { ClipThing } from "../../Common/ClipThing"

export const ActiveBanPanel = ({
    faction,
    playerBans,
    toggleSelected,
    playerUnBanIDs,
}: {
    faction: Faction
    playerBans: AdminPlayerBan[]
    toggleSelected: (playerBan: AdminPlayerBan) => void
    playerUnBanIDs: string[]
}) => {
    return (
        <Stack sx={{ flex: 2, p: "1rem", height: "100%" }} spacing={"1rem"}>
            {playerBans.map((playerBan) => {
                const isSelected = playerUnBanIDs.includes(playerBan.id)

                return (
                    <ClipThing
                        clipSize="5px"
                        border={{
                            borderColor: faction.primary_color,
                            borderThickness: ".3rem",
                        }}
                        backgroundColor={faction.background_color}
                        opacity={0.9}
                        sx={{ height: "100%" }}
                        key={playerBan.id}
                    >
                        <Stack sx={{ width: "100%", p: "1rem" }}>
                            <Stack justifyContent={"space-between"} direction="row" alignItems="center">
                                <Stack direction="row">
                                    <Checkbox
                                        checked={isSelected}
                                        onClick={() => {
                                            toggleSelected(playerBan)
                                        }}
                                        sx={{
                                            position: "absolute",
                                            bottom: "1rem",
                                            right: ".8rem",
                                            zIndex: 3,
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
