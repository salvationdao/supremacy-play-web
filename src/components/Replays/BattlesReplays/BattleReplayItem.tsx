import { Box, Typography } from "@mui/material"
import { ThreeMechsJPG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { timeSinceInWords } from "../../../helpers"
import { fonts } from "../../../theme/theme"
import { BattleReplay } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"

export const BattleReplayItem = ({ battleReplay }: { battleReplay: BattleReplay }) => {
    const theme = useTheme()
    const { battle_number, ended_at } = battleReplay.battle

    if (!ended_at) return null

    return (
        <ClipThing
            clipSize="10px"
            border={{
                isFancy: true,
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            opacity={0.7}
            backgroundColor={theme.factionTheme.primary}
            sx={{ height: "100%" }}
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
        </ClipThing>
    )
}
