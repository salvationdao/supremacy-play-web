import { Box, Typography } from "@mui/material"
import { ThreeMechsJPG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { timeSinceInWords } from "../../../helpers"
import { fonts } from "../../../theme/theme"
import { BattleReplay } from "../../../types"
import { FancyButton } from "../../Common/FancyButton"

export const BattleReplayItem = ({ battleReplay }: { battleReplay: BattleReplay }) => {
    const theme = useTheme()

    if (!battleReplay.battle || !battleReplay.battle.ended_at) return null

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
            to={`/replays/battles/${battleReplay.id}`}
        >
            <Box sx={{ height: "100%" }}>
                {/* Thumbnail */}
                <Box
                    component="img"
                    src={ThreeMechsJPG}
                    sx={{
                        height: "15rem",
                        width: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                    }}
                />

                {/* Info */}
                <Box>
                    <Typography sx={{ fontFamily: fonts.nostromoBlack }}>BATTLE #{battle_number}</Typography>
                    <Typography>{timeSinceInWords(ended_at, new Date())} ago</Typography>
                </Box>
            </Box>
        </FancyButton>
    )
}
