import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useEffect, useMemo, useState } from "react"
import { SvgRepair } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { useArray } from "../../../hooks"
import { useGameServerSubscriptionSecured } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { HeaderProps } from "../../../routes"
import { colors, fonts } from "../../../theme/theme"
import { RepairJob } from "../../../types/jobs"
import { SortTypeLabel } from "../../../types/marketplace"
import { DoRepairModal } from "../../Common/Mech/RepairModal/DoRepairModal"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceSelect } from "../../Common/Nice/NiceSelect"
import { NiceTooltip } from "../../Common/Nice/NiceTooltip"
import { VirtualizedGrid } from "../../Common/VirtualizedGrid"
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
    const [repairJobModal, setRepairJobModal] = useState<RepairJob>()

    // Items
    const { value: repairJobs, setValue: setRepairJobs, removeByID } = useArray<RepairJob>([], "id")
    const [repairJobsRender, setRepairJobsRender] = useState<RepairJob[]>([])

    // Filters and sorts
    const [sort, setSort] = useState<string>(SortTypeLabel.RewardAmountHighest)

    useGameServerSubscriptionSecured<RepairJob[]>(
        {
            URI: "/repair_offer/update",
            key: GameServerKeys.SubRepairJobListUpdated,
        },
        (payload) => {
            if (!payload || payload.length <= 0) return

            setRepairJobs((prev) => {
                prev = prev.map((rj) => payload.find((p) => p.id === rj.id) || rj)
                payload.forEach((p) => (prev.some((rj) => rj.id === p.id) ? undefined : prev.push(p)))
                return prev.filter((rj) => !rj.closed_at && rj.expires_at > new Date())
            })
        },
    )

    // Apply filter and sorting
    useEffect(() => {
        let sorted = [...repairJobs]
        if (sort === SortTypeLabel.EndTimeEndingLast) sorted = sorted.sort((a, b) => (a.expires_at < b.expires_at ? 1 : -1))
        if (sort === SortTypeLabel.EndTimeEndingSoon) sorted = sorted.sort((a, b) => (a.expires_at > b.expires_at ? 1 : -1))
        if (sort === SortTypeLabel.CreateTimeNewestFirst) sorted = sorted.sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
        if (sort === SortTypeLabel.CreateTimeOldestFirst) sorted = sorted.sort((a, b) => (a.created_at > b.created_at ? 1 : -1))
        if (sort === SortTypeLabel.RewardAmountHighest)
            sorted = sorted.sort((a, b) => (new BigNumber(a.sups_worth_per_block).isLessThan(new BigNumber(b.sups_worth_per_block)) ? 1 : -1))
        if (sort === SortTypeLabel.RewardAmountLowest)
            sorted = sorted.sort((a, b) => (new BigNumber(a.sups_worth_per_block).isGreaterThan(new BigNumber(b.sups_worth_per_block)) ? 1 : -1))

        setRepairJobsRender(sorted)
    }, [sort, setRepairJobsRender, repairJobs])

    const renderIndex = useCallback(
        (index) => {
            const repairJob = repairJobsRender[index]
            if (!repairJob) {
                return null
            }
            return <RepairJobItem repairJob={repairJob} removeByID={removeByID} repairJobModal={repairJobModal} setRepairJobModal={setRepairJobModal} />
        },
        [removeByID, repairJobModal, repairJobsRender],
    )

    const content = useMemo(() => {
        if (!repairJobsRender) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress />
                    </Stack>
                </Stack>
            )
        }

        if (repairJobsRender && repairJobsRender.length > 0) {
            return (
                <VirtualizedGrid
                    uniqueID="repair-jobs"
                    itemWidthConfig={{ columnCount: 1 }}
                    itemHeight={19}
                    gap={1}
                    totalItems={repairJobsRender.length}
                    renderIndex={renderIndex}
                />
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", p: "1rem" }}>
                <Typography
                    variant="body2"
                    sx={{
                        color: colors.grey,
                        fontFamily: fonts.nostromoBold,
                        textAlign: "center",
                    }}
                >
                    Repair jobs will appear here
                </Typography>
            </Stack>
        )
    }, [renderIndex, repairJobsRender])

    return (
        <>
            <Stack sx={{ position: "relative", height: "100%" }}>
                {/* Sort */}
                <NiceSelect label="Sort:" options={sortOptions} selected={sort} onSelected={(value) => setSort(`${value}`)} sx={{}} />

                <Box sx={{ p: "1rem", flex: 1 }}>{content}</Box>
            </Stack>

            {repairJobModal && <DoRepairModal repairJob={repairJobModal} onClose={() => setRepairJobModal(undefined)} />}
        </>
    )
}

const Header = ({ isOpen, onClose }: HeaderProps) => {
    const theme = useTheme()
    const [repairJobs, setRepairJobs] = useState<RepairJob[]>([])

    useGameServerSubscriptionSecured<RepairJob[]>(
        {
            URI: "/repair_offer/update",
            key: GameServerKeys.SubRepairJobListUpdated,
        },
        (payload) => {
            if (!payload) return

            setRepairJobs((prev) => {
                prev = prev.map((rj) => payload.find((p) => p.id === rj.id) || rj)
                payload.forEach((p) => (prev.some((rj) => rj.id === p.id) ? undefined : prev.push(p)))
                return prev.filter((rj) => !rj.closed_at && rj.expires_at > new Date())
            })
        },
    )

    return (
        <Stack
            spacing="1rem"
            direction="row"
            sx={{
                width: "100%",
                p: "1rem",
                alignItems: "center",
                opacity: isOpen ? 1 : 0.7,
                background: isOpen ? `linear-gradient(${theme.factionTheme.s500}70 26%, ${theme.factionTheme.s600})` : theme.factionTheme.s800,
                transition: "background-color .2s ease-out",
            }}
        >
            <NiceTooltip text="Repair Jobs" placement="left">
                <NiceButton
                    onClick={onClose}
                    buttonColor={theme.factionTheme.primary}
                    corners
                    sx={{
                        p: ".8rem",
                        pb: ".6rem",
                    }}
                >
                    <SvgRepair size="2.6rem" />
                </NiceButton>
            </NiceTooltip>

            <Typography sx={{ fontFamily: fonts.nostromoBlack, fontSize: "1.6rem" }}>Repair Jobs</Typography>

            <Box flex={1} />

            <Typography>{repairJobs.length} jobs</Typography>
        </Stack>
    )
}
RepairJobs.Header = Header
