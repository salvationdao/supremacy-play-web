import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useRef, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { PlayerAbilityPNG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { parseString } from "../../../helpers"
import { usePagination, useToggle, useUrlQuery } from "../../../hooks"
import { useGameServerSubscriptionUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { LocationSelectType, PlayerAbility } from "../../../types"
import { PageHeader } from "../../Common/PageHeader"
import { ChipFilter } from "../../Common/SortAndFilters/ChipFilterSection"
import { SortAndFilters } from "../../Common/SortAndFilters/SortAndFilters"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { MysteryCrateStoreItemLoadingSkeleton } from "../../Storefront/MysteryCratesStore/MysteryCrateStoreItem/MysteryCrateStoreItem"
import { PlayerAbilityHangarItem } from "./PlayerAbilityHangarItem"

export const PlayerAbilitiesHangar = () => {
    const theme = useTheme()
    const [query] = useUrlQuery()

    const [isLoaded, setIsLoaded] = useState(false)
    const [playerAbilities, setPlayerAbilities] = useState<PlayerAbility[]>([])
    const [shownPlayerAbilities, setShownPlayerAbilities] = useState<PlayerAbility[]>([])

    // Pagination
    const { page, changePage, totalItems, setTotalItems, pageSize, changePageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })

    // Filters
    const [isFiltersExpanded, toggleIsFiltersExpanded] = useToggle(localStorage.getItem("isFiltersExpanded") === "true")
    const [search, setSearch] = useState("")
    const [locationSelectTypes, setLocationSelectTypes] = useState<string[]>((query.get("abilityTypes") || undefined)?.split("||") || [])
    const locationSelectTypeFilterSection = useRef<ChipFilter>({
        label: "ABILITY TYPE",
        options: [
            { value: LocationSelectType.GLOBAL, label: LocationSelectType.GLOBAL.split("_").join(" "), color: colors.green },
            { value: LocationSelectType.LOCATION_SELECT, label: LocationSelectType.LOCATION_SELECT.split("_").join(" "), color: colors.blue2 },
            { value: LocationSelectType.MECH_SELECT, label: LocationSelectType.MECH_SELECT.split("_").join(" "), color: colors.gold },
            { value: LocationSelectType.LINE_SELECT, label: LocationSelectType.LINE_SELECT.split("_").join(" "), color: colors.purple },
        ],
        initialSelected: locationSelectTypes,
        initialExpanded: true,
        onSetSelected: (value: string[]) => {
            setLocationSelectTypes(value)
            changePage(1)
        },
    })

    useEffect(() => {
        localStorage.setItem("isFiltersExpanded", isFiltersExpanded.toString())
    }, [isFiltersExpanded])

    useGameServerSubscriptionUser<PlayerAbility[]>(
        {
            URI: "/player_abilities",
            key: GameServerKeys.PlayerAbilitiesList,
        },
        (payload) => {
            if (!payload) return
            setPlayerAbilities(payload)
            setTotalItems(payload.length)
            if (isLoaded) return
            setIsLoaded(true)
        },
    )

    useEffect(() => {
        let result = playerAbilities.map((p) => p)
        if (locationSelectTypes.length > 0) {
            result = result.filter((p) => locationSelectTypes.includes(p.ability.location_select_type))
        }
        if (search !== "") {
            result = result.filter((p) => p.ability.label.includes(search) || p.ability.description.includes(search))
        }

        setTotalItems(result.length)
        setShownPlayerAbilities(result.slice((page - 1) * pageSize, page * pageSize))
    }, [playerAbilities, page, setTotalItems, pageSize, locationSelectTypes, search])

    const content = useMemo(() => {
        if (!isLoaded) {
            return (
                <Stack direction="row" flexWrap="wrap" sx={{ height: 0 }}>
                    {new Array(10).fill(0).map((_, index) => (
                        <MysteryCrateStoreItemLoadingSkeleton key={index} />
                    ))}
                </Stack>
            )
        }

        if (shownPlayerAbilities.length > 0) {
            return (
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Box
                        sx={{
                            overflow: "visible",
                            display: "grid",
                            width: "100%",
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                            gridTemplateRows: "repeat(1, min-content)",
                            gap: "3rem",
                            alignItems: "stretch",
                            justifyContent: "center",
                            py: "1rem",
                        }}
                    >
                        {shownPlayerAbilities.map((p) => (
                            <PlayerAbilityHangarItem key={p.ability.id} playerAbility={p} />
                        ))}
                    </Box>
                </Box>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "43rem" }}>
                    <Box
                        sx={{
                            width: "9rem",
                            height: "9rem",
                            opacity: 0.6,
                            filter: "grayscale(100%)",
                            border: "#FFFFFF10 1px solid",
                            background: `url(${PlayerAbilityPNG})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "top center",
                            backgroundSize: "contain",
                        }}
                    />

                    <Typography
                        sx={{
                            px: "1.28rem",
                            pt: "1.28rem",
                            color: colors.grey,
                            fontFamily: fonts.nostromoBold,
                            userSelect: "text !important",
                            opacity: 0.9,
                            textAlign: "center",
                        }}
                    >
                        {"You don't have any abilities."}
                    </Typography>

                    <FancyButton
                        to={`/storefront/abilities${location.hash}`}
                        clipThingsProps={{
                            clipSize: "9px",
                            backgroundColor: theme.factionTheme.primary,
                            border: { isFancy: true, borderColor: theme.factionTheme.primary },
                            sx: { position: "relative", mt: "2rem" },
                        }}
                        sx={{ px: "1.8rem", py: ".8rem", color: theme.factionTheme.secondary }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                textAlign: "center",
                                color: theme.factionTheme.secondary,
                                fontFamily: fonts.nostromoBold,
                            }}
                        >
                            GO TO STOREFRONT
                        </Typography>
                    </FancyButton>
                </Stack>
            </Stack>
        )
    }, [isLoaded, shownPlayerAbilities, theme.factionTheme.primary, theme.factionTheme.secondary])

    return (
        <Stack direction="row" sx={{ height: "100%" }}>
            <SortAndFilters
                initialSearch={search}
                onSetSearch={setSearch}
                chipFilters={[locationSelectTypeFilterSection.current]}
                changePage={changePage}
                isExpanded={isFiltersExpanded}
            />

            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".3rem",
                }}
                corners={{
                    topRight: true,
                    bottomLeft: true,
                    bottomRight: true,
                }}
                opacity={0.7}
                backgroundColor={theme.factionTheme.background}
                sx={{ height: "100%", flex: 1 }}
            >
                <Stack
                    sx={{
                        flex: 1,
                        position: "relative",
                        height: "100%",
                    }}
                >
                    <PageHeader
                        imageUrl={PlayerAbilityPNG}
                        title="PLAYER ABILITIES"
                        description="Player abilities are abilities that can be claimed and used on the battle arena."
                    />

                    <TotalAndPageSizeOptions
                        countItems={shownPlayerAbilities.length}
                        totalItems={totalItems}
                        pageSize={pageSize}
                        changePageSize={changePageSize}
                        pageSizeOptions={[10, 20, 40]}
                        changePage={changePage}
                        isFiltersExpanded={isFiltersExpanded}
                        toggleIsFiltersExpanded={toggleIsFiltersExpanded}
                    />

                    <Stack sx={{ px: "2rem", flex: 1 }}>
                        <Box
                            sx={{
                                flex: 1,
                                ml: "1.9rem",
                                mr: ".5rem",
                                pr: "1.4rem",
                                my: "1rem",
                                overflowY: "auto",
                                overflowX: "hidden",
                                direction: "ltr",

                                "::-webkit-scrollbar": {
                                    width: ".4rem",
                                },
                                "::-webkit-scrollbar-track": {
                                    background: "#FFFFFF15",
                                    borderRadius: 3,
                                },
                                "::-webkit-scrollbar-thumb": {
                                    background: theme.factionTheme.primary,
                                    borderRadius: 3,
                                },
                            }}
                        >
                            {content}
                        </Box>
                    </Stack>
                </Stack>
            </ClipThing>
        </Stack>
    )
}
