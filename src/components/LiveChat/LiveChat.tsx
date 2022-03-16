import { Badge, Box, Drawer, Stack, Tab, Tabs, Typography } from "@mui/material"
import { DrawerButtons } from ".."
import { SvgGlobal } from "../../assets"
import {
    DRAWER_TRANSITION_DURATION,
    GAME_BAR_HEIGHT,
    LIVE_CHAT_DRAWER_WIDTH,
    PASSPORT_SERVER_HOST_IMAGES,
} from "../../constants"
import { useChat, useDrawer, usePassportServerAuth } from "../../containers"
import { acronym, shadeColor } from "../../helpers"
import { colors } from "../../theme/theme"
import { ChatData, UserData } from "../../types/passport"
import { ChatMessages } from "./ChatMessages/ChatMessages"
import { ChatSend } from "./ChatSend/ChatSend"

const Content = ({
    user,
    faction_id,
    primaryColor,
    secondaryColor,
    chatMessages,
}: {
    user?: UserData
    faction_id: string | null
    primaryColor: string
    secondaryColor: string
    chatMessages: ChatData[]
}) => {
    return (
        <>
            <ChatMessages
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                chatMessages={chatMessages}
                faction_id={faction_id}
            />

            {user ? (
                <ChatSend primaryColor={primaryColor} faction_id={faction_id} />
            ) : (
                <Box sx={{ px: "1.6rem", py: ".4rem", backgroundColor: colors.red }}>
                    <Typography
                        variant="body2"
                        sx={{
                            textAlign: "center",
                            lineHeight: 1,
                        }}
                    >
                        You must be signed in to send messages.
                    </Typography>
                </Box>
            )}
        </>
    )
}

const TabbedLayout = () => {
    const { user } = usePassportServerAuth()
    const { tabValue, setTabValue, globalChatMessages, factionChatMessages, factionChatUnread, globalChatUnread } =
        useChat()

    const chatMessages = tabValue == 0 ? globalChatMessages : factionChatMessages
    const isEnlisted = user && user.faction_id && user.faction
    let faction_id
    let primaryColor
    let secondaryColor
    let bannerBackgroundColor

    if (tabValue == 0) {
        faction_id = null
        primaryColor = colors.globalChat
        secondaryColor = "#FFFFFF"
        bannerBackgroundColor = shadeColor(colors.globalChat, -30)
    } else if (tabValue == 1 && isEnlisted) {
        faction_id = user.faction_id
        primaryColor = user.faction.theme.primary
        secondaryColor = user.faction.theme.secondary
        bannerBackgroundColor = `${primaryColor}25`
    } else {
        return null
    }

    let factionTabLabel = ""
    if (isEnlisted) {
        factionTabLabel = user.faction.label
        if (factionTabLabel.length > 8) factionTabLabel = acronym(factionTabLabel)
        factionTabLabel += " CHAT"
    }

    return (
        <Stack
            sx={{
                flex: 1,
                backgroundColor:
                    tabValue == 1 && user && user.faction
                        ? `${user?.faction.theme.primary}06`
                        : `${colors.globalChat}13`,
            }}
        >
            <Tabs
                value={tabValue}
                variant="fullWidth"
                sx={{
                    height: `${GAME_BAR_HEIGHT}rem`,
                    background: bannerBackgroundColor,
                    boxShadow: 1,
                    ".MuiButtonBase-root": {
                        height: `${GAME_BAR_HEIGHT}rem`,
                    },
                    ".MuiTabs-indicator": {
                        height: "3px",
                        background: "#FFFFFF50",
                    },
                }}
                onChange={(event, newValue) => {
                    setTabValue(newValue)
                }}
            >
                <Tab
                    label={
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing=".96rem">
                            <Badge
                                badgeContent={globalChatUnread}
                                sx={{ ".MuiBadge-badge": { color: "#FFFFFF", backgroundColor: colors.red } }}
                            >
                                <SvgGlobal size="2rem" />
                            </Badge>
                            <Typography
                                variant="caption"
                                sx={{
                                    lineHeight: 1,
                                    fontFamily: "Nostromo Regular Black",
                                }}
                            >
                                GLOBAL CHAT
                            </Typography>
                        </Stack>
                    }
                />
                {isEnlisted && (
                    <Tab
                        label={
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing=".96rem">
                                <Badge
                                    badgeContent={factionChatUnread}
                                    sx={{ ".MuiBadge-badge": { color: "#FFFFFF", backgroundColor: colors.red } }}
                                >
                                    <Box
                                        sx={{
                                            width: "2.1rem",
                                            height: "2.1rem",
                                            flexShrink: 0,
                                            mb: ".16rem",
                                            backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${user.faction.logo_blob_id})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center",
                                            backgroundSize: "contain",
                                            backgroundColor: user.faction.theme.primary,
                                            borderRadius: 0.5,
                                            border: `${user.faction.theme.primary} solid 1px`,
                                        }}
                                    />
                                </Badge>
                                <Typography
                                    variant="caption"
                                    sx={{ lineHeight: 1, fontFamily: "Nostromo Regular Black" }}
                                >
                                    {factionTabLabel}
                                </Typography>
                            </Stack>
                        }
                    />
                )}
            </Tabs>

            <Content
                user={user}
                faction_id={faction_id}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                chatMessages={chatMessages}
            />
        </Stack>
    )
}

