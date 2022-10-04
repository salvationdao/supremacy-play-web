import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useSupremacy } from "../../../containers"
import { dateFormatter } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { Faction, User } from "../../../types"
import { AdminChatView } from "../../../types/admin"

export const RelatedAccounts = ({ relatedAccounts }: { relatedAccounts: User[] }) => {
    const { getFaction } = useSupremacy()

    return (
        <Box>
            {relatedAccounts.map((relatedAccount, i) => {
                const faction = getFaction(relatedAccount.faction_id)

                return (
                    <Stack key={i} sx={{ width: "100%", p: "1rem" }}>
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
                                <Typography sx={{ ml: "0.3rem", fontWeight: "700" }}>{`${relatedAccount.username} #${relatedAccount.gid}`}</Typography>
                            </Stack>
                            {relatedAccount.created_at && (
                                <Typography sx={{ color: colors.lightGrey }}>Created On: {dateFormatter(relatedAccount.created_at)}</Typography>
                            )}
                        </Stack>
                    </Stack>
                )
            })}
        </Box>
    )
}
