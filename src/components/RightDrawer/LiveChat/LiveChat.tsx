import { Badge, Box, Fade, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useMemo } from "react"
import { AdditionalOptionsButton, TooltipHelper } from "../.."
import { SvgGlobal, SvgInfoCircular } from "../../../assets"
import { useChat, useAuth, useSupremacy } from "../../../containers"
import { acronym, shadeColor } from "../../../helpers"
import { zoomEffect } from "../../../theme/keyframes"
import { colors, fonts } from "../../../theme/theme"
import { ChatMessageType } from "../../../types/chat"
import { ChatMessages } from "./ChatMessages/ChatMessages"
import { ChatSend } from "./ChatSend/ChatSend"
import { useTheme } from "../../../containers/theme"

export const LiveChat = () => {
    const { splitOption } = useChat()
    return (
        <Fade in>
            <Stack id="tutorial-chat" sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
                {splitOption == "split" ? <SplitLayout /> : <TabbedLayout />}
                <AdditionalOptionsButton />
            </Stack>
        </Fade>
    )
}

const TabbedLayout = () => {
    const theme = useTheme()
    const { getFaction } = useSupremacy()
    const { userID, factionID } = useAuth()
    const { tabValue, setTabValue, globalChatMessages, factionChatMessages, factionChatUnread, globalChatUnread, banProposal } = useChat()

    const faction = getFaction(factionID)
    const chatMessages = tabValue == 0 ? globalChatMessages : factionChatMessages

    const data = useMemo(() => {
        const isEnlisted = !!factionID
        let faction_id = null
        let primaryColor = colors.globalChat
        let secondaryColor = "#FFFFFF"
        let bannerBackgroundColor = shadeColor(primaryColor, -30)
        let factionTabLabel = ""

        if (isEnlisted) {
            factionTabLabel = faction.label
            if (factionTabLabel.length > 8) factionTabLabel = acronym(factionTabLabel)
            factionTabLabel += " CHAT"
        }

        if (tabValue == 1 && isEnlisted) {
            faction_id = factionID
            primaryColor = theme.factionTheme.primary
            secondaryColor = theme.factionTheme.secondary
            bannerBackgroundColor = shadeColor(primaryColor, -60)
        }

        return {
            isEnlisted,
            faction_id,
            primaryColor,
            secondaryColor,
            bannerBackgroundColor,
            factionTabLabel,
        }
    }, [faction.label, factionID, tabValue, theme.factionTheme.primary, theme.factionTheme.secondary])

    const { isEnlisted, faction_id, primaryColor, secondaryColor, bannerBackgroundColor, factionTabLabel } = data

    return (
        <Stack
            sx={{
                flex: 1,
                height: 0,
                position: "relative",
                backgroundColor: (theme) => (tabValue == 1 ? `${theme.factionTheme.primary}06` : `${colors.globalChat}13`),
            }}
        >
            <Tabs
                value={tabValue}
                variant="fullWidth"
                sx={{
                    height: `${5}rem`,
                    background: `linear-gradient(${bannerBackgroundColor} 26%, ${bannerBackgroundColor}95)`,
                    boxShadow: 1,
                    zIndex: 9,
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
                    className="tutorial-global-chat"
                    label={
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing=".96rem">
                            <Badge
                                badgeContent={globalChatUnread}
                                sx={{
                                    ".MuiBadge-badge": {
                                        fontSize: "1.2rem",
                                        fontFamily: fonts.shareTech,
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
                                    fontFamily: fonts.nostromoBlack,
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
                        className="tutorial-faction-chat"
                        label={
                            <Stack
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
                                            fontFamily: fonts.shareTech,
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
                                            backgroundImage: `url(${faction.logo_url})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center",
                                            backgroundSize: "contain",
                                            backgroundColor: (theme) => theme.factionTheme.primary,
                                            borderRadius: 0.5,
                                            border: (theme) => `${theme.factionTheme.primary} solid 1px`,
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
                                <Typography variant="caption" sx={{ lineHeight: 1, fontFamily: fonts.nostromoBlack, textAlign: "start" }}>
                                    {factionTabLabel}
                                </Typography>
                            </Stack>
                        }
                    />
                )}
            </Tabs>

            <Content userID={userID} faction_id={faction_id} primaryColor={primaryColor} secondaryColor={secondaryColor} chatMessages={chatMessages} />
        </Stack>
    )
}

const SplitLayout = () => {
    const theme = useTheme()
    const { getFaction } = useSupremacy()
    const { userID, factionID } = useAuth()
    const { globalChatMessages, factionChatMessages, banProposal } = useChat()

    const faction = getFaction(factionID)

    const data = useMemo(() => {
        const isEnlisted = !!factionID
        let factionTabLabel = ""
        const globalChatBannerColor = shadeColor(colors.globalChat, -30)
        const factionChatBannerColor = shadeColor(theme.factionTheme.primary, -60)

        if (isEnlisted) {
            factionTabLabel = faction.label
            if (factionTabLabel.length > 8) factionTabLabel = acronym(factionTabLabel)
            factionTabLabel += " CHAT"
        }

        return {
            isEnlisted,
            factionTabLabel,
            globalChatBannerColor,
            factionChatBannerColor,
        }
    }, [faction.label, factionID, theme.factionTheme.primary])

    const { isEnlisted, factionTabLabel, globalChatBannerColor, factionChatBannerColor } = data

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
                        background: `linear-gradient(${globalChatBannerColor} 26%, ${globalChatBannerColor}95)`,
                        boxShadow: 1,
                        zIndex: 9,
                    }}
                >
                    <SvgGlobal size="2rem" />
                    <Typography
                        variant="caption"
                        sx={{
                            lineHeight: 1,
                            fontFamily: fonts.nostromoBlack,
                            textAlign: "start",
                        }}
                    >
                        GLOBAL CHAT
                    </Typography>
                </Stack>

                <Content userID={userID} faction_id={null} primaryColor={colors.globalChat} secondaryColor={"#FFFFFF"} chatMessages={globalChatMessages} />
            </Stack>

            {isEnlisted && (
                <Stack
                    className="tutorial-faction-chat"
                    sx={{ position: "relative", height: "50%", backgroundColor: (theme) => `${theme.factionTheme.primary}06` }}
                >
                    <Stack
                        justifyContent="center"
                        sx={{
                            height: `${5}rem`,
                            px: "1.8rem",
                            background: `linear-gradient(${factionChatBannerColor} 26%, ${factionChatBannerColor}95)`,
                            boxShadow: 1,
                            zIndex: 9,
                        }}
                    >
                        <Stack
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
                                    backgroundImage: `url(${faction.logo_url})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundSize: "contain",
                                    backgroundColor: (theme) => theme.factionTheme.primary,
                                    borderRadius: 0.5,
                                    border: (theme) => `${theme.factionTheme.primary} solid 1px`,
                                }}
                            />
                            {banProposal && (
                                <TooltipHelper placement="bottom" text="Punish proposal ongoing">
                                    <Box sx={{ ml: "-.2rem", mr: ".4rem", animation: `${zoomEffect(1.1)} 1s infinite` }}>
                                        <SvgInfoCircular size="1rem" fill={colors.orange} sx={{ pb: ".2rem" }} />
                                    </Box>
                                </TooltipHelper>
                            )}
                            <Typography variant="caption" sx={{ lineHeight: 1, fontFamily: fonts.nostromoBlack, textAlign: "start" }}>
                                {factionTabLabel}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Content
                        userID={userID}
                        faction_id={factionID}
                        primaryColor={theme.factionTheme.primary}
                        secondaryColor={theme.factionTheme.secondary}
                        chatMessages={factionChatMessages}
                    />
                </Stack>
            )}
        </Stack>
    )
}

const Content = ({
    userID,
    faction_id,
    primaryColor,
    secondaryColor,
    chatMessages,
}: {
    userID?: string
    faction_id: string | null
    primaryColor: string
    secondaryColor: string
    chatMessages: ChatMessageType[]
}) => {
    return (
        <>
            <ChatMessages primaryColor={primaryColor} secondaryColor={secondaryColor} chatMessages={chatMessages} faction_id={faction_id} />

            {userID ? (
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
