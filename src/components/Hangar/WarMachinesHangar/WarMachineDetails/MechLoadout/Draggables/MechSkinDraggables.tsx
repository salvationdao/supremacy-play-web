import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SvgLoadoutSkin, SvgSearch } from "../../../../../../assets"
import { getRarityDeets } from "../../../../../../helpers"
import { usePagination } from "../../../../../../hooks"
import { useGameServerCommandsUser } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { fonts, theme } from "../../../../../../theme/theme"
import { AssetItemType, MechSkin } from "../../../../../../types"
import { SortTypeLabel } from "../../../../../../types/marketplace"
import { NiceSelect } from "../../../../../Common/Nice/NiceSelect"
import { NiceTextField } from "../../../../../Common/Nice/NiceTextField"
import { GetSubmodelsRequest, GetSubmodelsResponse } from "../../../../SubmodelHangar/SubmodelsHangar"
import { MechLoadoutItem } from "../../../Common/MechLoadoutItem"
import { OnClickEventWithType } from "../MechLoadoutDraggables"

export interface MechSkinDraggablesProps {
    excludeMechSkinIDs: string[]
    includeMechSkinIDs: string[]
    mechModelID: string
    onClick: OnClickEventWithType
}

export const MechSkinDraggables = ({ excludeMechSkinIDs, includeMechSkinIDs, mechModelID, onClick }: MechSkinDraggablesProps) => {
    const { send } = useGameServerCommandsUser("/user_commander")

    const mechSkinsMemoized = useRef<MechSkin[]>([])
    const [mechSkins, setMechSkins] = useState<MechSkin[]>([])
    const [isMechSkinsLoading, setIsMechSkinsLoading] = useState(true)
    const [mechSkinsError, setMechSkinsError] = useState<string>()
    const [sort, setSort] = useState<string>(SortTypeLabel.DateAddedNewest)
    const { page, changePage, setTotalItems, totalPages, pageSize } = usePagination({
        pageSize: 9,
        page: 1,
    })

    const [search, setSearch] = useState("")
    const [searchLoading, setSearchLoading] = useState(false)
    const debounceTimeoutRef = useRef<NodeJS.Timeout>()
    const debouncedSetSearch = (newValue: string) => {
        setSearchLoading(true)
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }
        debounceTimeoutRef.current = setTimeout(() => {
            setSearch(newValue)
            setSearchLoading(false)
        }, 1000)
    }

    const getMechSkins = useCallback(async () => {
        setIsMechSkinsLoading(true)
        try {
            let sortDir = "asc"
            let sortBy = ""
            if (sort === SortTypeLabel.AlphabeticalReverse || sort === SortTypeLabel.RarestDesc) sortDir = "desc"

            switch (sort) {
                case SortTypeLabel.Alphabetical:
                    sortBy = "alphabetical"
                    break
                case SortTypeLabel.AlphabeticalReverse:
                    sortBy = "alphabetical"
                    sortDir = "desc"
                    break
                case SortTypeLabel.RarestAsc:
                    sortBy = "rarity"
                    break
                case SortTypeLabel.RarestDesc:
                    sortBy = "rarity"
                    sortDir = "desc"
                    break
                case SortTypeLabel.DateAddedOldest:
                    sortBy = "date"
                    break
                case SortTypeLabel.DateAddedNewest:
                    sortBy = "date"
                    sortDir = "desc"
                    break
            }

            const resp = await send<GetSubmodelsResponse, GetSubmodelsRequest>(GameServerKeys.GetMechSubmodelsDetailed, {
                page,
                page_size: pageSize,
                sort_by: sortBy,
                sort_dir: sortDir,
                include_market_listed: false,
                display_genesis_and_limited: true,
                exclude_market_locked: true,
                display_xsyn: false,
                display_unique: true,
                skin_compatibility: [],
                exclude_ids: excludeMechSkinIDs,
                include_ids: includeMechSkinIDs,
                model_id: mechModelID,
                rarities: [],
                equipped_statuses: [],
                search,
            })

            if (!resp) return
            setMechSkinsError(undefined)
            setMechSkins(resp.submodels)
            setTotalItems(resp.total)
            mechSkinsMemoized.current = resp.submodels
        } catch (e) {
            setMechSkinsError(typeof e === "string" ? e : "Failed to get mech skins.")
            console.error(e)
        } finally {
            setIsMechSkinsLoading(false)
        }
    }, [excludeMechSkinIDs, includeMechSkinIDs, mechModelID, page, pageSize, search, send, setTotalItems, sort])
    useEffect(() => {
        getMechSkins()
    }, [getMechSkins])

    const mechSkinsContent = useMemo(() => {
        if (isMechSkinsLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" flex={1}>
                    <Typography>Loading mech skins...</Typography>
                </Stack>
            )
        }
        if (mechSkinsError) {
            return (
                <Stack alignItems="center" justifyContent="center" flex={1}>
                    <Typography>{mechSkinsError}</Typography>
                </Stack>
            )
        }
        if (mechSkins.length === 0) {
            return (
                <Stack alignItems="center" justifyContent="center" flex={1}>
                    <Typography
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            color: `${theme.factionTheme.primary}aa`,
                            textTransform: "uppercase",
                        }}
                    >
                        No Submodels
                    </Typography>
                </Stack>
            )
        }

        return (
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(100px, 1fr))",
                    gap: "1rem",
                }}
            >
                {mechSkins.map((ms, index) => (
                    <MechLoadoutItem
                        key={index}
                        imageUrl={ms.swatch_images?.image_url || ms.swatch_images?.avatar_url || ms.image_url || ms.avatar_url}
                        label={ms.label}
                        Icon={SvgLoadoutSkin}
                        rarity={ms.tier ? getRarityDeets(ms.tier) : undefined}
                        onClick={(e) => onClick(e, AssetItemType.MechSkin, ms)}
                        shape="square"
                        size="full-width"
                    />
                ))}
            </Box>
        )
    }, [isMechSkinsLoading, mechSkins, mechSkinsError, onClick])

    return (
        <Stack spacing="2rem" minHeight={400}>
            {/* Search and sort */}
            <Stack direction="row" spacing="1rem">
                <NiceTextField
                    primaryColor={theme.factionTheme.primary}
                    onChange={(value) => debouncedSetSearch(value)}
                    placeholder="Search..."
                    InputProps={{
                        endAdornment: searchLoading ? <CircularProgress size="1.6rem" /> : <SvgSearch size="1.6rem" fill={"rgba(255, 255, 255, 0.4)"} />,
                    }}
                />
                <NiceSelect
                    label="Sort:"
                    primaryColor={theme.factionTheme.primary}
                    secondaryColor={theme.factionTheme.secondary}
                    options={[
                        {
                            value: SortTypeLabel.Alphabetical,
                            label: SortTypeLabel.Alphabetical,
                        },
                        {
                            value: SortTypeLabel.AlphabeticalReverse,
                            label: SortTypeLabel.AlphabeticalReverse,
                        },
                        {
                            value: SortTypeLabel.RarestAsc,
                            label: SortTypeLabel.RarestAsc,
                        },
                        {
                            value: SortTypeLabel.RarestDesc,
                            label: SortTypeLabel.RarestDesc,
                        },
                        {
                            value: SortTypeLabel.DateAddedNewest,
                            label: "Date added: newest",
                        },
                        {
                            value: SortTypeLabel.DateAddedOldest,
                            label: "Date added: oldest",
                        },
                    ]}
                    selected={sort}
                    onSelected={(value) => setSort(value)}
                />
            </Stack>

            {/* Content */}
            {mechSkinsContent}
            <Box flex={1} />

            {/* Pagination */}
            <Pagination count={totalPages} page={page} onChange={(_, p) => changePage(p)} />
        </Stack>
    )
}
