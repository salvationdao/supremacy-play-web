import { Box, Stack, Typography } from "@mui/material"
import { GAMEBAR_CONSTANTS } from "@ninjasoftware/passport-gamebar"
import { useLeftSideBar } from "../../containers"
import { colors } from "../../theme/theme"

const BUTTON_WIDTH = 110
const NUM_BUTTONS = 1

export const LeftSideBar = () => {
    const { isEndBattleDetailOpen, toggleIsEndBattleDetailOpen } = useLeftSideBar()

    return (
        <Box
            sx={{
                position: "relative",
                overflow: "hidden",
                width: GAMEBAR_CONSTANTS.liveChatDrawerButtonWidth,
                backgroundColor: colors.darkNavyBlue,
                zIndex: 1002,
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={0.2}
                sx={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: `translate(-50%, ${NUM_BUTTONS * (BUTTON_WIDTH / 2)}px) rotate(-90deg)`,
                }}
            >
                <Stack
                    onClick={toggleIsEndBattleDetailOpen}
                    justifyContent="center"
                    sx={{
                        px: 2,
                        height: GAMEBAR_CONSTANTS.liveChatDrawerButtonWidth,
                        width: BUTTON_WIDTH,
                        backgroundColor: colors.darkNavy,
                        cursor: "pointer",
                        opacity: isEndBattleDetailOpen ? 1 : 0.6,
                        ":hover": {
                            opacity: 1,
                        },
                        ":active": {
                            opacity: 0.8,
                        },
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            textAlign: "center",
                            lineHeight: 1,
                            fontWeight: "fontWeightBold",
                            whiteSpace: "nowrap",
                        }}
                    >
                        PREVIOUS BATTLE
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    )
}
