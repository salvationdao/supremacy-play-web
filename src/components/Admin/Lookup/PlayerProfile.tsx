import { Box, CircularProgress, Fade, Stack, Tab, Tabs, Typography } from "@mui/material"
import React, { SyntheticEvent, useCallback, useEffect, useMemo, useState } from "react"
import { SvgBack } from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useToggle } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { Faction, RoleType, User } from "../../../types"
import { AdminPlayerBan, GetUserResp } from "../../../types/admin"
import { FancyButton } from "../../Common/FancyButton"
import { PageHeader } from "../../Common/PageHeader"
import { PlayerProfileCard } from "./PlayerProfileCard"
import { BanHistoryPanel } from "./BanHistoryPanel"
import { ChatHistory } from "./ChatHistory"
import { RelatedAccounts } from "./RelatedAccounts"
import { AdminBanModal } from "./AdminBanModal"
import { AdminUnbanModal } from "./AdminUnbanModal"
import { ClipThing } from "../../Common/ClipThing"
import { AdminUserAsset } from "./AdminUserAsset"
import { ActiveBanPanel } from "./ActiveBanPanel"

export const PlayerProfile = ({ gid, updateQuery }: { gid: number; updateQuery: (newQuery: { [p: string]: string | undefined }) => void }) => {
    const [userData, setUserData] = useState<GetUserResp>()
    const { send } = useGameServerCommandsUser("/user_commander")
    const { user } = useAuth()
    const theme = useTheme()
    const [isLoading, setIsLoading] = useToggle(false)
    const [loadError, setLoadError] = useState<string>("")
    const { getFaction } = useSupremacy()
    const [faction, setFaction] = useState<Faction>(getFaction(user.faction_id))
    const [banModalOpen, setBanModalOpen] = useState<boolean>(false)
    const [unbanModalOpen, setUnbanModalOpen] = useState<boolean>(false)
    const [currentValue, setCurrentValue] = useState<string>("PLAYER-INFO")
    const [playerUnbanIDs, setPlayerUnbanIDs] = useState<string[]>([])

    useEffect(() => {
        ;(async () => {
            setIsLoading(true)
            try {
                const resp = await send<GetUserResp, { gid: number }>(GameServerKeys.ModGetUser, {
                    gid: gid,
                })

                if (!resp) return
                setUserData(resp)
                setFaction(getFaction(resp.user.faction_id))
            } catch (e) {
                setLoadError(typeof e === "string" ? e : "Failed to get player data.")
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [getFaction, gid, send, setIsLoading])

    const handleChange = useCallback((event: SyntheticEvent, newValue: string) => {
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

    const fetchPlayer = useCallback(
        (newGid: number) => {
            ;(async () => {
                try {
                    setIsLoading(true)
                    const resp = await send<GetUserResp, { gid: number }>(GameServerKeys.ModGetUser, {
                        gid: newGid,
                    })

                    if (!resp) return
                    setUserData(resp)
                    setFaction(getFaction(resp.user.faction_id))
                } catch (e) {
                    setLoadError(typeof e === "string" ? e : "Failed to get player data.")
                    console.error(e)
                } finally {
                    setIsLoading(false)
                }
            })()
        },
        [getFaction, send, setIsLoading],
    )

    if (isLoading || loadError !== "" || !userData) {
        return (
            <Box sx={{ height: "100%" }}>
                {isLoading && loadError === "" && (
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                        <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                            <CircularProgress size="3rem" sx={{ color: theme.factionTheme.primary }} />
                        </Stack>
                    </Stack>
                )}
                {loadError !== "" && (
                    <Typography variant="body2" sx={{ mt: ".3rem", color: colors.red }}>
                        {loadError}
                    </Typography>
                )}
            </Box>
        )
    }
    return (
        <PlayerProfileInner
            userData={userData}
            updateQuery={updateQuery}
            isLoading={isLoading}
            loadError={loadError}
            user={user}
            fetchPlayer={fetchPlayer}
            faction={faction}
            setBanModalOpen={setBanModalOpen}
            banModalOpen={banModalOpen}
            setUnbanModalOpen={setUnbanModalOpen}
            unbanModalOpen={unbanModalOpen}
            handleChange={handleChange}
            currentValue={currentValue}
            playerUnbanIDs={playerUnbanIDs}
            toggleSelected={toggleSelected}
            toggleAll={toggleAll}
        />
    )
}

const PlayerProfileInner = ({
    userData,
    updateQuery,
    isLoading,
    loadError,
    user,
    fetchPlayer,
    faction,
    setBanModalOpen,
    banModalOpen,
    setUnbanModalOpen,
    unbanModalOpen,
    handleChange,
    currentValue,
    playerUnbanIDs,
    toggleSelected,
    toggleAll,
}: {
    userData: GetUserResp
    updateQuery: (newQuery: { [p: string]: string | undefined }) => void
    isLoading: boolean
    loadError: string
    user: User
    fetchPlayer: (newGid: number) => void
    faction: Faction
    setBanModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    banModalOpen: boolean
    setUnbanModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    unbanModalOpen: boolean
    handleChange: (event: SyntheticEvent, newValue: string) => void
    currentValue: string
    playerUnbanIDs: string[]
    toggleSelected: (playerBan: AdminPlayerBan) => void
    toggleAll: () => void
}) => {
    const content = useMemo(() => {
        if (loadError !== "" && !userData) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
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

        return (
            <Stack alignItems="center" justifyContent="center" direction="row" spacing="2rem" sx={{ height: "100%" }}>
                <Stack spacing="2rem" sx={{ width: "100%", height: "100%" }} flex="1">
                    <PlayerProfileCard faction={faction} title="Related Accounts" sx={{ flex: 1 }}>
                        {userData.related_accounts ? (
                            <RelatedAccounts relatedAccounts={userData.related_accounts} fetchPlayer={fetchPlayer} />
                        ) : (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                <Typography>No Related Accounts</Typography>
                            </Stack>
                        )}
                    </PlayerProfileCard>
                    <PlayerProfileCard faction={faction} title="Recent Chat History" sx={{ flex: 2 }}>
                        {userData.recent_chat_history ? (
                            <ChatHistory chatHistory={userData.recent_chat_history} faction={faction} user={userData.user} />
                        ) : (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                <Typography>No Recent Chat History</Typography>
                            </Stack>
                        )}
                    </PlayerProfileCard>
                </Stack>
                <Stack spacing="2rem" sx={{ width: "100%", height: "100%" }} flex="2">
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
                </Stack>
            </Stack>
        )
    }, [
        loadError,
        faction,
        userData.related_accounts,
        userData.recent_chat_history,
        userData.user,
        userData.active_ban,
        userData.ban_history,
        fetchPlayer,
        playerUnbanIDs,
        toggleSelected,
        setUnbanModalOpen,
        toggleAll,
    ])

    return (
        <Stack sx={{ position: "relative", height: "100%" }}>
            <Stack sx={{ flex: 1 }}>
                <FancyButton
                    clipThingsProps={{
                        clipSize: "9px",
                        corners: { topLeft: true },
                        opacity: 1,
                        sx: { position: "relative", alignSelf: "flex-start", opacity: 0.5, ":hover": { opacity: 1 } },
                    }}
                    sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                    onClick={() => {
                        updateQuery({
                            selectedGID: "",
                        })
                        window.location.reload()
                    }}
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

                <Box sx={{ px: "1rem", py: "1rem", flex: 1 }}>
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

                    <TabPanel currentValue={currentValue} value={"PLAYER-INFO"} faction={faction}>
                        {content}
                    </TabPanel>

                    <TabPanel currentValue={currentValue} value={"USER-ASSET"} faction={faction}>
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
                </Box>

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
            </Stack>
        </Stack>
    )
}

interface TabPanelProps {
    children?: React.ReactNode
    value: string
    currentValue: string
    faction: Faction
}

const TabPanel = (props: TabPanelProps) => {
    const { children, currentValue, value, faction } = props

    if (currentValue === value) {
        return (
            <Fade in>
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
                    sx={{ flex: 1, width: "100%", height: "100%", p: "1rem" }}
                >
                    {children}
                </ClipThing>
            </Fade>
        )
    }

    return null
}
