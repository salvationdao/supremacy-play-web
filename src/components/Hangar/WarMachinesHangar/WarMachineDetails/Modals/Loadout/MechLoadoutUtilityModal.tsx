import { Box, CircularProgress, IconButton, Modal, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { FancyButton } from "../../../../.."
import { EmptyWarMachinesPNG, SvgClose, SvgView } from "../../../../../../assets"
import { useTheme } from "../../../../../../containers/theme"
import { getRarityDeets, getUtilityTypeColor } from "../../../../../../helpers"
import { usePagination, useToggle } from "../../../../../../hooks"
import { useGameServerCommandsUser, useGameServerSubscriptionFaction } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { colors, fonts, siteZIndex } from "../../../../../../theme/theme"
import { Utility, UtilityType } from "../../../../../../types"
import { SortTypeLabel } from "../../../../../../types/marketplace"
import { ClipThing } from "../../../../../Common/ClipThing"
import { PageHeader } from "../../../../../Common/PageHeader"
import { ChipFilter } from "../../../../../Common/SortAndFilters/ChipFilterSection"
import { SortAndFilters } from "../../../../../Common/SortAndFilters/SortAndFilters"
import { TotalAndPageSizeOptions } from "../../../../../Common/TotalAndPageSizeOptions"
import { FeatherFade } from "../../MechViewer"

const sortOptions = [
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
    { label: SortTypeLabel.RarestAsc, value: SortTypeLabel.RarestAsc },
    { label: SortTypeLabel.RarestDesc, value: SortTypeLabel.RarestDesc },
]

export interface GetUtilitiesRequest {
    search: string
    page: number
    page_size: number
    include_market_listed: boolean
    exclude_equipped?: boolean
    exclude_mech_locked?: boolean
    sort_by: string
    sort_dir: string
    exclude_ids: string[]
    weapon_types: string[]
    rarities: string[]
    equipped_statuses: string[]
}

export interface GetUtilitiesResponse {
    utilities: Utility[]
    total: number
}

type OnConfirmUtilitySelection = (selectedUtility: Utility) => void

interface MechLoadoutUtilityModalProps {
    onClose: () => void
    onConfirm: OnConfirmUtilitySelection
    equipped: Utility
    utilitiesAlreadyEquippedInOtherSlots: string[]
}

export const MechLoadoutUtilityModal = ({ onClose, onConfirm, equipped, utilitiesAlreadyEquippedInOtherSlots }: MechLoadoutUtilityModalProps) => {
    const { send } = useGameServerCommandsUser("/user_commander")

    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    const [utilities, setUtilities] = useState<Utility[]>([])
    const [selectedUtility, setSelectedUtility] = useState<Utility>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()

    const { page, changePage, totalPages, changePageSize, pageSize, setTotalItems, totalItems } = usePagination({
        pageSize: 4,
        page: 1,
    })

    const [sort, setSort] = useState<string>(SortTypeLabel.Alphabetical)

    const [isFiltersExpanded, toggleIsFiltersExpanded] = useToggle()
    const filtersContainerEl = useRef<HTMLElement>()
    const [search, setSearch] = useState("")
    const [utilityTypes, setUtilityTypes] = useState<string[]>([])
    const [rarities, setRarities] = useState<string[]>([])
    const [equippedStatuses, setEquippedStatuses] = useState<string[]>(["unequipped"])

    const utilityTypeFilterSection = useRef<ChipFilter>({
        label: "UTILITY TYPE",
        options: [
            { value: UtilityType.Shield, label: UtilityType.Shield, color: getUtilityTypeColor(UtilityType.Shield) },
            { value: UtilityType.AttackDrone, label: UtilityType.AttackDrone, color: getUtilityTypeColor(UtilityType.AttackDrone) },
            { value: UtilityType.RepairDrone, label: UtilityType.RepairDrone, color: getUtilityTypeColor(UtilityType.RepairDrone) },
            { value: UtilityType.AntiMissile, label: UtilityType.AntiMissile, color: getUtilityTypeColor(UtilityType.AntiMissile) },
            { value: UtilityType.Accelerator, label: UtilityType.Accelerator, color: getUtilityTypeColor(UtilityType.Accelerator) },
        ],
        initialSelected: utilityTypes,
        initialExpanded: true,
        onSetSelected: (value: string[]) => {
            setUtilityTypes(value)
            changePage(1)
        },
    })

    const rarityChipFilter = useRef<ChipFilter>({
        label: "RARITY",
        options: [
            { value: "MEGA", ...getRarityDeets("MEGA") },
            { value: "COLOSSAL", ...getRarityDeets("COLOSSAL") },
            { value: "RARE", ...getRarityDeets("RARE") },
            { value: "LEGENDARY", ...getRarityDeets("LEGENDARY") },
            { value: "ELITE_LEGENDARY", ...getRarityDeets("ELITE_LEGENDARY") },
            { value: "ULTRA_RARE", ...getRarityDeets("ULTRA_RARE") },
            { value: "EXOTIC", ...getRarityDeets("EXOTIC") },
            { value: "GUARDIAN", ...getRarityDeets("GUARDIAN") },
            { value: "MYTHIC", ...getRarityDeets("MYTHIC") },
            { value: "DEUS_EX", ...getRarityDeets("DEUS_EX") },
            { value: "TITAN", ...getRarityDeets("TITAN") },
        ],
        initialSelected: rarities,
        initialExpanded: true,
        onSetSelected: (value: string[]) => {
            setRarities(value)
            changePage(1)
        },
    })

    const weaponEquippedFilterSection = useRef<ChipFilter>({
        label: "EQUIPPED STATUS",
        options: [
            { value: "equipped", label: "EQUIPPED", color: colors.green, textColor: "#FFFFFF" },
            { value: "unequipped", label: "UNEQUIPPED", color: colors.yellow, textColor: "#000000" },
        ],
        initialExpanded: true,
        initialSelected: equippedStatuses,
        onSetSelected: (value: string[]) => {
            setEquippedStatuses(value)
            changePage(1)
        },
    })

    const getUtilities = useCallback(async () => {
        try {
            setIsLoading(true)

            let sortDir = "asc"
            let sortBy = ""
            if (sort === SortTypeLabel.AlphabeticalReverse || sort === SortTypeLabel.RarestDesc) sortDir = "desc"

            switch (sort) {
                case SortTypeLabel.Alphabetical:
                case SortTypeLabel.AlphabeticalReverse:
                    sortBy = "alphabetical"
                    break
                case SortTypeLabel.RarestAsc:
                case SortTypeLabel.RarestDesc:
                    sortBy = "rarity"
                    break
            }

            const resp = await send<GetUtilitiesResponse, GetUtilitiesRequest>(GameServerKeys.GetUtilities, {
                page,
                page_size: pageSize,
                sort_by: sortBy,
                sort_dir: sortDir,
                include_market_listed: false,

                exclude_ids: utilitiesAlreadyEquippedInOtherSlots,
                weapon_types: utilityTypes,
                rarities,
                equipped_statuses: equippedStatuses,
                search,
            })

            if (!resp) return
            setLoadError(undefined)
            setUtilities(resp.utilities)
            setTotalItems(resp.total)
        } catch (e) {
            setLoadError(typeof e === "string" ? e : "Failed to get weapons.")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [equippedStatuses, page, pageSize, rarities, search, send, setTotalItems, sort, utilityTypes, utilitiesAlreadyEquippedInOtherSlots])

    useEffect(() => {
        getUtilities()
    }, [getUtilities])

    const utilityList = useMemo(() => {
        if (loadError) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: "100%", maxWidth: "100%", width: "75rem", px: "3rem", pt: "1.28rem" }}
                        spacing="1.5rem"
                    >
                        <Typography
                            sx={{
                                color: colors.red,
                                fontFamily: fonts.nostromoBold,
                                textAlign: "center",
                            }}
                        >
                            {loadError}
                        </Typography>
                    </Stack>
                </Stack>
            )
        }

        if (!utilities || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: theme.factionTheme.primary }} />
                    </Stack>
                </Stack>
            )
        }

        if (utilities && utilities.length > 0) {
            return (
                <Box
                    sx={{
                        display: "grid",
                        gap: "1rem",
                    }}
                >
                    {utilities.map((p) => (
                        <UtilityItem key={p.id} id={p.id} onSelect={(w) => setSelectedUtility(w)} equipped={equipped} selected={selectedUtility?.id === p.id} />
                    ))}
                </Box>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Box
                        sx={{
                            width: "80%",
                            height: "16rem",
                            opacity: 0.7,
                            filter: "grayscale(100%)",
                            background: `url(${EmptyWarMachinesPNG})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "bottom center",
                            backgroundSize: "contain",
                        }}
                    />
                    <Typography
                        sx={{
                            px: "1.28rem",
                            pt: "1.28rem",
                            color: colors.grey,
                            fontFamily: fonts.nostromoBold,
                            textAlign: "center",
                        }}
                    >
                        There are no utilities found, please try again.
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [equipped, isLoading, loadError, selectedUtility?.id, theme.factionTheme.primary, utilities])

    return (
        <Modal open onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "100rem",
                    maxWidth: "90vw",
                    boxShadow: 6,
                    outline: "none",
                }}
            >
                <ClipThing
                    ref={filtersContainerEl}
                    clipSize="10px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".3rem",
                    }}
                    backgroundColor={theme.factionTheme.background}
                    sx={{
                        position: "relative",
                        height: "55rem",
                        maxHeight: "90vh",
                    }}
                >
                    <IconButton
                        size="small"
                        onClick={onClose}
                        sx={{
                            zIndex: 100,
                            position: "absolute",
                            top: ".5rem",
                            right: ".5rem",
                        }}
                    >
                        <SvgClose size="3rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                    <Stack
                        direction="row"
                        sx={{
                            height: "100%",
                        }}
                    >
                        <SortAndFilters
                            initialSearch={search}
                            onSetSearch={setSearch}
                            chipFilters={[utilityTypeFilterSection.current, rarityChipFilter.current, weaponEquippedFilterSection.current]}
                            changePage={changePage}
                            isExpanded={isFiltersExpanded}
                            width="25rem"
                            drawer={{
                                container: filtersContainerEl.current,
                                onClose: () => toggleIsFiltersExpanded(false),
                            }}
                        />
                        <Stack flex={1}>
                            <PageHeader title="Equip a weapon" description="Select a weapon to equip on your mech." />
                            <TotalAndPageSizeOptions
                                countItems={utilities?.length}
                                totalItems={totalItems}
                                pageSize={pageSize}
                                changePageSize={changePageSize}
                                pageSizeOptions={[4, 8]}
                                changePage={changePage}
                                manualRefresh={getUtilities}
                                sortOptions={sortOptions}
                                selectedSort={sort}
                                onSetSort={setSort}
                                isFiltersExpanded={isFiltersExpanded}
                                toggleIsFiltersExpanded={toggleIsFiltersExpanded}
                            />
                            <Box
                                sx={{
                                    ml: "1.9rem",
                                    mr: ".5rem",
                                    pr: "1.4rem",
                                    my: "1rem",
                                    flex: 1,
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
                                {utilityList}
                            </Box>
                            {totalPages > 1 && (
                                <Box
                                    sx={{
                                        mt: "auto",
                                        px: "1rem",
                                        py: ".7rem",
                                        borderTop: `${primaryColor}70 1.5px solid`,
                                        borderBottom: `${primaryColor}70 1.5px solid`,
                                        backgroundColor: "#00000070",
                                    }}
                                >
                                    <Pagination
                                        size="small"
                                        count={totalPages}
                                        page={page}
                                        sx={{
                                            ".MuiButtonBase-root": { borderRadius: 0.8, fontFamily: fonts.nostromoBold, fontSize: "1.2rem" },
                                            ".Mui-selected": {
                                                color: secondaryColor,
                                                backgroundColor: `${primaryColor} !important`,
                                            },
                                        }}
                                        onChange={(e, p) => changePage(p)}
                                    />
                                </Box>
                            )}
                        </Stack>
                        <Stack
                            sx={{
                                overflow: "hidden",
                                flexBasis: "300px",
                                borderLeft: `${primaryColor}70 1.5px solid`,
                                backgroundColor: "#00000070",
                            }}
                        >
                            <UtilityPreview utility={selectedUtility} equipped={equipped} onConfirm={onConfirm} />
                        </Stack>
                    </Stack>
                </ClipThing>
            </Box>
        </Modal>
    )
}

interface UtilityItemProps {
    id: string
    equipped: Utility
    selected: boolean
    onSelect: (w: Utility) => void
}

const UtilityItem = ({ id, equipped, selected, onSelect }: UtilityItemProps) => {
    const theme = useTheme()
    const [utilityDetails, setUtilityDetails] = useState<Utility>()

    useGameServerSubscriptionFaction<Utility>(
        {
            URI: `/utility/${id}/details`,
            key: GameServerKeys.GetUtilityDetails,
        },
        (payload) => {
            if (!payload) return
            console.log(payload)
            setUtilityDetails(payload)
        },
    )

    if (!utilityDetails) {
        return (
            <ClipThing
                border={{
                    borderColor: theme.factionTheme.primary,
                }}
                backgroundColor={theme.factionTheme.background}
            >
                <Stack alignItems="center" justifyContent="center">
                    <CircularProgress />
                </Stack>
            </ClipThing>
        )
    }

    return (
        <FancyButton
            clipThingsProps={{
                border: {
                    borderColor: theme.factionTheme.primary,
                },
                backgroundColor: theme.factionTheme.background,
            }}
            sx={{
                position: "relative",
                padding: "1rem",
                backgroundColor: selected ? "#ffffff22" : "transparent",
            }}
            onClick={() => onSelect(utilityDetails)}
        >
            {utilityDetails.equipped_on && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "black",
                        opacity: 0.4,
                    }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        IN USE
                    </Typography>
                </Box>
            )}
            {selected && (
                <SvgView
                    size="3rem"
                    sx={{
                        position: "absolute",
                        top: "2rem",
                        right: "2rem",
                        opacity: 0.5,
                    }}
                />
            )}
            <Stack direction="row" alignItems="stretch" padding="1rem">
                <Box sx={{ width: "10rem" }}>
                    <Box
                        sx={{
                            position: "relative",
                            height: "9rem",
                            width: "100%",
                        }}
                    >
                        <Box
                            component="img"
                            src={utilityDetails.avatar_url || utilityDetails.image_url || utilityDetails.large_image_url}
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                            }}
                        />
                    </Box>

                    <Typography
                        variant="body2"
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        {utilityDetails?.label}
                    </Typography>
                </Box>
            </Stack>
        </FancyButton>
    )
}

interface UtilityPreviewProps {
    onConfirm: OnConfirmUtilitySelection
    utility?: Utility
    equipped: Utility
}

const UtilityPreview = ({ onConfirm, utility, equipped }: UtilityPreviewProps) => {
    const theme = useTheme()

    if (utility) {
        const videoUrls = [utility?.animation_url, utility?.card_animation_url]
        const videoUrlsFilters = videoUrls ? videoUrls.filter((videoUrl) => !!videoUrl) : []
        const imageUrl = utility?.avatar_url || utility?.image_url || utility?.large_image_url

        return (
            <Stack p="1rem 2rem" height="100%">
                <Box
                    sx={{
                        position: "relative",
                    }}
                >
                    <FeatherFade color={theme.factionTheme.background} />
                    {(!videoUrlsFilters || videoUrlsFilters.length <= 0) && imageUrl ? (
                        <Box
                            component="img"
                            src={imageUrl}
                            sx={{
                                height: "100%",
                                width: "100%",
                                objectFit: "contain",
                                objectPosition: "center",
                            }}
                        />
                    ) : (
                        <Box
                            key={imageUrl}
                            component="video"
                            sx={{
                                height: "100%",
                                width: "100%",
                                objectFit: "contain",
                                objectPosition: "center",
                            }}
                            disablePictureInPicture
                            disableRemotePlayback
                            loop
                            muted
                            autoPlay
                            controls={false}
                            poster={`${imageUrl}`}
                        >
                            {videoUrlsFilters.map((videoUrl, i) => videoUrl && <source key={videoUrl + i} src={videoUrl} type="video/mp4" />)}
                        </Box>
                    )}
                    <Box
                        sx={{
                            zIndex: 100,
                            position: "absolute",
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                color: getRarityDeets(utility.tier).color,
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            {utility.tier}
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            {utility.label}
                        </Typography>
                    </Box>
                </Box>
                <Stack
                    sx={{
                        zIndex: 100,
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        direction: "ltr",
                        mt: "1rem",

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
                    {utility.equipped_on && (
                        <Typography
                            sx={{
                                color: colors.red,
                            }}
                        >
                            Currently equipped on another mech.
                        </Typography>
                    )}
                </Stack>
                {!utility.locked_to_mech && (
                    <Stack
                        direction="row"
                        spacing="1rem"
                        sx={{
                            zIndex: 100,
                            pt: "1rem",
                        }}
                    >
                        <Box ml="auto" />
                        <FancyButton
                            clipThingsProps={{
                                backgroundColor: colors.green,
                            }}
                            onClick={() => onConfirm(utility)}
                        >
                            Equip To Mech
                        </FancyButton>
                    </Stack>
                )}
            </Stack>
        )
    }

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
                height: "100%",
            }}
        >
            <Typography
                sx={{
                    px: "1.28rem",
                    pt: "1.28rem",
                    color: colors.grey,
                    fontFamily: fonts.nostromoBold,
                    textAlign: "center",
                }}
            >
                Select a weapon to view its details.
            </Typography>
        </Stack>
    )
}
