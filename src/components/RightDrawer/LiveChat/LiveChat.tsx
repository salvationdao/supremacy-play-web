import { Badge, Box, Stack, Tab, Tabs, Typography } from "@mui/material"
import React, { ReactNode, useMemo } from "react"
import { AdditionalOptionsButton, FancyButton, TooltipHelper } from "../.."
import { SvgGlobal, SvgInfoCircular } from "../../../assets"
import { useAuth, useChat, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { acronym, shadeColor } from "../../../helpers"
import { zoomEffect } from "../../../theme/keyframes"
import { colors, fonts } from "../../../theme/theme"
import { SplitOptionType } from "../../../types/chat"
import { WindowPortal } from "../../Common/WindowPortal/WindowPortal"
import { ChatMessages } from "./ChatMessages/ChatMessages"
import { ChatSend } from "./ChatSend/ChatSend"

export const LiveChat = () => {
    const { splitOption, isPoppedout, setIsPoppedout } = useChat()

    const common = useMemo(() => {
        return (
            <Stack sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
                {splitOption === SplitOptionType.Split ? <SplitLayout /> : <TabbedLayout />}
                <AdditionalOptionsButton />
            </Stack>
        )
    }, [splitOption])

    return useMemo(() => {
        if (isPoppedout) {
            return (
                <>
                    <WindowPortal
                        title="Supremacy - Live Chat"
                        onClose={() => setIsPoppedout(false)}
                        features={{
                            width: 360,
                            height: 650,
                        }}
                    >
                        {common}
                    </WindowPortal>

                    <Stack spacing=".6rem" alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                        <Typography sx={{ color: colors.grey, textAlign: "center" }}>Live chat has been opened in a new window.</Typography>
                        <FancyButton
                            clipThingsProps={{
                                clipSize: "6px",
                                clipSlantSize: "0px",
                                backgroundColor: "#333333",
                                opacity: 1,
                                sx: { position: "relative" },
                            }}
                            sx={{ px: "2rem", py: ".2rem", color: "#FFFFFF" }}
                            onClick={() => setIsPoppedout(false)}
                        >
                            <Typography variant="caption" sx={{ fontWeight: "fontWeightBold", color: "#FFFFFF" }}>
                                RESTORE WINDOW
                            </Typography>
                        </FancyButton>
                    </Stack>
                </>
            )
        }

        return <>{common}</>
    }, [common, isPoppedout, setIsPoppedout])
}

const TabbedLayout = () => {
    const theme = useTheme()
    const { getFaction } = useSupremacy()
    const { userID, factionID } = useAuth()
    const { tabValue, changeTab, banProposal } = useChat()

    const faction = useMemo(() => getFaction(factionID), [factionID, getFaction])

    const { isEnlisted, faction_id, primaryColor, secondaryColor, bannerBackgroundColor, factionTabLabel } = useMemo(() => {
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

    return useMemo(() => {
        return (
            <Stack
                sx={{
                    flex: 1,
                    height: 0,
                    position: "relative",
                    backgroundColor: (theme) => (tabValue == 1 ? `${theme.factionTheme.primary}06` : `${colors.globalChat}13`),
                    overflow: "hidden",
                }}
            >
                {/* Tabs */}
                <Tabs
                    value={tabValue}
                    variant="fullWidth"
                    sx={{
                        height: `${4.8}rem`,
                        background: `linear-gradient(${bannerBackgroundColor} 26%, ${bannerBackgroundColor}95)`,
                        boxShadow: 1,
                        zIndex: 9,
                        minHeight: 0,
                        ".MuiButtonBase-root": {
                            height: `${4.8}rem`,
                            minHeight: 0,
                        },
                        ".MuiTabs-indicator": {
                            height: "3px",
                            background: "#FFFFFF50",
                        },
                    }}
                    onChange={(_event, newValue) => {
                        changeTab(newValue)
                    }}
                >
                    <Tab
                        className="tutorial-global-chat"
                        label={
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing=".96rem">
                                <UnreadBadge tabValue={0}>
                                    <SvgGlobal size="2rem" />
                                </UnreadBadge>
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
                                    <UnreadBadge tabValue={1}>
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
                                    </UnreadBadge>
                                    {banProposal && (
                                        <TooltipHelper color={colors.orange} placement="bottom" text="Punish proposal ongoing">
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

                <Content userID={userID} faction_id={faction_id} primaryColor={primaryColor} secondaryColor={secondaryColor} />
            </Stack>
        )
    }, [
        banProposal,
        bannerBackgroundColor,
        faction.logo_url,
        factionTabLabel,
        faction_id,
        isEnlisted,
        primaryColor,
        secondaryColor,
        changeTab,
        tabValue,
        userID,
    ])
}

const SplitLayout = () => {
    const theme = useTheme()
    const { getFaction } = useSupremacy()
    const { userID, factionID } = useAuth()
    const { banProposal } = useChat()

    const faction = getFaction(factionID)

    const { isEnlisted, factionTabLabel, globalChatBannerColor, factionChatBannerColor } = useMemo(() => {
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

    return useMemo(() => {
        return (
            <Stack sx={{ flex: 1, height: 0 }}>
                {/* Top half */}
                <Stack
                    className="tutorial-global-chat"
                    sx={{
                        position: "relative",
                        height: isEnlisted ? "50%" : "100%",
                        backgroundColor: `${colors.globalChat}13`,
                        overflow: "hidden",
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

                    <Content userID={userID} faction_id={null} primaryColor={colors.globalChat} secondaryColor={"#FFFFFF"} />
                </Stack>

                {/* Bottom half */}
                {isEnlisted && (
                    <Stack
                        className="tutorial-faction-chat"
                        sx={{ position: "relative", height: "50%", backgroundColor: (theme) => `${theme.factionTheme.primary}06`, overflow: "hidden" }}
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
                                    <TooltipHelper color={colors.orange} placement="bottom" text="Punish proposal ongoing">
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
                        />
                    </Stack>
                )}
            </Stack>
        )
    }, [
        banProposal,
        faction.logo_url,
        factionChatBannerColor,
        factionID,
        factionTabLabel,
        globalChatBannerColor,
        isEnlisted,
        theme.factionTheme.primary,
        theme.factionTheme.secondary,
        userID,
    ])
}

const Content = React.memo(function Content({
    userID,
    faction_id,
    primaryColor,
    secondaryColor,
}: {
    userID?: string
    faction_id: string | null
    primaryColor: string
    secondaryColor: string
}) {
    return (
        <>
            <ChatMessages primaryColor={primaryColor} secondaryColor={secondaryColor} faction_id={faction_id} />

            {userID ? (
                <ChatSend primaryColor={primaryColor} faction_id={faction_id} />
            ) : (
                <Box sx={{ px: "1.6rem", py: ".4rem", backgroundColor: colors.red }}>
                    <Typography sx={{ textAlign: "center", lineHeight: 1 }}>You must be signed in to send messages.</Typography>
                </Box>
            )}
        </>
    )
})

const UnreadBadge = ({ tabValue: forTabValue, children }: { tabValue: number; children: ReactNode }) => {
    const { tabValue, globalChatUnread, factionChatUnread } = useChat()

    const unreadCount = useMemo(() => {
        if (forTabValue === 0) return globalChatUnread
        if (forTabValue === 1) return factionChatUnread
        return 0
    }, [factionChatUnread, globalChatUnread, forTabValue])

    return (
        <Badge
            badgeContent={tabValue == forTabValue ? 0 : unreadCount}
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
            {children}
        </Badge>
    )
}
