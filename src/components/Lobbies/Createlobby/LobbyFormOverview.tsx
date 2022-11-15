import { Box, Stack, Typography } from "@mui/material"
import { useFormContext } from "react-hook-form"
import { LobbyForm, Scheduling } from "./CreateLobby"
import { colors, fonts } from "../../../theme/theme"
import { useTheme } from "../../../containers/theme"
import { useGameServerSubscriptionSecured } from "../../../hooks/useGameServer"
import { GameMap } from "../../../types"
import { GameServerKeys } from "../../../keys"
import { ReactNode, useMemo, useState } from "react"
import { camelToTitle } from "../../../helpers"
import { SvgSupToken } from "../../../assets"
import { NiceButton } from "../../Common/Nice/NiceButton"

export const LobbyFormOverview = () => {
    const { factionTheme } = useTheme()
    const { watch } = useFormContext<LobbyForm>()

    const [gameMaps, setGameMaps] = useState<GameMap[]>([])
    useGameServerSubscriptionSecured<GameMap[]>(
        {
            URI: "/game_map_list",
            key: GameServerKeys.SubGameMapList,
        },
        (payload) => {
            if (!payload) return
            setGameMaps(payload)
        },
    )

    const { name, accessibility, game_map_id, max_deploy_number, scheduling_type, entry_fee, first_faction_cut, second_faction_cut, extra_reward } = watch()

    const mapName = useMemo(() => gameMaps.find((gm) => gm.id === game_map_id)?.name || "Random", [gameMaps, game_map_id])

    const firstFactionCut = useMemo(() => {
        const firstFactionCut = parseFloat(first_faction_cut)
        if (isNaN(firstFactionCut)) return 0
        return Math.floor(firstFactionCut * 100) / 100
    }, [first_faction_cut])

    const secondFactionCut = useMemo(() => {
        const secondFactionCut = parseFloat(second_faction_cut)
        if (isNaN(secondFactionCut)) return 0
        return Math.floor(secondFactionCut * 100) / 100
    }, [second_faction_cut])

    const losingFactionCut = useMemo(() => 100 - firstFactionCut - secondFactionCut, [firstFactionCut, secondFactionCut])

    return (
        <Stack
            sx={{
                width: "80rem",
                p: "4rem",
                backgroundColor: `${factionTheme.primary}10`,
            }}
        >
            <Stack flex={1} spacing={3}>
                <Stack direction="column">
                    <Typography variant="body1" fontFamily={fonts.nostromoHeavy}>
                        Lobby Overview
                    </Typography>
                    <Typography variant="h6" fontFamily={fonts.nostromoBlack} sx={{ opacity: name ? 1 : 0.5 }}>
                        {name ? name : "Lobby Name"}
                    </Typography>
                </Stack>

                <Stack direction="column">
                    <OverviewField label="Type" value={accessibility} />
                    <OverviewField label="Map" value={camelToTitle(mapName)} />
                    <OverviewField label="Max War machine Deploy" value={max_deploy_number} />
                    <OverviewField label="Scheduled" value={scheduling_type === Scheduling.OnReady ? "Not Set" : ""} />
                </Stack>

                <Stack direction="column">
                    <OverviewField label="Entry Fee" preIcon={<SvgSupToken fill={colors.gold} />} value={entry_fee} />
                    <OverviewField label="Extra Reward" preIcon={<SvgSupToken fill={colors.gold} />} value={extra_reward} />
                    <OverviewField label="Winning Faction Cut" value={`${firstFactionCut}%`} />
                    <OverviewField label="Second Place Faction Cut" value={`${secondFactionCut}%`} />
                    <OverviewField label="Losing Faction Cut" value={`${losingFactionCut}%`} />
                </Stack>

                <Stack direction="column">
                    <Stack direction="row" spacing={2}>
                        <Typography>War Machines Slots</Typography>
                        <Typography>Select your War Machines in stop 3.</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                            sx={{
                                width: "20rem",
                                height: "20rem",
                                border: `${factionTheme.primary} 1px dashed`,
                                backgroundColor: `${factionTheme.primary}10`,
                            }}
                        />
                        <Box
                            sx={{
                                width: "20rem",
                                height: "20rem",
                                border: `${factionTheme.primary} 1px dashed`,
                                backgroundColor: `${factionTheme.primary}10`,
                            }}
                        />
                        <Box
                            sx={{
                                width: "20rem",
                                height: "20rem",
                                border: `${factionTheme.primary} 1px dashed`,
                                backgroundColor: `${factionTheme.primary}10`,
                            }}
                        />
                    </Stack>
                </Stack>

                <Stack direction="column">
                    <Stack direction="row">
                        <Typography>Invite Friends To Lobby</Typography>
                        <Typography>Send invites to join your lobby.</Typography>
                    </Stack>
                </Stack>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="center">
                <NiceButton
                    buttonColor={factionTheme.primary}
                    sx={{
                        px: "4rem",
                        py: "1.5rem",
                    }}
                >
                    Create Lobby
                </NiceButton>
            </Stack>
        </Stack>
    )
}

interface OverviewFieldProps {
    label: string
    value?: ReactNode
    preIcon?: JSX.Element
}
const OverviewField = ({ label, value, preIcon }: OverviewFieldProps) => {
    return (
        <Stack direction="row" spacing="1rem">
            <Typography>{label}:</Typography>
            {preIcon}
            <Typography>{value}</Typography>
        </Stack>
    )
}
