import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useAuth, useSupremacy } from "../../../../containers"
import { colors, fonts } from "../../../../theme/theme"
import { MarketUser } from "../../../../types/marketplace"

export const UserInfo = ({ marketUser, title, primaryColor }: { marketUser?: MarketUser; title?: string; primaryColor?: string }) => {
    const { userID } = useAuth()
    const { getFaction } = useSupremacy()
    const ownerFactionDeets = useMemo(() => getFaction(marketUser?.faction_id || ""), [marketUser, getFaction])

    if (!marketUser) return null

    const { id, username, gid } = marketUser
    const isSelfItem = userID === id

    return (
        <Box>
            <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                {title || "USER:"}
            </Typography>
            <Stack direction="row" alignItems="center" spacing=".7rem">
                {ownerFactionDeets && (
                    <Box
                        sx={{
                            mt: "-0.2rem !important",
                            width: "2.4rem",
                            height: "2.4rem",
                            flexShrink: 0,
                            backgroundImage: `url(${ownerFactionDeets.logo_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                            backgroundColor: ownerFactionDeets.palette.primary,
                            borderRadius: 0.8,
                            border: `${ownerFactionDeets.palette.primary} 1px solid`,
                        }}
                    />
                )}
                <Typography variant="h5" sx={{ color: primaryColor || ownerFactionDeets.palette.primary, fontWeight: "bold" }}>
                    {username}
                    <span style={{ marginLeft: ".2rem", opacity: 0.8 }}>{`#${gid}`}</span>
                    <span style={{ color: colors.neonBlue }}>{isSelfItem ? " (YOU)" : ""}</span>
                </Typography>
            </Stack>
        </Box>
    )
}
