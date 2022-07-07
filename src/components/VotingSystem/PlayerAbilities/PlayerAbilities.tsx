import { Box, Button, ButtonGroup, Collapse, Fade, Pagination, Stack, Typography } from "@mui/material"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FancyButton } from "../.."
import { PlayerAbilityPNG, SvgDropdownArrow, SvgGlobal, SvgLine, SvgMicrochip, SvgTarget } from "../../../assets"
import { useAuth } from "../../../containers/auth"
import { useTheme } from "../../../containers/theme"
import { usePagination } from "../../../hooks"
import { useGameServerSubscriptionUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { LocationSelectType, PlayerAbility } from "../../../types"
import { PlayerAbilityCard } from "./PlayerAbilityCard"

const COLUMNS = 4
const ROWS = 2
const PAGE_SIZE = COLUMNS * ROWS

export const PlayerAbilities = () => {
    const theme = useTheme()
    const { userID } = useAuth()
    const [isCollapsed, setIsCollapsed] = useState(localStorage.getItem("isPlayerAbilitiesCollapsed") === "true")

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
        <Fade in={true}>
            <Box>
                <FancyButton
                    clipThingsProps={{
                        clipSize: "0",
                        backgroundColor: "#FFFFFF",
                        opacity: 0.05,
                        sx: { position: "relative" },
                    }}
                    sx={{ px: "1rem", py: ".4rem", color: "#FFFFFF" }}
                    onClick={() => {
                        setIsCollapsed((prev) => {
                            localStorage.setItem("isPlayerAbilitiesCollapsed", (!prev).toString())
                            return !prev
                        })
                    }}
                >
                    <Stack direction="row" spacing=".8rem" alignItems="center">
                        <Box
                            sx={{
                                width: "1.9rem",
                                height: "1.9rem",
                                backgroundImage: `url(${PlayerAbilityPNG})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                mb: ".24rem",
                            }}
                        />

                        <Typography
                            sx={{
                                lineHeight: 1,
                                color: colors.text,
                                fontWeight: "fontWeightBold",
                            }}
                        >
                            OWNED ABILITIES
                        </Typography>

                        <SvgDropdownArrow size="1.3rem" sx={{ ml: "auto !important", transform: isCollapsed ? "scaleY(-1) translateY(2px)" : "unset" }} />
                    </Stack>
                </FancyButton>

                <Collapse in={isCollapsed}>
                    <Stack spacing="1rem" sx={{ my: "1rem", px: ".6rem" }}>
                        <ButtonGroup
                            size="small"
                            sx={(theme) => ({
                                "& .MuiButton-root": {
                                    flex: 1,
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
                                onChange={onLocationSelectTypeChange}
                                icon={<SvgGlobal size="1.4rem" />}
                            />

                            <FilterButton
                                value={LocationSelectType.LOCATION_SELECT}
                                currentSelectedValue={locationSelectType}
                                onChange={onLocationSelectTypeChange}
                                icon={<SvgTarget size="1.4rem" />}
                            />

                            <FilterButton
                                value={LocationSelectType.MECH_SELECT}
                                currentSelectedValue={locationSelectType}
                                onChange={onLocationSelectTypeChange}
                                icon={<SvgMicrochip size="1.4rem" />}
                            />

                            <FilterButton
                                value={LocationSelectType.LINE_SELECT}
                                currentSelectedValue={locationSelectType}
                                onChange={onLocationSelectTypeChange}
                                icon={<SvgLine size="1.4rem" />}
                            />
                        </ButtonGroup>

                        {shownPlayerAbilities && shownPlayerAbilities.length > 0 ? (
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 9rem))`,
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
                                    userSelect: "text !important",
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
                </Collapse>
            </Box>
        </Fade>
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
