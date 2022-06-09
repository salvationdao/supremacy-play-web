import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useSupremacy } from "../../../../containers"
import { colors, fonts } from "../../../../theme/theme"
import { MarketUser } from "../../../../types/marketplace"

export const Owner = ({ owner }: { owner?: MarketUser }) => {
    const { getFaction } = useSupremacy()
    const ownerFactionDeets = useMemo(() => getFaction(owner?.faction_id || ""), [owner, getFaction])

    if (!owner) return null

    const { username, gid } = owner

    return (
        <Box>
            <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                OWNED BY:
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
                            backgroundColor: ownerFactionDeets.primary_color,
                            borderRadius: 0.8,
                            border: `${ownerFactionDeets.primary_color} 1px solid`,
                        }}
                    />
                )}
                <Typography variant="h5" sx={{ color: ownerFactionDeets.primary_color, fontWeight: "fontWeightBold" }}>
                    {username}
                    <span style={{ marginLeft: ".2rem", opacity: 0.8, fontFamily: "inherit" }}>{`#${gid}`}</span>
                </Typography>
            </Stack>
        </Box>
    )
}
