import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { SvgGlobal, SvgLine, SvgMicrochip, SvgTarget } from "../../../../assets"
import { useArena, useAuth, useGame, useSupremacy } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { warMachineStatsBinaryParser } from "../../../../helpers/binaryDataParsers/warMachineStatsParser"
import { BinaryDataKey, useGameServerSubscription } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"
import { AnyAbility, BattleState, LocationSelectType, WarMachineLiveState } from "../../../../types"
import { NiceButtonGroup } from "../../../Common/Nice/NiceButtonGroup"
import { PlayerAbilitySmallCard } from "../../../Common/PlayerAbility/PlayerAbilitySmallCard"
import { SectionCollapsible } from "../Common/SectionCollapsible"

const filterOptions = [
    { label: "", value: LocationSelectType.Global, svg: <SvgGlobal size="1.4rem" /> },
    { label: "", value: LocationSelectType.LocationSelect, svg: <SvgTarget size="1.4rem" /> },
    { label: "", value: LocationSelectType.MechSelect, svg: <SvgMicrochip size="1.4rem" /> },
    { label: "", value: LocationSelectType.LineSelect, svg: <SvgLine size="1.4rem" /> },
]

export interface PlayerAbilitiesResponse {
    battle_id: string
    supporter_abilities: AnyAbility[]
}

export const SupporterAbilities = () => {
    const { userID } = useAuth()
    const { battleID } = useSupremacy()
    const { battleState } = useGame()

    if (battleState !== BattleState.BattlingState || !userID) return null

    return (
        <Box key={battleID} sx={{ position: "relative" }}>
            <SectionCollapsible label={"SUPPORT ABILITIES"} tooltip="Your supporter abilities" initialExpanded={true} localStoragePrefix="supportAbility">
                <Box sx={{ pointerEvents: battleState === BattleState.BattlingState ? "all" : "none" }}>
                    <SupporterAbilitiesInner />
                </Box>

                {battleState !== BattleState.BattlingState && (
                    <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "#000000AA" }} />
                )}
            </SectionCollapsible>
        </Box>
    )
}

const SupporterAbilitiesInner = () => {
    const theme = useTheme()
    const { userID } = useAuth()
    const { currentArenaID } = useArena()
    const { battleID } = useSupremacy()
    const [abilities, setAbilities] = useState<AnyAbility[]>([])
    const [displayAbilities, setDisplayAbilities] = useState<AnyAbility[]>([])
    const [locationSelectType, setLocationSelectType] = useState<LocationSelectType>()

    // subscription for users supporter abilities
    // need battle? lobby? arena? id, then we have a subscription to get the users support abilities
    useGameServerSubscription<PlayerAbilitiesResponse>(
        {
            URI: `/user/${userID}/battle/${battleID}/supporter_abilities`,
            key: GameServerKeys.PlayerSupportAbilities,
            ready: !!currentArenaID,
        },
        (payload) => {
            if (battleID !== payload.battle_id) {
                setAbilities([])
                return
            }
            setAbilities(payload.supporter_abilities || [])
        },
    )

    // If all my faction mechs are dead, then disable my player abilities
    const { factionWarMachines } = useGame()
    const [disableAbilities, setDisableAbilities] = useState(true)
    useGameServerSubscription<WarMachineLiveState[]>(
        {
            URI: `/mini_map/arena/${currentArenaID}/public/mech_stats`,
            binaryKey: BinaryDataKey.WarMachineStats,
            binaryParser: warMachineStatsBinaryParser,
            ready: !!currentArenaID && !!factionWarMachines,
        },
        (payload) => {
            if (!payload || !factionWarMachines) return

            const deadMechs = payload.filter((p) => {
                if (p.health > 0) return false
                return factionWarMachines.find((w) => w.participantID === p.participant_id)
            })

            setDisableAbilities(deadMechs.length === 3)
        },
    )

    // Apply filter
    useEffect(() => {
        setDisplayAbilities(
            abilities.filter((p) => {
                if (!locationSelectType) return true

                if (locationSelectType === LocationSelectType.MechSelect) {
                    return (
                        locationSelectType === p.location_select_type ||
                        LocationSelectType.MechSelectAllied === p.location_select_type ||
                        LocationSelectType.MechSelectOpponent === p.location_select_type
                    )
                }
                return locationSelectType === p.location_select_type
            }),
        )
    }, [abilities, locationSelectType])

    return (
        <Stack spacing="1rem">
            <NiceButtonGroup
                primaryColor={theme.factionTheme.primary}
                secondaryColor={theme.factionTheme.text}
                options={filterOptions}
                selected={locationSelectType}
                onSelected={(value) => setLocationSelectType((prev) => (prev === value ? undefined : value))}
                sx={{ height: "3rem", "&>*": { flex: "1 !important" } }}
            />

            {displayAbilities && displayAbilities.length > 0 ? (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
                        gap: ".6rem",
                    }}
                >
                    {displayAbilities.map((ab) => (
                        <PlayerAbilitySmallCard
                            key={`${ab.id}`}
                            anyAbility={{ ...ab, isSupportAbility: true }}
                            onClickAction={disableAbilities ? "nothing" : "use"}
                        />
                    ))}
                </Box>
            ) : (
                <Typography
                    sx={{
                        px: "1.28rem",
                        pt: "1.28rem",
                        mb: ".56rem",
                        color: colors.grey,
                        opacity: 0.8,
                    }}
                >
                    Supporter abilities appear here, opt in to be a supporter in the pre-battle screen.
                </Typography>
            )}
        </Stack>
    )
}
