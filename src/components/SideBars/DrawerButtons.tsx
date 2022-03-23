import { Box, Stack, SxProps, Typography } from "@mui/material"
import { ReactElement } from "react"
import { SvgChat, SvgRobot } from "../../assets"
import { GAME_BAR_HEIGHT, LIVE_CHAT_DRAWER_BUTTON_WIDTH } from "../../constants"
import { useDrawer, usePassportServerAuth } from "../../containers"
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
    Svg?: ReactElement
}) => {
    const { user } = usePassportServerAuth()

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

export const DrawerButtons = ({ isFixed = true }: { isFixed?: boolean }) => {
    const { user } = usePassportServerAuth()
    const { isLiveChatOpen, toggleIsLiveChatOpen, isAssetOpen, toggleIsAssetOpen } = useDrawer()

    const numberOfButtons = user ? 2 : 1

    const styles: SxProps = isFixed
        ? {
              position: "fixed",
              top: 0,
              bottom: 0,
              right: 0,
          }
        : {
              position: "relative",
              height: "100%",
          }

    return (
        <Box
            sx={{
                ...styles,
                overflow: "hidden",
                width: `${LIVE_CHAT_DRAWER_BUTTON_WIDTH}rem`,
                backgroundColor:
                    user && user.faction ? shadeColor(user.faction.theme.primary, -95) : colors.darkNavyBlue,
                zIndex: 1,
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
                    transform: `translate(-50%, calc(${numberOfButtons * (BUTTON_WIDTH / 2)}rem - ${
                        LIVE_CHAT_DRAWER_BUTTON_WIDTH / 2
                    }rem + ${GAME_BAR_HEIGHT}rem)) rotate(-90deg)`,
                }}
            >
                {user && user.faction && (
                    <SideButton
                        isEnabled={true}
                        isOpen={isAssetOpen}
                        toggleIsOpen={toggleIsAssetOpen}
                        text="WAR MACHINES"
                        Svg={<SvgRobot size="1.2rem" sx={{ pt: ".08rem" }} />}
                    />
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
