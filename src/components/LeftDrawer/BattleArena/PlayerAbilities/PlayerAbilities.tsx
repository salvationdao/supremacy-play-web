import { Box, Button, ButtonGroup, Pagination, Stack, Typography } from "@mui/material"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { SvgGlobal, SvgLine, SvgMicrochip, SvgTarget } from "../../../../assets"
import { useGame } from "../../../../containers"
import { useAuth } from "../../../../containers/auth"
import { useTheme } from "../../../../containers/theme"
import { usePagination } from "../../../../hooks"
import { useGameServerSubscriptionSecuredUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { BattleState, LocationSelectType, PlayerAbility } from "../../../../types"
import { SectionCollapsible } from "../Common/SectionCollapsible"
import { PlayerAbilityCard } from "./PlayerAbilityCard"

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

    const [playerAbilities, setPlayerAbilities] = useState<PlayerAbility[]>([])
    const [shownPlayerAbilities, setShownPlayerAbilities] = useState<PlayerAbility[]>([])

    const { page, changePage, setTotalItems, totalPages, pageSize } = usePagination({
        pageSize: 8,
        page: 1,
    })
    const [locationSelectTypes, setLocationSelectTypes] = useState<LocationSelectType[]>([])

    useGameServerSubscriptionSecuredUser<PlayerAbility[]>(
        {
            URI: "/player_abilities",
            key: GameServerKeys.SubPlayerAbilitiesList,
        },
        (payload) => {
            if (!payload) return
            setPlayerAbilities(payload)
            setTotalItems(payload.length)
        },
    )

    useEffect(() => {
        let result = playerAbilities.map((p) => p)
        if (locationSelectTypes.length > 0) {
            result = result.filter((p) => locationSelectTypes.includes(p.ability.location_select_type))
        }

        setTotalItems(result.length)
        setShownPlayerAbilities(result.slice((page - 1) * pageSize, page * pageSize))
    }, [playerAbilities, locationSelectTypes, setTotalItems, pageSize, page])

    const onLocationSelectTypeChange = useCallback(
        (l: LocationSelectType[]) => {
            changePage(1)
            setLocationSelectTypes(l)
        },
        [changePage],
    )

    if (!userID) return null

    return (
        <Stack spacing="1rem">
            <ButtonGroup
                size="small"
                sx={(theme) => ({
                    "& .MuiButton-root": {
                        flex: 1,
                        height: "3rem",
                        borderWidth: "2px",
                        borderRadius: 0.8,
                        transition: "none",
                        "&:hover": {
                            opacity: 0.9,
                            backgroundColor: theme.factionTheme.primary,
                        },
                    },
                })}
            >
                <FilterButton
                    value={[LocationSelectType.Global]}
                    currentSelectedValue={locationSelectTypes}
                    onChange={onLocationSelectTypeChange}
                    icon={<SvgGlobal size="1.4rem" />}
                />

                <FilterButton
                    value={[LocationSelectType.LocationSelect]}
                    currentSelectedValue={locationSelectTypes}
                    onChange={onLocationSelectTypeChange}
                    icon={<SvgTarget size="1.4rem" />}
                />

                <FilterButton
                    value={[LocationSelectType.MechSelect, LocationSelectType.MechSelectAllied, LocationSelectType.MechSelectOpponent]}
                    currentSelectedValue={locationSelectTypes}
                    onChange={onLocationSelectTypeChange}
                    icon={<SvgMicrochip size="1.4rem" />}
                />

                <FilterButton
                    value={[LocationSelectType.LineSelect]}
                    currentSelectedValue={locationSelectTypes}
                    onChange={onLocationSelectTypeChange}
                    icon={<SvgLine size="1.4rem" />}
                />
            </ButtonGroup>

            {shownPlayerAbilities && shownPlayerAbilities.length > 0 ? (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
                        gap: ".6rem",
                    }}
                >
                    {shownPlayerAbilities.map((p) => (
                        <PlayerAbilityCard key={p.ability.id} playerAbility={p} />
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
                    {locationSelectTypes ? (
                        <>
                            No results,&nbsp;
                            <strong style={{ color: colors.gold, textDecoration: "underline" }} onClick={() => setLocationSelectTypes([])}>
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
                    <Pagination
                        size="medium"
                        count={totalPages}
                        page={page}
                        sx={{
                            ".MuiButtonBase-root": { borderRadius: 0.8, fontFamily: fonts.nostromoBold },
                            ".Mui-selected": {
                                color: (theme) => theme.factionTheme.secondary,
                                backgroundColor: `${theme.factionTheme.primary} !important`,
                            },
                        }}
                        onChange={(e, p) => changePage(p)}
                        showFirstButton
                        showLastButton
                    />
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

    const isSame = value.join("||") === currentSelectedValue.join("||")

    return (
        <Button
            sx={{
                "&&": {
                    backgroundColor: isSame ? theme.factionTheme.primary : "unset",
                    border: `1px solid ${theme.factionTheme.primary}`,
                },
                svg: {
                    fill: isSame ? theme.factionTheme.secondary : "#FFFFFF",
                },
            }}
            onClick={() => {
                setLocationSelectTypes(isSame ? [] : value)
            }}
        >
            {icon}
        </Button>
    )
}
