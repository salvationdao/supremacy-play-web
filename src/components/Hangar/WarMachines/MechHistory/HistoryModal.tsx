import { Box, CircularProgress, IconButton, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { SvgHistory, SvgRefresh } from "../../../../assets"
import { useHangarWarMachine } from "../../../../containers/hangar/hangarWarMachines"
import { camelToTitle, getRarityDeets } from "../../../../helpers"
import { useGameServerCommands } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { BattleMechHistory, BattleMechStats } from "../../../../types"
import { MechModal } from "../Common/MechModal"
import { HistoryEntry } from "./HistoryEntry"
import { PercentageDisplay, PercentageDisplaySkeleton } from "./PercentageDisplay"

const tempHistory = [
    {
        battle_id: "a76cd657-d3d1-4c8c-b75a-0ecf40d994f5",
        mech_id: "5ced6b7b-8c9d-449d-9c12-2cef29deb66f",
        owner_id: "e26bca8c-d67d-4c65-9311-fba219ff023c",
        faction_id: "880db344-e405-428d-84e5-6ebebab1fe6d",
        kills: 1,
        damage_taken: 0,
        updated_at: new Date("2022-05-07T12:35:59.329616Z"),
        created_at: new Date("2022-05-07T12:34:46.048922Z"),
        faction_won: true,
        mech_survived: true,
        battle: {
            id: "a76cd657-d3d1-4c8c-b75a-0ecf40d994f5",
            game_map_id: "3dbb8ecc-22ab-476b-ac69-00dd6221bdc8",
            started_at: new Date("2022-05-07T12:34:10.189484Z"),
            ended_at: new Date("2022-05-07T12:35:57.325782Z"),
            battle_number: 25730,
            game_map: {
                name: "DesertCity",
                image_url: "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/desert_city.jpg",
                width: 1700,
                height: 1600,
                cells_x: 34,
                cells_y: 32,
                top_pixels: -40000,
                left_pixels: -40000,
                disabled_cells: [],
            },
        },
    },
    {
        battle_id: "8d5aec3f-bb2f-4a67-ba18-49404fe2dbe7",
        mech_id: "5ced6b7b-8c9d-449d-9c12-2cef29deb66f",
        owner_id: "e26bca8c-d67d-4c65-9311-fba219ff023c",
        faction_id: "880db344-e405-428d-84e5-6ebebab1fe6d",
        kills: 3,
        damage_taken: 0,
        updated_at: new Date("2022-05-02T13:06:33.069602Z"),
        created_at: new Date("2022-05-02T13:03:29.510035Z"),
        faction_won: true,
        mech_survived: true,
        battle: {
            id: "8d5aec3f-bb2f-4a67-ba18-49404fe2dbe7",
            game_map_id: "32553b2d-3b3c-4766-8a7b-6c94a1e60069",
            started_at: new Date("2022-05-02T13:02:55.644679Z"),
            ended_at: new Date("2022-05-02T13:06:31.067773Z"),
            battle_number: 23982,
            game_map: {
                name: "NeoTokyo",
                image_url: "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/neo_tokyo.jpg",
                width: 1464,
                height: 1562,
                cells_x: 30,
                cells_y: 32,
                top_pixels: -31000,
                left_pixels: -35000,
                disabled_cells: [],
            },
        },
    },
    {
        battle_id: "acfd2d98-8a3d-4165-bcfb-38406c4313b1",
        mech_id: "5ced6b7b-8c9d-449d-9c12-2cef29deb66f",
        owner_id: "e26bca8c-d67d-4c65-9311-fba219ff023c",
        faction_id: "880db344-e405-428d-84e5-6ebebab1fe6d",
        kills: 1,
        damage_taken: 0,
        updated_at: new Date("2022-05-02T07:54:42.197487Z"),
        created_at: new Date("2022-05-02T07:52:50.474325Z"),
        faction_won: true,
        mech_survived: true,
        battle: {
            id: "acfd2d98-8a3d-4165-bcfb-38406c4313b1",
            game_map_id: "45f24d2d-c5e4-4676-bf2e-7d8d6717bf37",
            started_at: new Date("2022-05-02T07:52:16.336395Z"),
            ended_at: new Date("2022-05-02T07:54:40.194697Z"),
            battle_number: 23905,
            game_map: {
                name: "UrbanBuildings",
                image_url: "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/urban_city.jpg",
                width: 2230,
                height: 2230,
                cells_x: 45,
                cells_y: 45,
                top_pixels: -118000,
                left_pixels: -76000,
                disabled_cells: [],
            },
        },
    },
    {
        battle_id: "8f40c137-70d1-4e2f-aad0-37914a485953",
        mech_id: "5ced6b7b-8c9d-449d-9c12-2cef29deb66f",
        owner_id: "e26bca8c-d67d-4c65-9311-fba219ff023c",
        faction_id: "880db344-e405-428d-84e5-6ebebab1fe6d",
        kills: 1,
        damage_taken: 0,
        updated_at: new Date("2022-04-27T04:00:02.04536Z"),
        created_at: new Date("2022-04-27T03:57:30.026638Z"),
        faction_won: true,
        mech_survived: true,
        battle: {
            id: "8f40c137-70d1-4e2f-aad0-37914a485953",
            game_map_id: "45f24d2d-c5e4-4676-bf2e-7d8d6717bf37",
            started_at: new Date("2022-04-27T03:56:55.846516Z"),
            ended_at: new Date("2022-04-27T04:00:00.028716Z"),
            battle_number: 22471,
            game_map: {
                name: "UrbanBuildings",
                image_url: "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/urban_city.jpg",
                width: 2230,
                height: 2230,
                cells_x: 45,
                cells_y: 45,
                top_pixels: -118000,
                left_pixels: -76000,
                disabled_cells: [],
            },
        },
    },
    {
        battle_id: "410c3080-61c9-4536-aa49-e7fc58171951",
        mech_id: "5ced6b7b-8c9d-449d-9c12-2cef29deb66f",
        owner_id: "e26bca8c-d67d-4c65-9311-fba219ff023c",
        faction_id: "880db344-e405-428d-84e5-6ebebab1fe6d",
        killed: new Date("2022-04-27T03:48:08.08431Z"),
        killed_by_id: "22c9b17a-886d-4d32-8e40-1fd33c6f7da4",
        kills: 0,
        damage_taken: 0,
        updated_at: new Date("2022-04-27T03:48:08.089328Z"),
        created_at: new Date("2022-04-27T03:47:43.761757Z"),
        faction_won: false,
        mech_survived: false,
        battle: {
            id: "410c3080-61c9-4536-aa49-e7fc58171951",
            game_map_id: "32553b2d-3b3c-4766-8a7b-6c94a1e60069",
            started_at: new Date("2022-04-27T03:47:09.464177Z"),
            ended_at: new Date("2022-04-27T03:48:23.712788Z"),
            battle_number: 22469,
            game_map: {
                name: "NeoTokyo",
                image_url: "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/neo_tokyo.jpg",
                width: 1464,
                height: 1562,
                cells_x: 30,
                cells_y: 32,
                top_pixels: -31000,
                left_pixels: -35000,
                disabled_cells: [],
            },
        },
    },
    {
        battle_id: "d2f8f4f5-dd88-4307-a790-3a4c714a1386",
        mech_id: "5ced6b7b-8c9d-449d-9c12-2cef29deb66f",
        owner_id: "e26bca8c-d67d-4c65-9311-fba219ff023c",
        faction_id: "880db344-e405-428d-84e5-6ebebab1fe6d",
        kills: 3,
        damage_taken: 0,
        updated_at: new Date("2022-04-26T01:32:37.329147Z"),
        created_at: new Date("2022-04-26T01:30:52.034124Z"),
        faction_won: true,
        mech_survived: true,
        battle: {
            id: "d2f8f4f5-dd88-4307-a790-3a4c714a1386",
            game_map_id: "7d94ea7f-f034-450d-9984-6adf6b947cd2",
            started_at: new Date("2022-04-26T01:30:18.562618Z"),
            ended_at: new Date("2022-04-26T01:32:35.319376Z"),
            battle_number: 22206,
            game_map: {
                name: "ArcticBay",
                image_url: "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/arctic_bay.jpg",
                width: 2750,
                height: 2750,
                cells_x: 55,
                cells_y: 55,
                top_pixels: -40000,
                left_pixels: -39000,
                disabled_cells: [],
            },
        },
    },
    {
        battle_id: "df8e3d99-a0a1-4165-b4b1-367ee9e63d3f",
        mech_id: "5ced6b7b-8c9d-449d-9c12-2cef29deb66f",
        owner_id: "e26bca8c-d67d-4c65-9311-fba219ff023c",
        faction_id: "880db344-e405-428d-84e5-6ebebab1fe6d",
        killed: new Date("2022-04-20T09:23:47.077884Z"),
        killed_by_id: "0b3bdbf9-f865-4477-8fbb-480b0b13ebf4",
        kills: 1,
        damage_taken: 0,
        updated_at: new Date("2022-04-20T09:23:47.081384Z"),
        created_at: new Date("2022-04-20T09:23:09.174629Z"),
        faction_won: true,
        mech_survived: false,
        battle: {
            id: "df8e3d99-a0a1-4165-b4b1-367ee9e63d3f",
            game_map_id: "45f24d2d-c5e4-4676-bf2e-7d8d6717bf37",
            started_at: new Date("2022-04-20T09:22:34.371497Z"),
            ended_at: new Date("2022-04-20T09:25:59.011723Z"),
            battle_number: 20556,
            game_map: {
                name: "UrbanBuildings",
                image_url: "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/urban_city.jpg",
                width: 2230,
                height: 2230,
                cells_x: 45,
                cells_y: 45,
                top_pixels: -118000,
                left_pixels: -76000,
                disabled_cells: [],
            },
        },
    },
    {
        battle_id: "4d0ae312-5dc6-4bf0-891d-b7abe777af5d",
        mech_id: "5ced6b7b-8c9d-449d-9c12-2cef29deb66f",
        owner_id: "e26bca8c-d67d-4c65-9311-fba219ff023c",
        faction_id: "880db344-e405-428d-84e5-6ebebab1fe6d",
        kills: 1,
        damage_taken: 0,
        updated_at: new Date("2022-04-07T07:39:15.634594Z"),
        created_at: new Date("2022-04-07T07:36:28.85749Z"),
        faction_won: true,
        mech_survived: true,
        battle: {
            id: "4d0ae312-5dc6-4bf0-891d-b7abe777af5d",
            game_map_id: "3dbb8ecc-22ab-476b-ac69-00dd6221bdc8",
            started_at: new Date("2022-04-07T07:35:52.502092Z"),
            ended_at: new Date("2022-04-07T07:39:13.6307Z"),
            battle_number: 17347,
            game_map: {
                name: "DesertCity",
                image_url: "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/desert_city.jpg",
                width: 1700,
                height: 1600,
                cells_x: 34,
                cells_y: 32,
                top_pixels: -40000,
                left_pixels: -40000,
                disabled_cells: [],
            },
        },
    },
    {
        battle_id: "6745dbc4-91a0-4591-ae07-5588131f9f24",
        mech_id: "5ced6b7b-8c9d-449d-9c12-2cef29deb66f",
        owner_id: "e26bca8c-d67d-4c65-9311-fba219ff023c",
        faction_id: "880db344-e405-428d-84e5-6ebebab1fe6d",
        killed: new Date("2022-04-05T09:42:54.731159Z"),
        killed_by_id: "eb200e81-7a19-4470-92bf-3370ba00d9c3",
        kills: 0,
        damage_taken: 0,
        updated_at: new Date("2022-04-05T09:42:54.732847Z"),
        created_at: new Date("2022-04-05T09:42:42.707717Z"),
        faction_won: false,
        mech_survived: false,
        battle: {
            id: "6745dbc4-91a0-4591-ae07-5588131f9f24",
            game_map_id: "32553b2d-3b3c-4766-8a7b-6c94a1e60069",
            started_at: new Date("2022-04-05T09:42:08.871106Z"),
            ended_at: new Date("2022-04-05T09:44:31.720119Z"),
            battle_number: 16629,
            game_map: {
                name: "NeoTokyo",
                image_url: "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/neo_tokyo.jpg",
                width: 1464,
                height: 1562,
                cells_x: 30,
                cells_y: 32,
                top_pixels: -31000,
                left_pixels: -35000,
                disabled_cells: [],
            },
        },
    },
    {
        battle_id: "941cdae3-e932-42c2-b9ef-c12243dfea8a",
        mech_id: "5ced6b7b-8c9d-449d-9c12-2cef29deb66f",
        owner_id: "e26bca8c-d67d-4c65-9311-fba219ff023c",
        faction_id: "880db344-e405-428d-84e5-6ebebab1fe6d",
        killed: new Date("2022-03-28T08:37:58.05859Z"),
        killed_by_id: "b639b207-7127-45fd-80df-33402a67fd0a",
        kills: 0,
        damage_taken: 0,
        updated_at: new Date("2022-03-28T08:37:58.059843Z"),
        created_at: new Date("2022-03-28T08:37:38.523029Z"),
        faction_won: false,
        mech_survived: false,
        battle: {
            id: "941cdae3-e932-42c2-b9ef-c12243dfea8a",
            game_map_id: "3dbb8ecc-22ab-476b-ac69-00dd6221bdc8",
            started_at: new Date("2022-03-28T08:37:05.317689Z"),
            ended_at: new Date("2022-03-28T08:39:24.084546Z"),
            battle_number: 15935,
            game_map: {
                name: "DesertCity",
                image_url: "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/desert_city.jpg",
                width: 1700,
                height: 1600,
                cells_x: 34,
                cells_y: 32,
                top_pixels: -40000,
                left_pixels: -40000,
                disabled_cells: [],
            },
        },
    },
]

export const HistoryModal = () => {
    const { historyMechDetails, setHistoryMechDetails } = useHangarWarMachine()
    const { send } = useGameServerCommands("/public/commander")
    // Mech stats
    const [stats, setStats] = useState<BattleMechStats>()
    const [statsLoading, setStatsLoading] = useState(false)
    const [statsError, setStatsError] = useState<string>()
    // Battle history
    const [history, setHistory] = useState<BattleMechHistory[]>(tempHistory) // TODO: reset
    const [historyLoading, setHistoryLoading] = useState(false)
    const [historyError, setHistoryError] = useState<string>()

    const onClose = useCallback(() => {
        setHistoryMechDetails(undefined)
    }, [setHistoryMechDetails])

    const fetchHistory = useCallback(async () => {
        if (!historyMechDetails?.id) return
        try {
            setHistoryLoading(true)
            const resp = await send<{
                total: number
                battle_history: BattleMechHistory[]
            }>(GameServerKeys.BattleMechHistoryList, {
                mech_id: historyMechDetails.id,
            })
            setHistory(resp.battle_history)
        } catch (e) {
            if (typeof e === "string") {
                setHistoryError(e)
            } else if (e instanceof Error) {
                setHistoryError(e.message)
            }
        } finally {
            setHistoryLoading(false)
        }
    }, [historyMechDetails?.id, send])

    useEffect(() => {
        ;(async () => {
            if (!historyMechDetails?.id) return

            try {
                setStatsLoading(true)
                const resp = await send<BattleMechStats | undefined>(GameServerKeys.BattleMechStats, {
                    mech_id: historyMechDetails.id,
                })

                if (resp) setStats(resp)
            } catch (e) {
                console.error(e)
                if (typeof e === "string") {
                    setStatsError(e)
                } else if (e instanceof Error) {
                    setStatsError(e.message)
                }
            } finally {
                setStatsLoading(false)
            }

            // fetchHistory()
        })()
    }, [send, historyMechDetails?.id, fetchHistory])

    const renderEmptyHistory = () => {
        if (historyLoading) {
            return <CircularProgress size="2rem" sx={{ mt: "2rem" }} />
        }
        if (historyError) {
            return <Typography sx={{ color: colors.red }}>{historyError} asd asd</Typography>
        }
        return (
            <Typography variant="body1" sx={{ color: colors.grey }}>
                No recent match history...
            </Typography>
        )
    }

    if (!historyMechDetails) return null

    return (
        <MechModal mechDetails={historyMechDetails} onClose={onClose} width="50rem">
            <Stack spacing="1.6rem">
                <Stack direction="row" justifyContent="space-between" sx={{ px: ".5rem" }}>
                    {statsLoading ? (
                        <>
                            <PercentageDisplaySkeleton circleSize={55} />
                            <PercentageDisplaySkeleton circleSize={55} />
                            <PercentageDisplaySkeleton circleSize={55} />
                            <PercentageDisplaySkeleton circleSize={55} />
                        </>
                    ) : stats ? (
                        <>
                            <PercentageDisplay
                                displayValue={`${(stats.extra_stats.win_rate * 100).toFixed(0)}%`}
                                percentage={stats.extra_stats.win_rate * 100}
                                size={86}
                                circleSize={55}
                                label="Win %"
                            />
                            <PercentageDisplay
                                displayValue={`${stats.total_kills}`}
                                percentage={100}
                                size={86}
                                circleSize={55}
                                label="Kills"
                                color={colors.gold}
                            />
                            <PercentageDisplay
                                displayValue={`${(stats.extra_stats.survival_rate * 100).toFixed(0)}%`}
                                percentage={stats.extra_stats.survival_rate * 100}
                                size={86}
                                circleSize={55}
                                label="Survival %"
                                color={colors.green}
                            />
                            <PercentageDisplay
                                displayValue={`${stats.total_deaths}`}
                                percentage={100}
                                size={86}
                                circleSize={55}
                                label="Deaths"
                                color={colors.red}
                            />
                        </>
                    ) : (
                        <>
                            <PercentageDisplay displayValue={`?`} percentage={0} size={86} circleSize={55} label="Win %" />
                            <PercentageDisplay displayValue={`?`} percentage={0} size={86} circleSize={55} label="Kills" color={colors.gold} />
                            <PercentageDisplay displayValue={`?`} percentage={0} size={86} circleSize={55} label="Survival %" color={colors.green} />
                            <PercentageDisplay displayValue={`?`} percentage={0} size={86} circleSize={55} label="Deaths" color={colors.red} />
                        </>
                    )}
                </Stack>

                <Stack
                    sx={{
                        minHeight: 0,
                        maxHeight: "36rem",
                    }}
                >
                    <Stack direction="row" alignItems="center" sx={{ pb: ".4rem" }}>
                        <Typography variant="body1" sx={{ fontFamily: fonts.nostromoBlack }}>
                            RECENT 10 MATCHES
                        </Typography>
                        <IconButton size="small" sx={{ opacity: 0.4, "&:hover": { cursor: "pointer", opacity: 1 } }} onClick={() => fetchHistory()}>
                            <SvgRefresh size="1.3rem" />
                        </IconButton>
                    </Stack>

                    {history.length > 0 ? (
                        <Stack
                            spacing=".6rem"
                            sx={{
                                overflowY: "auto",
                                overflowX: "hidden",
                                pr: ".6rem",
                                py: ".16rem",
                                direction: "ltr",
                                scrollbarWidth: "none",
                                "::-webkit-scrollbar": {
                                    width: ".4rem",
                                },
                                "::-webkit-scrollbar-track": {
                                    background: "#FFFFFF15",
                                    borderRadius: 3,
                                },
                                "::-webkit-scrollbar-thumb": {
                                    background: (theme) => theme.factionTheme.primary,
                                    borderRadius: 3,
                                },
                            }}
                        >
                            {history.map((h, index) => (
                                <HistoryEntry
                                    key={index}
                                    mapName={camelToTitle(h.battle?.game_map?.name || "Unknown")}
                                    backgroundImage={h.battle?.game_map?.image_url}
                                    mechSurvived={!!h.mech_survived}
                                    status={!h.battle?.ended_at ? "pending" : h.faction_won ? "won" : "lost"}
                                    kills={h.kills}
                                    date={h.created_at}
                                />
                            ))}
                        </Stack>
                    ) : (
                        <Stack alignItems="center" justifyContent="center" sx={{ flex: 1, py: "1rem" }}>
                            {renderEmptyHistory()}
                        </Stack>
                    )}
                </Stack>
            </Stack>
        </MechModal>
    )
}
