import { Box, Button, Popover, Stack } from "@mui/material"
import { useMemo, useRef, useState } from "react"
import { LiveCounts, OverlayToggles, VideoPlayerControls } from ".."
import { DEV_ONLY } from "../../constants"
import { useArena, useAuth, useChat, useMobile, useSupremacy, VoiceStream } from "../../containers"
import { useTheme } from "../../containers/theme"
import { shadeColor } from "../../helpers"
import { useGameServerSubscriptionSecuredUser } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { siteZIndex } from "../../theme/theme"
import { VoiceChat } from "../RightDrawer/VoiceChat/VoiceChat"
import { ArenaSelect } from "./ArenaSelect"
import { OvenResolutionSelect } from "./ResolutionSelect"
import { OvenStreamSelect } from "./StreamSelect"

export const CONTROLS_HEIGHT = 3.0 // rem

export const Controls = () => {
    const { isMobile } = useMobile()
    const theme = useTheme()

    const darkerBackgroundColor = useMemo(() => shadeColor(theme.factionTheme.primary, -91), [theme.factionTheme.primary])

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing="1.6rem"
            sx={{
                flexShrink: 0,
                position: "relative",
                width: "100%",
                height: `${CONTROLS_HEIGHT}rem`,
                px: "1rem",
                pt: ".24rem",
                pb: ".16rem",
                background: (theme) => `linear-gradient(${darkerBackgroundColor} 26%, ${theme.factionTheme.background})`,
                zIndex: siteZIndex.Controls,
                overflowX: "auto",
                overflowY: "hidden",

                "::-webkit-scrollbar": {
                    height: ".6rem",
                },
                "::-webkit-scrollbar-track": {
                    background: "#FFFFFF15",
                    borderRadius: 0,
                },
                "::-webkit-scrollbar-thumb": {
                    background: (theme) => `${theme.factionTheme.primary}50`,
                    borderRadius: 0,
                },
            }}
        >
            <Stack direction="row" spacing="1.6rem" sx={{ flexShrink: 0, height: "100%" }}>
                <LiveCounts />
                {!isMobile && <OverlayToggles />}
            </Stack>

            <Stack direction="row" spacing="1.2rem" sx={{ flexShrink: 0, height: "100%" }}>
                <VoiceChat2 />
                {DEV_ONLY && <ArenaSelect />}
                <OvenStreamSelect />
                <OvenResolutionSelect />
                <VideoPlayerControls />
            </Stack>
        </Stack>
    )
}

const VoiceChat2 = () => {
    const [open, setOpen] = useState(false)
    const popoverRef = useRef(null)

    const { getFaction } = useSupremacy()
    const { user, factionID } = useAuth()
    const { activePlayers } = useChat()
    const { currentArenaID, setListenStreams, listenStreams, onListen, onDisconnect } = useArena()

    // player voice chat data
    useGameServerSubscriptionSecuredUser<VoiceStream[]>(
        {
            URI: `/arena/${currentArenaID}`,
            key: GameServerKeys.SubPlayerVoiceStream,
            ready: !!(currentArenaID && factionID),
        },
        (payload: VoiceStream[]) => {
            setListenStreams(undefined)
            setListenStreams(payload)
        },
    )

    return (
        <>
            {/* open button */}
            <Button ref={popoverRef} onClick={() => setOpen(!open)}>
                Voice Chat
            </Button>

            <Popover
                id={"voice-chat"}
                open={open}
                onClose={() => setOpen(false)}
                anchorEl={popoverRef.current}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Box sx={{ width: "40rem", height: "55rem" }}>
                    {<VoiceChat faction={getFaction(user.faction_id)} listenStreams={listenStreams || []} onListen={onListen} user={user} />}
                </Box>
            </Popover>

            <>
                {listenStreams &&
                    listenStreams.map((s) => {
                        return (
                            <Box display="none" key={s.username + s.user_gid}>
                                <div id={s.listen_url} key={s.username + s.user_gid} />
                            </Box>
                        )
                    })}
            </>
        </>
    )
}
