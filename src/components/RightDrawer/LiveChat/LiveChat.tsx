import { Badge, Box, Fade, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useMemo } from "react"
import { AdditionalOptionsButton, TooltipHelper } from "../.."
import { SvgGlobal, SvgInfoCircular } from "../../../assets"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { ChatProvider, useChat, useGameServerAuth } from "../../../containers"
import { acronym, shadeColor } from "../../../helpers"
import { zoomEffect } from "../../../theme/keyframes"
import { colors } from "../../../theme/theme"
import { User } from "../../../types"
import { ChatMessageType } from "../../../types/chat"
import { ChatMessages } from "./ChatMessages/ChatMessages"
import { ChatSend } from "./ChatSend/ChatSend"

const TabbedLayout = () => {
    const { user } = useGameServerAuth()
    const { tabValue, setTabValue, globalChatMessages, factionChatMessages, factionChatUnread, globalChatUnread, banProposal } = useChat()

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
                height: 0,
                position: "relative",
                backgroundColor: tabValue == 1 && user && user.faction ? `${user?.faction.theme.primary}06` : `${colors.globalChat}13`,
            }}
        >
            <Tabs
                value={tabValue}
                variant="fullWidth"
                sx={{
                    height: `${5}rem`,
                    background: bannerBackgroundColor,
                    boxShadow: 1,
                    zIndex: 99,
                    ".MuiButtonBase-root": {
                        height: `${5}rem`,
                    },
                    ".MuiTabs-indicator": {
                        height: "3px",
                        background: "#FFFFFF50",
                    },
                }}
                onChange={(_event, newValue) => {
                    setTabValue(newValue)
                }}
            >
                <Tab
                    label={
                        <Stack className="tutorial-global-chat" direction="row" alignItems="center" justifyContent="center" spacing=".96rem">
                            <Badge
                                badgeContent={globalChatUnread}
                                sx={{
                                    ".MuiBadge-badge": {
                                        fontSize: "1.2rem",
                                        fontFamily: "Share Tech",
                                        fontWeight: "fontWeightBold",
                                        lineHeight: 0,
                                        color: "#FFFFFF",
                                        backgroundColor: colors.red,
                                    },
                                }}
                            >
                                <SvgGlobal size="2rem" />
                            </Badge>
                            <Typography
                                variant="caption"
                                sx={{
                                    lineHeight: 1,
                                    fontFamily: "Nostromo Regular Black",
                                    textAlign: "start",
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
                            <Stack
                                className="tutorial-faction-chat"
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                                spacing=".96rem"
                                sx={{ animation: banProposal ? `${zoomEffect(1.03)} 1s infinite` : "none" }}
                            >
                                <Badge
                                    badgeContent={factionChatUnread}
                                    sx={{
                                        ".MuiBadge-badge": {
                                            fontSize: "1.2rem",
                                            fontFamily: "Share Tech",
                                            fontWeight: "fontWeightBold",
                                            lineHeight: 0,
                                            color: "#FFFFFF",
                                            backgroundColor: colors.red,
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: "2.1rem",
                                            height: "2.1rem",
                                            flexShrink: 0,
                                            mb: ".16rem",
                                            mr: ".8rem",
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
                                {banProposal && (
                                    <TooltipHelper placement="bottom" text="Punish proposal ongoing">
                                        <Box sx={{ ml: "-.2rem", mr: ".4rem", animation: `${zoomEffect(1.1)} 1s infinite` }}>
                                            <SvgInfoCircular size="1rem" fill={colors.orange} sx={{ pb: ".2rem" }} />
                                        </Box>
                                    </TooltipHelper>
                                )}
                                <Typography variant="caption" sx={{ lineHeight: 1, fontFamily: "Nostromo Regular Black", textAlign: "start" }}>
                                    {factionTabLabel}
                                </Typography>
                            </Stack>
                        }
                    />
                )}
            </Tabs>

            <Content user={user} faction_id={faction_id} primaryColor={primaryColor} secondaryColor={secondaryColor} chatMessages={chatMessages} />
        </Stack>
    )
}

const SplitLayout = () => {
    const { user } = useGameServerAuth()
    const { globalChatMessages, factionChatMessages, banProposal } = useChat()

    const isEnlisted = useMemo(() => user && user.faction_id && user.faction, [user])
    const factionTabLabel = useMemo(() => {
        if (isEnlisted && user) {
            let aaa = user.faction.label
            if (aaa.length > 8) aaa = acronym(aaa)
            aaa += " CHAT"
            return aaa
        }
        return ""
    }, [isEnlisted, user])

    return (
        <Stack sx={{ flex: 1, height: 0 }}>
            <Stack
                className="tutorial-global-chat"
                sx={{
                    position: "relative",
                    height: isEnlisted ? "50%" : "100%",
                    backgroundColor: `${colors.globalChat}13`,
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing=".8rem"
                    sx={{
                        height: `${5}rem`,
                        px: "1.8rem",
                        background: shadeColor(colors.globalChat, -30),
                        boxShadow: 1,
                        zIndex: 99,
                    }}
                >
                    <SvgGlobal size="2rem" />
                    <Typography
                        variant="caption"
                        sx={{
                            lineHeight: 1,
                            fontFamily: "Nostromo Regular Black",
                            textAlign: "start",
                        }}
                    >
                        GLOBAL CHAT
                    </Typography>
                </Stack>

                <Content user={user} faction_id={null} primaryColor={colors.globalChat} secondaryColor={"#FFFFFF"} chatMessages={globalChatMessages} />
            </Stack>

            {isEnlisted && user && (
                <Stack sx={{ position: "relative", height: "50%", backgroundColor: `${user?.faction.theme.primary}06` }}>
                    <Stack
                        justifyContent="center"
                        sx={{
                            height: `${5}rem`,
                            px: "1.8rem",
                            background: `${user.faction.theme.primary}25`,
                            boxShadow: 1,
                            zIndex: 99,
                        }}
                    >
                        <Stack
                            className="tutorial-faction-chat"
                            direction="row"
                            alignItems="center"
                            spacing=".96rem"
                            sx={{ animation: banProposal ? `${zoomEffect(1.03)} 1s infinite` : "none" }}
                        >
                            <Box
                                sx={{
                                    width: "2.1rem",
                                    height: "2.1rem",
                                    flexShrink: 0,
                                    mb: ".16rem",
                                    mr: ".8rem",
                                    backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${user.faction.logo_blob_id})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundSize: "contain",
                                    backgroundColor: user.faction.theme.primary,
                                    borderRadius: 0.5,
                                    border: `${user.faction.theme.primary} solid 1px`,
                                }}
                            />
                            {banProposal && (
                                <TooltipHelper placement="bottom" text="Punish proposal ongoing">
                                    <Box sx={{ ml: "-.2rem", mr: ".4rem", animation: `${zoomEffect(1.1)} 1s infinite` }}>
                                        <SvgInfoCircular size="1rem" fill={colors.orange} sx={{ pb: ".2rem" }} />
                                    </Box>
                                </TooltipHelper>
                            )}
                            <Typography variant="caption" sx={{ lineHeight: 1, fontFamily: "Nostromo Regular Black", textAlign: "start" }}>
                                {factionTabLabel}
                            </Typography>
                        </Stack>
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
    return (
        <ChatProvider>
            <LiveChatInner />
        </ChatProvider>
    )
}

const LiveChatInner = () => {
    const { splitOption } = useChat()
    return (
        <Fade in>
            <Stack sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
                {splitOption == "split" ? <SplitLayout /> : <TabbedLayout />}
                <AdditionalOptionsButton />
            </Stack>
        </Fade>
    )
}

const Content = ({
    user,
    faction_id,
    primaryColor,
    secondaryColor,
    chatMessages,
}: {
    user?: User
    faction_id: string | null
    primaryColor: string
    secondaryColor: string
    chatMessages: ChatMessageType[]
}) => {
    return (
        <>
            <ChatMessages primaryColor={primaryColor} secondaryColor={secondaryColor} chatMessages={chatMessages} faction_id={faction_id} />

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
