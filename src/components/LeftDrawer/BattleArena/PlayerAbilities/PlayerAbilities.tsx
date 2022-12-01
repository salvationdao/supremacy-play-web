import { Box, Button, Pagination, Stack, Typography } from "@mui/material"
import { ReactNode, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { SvgGlobal, SvgLine, SvgMicrochip, SvgTarget } from "../../../../assets"
import { useArena, useGame } from "../../../../containers"
import { useAuth } from "../../../../containers/auth"
import { useTheme } from "../../../../containers/theme"
import { warMachineStatsBinaryParser } from "../../../../helpers/binaryDataParsers/warMachineStatsParser"
import { usePagination } from "../../../../hooks"
import { BinaryDataKey, useGameServerSubscription, useGameServerSubscriptionSecuredUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"
import { BattleState, LocationSelectType, PlayerAbility, WarMachineLiveState } from "../../../../types"
import { NiceButtonGroup } from "../../../Common/Nice/NiceButtonGroup"
import { PlayerAbilitySmallCard } from "../../../Common/PlayerAbility/PlayerAbilitySmallCard"
import { SectionCollapsible } from "../Common/SectionCollapsible"

const filterOptions = [
    { label: "", value: LocationSelectType.Global, svg: <SvgGlobal size="1.4rem" /> },
    { label: "", value: LocationSelectType.LocationSelect, svg: <SvgTarget size="1.4rem" /> },
    { label: "", value: LocationSelectType.MechSelect, svg: <SvgMicrochip size="1.4rem" /> },
    { label: "", value: LocationSelectType.LineSelect, svg: <SvgLine size="1.4rem" /> },
]

export const PlayerAbilities = () => {
    const { userID } = useAuth()
    const { battleState, isAIDrivenMatch } = useGame()

    if (battleState !== BattleState.BattlingState || !userID) return null

    return (
        <Box sx={{ position: "relative" }}>
            <SectionCollapsible label="OWNED ABILITIES" tooltip="Launch your own abilities." initialExpanded={true} localStoragePrefix="playerAbility">
                <Box sx={{ pointerEvents: battleState === BattleState.BattlingState ? "all" : "none" }}>
                    <PlayerAbilitiesInner />
                </Box>

                {(isAIDrivenMatch || battleState !== BattleState.BattlingState) && (
                    <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "#000000AA" }} />
                )}
            </SectionCollapsible>
        </Box>
    )
}

const PlayerAbilitiesInner = () => {
    const theme = useTheme()
    const { userID } = useAuth()

    const [abilities, setAbilities] = useState<PlayerAbility[]>([])
    const [displayAbilities, setDisplayAbilities] = useState<PlayerAbility[]>([])
    const [locationSelectType, setLocationSelectType] = useState<LocationSelectType>()

    const { page, changePage, setTotalItems, totalPages, pageSize } = usePagination({
        pageSize: 8,
        page: 1,
    })

    useGameServerSubscriptionSecuredUser<PlayerAbility[]>(
        {
            URI: "/player_abilities",
            key: GameServerKeys.SubPlayerAbilitiesList,
        },
        (payload) => {
            if (!payload) return
            setAbilities(payload)
            setTotalItems(payload.length)
        },
    )

    // If all my faction mechs are dead, then disable my player abilities
    const { currentArenaID } = useArena()
    const { factionWarMachines } = useGame()
    const [disableAbilities, setDisableAbilities] = useState(false)
    useGameServerSubscription<WarMachineLiveState[]>(
        {
            URI: `/mini_map/arena/${currentArenaID}/public/mech_stats`,
            binaryKey: BinaryDataKey.WarMachineStats,
            binaryParser: warMachineStatsBinaryParser,
            ready: !!currentArenaID,
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
    useEffect(() => {
        console.log(disableAbilities)
    }, [disableAbilities])

    // Apply filter
    useEffect(() => {
        let result = abilities.map((p) => p)
        result = result.filter((p) => {
            if (!locationSelectType) return true

            if (locationSelectType === LocationSelectType.MechSelect) {
                return (
                    locationSelectType === p.ability.location_select_type ||
                    LocationSelectType.MechSelectAllied === p.ability.location_select_type ||
                    LocationSelectType.MechSelectOpponent === p.ability.location_select_type
                )
            }
            return locationSelectType === p.ability.location_select_type
        })

        setTotalItems(result.length)
        setDisplayAbilities(result.slice((page - 1) * pageSize, page * pageSize))
    }, [abilities, locationSelectType, setTotalItems, pageSize, page])

    if (!userID) return null

    return (
        <Stack spacing="1rem">
            <NiceButtonGroup
                primaryColor={theme.factionTheme.primary}
                secondaryColor={theme.factionTheme.text}
                options={filterOptions}
                selected={locationSelectType}
                onSelected={(value) => {
                    setLocationSelectType((prev) => (prev === value ? undefined : value))
                    changePage(1)
                }}
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
                    {displayAbilities.map((p) => (
                        <PlayerAbilitySmallCard
                            key={p.ability.id}
                            anyAbility={p.ability}
                            playerAbility={p}
                            onClickAction={disableAbilities ? "nothing" : "use"}
                            ownedCount={p.count}
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
                    {locationSelectType ? (
                        <>
                            No results,&nbsp;
                            <strong style={{ color: colors.gold, textDecoration: "underline" }} onClick={() => setLocationSelectType(undefined)}>
                                click here to clear filters.
                            </strong>
                        </>
                    ) : (
                        <>
                            You don&apos;t have any player abilities,&nbsp;
                            <strong>
                                <Link style={{ color: colors.gold, textDecoration: "underline" }} to={`/storefront/abilities`}>
                                    go to storefront.
                                </Link>
                            </strong>
                        </>
                    )}
                </Typography>
            )}

            {totalPages > 1 && (
                <Box
                    sx={{
                        px: "1rem",
                        py: ".7rem",
                        borderTop: (theme) => `${theme.factionTheme.primary}70 1.5px solid`,
                        backgroundColor: "#00000070",
                    }}
                >
                    <Pagination count={totalPages} page={page} onChange={(e, p) => changePage(p)} />
                </Box>
            )}
        </Stack>
    )
}

export const FilterButton = ({
    value,
    currentSelectedValue,
    onChange: setLocationSelectTypes,
    icon,
}: {
    value: LocationSelectType[]
    currentSelectedValue: LocationSelectType[]
    onChange: (l: LocationSelectType[]) => void
    icon: ReactNode
}) => {
    const theme = useTheme()

    const isSelected = value.join("||") === currentSelectedValue.join("||")

    return (
        <Button
            sx={{
                "&&": {
                    backgroundColor: isSelected ? theme.factionTheme.primary : "unset",
                    border: `1px solid ${theme.factionTheme.primary}`,
                },
                svg: {
                    fill: isSelected ? `${theme.factionTheme.text} !important` : "#FFFFFF",
                },
            }}
            onClick={() => {
                setLocationSelectTypes(isSelected ? [] : value)
            }}
        >
            {icon}
        </Button>
    )
}
