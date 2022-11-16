import { Badge, Box, Fade, Stack, Tab, Tabs, Typography } from "@mui/material"
import React, { ReactNode, useMemo, useRef, useState } from "react"
import { AdditionalOptionsButton, FancyButton, NiceTooltip } from "../.."
import { SvgChat, SvgChatGlobal, SvgExternalLink, SvgInfoCircular, SvgSettings } from "../../../assets"
import { useAuth, useChat, useMobile, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { acronym, shadeColor } from "../../../helpers"
import { HeaderProps } from "../../../routes"
import { zoomEffect } from "../../../theme/keyframes"
import { colors, fonts } from "../../../theme/theme"
import { SplitOptionType } from "../../../types/chat"
import { NiceButton } from "../../Common/Nice/NiceButton"
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
                            <Typography variant="caption" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
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
                backgroundColor: isOpen ? `#1B0313` : `#1c1424`,
                transition: "background-color .2s ease-out",
            }}
        >
            <NiceButton
                onClick={onClose}
                buttonColor={theme.factionTheme.primary}
                corners
                sx={{
                    p: ".8rem",
                    pb: ".6rem",
                }}
            >
                <SvgChat size="3rem" />
            </NiceButton>
            <Typography
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    fontSize: "1.8rem",
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

const TabbedLayout = () => {
    const theme = useTheme()
    const { getFaction } = useSupremacy()
    const { userID, factionID } = useAuth()
    const { tabValue, changeTab, banProposal } = useChat()

    const faction = useMemo(() => getFaction(factionID), [factionID, getFaction])

    const { isEnlisted, faction_id, primaryColor, secondaryColor, factionTabLabel } = useMemo(() => {
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
                    backgroundColor: `#0D0415`,
                    overflow: "hidden",
                }}
            >
                {/* Tabs */}
                <Tabs
                    value={tabValue}
                    variant="fullWidth"
                    sx={{
                        height: `${4.8}rem`,
                        background: `#0D0415`,
                        boxShadow: 1,
                        zIndex: 9,
                        minHeight: 0,
                        ".MuiTab-root": {
                            height: `${4.8}rem`,
                            minHeight: 0,
                            p: "1rem",
                        },
                        ".MuiTabs-indicator": {
                            zIndex: -1,
                            height: "100%",
                            background: "#2D0311",
                            borderTop: `1px solid #9F0410`,
                            borderLeft: `1px solid #9F0410`,
                            borderRight: `1px solid #9F0410`,
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
                                    <SvgChatGlobal size="3rem" />
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
                        sx={{
                            borderBottom: tabValue !== 0 ? `1px solid #9F0410` : `0px solid transparent`,
                        }}
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
                                                width: "4rem",
                                                height: "4rem",
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
                            }
                            sx={{
                                borderBottom: tabValue !== 1 ? `1px solid #9F0410` : `0px solid transparent`,
                            }}
                        />
                    )}
                </Tabs>

                <Content userID={userID} faction_id={faction_id} primaryColor={primaryColor} secondaryColor={secondaryColor} />
            </Stack>
        )
    }, [banProposal, changeTab, faction.logo_url, factionTabLabel, faction_id, isEnlisted, primaryColor, secondaryColor, tabValue, userID])
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
                        backgroundColor: `#0D0415`,
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
                            background: "#2D0311",
                            borderTop: `1px solid #9F0410`,
                            boxShadow: 1,
                        }}
                    >
                        <SvgChatGlobal size="3rem" />
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

                    <Content userID={userID} faction_id={null} primaryColor={theme.factionTheme.primary} secondaryColor={"#FFFFFF"} />
                </Stack>

                {/* Bottom half */}
                {isEnlisted && (
                    <Stack className="tutorial-faction-chat" sx={{ position: "relative", height: "50%", backgroundColor: `#0D0415`, overflow: "hidden" }}>
                        <Stack
                            justifyContent="center"
                            sx={{
                                zIndex: 9,
                                height: `${5}rem`,
                                px: "1.8rem",
                                background: "#2D0311",
                                borderTop: `1px solid #9F0410`,
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
                                        width: "4rem",
                                        height: "4rem",
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
    }, [banProposal, faction.logo_url, factionID, factionTabLabel, isEnlisted, theme.factionTheme.primary, theme.factionTheme.secondary, userID])
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
