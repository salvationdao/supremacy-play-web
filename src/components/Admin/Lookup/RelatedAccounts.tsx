import { Box, Stack, Typography } from "@mui/material"
import { useSupremacy } from "../../../containers"
import { dateFormatter } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { User } from "../../../types"

export const RelatedAccounts = ({ relatedAccounts, fetchPlayer }: { relatedAccounts: User[]; fetchPlayer: (newGid: number) => void }) => {
    const { getFaction } = useSupremacy()

    return (
        <Box>
            {relatedAccounts.map((relatedAccount, i) => {
                const faction = getFaction(relatedAccount.faction_id)

                return (
                    <Stack
                        key={i}
                        sx={{ width: "100%", p: "1rem", cursor: "pointer" }}
                        onClick={() => {
                            fetchPlayer(relatedAccount.gid)
                        }}
                    >
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
                                <Typography
                                    sx={{ ml: "0.3rem", fontWeight: "700", userSelect: "none" }}
                                >{`${relatedAccount.username} #${relatedAccount.gid}`}</Typography>
                            </Stack>
                            {relatedAccount.created_at && (
                                <Typography sx={{ color: colors.lightGrey, userSelect: "none" }}>
                                    Created on: {relatedAccount.created_at.toLocaleDateString()} {dateFormatter(relatedAccount.created_at)}
                                </Typography>
                            )}
                        </Stack>
                    </Stack>
                )
            })}
        </Box>
    )
}