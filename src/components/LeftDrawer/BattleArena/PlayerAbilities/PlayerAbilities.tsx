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
import { LocationSelectType, PlayerAbility } from "../../../../types"
import { SectionHeading } from "../Common/SectionHeading"
import { PlayerAbilityCard } from "./PlayerAbilityCard"

export const PlayerAbilities = () => {
    const { userID } = useAuth()
    const { bribeStage, isBattleStarted } = useGame()

    if (!bribeStage || !userID) return null

    return (
        <Box sx={{ position: "relative" }}>
            <SectionHeading label="OWNED ABILITIES" tooltip="Launch your own abilities." />
            <Stack
                spacing="1rem"
                sx={{
                    pointerEvents: isBattleStarted ? "all" : "none",
                    p: "1.5rem 1.1rem",
                    backgroundColor: "#FFFFFF12",
                    boxShadow: 2,
                    border: "#FFFFFF20 1px solid",
                }}
            >
                <PlayerAbilitiesInner />
            </Stack>

            {!isBattleStarted && <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "#000000AA" }} />}
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
    const [locationSelectType, setLocationSelectType] = useState<LocationSelectType | null>(null)

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
        if (locationSelectType) {
            result = result.filter((p) => p.ability.location_select_type === locationSelectType)
        }

        setTotalItems(result.length)
        setShownPlayerAbilities(result.slice((page - 1) * pageSize, page * pageSize))
    }, [playerAbilities, locationSelectType, setTotalItems, pageSize, page])

    const onLocationSelectTypeChange = useCallback(
        (l: LocationSelectType | null) => {
            changePage(1)
            setLocationSelectType(l)
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
                    value={LocationSelectType.Global}
                    currentSelectedValue={locationSelectType}
                    onChange={onLocationSelectTypeChange}
                    icon={<SvgGlobal size="1.4rem" />}
                />

                <FilterButton
                    value={LocationSelectType.LocationSelect}
                    currentSelectedValue={locationSelectType}
                    onChange={onLocationSelectTypeChange}
                    icon={<SvgTarget size="1.4rem" />}
                />

                <FilterButton
                    value={LocationSelectType.MechSelect}
                    currentSelectedValue={locationSelectType}
                    onChange={onLocationSelectTypeChange}
                    icon={<SvgMicrochip size="1.4rem" />}
                />

                <FilterButton
                    value={LocationSelectType.LineSelect}
                    currentSelectedValue={locationSelectType}
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
                    {locationSelectType ? (
                        <>
                            No results,&nbsp;
                            <strong style={{ color: colors.gold, textDecoration: "underline" }} onClick={() => setLocationSelectType(null)}>
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

const FilterButton = ({
    value,
    currentSelectedValue,
    onChange: setLocationSelectType,
    icon,
}: {
    value: LocationSelectType
    currentSelectedValue: LocationSelectType | null
    onChange: (l: LocationSelectType | null) => void
    icon: ReactNode
}) => {
    const theme = useTheme()

    return (
        <Button
            sx={{
                "&&": {
                    backgroundColor: value === currentSelectedValue ? theme.factionTheme.primary : "unset",
                    border: `1px solid ${theme.factionTheme.primary}`,
                },
                svg: {
                    fill: value === currentSelectedValue ? theme.factionTheme.secondary : "#FFFFFF",
                },
            }}
            onClick={() => {
                setLocationSelectType(value === currentSelectedValue ? null : value)
            }}
        >
            {icon}
        </Button>
    )
}
