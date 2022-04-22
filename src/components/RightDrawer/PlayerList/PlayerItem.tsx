import { Box, Button, Stack, Theme, Typography, useTheme } from "@mui/material"
import { StyledImageText, UserBanForm } from "../.."
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { truncate } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { colors } from "../../../theme/theme"
import { User } from "../../../types"
import { FactionGeneralData } from "../../../types/passport"

export const PlayerItem = ({ player, faction, user, isActive }: { player: User; faction: FactionGeneralData; user: User; isActive?: boolean }) => {
    const theme = useTheme<Theme>()
    const [banModalOpen, toggleBanModalOpen] = useToggle()

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    px: "1.3rem",
                    pt: ".2rem",
                    pb: ".3rem",
                    backgroundColor: `${theme.factionTheme.primary}10`,
                    opacity: isActive ? 1 : 0.6,
                }}
            >
                <Box sx={{ width: ".8rem", height: ".8rem", borderRadius: "50%", backgroundColor: isActive ? colors.green : colors.yellow }} />

                <Box sx={{ pt: ".3rem", ml: "1.1rem" }}>
                    <StyledImageText
                        text={
                            <>
                                {`${truncate(player.username, 20)}`}
                                <span style={{ marginLeft: ".2rem", opacity: 0.7 }}>{`#${player.gid}`}</span>
                            </>
                        }
                        color={theme.factionTheme.primary}
                        imageUrl={`${PASSPORT_SERVER_HOST_IMAGES}/api/files/${faction?.logo_blob_id}`}
                        imageMb={-0.2}
                    />
                </Box>

                <Button size="small" onClick={() => toggleBanModalOpen()} sx={{ px: "1rem", ml: "auto" }}>
                    <Typography>REPORT</Typography>
                </Button>
            </Stack>

            {banModalOpen && (
                <UserBanForm
                    user={user}
                    open={banModalOpen}
                    onClose={() => toggleBanModalOpen(false)}
                    prefillUser={{
                        id: player.id,
                        username: player.username,
                        gid: player.gid,
                    }}
                />
            )}
        </>
    )
}
