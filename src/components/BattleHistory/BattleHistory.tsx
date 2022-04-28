import { Fade } from "@mui/material"
import { Box } from "@mui/system"
import { useOverlayToggles } from "../../containers"
import { colors, siteZIndex } from "../../theme/theme"

export const BattleHistory = () => {
    const { isBattleHistoryOpen } = useOverlayToggles()

    return (
        <Fade in={isBattleHistoryOpen}>
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: colors.darkNavy,
                    zIndex: siteZIndex.BattleHistory,
                }}
            >
                {isBattleHistoryOpen && (
                    <iframe
                        src="https://stats.supremacy.game/#/"
                        style={{
                            width: "100%",
                            height: "100%",
                            border: 0,
                        }}
                    ></iframe>
                )}
            </Box>
        </Fade>
    )
}
