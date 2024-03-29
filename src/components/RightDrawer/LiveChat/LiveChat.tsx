import { Badge, Box, Fade, Stack, Typography } from "@mui/material"
import React, { ReactNode, useMemo, useRef, useState } from "react"
import { AdditionalOptionsButton, NiceTooltip } from "../.."
import { SvgChat, SvgChatGlobal, SvgExternalLink, SvgInfoCircular, SvgSettings } from "../../../assets"
import { useAuth, useChat, useMobile, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { acronym } from "../../../helpers"
import { HeaderProps } from "../../../routes"
import { zoomEffect } from "../../../theme/keyframes"
import { colors, fonts } from "../../../theme/theme"
import { SplitOptionType } from "../../../types/chat"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceTab, NiceTabs } from "../../Common/Nice/NiceTabs"
import { WindowPortal } from "../../Common/WindowPortal/WindowPortal"
import { ChatMessages } from "./ChatMessages/ChatMessages"
import { ChatSend } from "./ChatSend/ChatSend"
import { SettingsPopover } from "./ChatSettings/SettingsPopover"

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

                    <Stack spacing="1rem" alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                        <Typography sx={{ color: colors.grey, textAlign: "center" }}>Live chat has been opened in a new window.</Typography>
                        <NiceButton corners buttonColor={colors.lightGrey} onClick={() => setIsPoppedout(false)}>
                            <Typography variant="body2" sx={{ textAlign: "center" }}>
                                RESTORE WINDOW
                            </Typography>
                        </NiceButton>
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

    const { isEnlisted, faction_id, primaryColor, secondaryColor, factionTabLabel } = useMemo(() => {
        const isEnlisted = !!factionID
        let faction_id = null
        let primaryColor = theme.factionTheme.primary
        let secondaryColor = "#FFFFFF"
        let factionTabLabel = ""

        if (isEnlisted) {
            factionTabLabel = faction.label
            if (factionTabLabel.length > 8) factionTabLabel = acronym(factionTabLabel)
            factionTabLabel += " CHAT"
        }

        if (tabValue == 1 && isEnlisted) {
            faction_id = factionID
            primaryColor = theme.factionTheme.primary
            secondaryColor = theme.factionTheme.text
        }

        return {
            isEnlisted,
            faction_id,
            primaryColor,
            secondaryColor,
            factionTabLabel,
        }
    }, [faction.label, factionID, tabValue, theme.factionTheme.primary, theme.factionTheme.text])

    const tabs = useMemo(() => {
        const tabs: NiceTab[] = []

        tabs.push({
            value: 0,
            label: (
                <Stack direction="row" alignItems="center" justifyContent="center" spacing=".96rem">
                    <UnreadBadge tabValue={0}>
                        <SvgChatGlobal size="2.5rem" />
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
            ),
        })

        if (isEnlisted) {
            tabs.push({
                value: 1,
                label: (
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
                                    width: "3.2rem",
                                    height: "3.2rem",
                                    flexShrink: 0,
                                    backgroundImage: `url(${faction.logo_url})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundSize: "contain",
                                }}
                            />
                        </UnreadBadge>
                        {banProposal && (
                            <NiceTooltip color={colors.orange} placement="bottom" text="Punish proposal ongoing">
                                <Box sx={{ ml: "-.2rem", mr: ".4rem", animation: `${zoomEffect(1.1)} 1s infinite` }}>
                                    <SvgInfoCircular size="1rem" fill={colors.orange} sx={{ pb: ".2rem" }} />
                                </Box>
                            </NiceTooltip>
                        )}
                        <Typography variant="caption" sx={{ lineHeight: 1, fontFamily: fonts.nostromoBlack, textAlign: "start" }}>
                            {factionTabLabel}
                        </Typography>
                    </Stack>
                ),
            })
        }

        return tabs
    }, [banProposal, faction.logo_url, factionTabLabel, isEnlisted])

    return useMemo(() => {
        return (
            <Stack
                sx={{
                    flex: 1,
                    height: 0,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <NiceTabs value={tabValue} onChange={(newValue) => changeTab(newValue)} tabs={tabs} />
                <Content userID={userID} faction_id={faction_id} primaryColor={primaryColor} secondaryColor={secondaryColor} />
            </Stack>
        )
    }, [changeTab, faction_id, primaryColor, secondaryColor, tabValue, tabs, userID])
}

const SplitLayout = () => {
    const theme = useTheme()
    const { getFaction } = useSupremacy()
    const { userID, factionID } = useAuth()
    const { banProposal } = useChat()

    const faction = getFaction(factionID)

    const { isEnlisted, factionTabLabel } = useMemo(() => {
        const isEnlisted = !!factionID
        let factionTabLabel = ""

        if (isEnlisted) {
            factionTabLabel = faction.label
            if (factionTabLabel.length > 8) factionTabLabel = acronym(factionTabLabel)
            factionTabLabel += " CHAT"
        }

        return {
            isEnlisted,
            factionTabLabel,
        }
    }, [faction.label, factionID])

    return useMemo(() => {
        return (
            <Stack sx={{ flex: 1, height: 0 }}>
                {/* Top half */}
                <Stack
                    className="tutorial-global-chat"
                    sx={{
                        position: "relative",
                        height: isEnlisted ? "50%" : "100%",
                        overflow: "hidden",
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing=".8rem"
                        sx={{
                            zIndex: 9,
                            height: `${5}rem`,
                            px: "1.8rem",
                            background: theme.factionTheme.s600,
                            boxShadow: 1,
                        }}
                    >
                        <SvgChatGlobal size="2.5rem" />
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

                    <Content userID={userID} faction_id={null} primaryColor={theme.factionTheme.primary} secondaryColor={theme.factionTheme.text} />
                </Stack>

                {/* Bottom half */}
                {isEnlisted && (
                    <Stack className="tutorial-faction-chat" sx={{ position: "relative", height: "50%", overflow: "hidden" }}>
                        <Stack
                            justifyContent="center"
                            sx={{
                                zIndex: 9,
                                height: `${5}rem`,
                                px: "1.8rem",
                                background: theme.factionTheme.s600,
                                boxShadow: 1,
                            }}
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing=".96rem"
                                sx={{
                                    animation: banProposal ? `${zoomEffect(1.03)} 1s infinite` : "none",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: "3.2rem",
                                        height: "3.2rem",
                                        flexShrink: 0,
                                        backgroundImage: `url(${faction.logo_url})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "contain",
                                    }}
                                />
                                {banProposal && (
                                    <NiceTooltip color={colors.orange} placement="bottom" text="Punish proposal ongoing">
                                        <Box sx={{ ml: "-.2rem", mr: ".4rem", animation: `${zoomEffect(1.1)} 1s infinite` }}>
                                            <SvgInfoCircular size="1rem" fill={colors.orange} sx={{ pb: ".2rem" }} />
                                        </Box>
                                    </NiceTooltip>
                                )}
                                <Typography variant="caption" sx={{ lineHeight: 1, fontFamily: fonts.nostromoBlack, textAlign: "start" }}>
                                    {factionTabLabel}
                                </Typography>
                            </Stack>
                        </Stack>

                        <Content userID={userID} faction_id={factionID} primaryColor={theme.factionTheme.primary} secondaryColor={theme.factionTheme.text} />
                    </Stack>
                )}
            </Stack>
        )
    }, [
        banProposal,
        faction.logo_url,
        factionID,
        factionTabLabel,
        isEnlisted,
        theme.factionTheme.primary,
        theme.factionTheme.s600,
        theme.factionTheme.text,
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
            <ChatMessages key={`chat-messages-${faction_id}`} primaryColor={primaryColor} secondaryColor={secondaryColor} faction_id={faction_id} />

            {userID ? (
                <ChatSend faction_id={faction_id} />
            ) : (
                <Box sx={{ px: "1.6rem", py: ".8rem", backgroundColor: colors.red }}>
                    <Typography sx={{ textAlign: "center", lineHeight: 1 }}>You must be signed in to send messages</Typography>
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
                    top: 8,
                    fontSize: "1.2rem",
                    fontFamily: fonts.rajdhaniMedium,
                    fontWeight: "bold",
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

const Header = ({ isOpen, onClose }: HeaderProps) => {
    const theme = useTheme()
    const { isMobile } = useMobile()
    const { isPoppedout, setIsPoppedout } = useChat()

    const popoverRef = useRef(null)
    const [showSettings, setShowSettings] = useState(false)

    return (
        <Stack
            spacing="1rem"
            direction="row"
            sx={{
                width: "100%",
                p: "1rem",
                alignItems: "center",
                opacity: isOpen ? 1 : 0.7,
                background: isOpen ? `linear-gradient(${theme.factionTheme.s700}70 26%, ${theme.factionTheme.s800})` : theme.factionTheme.u700,
                transition: "background-color .2s ease-out",
            }}
        >
            <NiceTooltip text="Live Chat" placement="left">
                <NiceButton
                    onClick={onClose}
                    buttonColor={theme.factionTheme.primary}
                    corners
                    sx={{
                        p: ".8rem",
                        pb: ".6rem",
                    }}
                >
                    <SvgChat size="2.6rem" />
                </NiceButton>
            </NiceTooltip>
            <Typography
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    fontSize: "1.6rem",
                }}
            >
                Live Chat
            </Typography>
            <Box flex={1} />
            <Fade in={isOpen} unmountOnExit>
                <Stack
                    direction="row"
                    spacing="1rem"
                    sx={{
                        alignItems: "center",
                    }}
                >
                    {/* Pop-out */}
                    {!isPoppedout && !isMobile && (
                        <NiceButton
                            corners
                            buttonColor={theme.factionTheme.primary}
                            onClick={() => setIsPoppedout(true)}
                            sx={{
                                p: ".5rem",
                                pb: ".3rem",
                            }}
                        >
                            <SvgExternalLink height="2rem" />
                        </NiceButton>
                    )}
                    {/* Settings */}
                    <NiceButton
                        ref={popoverRef}
                        corners
                        buttonColor={theme.factionTheme.primary}
                        onClick={() => setShowSettings(true)}
                        sx={{
                            p: ".5rem",
                            pb: ".3rem",
                        }}
                    >
                        <SvgSettings height="2rem" />
                    </NiceButton>
                </Stack>
            </Fade>
            <SettingsPopover open={showSettings} popoverRef={popoverRef} onClose={() => setShowSettings(false)} primaryColor={theme.factionTheme.primary} />
        </Stack>
    )
}
LiveChat.Header = Header
