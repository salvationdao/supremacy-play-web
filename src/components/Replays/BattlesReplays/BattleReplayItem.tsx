import { Box, Typography } from "@mui/material"
import { useTheme } from "../../../containers/theme"
import { timeSinceInWords } from "../../../helpers"
import { fonts } from "../../../theme/theme"
import { BattleReplay } from "../../../types"
import { FancyButton } from "../../Common/FancyButton"

export const BattleReplayItem = ({ battleReplay, onItemClick }: { battleReplay: BattleReplay; onItemClick: (gid: number, battleNumber: number) => void }) => {
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
                opacity: 0.9,
                border: { borderColor: theme.factionTheme.primary, borderThickness: ".25rem" },
                sx: { position: "relative", height: "100%" },
            }}
            sx={{ color: theme.factionTheme.primary, textAlign: "start", height: "100%", ":hover": { opacity: 1 } }}
            onClick={() => onItemClick(arena.gid, battle_number)}
        >
            <Box sx={{ height: "100%" }}>
                {/* Thumbnail */}
                <Box sx={{ position: "relative" }}>
                    <Box
                        component="img"
                        src={battleReplay.game_map?.logo_url}
                        sx={{
                            top: "5",
                            right: "5",
                            width: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                            position: "absolute",
                        }}
                    />

                    <Box
                        component="img"
                        src={battleReplay.game_map?.background_url}
                        sx={{
                            height: "15rem",
                            width: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                        }}
                    />
                </Box>

                {/* Info */}
                <Box>
                    <Typography sx={{ fontFamily: fonts.nostromoBlack }}>BATTLE #{battle_number}</Typography>
                    <Typography>{timeSinceInWords(ended_at, new Date())} ago</Typography>
                </Box>
            </Box>
        </FancyButton>
    )
}
