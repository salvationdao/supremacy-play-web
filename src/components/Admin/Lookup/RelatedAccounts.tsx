import { Box, Stack, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { useSupremacy } from "../../../containers"
import { dateFormatter } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { User } from "../../../types"

interface RelatedAccountsProps {
    relatedAccounts: User[]
}

export const RelatedAccounts = ({ relatedAccounts }: RelatedAccountsProps) => {
    const { getFaction } = useSupremacy()

    return (
        <Box>
            {relatedAccounts.map((relatedAccount, i) => {
                const faction = getFaction(relatedAccount.faction_id)

                return (
                    <Link key={i} to={`/admin/lookup/${relatedAccount.gid}`}>
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
                    </Link>
                )
            })}
        </Box>
    )
}
