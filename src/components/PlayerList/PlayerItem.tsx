import { Box, Stack, Theme, Typography, useTheme } from "@mui/material"
import { StyledImageText, UserActive } from ".."
import { PASSPORT_SERVER_HOST_IMAGES } from "../../constants"
import { colors } from "../../theme/theme"
import { FactionGeneralData } from "../../types/passport"

export const PlayerItem = ({ player, faction }: { player: UserActive; faction: FactionGeneralData }) => {
    const theme = useTheme<Theme>()

    return (
        <Stack
            direction="row"
            spacing="1.1rem"
            alignItems="center"
            sx={{
                px: "1.3rem",
                py: "1rem",
                backgroundColor: `${theme.factionTheme.primary}10`,
            }}
        >
            <Box sx={{ width: ".8rem", height: ".8rem", borderRadius: "50%", backgroundColor: player.is_active ? colors.green : colors.grey }} />

            <Box sx={{ pt: ".3rem" }}>
                <StyledImageText
                    text={
                        <>
                            {`${player.username}`}
                            <span style={{ marginLeft: ".2rem", opacity: 0.7 }}>{`#${player.gid}`}</span>
                        </>
                    }
                    color={theme.factionTheme.primary}
                    imageUrl={`${PASSPORT_SERVER_HOST_IMAGES}/api/files/${faction?.logo_blob_id}`}
                    imageMb={-0.2}
                />
            </Box>
        </Stack>
    )
}
