import { Box, Button, ButtonGroup, Divider, Fade, Link, Pagination, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { SvgGlobal, SvgLine, SvgMicrochip, SvgTarget } from "../../assets"
import { useAuth } from "../../containers/auth"
import { useGameServerSubscriptionUser } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { LocationSelectType, PlayerAbility } from "../../types"
import { PlayerAbilityCard } from "./PlayerAbilityCard"

const columns = 5
const rows = 2
const pageSize = columns * rows

export const PlayerAbilities = () => {
    const { userID } = useAuth()

    const [playerAbilities, setPlayerAbilities] = useState<PlayerAbility[]>([])
    const [shownPlayerAbilities, setShownPlayerAbilities] = useState<PlayerAbility[]>([])

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    // Filters
    const [locationSelectType, setLocationSelectType] = useState<LocationSelectType | null>(null)

    useGameServerSubscriptionUser<PlayerAbility[]>(
        {
            URI: "/player_abilities",
            key: GameServerKeys.PlayerAbilitiesList,
        },
        (payload) => {
            if (!payload) return
            setPlayerAbilities(payload)
            setTotalPages(Math.ceil(payload.length / pageSize))
        },
    )

    useEffect(() => {
        setCurrentPage(1)
    }, [locationSelectType])

    useEffect(() => {
        let result = playerAbilities.map((p) => p)
        if (locationSelectType) {
            result = result.filter((p) => p.ability.location_select_type === locationSelectType)
        }

        setTotalPages(Math.ceil(result.length / pageSize))
        setShownPlayerAbilities(result.slice((currentPage - 1) * pageSize, currentPage * pageSize))
    }, [playerAbilities, locationSelectType, currentPage])

    if (!userID)
        return (
            <Fade in={true}>
                <Box>
                    <Divider sx={{ mb: "2rem", borderBottomWidth: ".25rem", borderColor: (theme) => theme.factionTheme.primary, opacity: 0.15 }} />
                    <Stack spacing=".8rem">
                        <Typography
                            sx={{
                                lineHeight: 1,
                                color: colors.text,
                                fontWeight: "fontWeightBold",
                                textTransform: "uppercase",
                            }}
                        >
                            Player Abilities
                        </Typography>
                        <Typography
                            sx={{
                                px: "1.28rem",
                                pt: "1.28rem",
                                mb: ".56rem",
                                color: colors.grey,
                                userSelect: "text !important",
                                opacity: 0.8,
                            }}
                        >
                            You must be logged in to view your owned abilities.
                        </Typography>
                    </Stack>
                </Box>
            </Fade>
        )

    return (
        <Fade in={true}>
            <Box>
                <Divider sx={{ mb: "2rem", borderBottomWidth: ".25rem", borderColor: (theme) => theme.factionTheme.primary, opacity: 0.15 }} />
                <Stack spacing=".8rem">
                    <Stack direction="row" spacing=".48rem" alignItems="center" justifyContent="space-between">
                        <Typography
                            sx={{
                                lineHeight: 1,
                                color: colors.text,
                                fontWeight: "fontWeightBold",
                                textTransform: "uppercase",
                            }}
                        >
                            Player Abilities
                        </Typography>
                        <ButtonGroup
                            size="small"
                            sx={(theme) => ({
                                "& .MuiButton-root": {
                                    borderRadius: 0,
                                    "&:hover": {
                                        border: `1px solid ${theme.factionTheme.primary}65`,
                                    },
                                },
                            })}
                        >
                            <Button
                                sx={(theme) => ({
                                    "&&": {
                                        border:
                                            locationSelectType === LocationSelectType.GLOBAL
                                                ? `1px solid ${theme.factionTheme.primary}65`
                                                : `1px solid ${theme.factionTheme.primary}`,
                                    },
                                })}
                                onClick={() => {
                                    setLocationSelectType(locationSelectType === LocationSelectType.GLOBAL ? null : LocationSelectType.GLOBAL)
                                }}
                            >
                                <SvgGlobal size="1.6rem" />
                            </Button>
                            <Button
                                sx={(theme) => ({
                                    "&&": {
                                        border:
                                            locationSelectType === LocationSelectType.LOCATION_SELECT
                                                ? `1px solid ${theme.factionTheme.primary}65`
                                                : `1px solid ${theme.factionTheme.primary}`,
                                    },
                                })}
                                onClick={() => {
                                    setLocationSelectType(locationSelectType === LocationSelectType.LOCATION_SELECT ? null : LocationSelectType.LOCATION_SELECT)
                                }}
                            >
                                <SvgTarget size="1.6rem" />
                            </Button>
                            <Button
                                sx={(theme) => ({
                                    "&&": {
                                        border:
                                            locationSelectType === LocationSelectType.MECH_SELECT
                                                ? `1px solid ${theme.factionTheme.primary}65`
                                                : `1px solid ${theme.factionTheme.primary}`,
                                    },
                                })}
                                onClick={() => {
                                    setLocationSelectType(locationSelectType === LocationSelectType.MECH_SELECT ? null : LocationSelectType.MECH_SELECT)
                                }}
                            >
                                <SvgMicrochip size="1.6rem" />
                            </Button>
                            <Button
                                sx={(theme) => ({
                                    "&&": {
                                        border:
                                            locationSelectType === LocationSelectType.LINE_SELECT
                                                ? `1px solid ${theme.factionTheme.primary}65`
                                                : `1px solid ${theme.factionTheme.primary}`,
                                    },
                                })}
                                onClick={() => {
                                    setLocationSelectType(locationSelectType === LocationSelectType.LINE_SELECT ? null : LocationSelectType.LINE_SELECT)
                                }}
                            >
                                <SvgLine size="1.6rem" />
                            </Button>
                        </ButtonGroup>
                    </Stack>
                    <Box>
                        {shownPlayerAbilities.length > 0 ? (
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                                    gap: ".5rem",
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
                                    userSelect: "text !important",
                                    opacity: 0.8,
                                }}
                            >
                                {locationSelectType ? (
                                    <>
                                        No results.&nbsp;
                                        <Link
                                            component="button"
                                            variant="body1"
                                            sx={{
                                                marginTop: "-2px",
                                                lineHeight: 1,
                                            }}
                                            onClick={() => setLocationSelectType(null)}
                                        >
                                            Click here to clear filters.
                                        </Link>
                                    </>
                                ) : (
                                    "You do not own any abilities at the moment."
                                )}
                            </Typography>
                        )}
                    </Box>
                    <Pagination
                        count={totalPages}
                        color="primary"
                        page={currentPage}
                        onChange={(_, p) => {
                            setCurrentPage(p)
                        }}
                    />
                </Stack>
            </Box>
        </Fade>
    )
}