const SplitLayout = () => {
    const { user } = usePassportServerAuth()
    const { globalChatMessages, factionChatMessages } = useChat()

    const isEnlisted = user && user.faction_id && user.faction

    let factionTabLabel = ""
    if (isEnlisted) {
        factionTabLabel = user.faction.label
        if (factionTabLabel.length > 8) factionTabLabel = acronym(factionTabLabel)
        factionTabLabel += " CHAT"
    }

    return (
        <Stack sx={{ flex: 1 }}>
            <Stack sx={{ height: "50%", backgroundColor: `${colors.globalChat}13` }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing=".96rem"
                    sx={{
                        height: `${GAME_BAR_HEIGHT}rem`,
                        px: "1.8rem",
                        background: shadeColor(colors.globalChat, -30),
                        boxShadow: 1,
                    }}
                >
                    <SvgGlobal size="2rem" />
                    <Typography
                        variant="caption"
                        sx={{
                            lineHeight: 1,
                            fontFamily: "Nostromo Regular Black",
                        }}
                    >
                        GLOBAL CHAT
                    </Typography>
                </Stack>

                <Content
                    user={user}
                    faction_id={null}
                    primaryColor={colors.globalChat}
                    secondaryColor={"#FFFFFF"}
                    chatMessages={globalChatMessages}
                />
            </Stack>

            {isEnlisted && (
                <Stack sx={{ height: "50%", backgroundColor: `${user?.faction.theme.primary}06` }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing=".96rem"
                        sx={{
                            height: `${GAME_BAR_HEIGHT}rem`,
                            px: "1.8rem",
                            background: `${user.faction.theme.primary}25`,
                            boxShadow: 1,
                        }}
                    >
                        <Box
                            sx={{
                                width: "2.1rem",
                                height: "2.1rem",
                                flexShrink: 0,
                                mb: ".16rem",
                                backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${user.faction.logo_blob_id})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "contain",
                                backgroundColor: user.faction.theme.primary,
                                borderRadius: 0.5,
                                border: `${user.faction.theme.primary} solid 1px`,
                            }}
                        />
                        <Typography variant="caption" sx={{ lineHeight: 1, fontFamily: "Nostromo Regular Black" }}>
                            {factionTabLabel}
                        </Typography>
                    </Stack>

                    <Content
                        user={user}
                        faction_id={user.faction_id}
                        primaryColor={user.faction.theme.primary}
                        secondaryColor={user.faction.theme.secondary}
                        chatMessages={factionChatMessages}
                    />
                </Stack>
            )}
        </Stack>
    )
}

export const LiveChat = () => {
    const { isLiveChatOpen } = useDrawer()
    const { splitOption } = useChat()

    return (
        <Drawer
            transitionDuration={DRAWER_TRANSITION_DURATION}
            open={isLiveChatOpen}
            variant="persistent"
            anchor="right"
            sx={{
                width: `${LIVE_CHAT_DRAWER_WIDTH}rem`,
                flexShrink: 0,
                zIndex: 9999,
                "& .MuiDrawer-paper": {
                    width: `${LIVE_CHAT_DRAWER_WIDTH}rem`,
                    backgroundColor: colors.darkNavy,
                },
            }}
        >
            <Stack direction="row" sx={{ width: "100%", height: "100%" }}>
                <DrawerButtons isFixed={false} />
                {splitOption == "split" ? <SplitLayout /> : <TabbedLayout />}
            </Stack>
        </Drawer>
    )
}
