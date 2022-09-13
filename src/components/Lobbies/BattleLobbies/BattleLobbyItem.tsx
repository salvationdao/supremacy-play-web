import { BattleLobby } from "../../../types/battle_queue"
import { useTheme } from "../../../containers/theme"
import { FancyButton } from "../../Common/FancyButton"
import { Box, Stack, Typography } from "@mui/material"
import { fonts } from "../../../theme/theme"

export const BattleLobbyItem = ({ battleLobby }: { battleLobby: BattleLobby }) => {
    const theme = useTheme()

    const { game_map, number } = battleLobby
    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    return (
        <FancyButton
            disableRipple
            clipThingsProps={{
                clipSize: "7px",
                clipSlantSize: "0px",
                corners: {
                    topLeft: true,
                    topRight: true,
                    bottomLeft: true,
                    bottomRight: true,
                },
                backgroundColor: backgroundColor,
                opacity: 0.9,
                border: { borderColor: primaryColor, borderThickness: ".4rem" },
                sx: { position: "relative", height: "100%" },
            }}
            sx={{ p: 0, color: primaryColor, textAlign: "start", height: "100%", ":hover": { opacity: 1 } }}
        >
            <Stack sx={{ height: "100%" }}>
                {/* Thumbnail */}
                <Box sx={{ position: "relative", minHeight: "10rem", background: `url(${game_map.background_url})` }}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "15%",
                            transform: "translate(-50%, -50%)",
                            height: "50%",
                            width: "50%",
                            background: `url(${game_map.logo_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                            zIndex: 1,
                        }}
                    />

                    {/* Info */}
                    <Box>
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>Lobby #{number}</Typography>
                    </Box>
                </Box>
            </Stack>
        </FancyButton>
    )
}
