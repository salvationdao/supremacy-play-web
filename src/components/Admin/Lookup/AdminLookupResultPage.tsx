import { Box, CircularProgress, Fade, Stack, Tab, Tabs, Typography } from "@mui/material"
import React, { SyntheticEvent, useCallback, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { ClipThing } from "../.."
import { HangarBg, SvgBack } from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useToggle } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { Faction, RoleType } from "../../../types"
import { AdminPlayerBan, GetUserResp } from "../../../types/admin"
import { FancyButton } from "../../Common/FancyButton"
import { PageHeader } from "../../Common/PageHeader"
import { ActiveBanPanel } from "./ActiveBanPanel"
import { AdminBanModal } from "./AdminBanModal"
import { AdminUnbanModal } from "./AdminUnbanModal"
import { AdminUserAsset } from "./AdminUserAsset"
import { BanHistoryPanel } from "./BanHistoryPanel"
import { ChatHistory } from "./ChatHistory"
import { PlayerProfileCard } from "./PlayerProfileCard"
import { RelatedAccounts } from "./RelatedAccounts"

export const AdminLookupResultPage = () => {
    const history = useHistory()
    const { playerGID: playerGIDString } = useParams<{ playerGID: string }>()

    return (
        <Stack
            alignItems="center"
            sx={{
                height: "100%",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${HangarBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                boxShadow: `inset 0 0 50px 60px #00000090`,
            }}
        >
            <Stack spacing=".6rem" sx={{ mt: "1.5rem", mb: "2rem", height: "100%", width: "calc(100% - 3rem)", maxWidth: "193rem" }}>
                <FancyButton
                    clipThingsProps={{
                        clipSize: "9px",
                        corners: { topLeft: true },
                        opacity: 1,
                        sx: { position: "relative", alignSelf: "flex-start", opacity: 0.5, ":hover": { opacity: 1 } },
                    }}
                    sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                    onClick={() => history.goBack()}
                >
                    <Stack spacing=".6rem" direction="row" alignItems="center">
                        <SvgBack size="1.4rem" fill={"#FFFFFF"} />
                        <Typography
                            variant="caption"
                            sx={{
                                color: "#FFFFFF",
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            GO BACK
                        </Typography>
                    </Stack>
                </FancyButton>

                <Stack direction="row" spacing="1rem" flex={1}>
                    <PreviousUsers />
                    <LookupResult playerGIDString={playerGIDString} />
                </Stack>
            </Stack>
        </Stack>
    )
}

const PreviousUsers = () => {
    const theme = useTheme()
    return (
        <ClipThing
            clipSize="5px"
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".2rem",
            }}
            corners={{
                topLeft: false,
                topRight: true,
                bottomLeft: true,
                bottomRight: false,
            }}
            backgroundColor={theme.factionTheme.background}
            opacity={0.9}
            sx={{
                flexBasis: "300px",
                height: "100%",
            }}
        >
            <Box />
        </ClipThing>
    )
}

interface LookupResultProps {
    playerGIDString: string
}

const LookupResult = ({ playerGIDString }: LookupResultProps) => {
    const theme = useTheme()
    const { user } = useAuth()
    const { getFaction } = useSupremacy()
    const { send } = useGameServerCommandsUser("/user_commander")

    const [userData, setUserData] = useState<GetUserResp>()
    const [isLoading, setIsLoading] = useToggle(false)
    const [loadError, setLoadError] = useState<string>()
    const [faction, setFaction] = useState<Faction>(getFaction(user.faction_id))
    const [banModalOpen, setBanModalOpen] = useState<boolean>(false)
    const [unbanModalOpen, setUnbanModalOpen] = useState<boolean>(false)
    const [currentValue, setCurrentValue] = useState<string>("PLAYER-INFO")
    const [playerUnbanIDs, setPlayerUnbanIDs] = useState<string[]>([])

    const fetchPlayer = useCallback(async () => {
        setIsLoading(true)
        try {
            const playerGID = Number(playerGIDString)
            if (Number.isNaN(playerGID)) throw new Error("Invalid player ID provided.")

            const resp = await send<GetUserResp, { gid: number }>(GameServerKeys.ModGetUser, {
                gid: playerGID,
            })

            if (!resp) return
            setUserData(resp)
            setFaction(getFaction(resp.user.faction_id))
            setLoadError(undefined)
        } catch (e) {
            setLoadError(typeof e === "string" ? e : "Failed to get player data.")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [getFaction, playerGIDString, send, setIsLoading])

    const handleChange = useCallback((_e: SyntheticEvent, newValue: string) => {
        setCurrentValue(newValue)
    }, [])

    const toggleSelected = useCallback((playerBan: AdminPlayerBan) => {
        setPlayerUnbanIDs((prev) => {
            const newArray = [...prev]
            const isAlreadySelected = prev.findIndex((s) => s === playerBan.id)
            if (isAlreadySelected >= 0) {
                newArray.splice(isAlreadySelected, 1)
            } else {
                newArray.push(playerBan.id)
            }

            return newArray
        })
    }, [])

    const toggleAll = useCallback(() => {
        if (!userData?.active_ban) return
        const allUser: string[] = []
        userData.active_ban.map((activeBan) => {
            allUser.push(...allUser, activeBan.id)
        })

        setPlayerUnbanIDs(allUser)
    }, [userData?.active_ban])

    useEffect(() => {
        fetchPlayer()
    }, [fetchPlayer])

    if (loadError) {
        return (
            <Stack alignItems="center" justifyContent="center">
                <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{ height: "100%", maxWidth: "100%", width: "75rem", px: "3rem", pt: "1.28rem" }}
                    spacing="1.5rem"
                >
                    <Typography
                        sx={{
                            color: colors.red,
                            fontFamily: fonts.nostromoBold,
                            textAlign: "center",
                        }}
                    >
                        {loadError}
                    </Typography>
                </Stack>
            </Stack>
        )
    }

    if (isLoading || !userData) {
        return (
            <Stack alignItems="center" justifyContent="center">
                <CircularProgress sx={{ color: theme.factionTheme.primary }} />
            </Stack>
        )
    }

    return (
        <>
            <ClipThing
                clipSize="5px"
                border={{
                    borderColor: faction.primary_color,
                    borderThickness: ".2rem",
                }}
                corners={{
                    topLeft: false,
                    topRight: true,
                    bottomLeft: true,
                    bottomRight: false,
                }}
                backgroundColor={faction.background_color}
                opacity={0.9}
                sx={{ flex: 1, height: "100%" }}
                contentSx={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <PageHeader
                    title={userData.user.username}
                    description={`#${userData.user.gid}`}
                    imageUrl={faction.logo_url}
                    imageHeight={"7rem"}
                    imageWidth={"7rem"}
                    primaryColor={faction.primary_color}
                >
                    <Stack spacing="1rem" direction="row" alignItems="center" sx={{ ml: "auto !important", pr: "2rem" }}>
                        <FancyButton
                            clipThingsProps={{
                                clipSize: "9px",
                                backgroundColor: colors.red,
                                opacity: 1,
                                border: { borderColor: colors.lightRed, borderThickness: "2px" },
                                sx: { position: "relative" },
                            }}
                            sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                            onClick={() => setBanModalOpen(true)}
                        >
                            <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                                Ban Player
                            </Typography>
                        </FancyButton>
                    </Stack>
                </PageHeader>

                <Stack
                    sx={{
                        flex: 1,
                        px: "1rem",
                        py: "1rem",
                    }}
                >
                    <Tabs
                        value={currentValue}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            flexShrink: 0,
                            color: faction.primary_color,
                            minHeight: 0,
                            ".MuiTab-root": { minHeight: 0, fontSize: "1.3rem", height: "6rem", width: "10rem" },
                            ".Mui-selected": {
                                color: `${faction.secondary_color} !important`,
                                background: `linear-gradient(${faction.primary_color} 26%, ${faction.primary_color}BB)`,
                            },
                            ".MuiTabs-indicator": { display: "none" },
                            ".MuiTabScrollButton-root": { display: "none" },
                        }}
                    >
                        <Tab label="INFO" value={"PLAYER-INFO"} />

                        {user.role_type === RoleType.admin && <Tab label="USER ASSET" value={"USER-ASSET"} />}
                    </Tabs>

                    <TabPanel currentValue={currentValue} value={"PLAYER-INFO"}>
                        <Box
                            sx={{
                                flex: 1,
                                display: "grid",
                                gridTemplateColumns: "1fr 2fr",
                                gap: "2rem",
                                overflowY: "hidden",
                            }}
                        >
                            {/* RELATED ACCOUNTS */}
                            <PlayerProfileCard faction={faction} title="Related Accounts" sx={{ flex: 1 }}>
                                {userData.related_accounts ? (
                                    <RelatedAccounts relatedAccounts={userData.related_accounts} fetchPlayer={fetchPlayer} />
                                ) : (
                                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                        <Typography>No Related Accounts</Typography>
                                    </Stack>
                                )}
                            </PlayerProfileCard>
                            {/* ACTIVE BANS */}
                            <PlayerProfileCard faction={faction} title="Active Bans" sx={{ flex: "1" }}>
                                <Stack sx={{ p: "1rem" }} spacing={"1rem"} direction={"row"}>
                                    <FancyButton
                                        clipThingsProps={{
                                            clipSize: "9px",
                                            backgroundColor: colors.orange,
                                            opacity: 1,
                                            border: { borderColor: colors.orange, borderThickness: "2px" },
                                            sx: { position: "relative" },
                                        }}
                                        sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                                        onClick={() => setUnbanModalOpen(true)}
                                        disabled={!userData.active_ban || playerUnbanIDs.length <= 0}
                                    >
                                        <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                                            Unban Selected
                                        </Typography>
                                    </FancyButton>
                                    <FancyButton
                                        clipThingsProps={{
                                            clipSize: "9px",
                                            backgroundColor: colors.green,
                                            opacity: 1,
                                            border: { borderColor: colors.green, borderThickness: "2px" },
                                            sx: { position: "relative" },
                                        }}
                                        sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                                        onClick={() => {
                                            toggleAll()
                                            setUnbanModalOpen(true)
                                        }}
                                        disabled={!userData.active_ban}
                                    >
                                        <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                                            Unban All
                                        </Typography>
                                    </FancyButton>
                                </Stack>

                                {userData.active_ban ? (
                                    <Stack sx={{ height: 0 }} flexWrap={"wrap"} direction={"row"}>
                                        <ActiveBanPanel
                                            faction={faction}
                                            playerBans={userData.active_ban}
                                            playerUnBanIDs={playerUnbanIDs}
                                            toggleSelected={toggleSelected}
                                        />
                                    </Stack>
                                ) : (
                                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                        <Typography>No Active Bans</Typography>
                                    </Stack>
                                )}
                            </PlayerProfileCard>
                            {/* RECENT CHAT HISTORY */}
                            <PlayerProfileCard faction={faction} title="Recent Chat History" sx={{ flex: 2 }}>
                                {userData.recent_chat_history ? (
                                    <ChatHistory chatHistory={userData.recent_chat_history} faction={faction} user={userData.user} />
                                ) : (
                                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                        <Typography>No Recent Chat History</Typography>
                                    </Stack>
                                )}
                            </PlayerProfileCard>
                            {/* RECENT BAN HISTORY */}
                            <PlayerProfileCard faction={faction} title="Recent Ban History" sx={{ flex: "2" }}>
                                {userData.ban_history ? (
                                    <Stack sx={{ height: 0 }} flexWrap={"wrap"} direction={"row"}>
                                        <BanHistoryPanel faction={faction} playerBans={userData.ban_history} />
                                    </Stack>
                                ) : (
                                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                        <Typography>No Recent Ban History</Typography>
                                    </Stack>
                                )}
                            </PlayerProfileCard>
                        </Box>
                    </TabPanel>

                    <TabPanel currentValue={currentValue} value={"USER-ASSET"}>
                        <PlayerProfileCard faction={faction} title="User Assets" fullWidth={true}>
                            {userData.user_assets ? (
                                <AdminUserAsset userAsset={userData.user_assets} faction={faction} />
                            ) : (
                                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                    <Typography>User Has No Assets</Typography>
                                </Stack>
                            )}
                        </PlayerProfileCard>
                    </TabPanel>
                </Stack>
            </ClipThing>

            {banModalOpen && (
                <AdminBanModal user={userData.user} modalOpen={banModalOpen} setModalOpen={setBanModalOpen} faction={faction} fetchPlayer={fetchPlayer} />
            )}

            {unbanModalOpen && playerUnbanIDs.length > 0 && (
                <AdminUnbanModal
                    modalOpen={unbanModalOpen}
                    setModalOpen={setUnbanModalOpen}
                    user={userData.user}
                    faction={faction}
                    fetchPlayer={fetchPlayer}
                    playerUnbanIDs={playerUnbanIDs}
                />
            )}
        </>
    )
}

interface TabPanelProps {
    children: React.ReactElement
    value: string
    currentValue: string
}

const TabPanel = (props: TabPanelProps) => {
    const { children, currentValue, value } = props

    if (currentValue === value) {
        return (
            <Fade in unmountOnExit>
                {children}
            </Fade>
        )
    }

    return null
}
