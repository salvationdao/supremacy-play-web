import { Box, Stack, Typography } from "@mui/material"
import { ReactElement } from "react"
import { LIVE_CHAT_DRAWER_BUTTON_WIDTH } from "../../constants"
import { useGameServerAuth, useOverlayToggles } from "../../containers"
import { shadeColor } from "../../helpers"
import { colors } from "../../theme/theme"

const BUTTON_WIDTH = 150
const NUM_BUTTONS = 1

const SideButton = ({
    isEnabled,
    isOpen,
    toggleIsOpen,
    text,
    Svg,
}: {
    isEnabled: boolean
    isOpen: boolean
    toggleIsOpen: any
    text: string
    Svg?: ReactElement
}) => {
    const { user } = useGameServerAuth()

    return (
        <Stack
            onClick={toggleIsOpen}
            direction="row"
            spacing={0.5}
            alignItems="center"
            justifyContent="center"
            sx={{
                px: 2,
                pt: 0.2,
                height: LIVE_CHAT_DRAWER_BUTTON_WIDTH,
                width: BUTTON_WIDTH,
                backgroundColor: user && user.faction ? `${user.faction.theme.primary}40` : colors.darkerNeonBlue,
                cursor: "pointer",
                pointerEvents: isEnabled ? "auto" : "none",
                opacity: isEnabled && isOpen ? 1 : 0.36,
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
                    fontFamily: "Nostromo Regular Bold",
                }}
            >
                {text}
            </Typography>
            {Svg}
        </Stack>
    )
}

export const LeftSideBar = () => {
    const { user } = useGameServerAuth()
    const { isEndBattleDetailOpen, toggleIsEndBattleDetailOpen, isEndBattleDetailEnabled } = useOverlayToggles()

    return (
        <Box
            sx={{
                position: "relative",
                overflow: "hidden",
                width: LIVE_CHAT_DRAWER_BUTTON_WIDTH,
                backgroundColor:
                    user && user.faction ? shadeColor(user.faction.theme.primary, -95) : colors.darkNavyBlue,
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
                    transform: `translate(-50%, calc(${NUM_BUTTONS * (BUTTON_WIDTH / 2)}px - ${
                        LIVE_CHAT_DRAWER_BUTTON_WIDTH / 2
                    }px)) rotate(-90deg)`,
                }}
            >
                <SideButton
                    isEnabled={isEndBattleDetailEnabled}
                    isOpen={isEndBattleDetailOpen}
                    toggleIsOpen={toggleIsEndBattleDetailOpen}
                    text="PREVIOUS BATTLE"
                />
            </Stack>
        </Box>
    )
}
