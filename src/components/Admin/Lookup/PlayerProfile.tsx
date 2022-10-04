import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { SvgBack } from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useToggle } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { Faction, RoleType, User } from "../../../types"
import { GetUserResp } from "../../../types/admin"
import { FancyButton } from "../../Common/FancyButton"
import { PageHeader } from "../../Common/PageHeader"
import { PlayerProfileCard } from "./PlayerProfileCard"
import { BanHistoryPanel } from "./BanHistoryPanel"
import { ChatHistory } from "./ChatHistory"
import { RelatedAccounts } from "./RelatedAccounts"
import { AdminUserAsset } from "./AdminUserAsset"

export const PlayerProfile = ({ gid, updateQuery }: { gid: number; updateQuery: (newQuery: { [p: string]: string | undefined }) => void }) => {
    const [userData, setUserData] = useState<GetUserResp>()
    const { send } = useGameServerCommandsUser("/user_commander")
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useToggle(false)
    const [loadError, setLoadError] = useState<string>("")
    const { getFaction } = useSupremacy()
    const [faction, setFaction] = useState<Faction>(getFaction(user.faction_id))

    useEffect(() => {
        ;(async () => {
            setIsLoading(true)
            try {
                const resp = await send<GetUserResp, { gid: number }>(GameServerKeys.ModGetUser, {
                    gid: gid,
                })

                if (!resp) return
                console.log(resp)
                setUserData(resp)
                setFaction(getFaction(resp.user.faction_id))
            } catch (e) {
                setLoadError(typeof e === "string" ? e : "Failed to get replays.")
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [gid, send])

    const fetchPlayer = useCallback(
        (newGid: number) => {
            ;(async () => {
                setIsLoading(true)
                try {
                    const resp = await send<GetUserResp, { gid: number }>(GameServerKeys.ModGetUser, {
                        gid: newGid,
                    })

                    if (!resp) return
                    console.log(resp)
                    setUserData(resp)
                    setFaction(getFaction(resp.user.faction_id))
                } catch (e) {
                    setLoadError(typeof e === "string" ? e : "Failed to get replays.")
                    console.error(e)
                } finally {
                    setIsLoading(false)
                }
            })()
        },
        [send],
    )

    if (!userData) return <Box></Box>

    return (
        <PlayerProfileInner
            userData={userData}
            updateQuery={updateQuery}
            isLoading={isLoading}
            loadError={loadError}
            user={user}
            fetchPlayer={fetchPlayer}
            faction={faction}
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
}: {
    userData: GetUserResp
    updateQuery: (newQuery: { [p: string]: string | undefined }) => void
    isLoading: boolean
    loadError: string
    user: User
    fetchPlayer: (newGid: number) => void
    faction: Faction
}) => {
    const theme = useTheme()

    console.log(userData)

    const content = useMemo(() => {
        if (isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: theme.factionTheme.primary }} />
                    </Stack>
                </Stack>
            )
        }

        if (loadError !== "") {
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
            <Stack alignItems="center" justifyContent="center" spacing="2rem" flex="1">
                <Stack alignItems="center" justifyContent="center" direction={"row"} spacing="2rem" sx={{ height: "50rem", width: "100%" }}>
                    <PlayerProfileCard faction={faction} title="Recent Chat History">
                        {userData.recent_chat_history ? (
                            <Box
                                sx={{
                                    flex: 1,
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    direction: "ltr",
                                    mr: ".4rem",
                                    my: ".3rem",
                                    "::-webkit-scrollbar": {
                                        width: ".4rem",
                                    },
                                    "::-webkit-scrollbar-track": {
                                        background: "#FFFFFF15",
                                        borderRadius: 3,
                                    },
                                    "::-webkit-scrollbar-thumb": {
                                        background: faction.primary_color,
                                        borderRadius: 3,
                                    },
                                }}
                            >
                                <Box sx={{ height: 0 }}>
                                    <ChatHistory chatHistory={userData.recent_chat_history} faction={faction} user={userData.user} />
                                </Box>
                            </Box>
                        ) : (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                <Typography>No Recent Chat History</Typography>
                            </Stack>
                        )}
                    </PlayerProfileCard>

                    <PlayerProfileCard faction={faction} title="Recent Ban History">
                        {userData.ban_history ? (
                            <BanHistoryPanel faction={faction} playerBans={userData.ban_history} />
                        ) : (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                <Typography>No Recent Ban History</Typography>
                            </Stack>
                        )}
                    </PlayerProfileCard>
                    <PlayerProfileCard faction={faction} title="Related Accounts">
                        {userData.related_accounts ? (
                            <RelatedAccounts relatedAccounts={userData.related_accounts} fetchPlayer={fetchPlayer} />
                        ) : (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                <Typography>No Related Accounts</Typography>
                            </Stack>
                        )}
                    </PlayerProfileCard>
                </Stack>
                {user.role_type === RoleType.admin && (
                    <PlayerProfileCard faction={faction} title="User Assets" fullWidth={true}>
                        {userData.user_assets ? (
                            <AdminUserAsset userAsset={userData.user_assets} faction={faction} />
                        ) : (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "50rem" }}>
                                <Typography>User Has No Assets</Typography>
                            </Stack>
                        )}
                    </PlayerProfileCard>
                )}
            </Stack>
        )
    }, [isLoading, loadError, userData])

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
                        >
                            <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                                Ban Player
                            </Typography>
                        </FancyButton>
                    </Stack>
                </PageHeader>

                <Stack sx={{ px: "1rem", py: "1rem", flex: 1 }}>
                    <Stack sx={{ height: 0 }}> {content}</Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}
