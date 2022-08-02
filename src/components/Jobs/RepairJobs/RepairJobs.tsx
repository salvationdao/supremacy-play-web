import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useEffect, useMemo, useRef, useState } from "react"
import FlipMove from "react-flip-move"
import { ClipThing } from "../.."
import { EmptyWarMachinesPNG, WarMachineIconPNG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { useArray, useToggle, useUrlQuery } from "../../../hooks"
import { useGameServerSubscription } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { RepairJob } from "../../../types/jobs"
import { SortTypeLabel } from "../../../types/marketplace"
import { PageHeader } from "../../Common/PageHeader"
import { RangeFilter } from "../../Common/SortAndFilters/RangeFilterSection"
import { SortAndFilters } from "../../Common/SortAndFilters/SortAndFilters"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { RepairJobItem } from "./RepairJobItem"

const sortOptions = [
    { label: SortTypeLabel.CreateTimeNewestFirst, value: SortTypeLabel.CreateTimeNewestFirst },
    { label: SortTypeLabel.CreateTimeOldestFirst, value: SortTypeLabel.CreateTimeOldestFirst },
    { label: SortTypeLabel.EndTimeEndingSoon, value: SortTypeLabel.EndTimeEndingSoon },
    { label: SortTypeLabel.EndTimeEndingLast, value: SortTypeLabel.EndTimeEndingLast },
    { label: SortTypeLabel.RewardAmountLowest, value: SortTypeLabel.RewardAmountLowest },
    { label: SortTypeLabel.RewardAmountHighest, value: SortTypeLabel.RewardAmountHighest },
]

export const RepairJobs = () => {
    const [query, updateQuery] = useUrlQuery()
    const theme = useTheme()

    // Items
    const { value: repairJobs, setValue: setRepairJobs, removeByID } = useArray<RepairJob>([], "id")
    const [repairJobsRender, setRepairJobsRender] = useState<RepairJob[]>([])

    // Filters and sorts
    const [isFiltersExpanded, toggleIsFiltersExpanded] = useToggle(localStorage.getItem("isRepairJobsFiltersExpanded") === "true")
    const [sort, setSort] = useState<string>(query.get("sort") || SortTypeLabel.EndTimeEndingSoon)
    const [rewardRanges, setRewardRanges] = useState<(number | undefined)[]>(
        (query.get("rewardRanges") || undefined)?.split("||").map((p) => (p ? parseInt(p) : undefined)) || [undefined, undefined],
    )

    useEffect(() => {
        localStorage.setItem("isRepairJobsFiltersExpanded", isFiltersExpanded.toString())
    }, [isFiltersExpanded])

    useGameServerSubscription<RepairJob[]>(
        {
            URI: "/public/repair_offer/update",
            key: GameServerKeys.SubRepairJobListUpdated,
        },
        (payload) => {
            if (!payload || payload.length <= 0) return

            setRepairJobs((prev) => {
                let newArray = [...prev]

                for (let index = 0; index < payload.length; index++) {
                    const foundIndex = newArray.findIndex((rj) => rj.id === payload[index].id)
                    if (foundIndex >= 0) {
                        newArray[foundIndex] = payload[index]
                    } else {
                        // If repair job is not in the array, then add it
                        newArray = [...newArray, payload[index]]
                    }
                }

                return newArray
            })
        },
    )

    // Filters
    const rewardRangeFilter = useRef<RangeFilter>({
        label: "REWARD PER BLOCK",
        initialValue: rewardRanges,
        initialExpanded: true,
        onSetValue: (value: (number | undefined)[]) => {
            setRewardRanges(value)
        },
    })

    // Apply filter and sorting
    useEffect(() => {
        const filtered = repairJobs.filter((rj) => {
            const rewardPerBlock = new BigNumber(rj.sups_worth_per_block).shiftedBy(-18).toNumber()
            if (rewardRanges && rewardRanges[0] !== undefined && rewardPerBlock < rewardRanges[0]) return false
            if (rewardRanges && rewardRanges[1] !== undefined && rewardPerBlock > rewardRanges[1]) return false
            return true
        })

        let sorted = filtered
        if (sort === SortTypeLabel.EndTimeEndingLast) sorted = sorted.sort((a, b) => (a.expires_at < b.expires_at ? 1 : -1))
        if (sort === SortTypeLabel.EndTimeEndingSoon) sorted = sorted.sort((a, b) => (a.expires_at > b.expires_at ? 1 : -1))
        if (sort === SortTypeLabel.CreateTimeNewestFirst) sorted = sorted.sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
        if (sort === SortTypeLabel.CreateTimeOldestFirst) sorted = sorted.sort((a, b) => (a.created_at > b.created_at ? 1 : -1))
        if (sort === SortTypeLabel.RewardAmountHighest) sorted = sorted.sort((a, b) => (a.offered_sups_amount < b.offered_sups_amount ? 1 : -1))
        if (sort === SortTypeLabel.RewardAmountLowest) sorted = sorted.sort((a, b) => (a.offered_sups_amount > b.offered_sups_amount ? 1 : -1))

        setRepairJobsRender(sorted)

        updateQuery({
            sort,
            rewardRanges: rewardRanges.join("||"),
        })
    }, [sort, rewardRanges, updateQuery, setRepairJobsRender, repairJobs])

    const content = useMemo(() => {
        if (!repairJobsRender) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: theme.factionTheme.primary }} />
                    </Stack>
                </Stack>
            )
        }

        if (repairJobsRender && repairJobsRender.length > 0) {
            return (
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Stack>
                        <FlipMove>
                            {repairJobsRender.map((repairJob) => {
                                return (
                                    <div key={`repair-job-${repairJob.id}`} style={{ marginBottom: "1.3rem" }}>
                                        <RepairJobItem repairJob={repairJob} removeByID={removeByID} />
                                    </div>
                                )
                            })}
                        </FlipMove>
                    </Stack>
                </Box>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "40rem" }}>
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
                            userSelect: "text !important",
                            opacity: 0.9,
                            textAlign: "center",
                        }}
                    >
                        {"There are no repair jobs found, please try again."}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [removeByID, repairJobsRender, theme.factionTheme.primary])

    return (
        <Stack direction="row" sx={{ height: "100%" }}>
            <SortAndFilters rangeFilters={[rewardRangeFilter.current]} isExpanded={isFiltersExpanded} />

            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".3rem",
                }}
                opacity={0.7}
                backgroundColor={theme.factionTheme.background}
                sx={{ height: "100%", flex: 1 }}
            >
                <Stack sx={{ position: "relative", height: "100%" }}>
                    <PageHeader title="REPAIR JOBS" description="Damaged items will be sent here by the mech owners." imageUrl={WarMachineIconPNG} />

                    <TotalAndPageSizeOptions
                        countItems={repairJobsRender?.length}
                        totalItems={repairJobs.length}
                        pageSizeOptions={[10, 20, 30]}
                        sortOptions={sortOptions}
                        selectedSort={sort}
                        onSetSort={setSort}
                        isFiltersExpanded={isFiltersExpanded}
                        toggleIsFiltersExpanded={toggleIsFiltersExpanded}
                    />

                    <Stack sx={{ px: "1rem", py: "1rem", flex: 1 }}>
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
                            {content}
                        </Box>
                    </Stack>
                </Stack>
            </ClipThing>
        </Stack>
    )
}
