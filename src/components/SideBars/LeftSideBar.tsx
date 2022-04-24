import { Box, Stack, Typography } from "@mui/material"
import { ReactElement } from "react"
import { useGameServerAuth, useOverlayToggles } from "../../containers"
import { shadeColor } from "../../helpers"
import { colors } from "../../theme/theme"

const DRAWER_BAR_WIDTH = 2.5 // rem
const BUTTON_WIDTH = 15.2 //rem
const NUM_BUTTONS = 1

export const LeftSideBar = () => {
    const { user } = useGameServerAuth()
    const { isEndBattleDetailOpen, toggleIsEndBattleDetailOpen, isEndBattleDetailEnabled } = useOverlayToggles()

    return (
        <Box
            sx={{
                position: "relative",
                overflow: "hidden",
                width: `${DRAWER_BAR_WIDTH}rem`,
                backgroundColor: user && user.faction ? shadeColor(user.faction.theme.primary, -95) : colors.darkNavyBlue,
                zIndex: 1002,
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing=".16rem"
                sx={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: `translate(-50%, calc(${NUM_BUTTONS * (BUTTON_WIDTH / 2)}rem - ${DRAWER_BAR_WIDTH / 2}rem)) rotate(-90deg)`,
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

const SideButton = ({
    isEnabled,
    isOpen,
    toggleIsOpen,
    text,
    Svg,
}: {
    isEnabled: boolean
    isOpen: boolean
    toggleIsOpen: (value?: boolean) => void
    text: string
    Svg?: ReactElement
}) => {
    const { user } = useGameServerAuth()

    return (
        <Stack
            onClick={() => toggleIsOpen()}
            direction="row"
            spacing=".4rem"
            alignItems="center"
            justifyContent="center"
            sx={{
                px: "1.8rem",
                pt: ".16rem",
                height: `${DRAWER_BAR_WIDTH}rem`,
                width: `${BUTTON_WIDTH}rem`,
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
