import { Box, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { SvgChat, SvgRobot } from "../../assets"
import { GAME_BAR_HEIGHT, LIVE_CHAT_DRAWER_BUTTON_WIDTH } from "../../constants"
import { useDrawer, useGameServerAuth } from "../../containers"
import { shadeColor } from "../../helpers"
import { colors } from "../../theme/theme"

const BUTTON_WIDTH = 15.2 //rem

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
    Svg?: ReactNode
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
                px: "1.6rem",
                pt: ".16rem",
                height: `${LIVE_CHAT_DRAWER_BUTTON_WIDTH}rem`,
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
                    fontFamily: "Nostromo Regular Bold",
                    textAlign: "center",
                    lineHeight: 1,
                    fontWeight: "fontWeightBold",
                    whiteSpace: "nowrap",
                }}
            >
                {text}
            </Typography>
            {Svg}
        </Stack>
    )
}

export const DrawerButtons = () => {
    const { user } = useGameServerAuth()
    const { isLiveChatOpen, toggleIsLiveChatOpen, isPlayerListOpen, toggleIsPlayerListOpen, isAssetOpen, toggleIsAssetOpen } = useDrawer()

    return (
        <Box
            sx={{
                position: "relative",
                height: "100%",
                overflow: "hidden",
                width: `${LIVE_CHAT_DRAWER_BUTTON_WIDTH}rem`,
                backgroundColor: user && user.faction ? shadeColor(user.faction.theme.primary, -95) : colors.darkNavyBlue,
                zIndex: 2,
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
                    transform: `translate(-50%, calc(${BUTTON_WIDTH}rem +  ${GAME_BAR_HEIGHT}rem)) rotate(-90deg)`,
                }}
            >
                {user && user.faction && (
                    <>
                        <SideButton
                            isEnabled={true}
                            isOpen={isAssetOpen}
                            toggleIsOpen={toggleIsAssetOpen}
                            text="WAR MACHINES"
                            Svg={<SvgRobot size="1.2rem" sx={{ pt: ".08rem" }} />}
                        />
                        <SideButton
                            isEnabled={true}
                            isOpen={isPlayerListOpen}
                            toggleIsOpen={toggleIsPlayerListOpen}
                            text="ACTIVE PLAYERS"
                            Svg={
                                <Box sx={{ pb: ".2rem" }}>
                                    <Box sx={{ width: ".8rem", height: ".8rem", borderRadius: "50%", backgroundColor: user.faction.theme.primary }} />
                                </Box>
                            }
                        />
                    </>
                )}

                <SideButton
                    isEnabled={true}
                    isOpen={isLiveChatOpen}
                    toggleIsOpen={toggleIsLiveChatOpen}
                    text="WAR ROOM"
                    Svg={<SvgChat size=".9rem" sx={{ pt: ".24rem" }} />}
                />
            </Stack>
        </Box>
    )
}
