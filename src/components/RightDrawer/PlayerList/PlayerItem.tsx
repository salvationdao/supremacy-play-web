import { Box, Stack, Typography } from "@mui/material"
import { FancyButton, UserBanForm } from "../.."
import { useTheme } from "../../../containers/theme"
import { useToggle } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { User } from "../../../types"
import { Player } from "../../Common/Player"

export const PlayerItem = ({ player, user, isActive }: { player: User; user: User; isActive?: boolean }) => {
    const theme = useTheme()
    const [banModalOpen, toggleBanModalOpen] = useToggle()

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    px: "1.3rem",
                    py: ".5rem",
                    backgroundColor: (theme) => `${theme.factionTheme.primary}10`,
                    opacity: isActive ? 1 : 0.6,
                }}
            >
                <Box sx={{ width: ".8rem", height: ".8rem", borderRadius: "50%", backgroundColor: isActive ? colors.green : colors.yellow }} />

                <Box sx={{ pt: ".3rem", ml: "1.1rem" }}>
                    <Player player={player} />
                </Box>

                <FancyButton
                    clipThingsProps={{
                        clipSize: "7px",
                        opacity: 1,
                        sx: { position: "relative", ml: "auto" },
                    }}
                    sx={{ px: "1rem", py: ".1rem", color: theme.factionTheme.primary }}
                    onClick={() => toggleBanModalOpen()}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            color: "#FFFFFF80",
                            fontFamily: fonts.nostromoBold,
                        }}
                    >
                        REPORT
                    </Typography>
                </FancyButton>
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
