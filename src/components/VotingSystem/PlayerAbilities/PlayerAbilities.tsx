import { Box, Button, ButtonGroup, Fade, Link, Pagination, Stack, Typography } from "@mui/material"
import { ReactNode, useEffect, useState } from "react"
import { SvgGlobal, SvgLine, SvgMicrochip, SvgTarget } from "../../../assets"
import { useAuth } from "../../../containers/auth"
import { useTheme } from "../../../containers/theme"
import { usePagination } from "../../../hooks"
import { useGameServerSubscriptionUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { LocationSelectType, PlayerAbility } from "../../../types"
import { PlayerAbilityCard } from "./PlayerAbilityCard"

const COLUMNS = 5
const ROWS = 2
const PAGE_SIZE = COLUMNS * ROWS

export const PlayerAbilities = () => {
    const theme = useTheme()
    const { userID } = useAuth()

    const [playerAbilities, setPlayerAbilities] = useState<PlayerAbility[]>([])
    const [shownPlayerAbilities, setShownPlayerAbilities] = useState<PlayerAbility[]>([])

    const { page, changePage, setTotalItems, totalPages, pageSize } = usePagination({
        pageSize: PAGE_SIZE,
        page: 1,
    })
    const [locationSelectType, setLocationSelectType] = useState<LocationSelectType | null>(null)

    useGameServerSubscriptionUser<PlayerAbility[]>(
        {
            URI: "/player_abilities",
            key: GameServerKeys.PlayerAbilitiesList,
        },
        (payload) => {
            if (!payload) return
            setPlayerAbilities(payload)
            setTotalItems(payload.length)
        },
    )

    useEffect(() => {
        changePage(1)
    }, [changePage, locationSelectType])

    useEffect(() => {
        let result = playerAbilities.map((p) => p)
        if (locationSelectType) {
            result = result.filter((p) => p.ability.location_select_type === locationSelectType)
        }

        setTotalItems(result.length)
        setShownPlayerAbilities(result.slice((page - 1) * pageSize, page * pageSize))
    }, [playerAbilities, locationSelectType, setTotalItems, pageSize, page])

    if (!userID) return null

    return (
        <Fade in={true}>
            <Stack spacing=".8rem">
                <Stack direction="row" spacing=".48rem" alignItems="center" justifyContent="space-between">
                    <Typography
                        sx={{
                            lineHeight: 1,
                            color: colors.text,
                            fontWeight: "fontWeightBold",
                        }}
                    >
                        PLAYER ABILITIES
                    </Typography>

                    <ButtonGroup
                        size="small"
                        sx={(theme) => ({
                            "& .MuiButton-root": {
                                borderRadius: 0.8,
                                "&:hover": {
                                    border: `1px solid ${theme.factionTheme.primary}65`,
                                },
                            },
                        })}
                    >
                        <FilterButton
                            value={LocationSelectType.GLOBAL}
                            currentSelectedValue={locationSelectType}
                            setLocationSelectType={setLocationSelectType}
                            icon={<SvgGlobal size="1.4rem" />}
                        />

                        <FilterButton
                            value={LocationSelectType.LOCATION_SELECT}
                            currentSelectedValue={locationSelectType}
                            setLocationSelectType={setLocationSelectType}
                            icon={<SvgTarget size="1.4rem" />}
                        />

                        <FilterButton
                            value={LocationSelectType.MECH_SELECT}
                            currentSelectedValue={locationSelectType}
                            setLocationSelectType={setLocationSelectType}
                            icon={<SvgMicrochip size="1.4rem" />}
                        />

                        <FilterButton
                            value={LocationSelectType.LINE_SELECT}
                            currentSelectedValue={locationSelectType}
                            setLocationSelectType={setLocationSelectType}
                            icon={<SvgLine size="1.4rem" />}
                        />
                    </ButtonGroup>
                </Stack>

                <Box>
                    {shownPlayerAbilities && shownPlayerAbilities.length > 0 ? (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`,
                                gridTemplateRows: `repeat(${ROWS}, 1fr)`,
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
                                    No results,&nbsp;
                                    <Link
                                        component="button"
                                        variant="body1"
                                        sx={{
                                            marginTop: "-2px",
                                            lineHeight: 1,
                                        }}
                                        onClick={() => setLocationSelectType(null)}
                                    >
                                        click here to clear filters.
                                    </Link>
                                </>
                            ) : (
                                "You do not own any abilities at the moment."
                            )}
                        </Typography>
                    )}
                </Box>

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
        </Fade>
    )
}

const FilterButton = ({
    value,
    currentSelectedValue,
    setLocationSelectType,
    icon,
}: {
    value: LocationSelectType
    currentSelectedValue: LocationSelectType | null
    setLocationSelectType: React.Dispatch<React.SetStateAction<LocationSelectType | null>>
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
