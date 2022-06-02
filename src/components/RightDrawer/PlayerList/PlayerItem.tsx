import { Box, Stack, Typography } from "@mui/material"
import { FancyButton, StyledImageText, UserBanForm } from "../.."
import { truncate } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { User } from "../../../types"
import { Faction } from "../../../types"
import { useTheme } from "../../../containers/theme"

export const PlayerItem = ({ player, faction, user, isActive }: { player: User; faction: Faction; user: User; isActive?: boolean }) => {
    const theme = useTheme()
    const [banModalOpen, toggleBanModalOpen] = useToggle()

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    px: "1.3rem",
                    py: ".4rem",
                    backgroundColor: (theme) => `${theme.factionTheme.primary}10`,
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
                        imageUrl={faction.logo_url}
                        imageMb={-0.2}
                    />
                </Box>

                <FancyButton
                    excludeCaret
                    clipThingsProps={{
                        clipSize: "4px",
                        opacity: 1,
                        sx: { position: "relative", ml: "auto" },
                    }}
                    sx={{ px: "1rem", py: ".1rem", color: "#FFFFFF" }}
                    onClick={() => toggleBanModalOpen()}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            color: "#FFFFFF80",
                            fontSize: "1rem",
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
