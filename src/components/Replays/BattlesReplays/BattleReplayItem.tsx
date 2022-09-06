import { Box, Stack, Typography } from "@mui/material"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"
import { BattleReplay } from "../../../types"
import { FancyButton } from "../../Common/FancyButton"

export const BattleReplayItem = ({ battleReplay }: { battleReplay: BattleReplay }) => {
    const theme = useTheme()

    if (!battleReplay.battle.ended_at) return null

    const { arena } = battleReplay
    const { battle_number, ended_at } = battleReplay.battle

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
                backgroundColor: theme.factionTheme.background,
                opacity: 0.6,
                sx: { position: "relative", height: "100%" },
            }}
            sx={{ color: theme.factionTheme.primary, textAlign: "start", height: "100%", ":hover": { opacity: 1 } }}
            to={`/replay?gid=${arena.gid}&battleNumber=${battle_number}`}
        >
            <Stack spacing="1rem" sx={{ height: "100%" }}>
                {/* Thumbnail */}
                <Box sx={{ position: "relative" }}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            height: "100%",
                            width: "90%",
                            background: `url(${battleReplay.game_map?.logo_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                            zIndex: 1,
                        }}
                    />

                    <Box
                        sx={{
                            height: "15rem",
                            width: "100%",
                            background: `url(${battleReplay.game_map?.background_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                    />
                </Box>

                {/* Info */}
                <Box>
                    <Typography sx={{ fontFamily: fonts.nostromoBlack }}>BATTLE #{battle_number}</Typography>
                    <Typography>{ended_at.toLocaleDateString()}</Typography>
                </Box>
            </Stack>
        </FancyButton>
    )
}
