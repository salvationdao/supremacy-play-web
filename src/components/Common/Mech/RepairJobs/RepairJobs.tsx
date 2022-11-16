import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useEffect, useMemo, useState } from "react"
import FlipMove from "react-flip-move"
import { EmptyWarMachinesPNG, SvgRepair } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { useArray } from "../../../../hooks"
import { useGameServerSubscriptionSecured } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { HeaderProps } from "../../../../routes"
import { colors, fonts } from "../../../../theme/theme"
import { RepairJob } from "../../../../types/jobs"
import { SortTypeLabel } from "../../../../types/marketplace"
import { TotalAndPageSizeOptions } from "../../Deprecated/TotalAndPageSizeOptions"
import { NiceButton } from "../../Nice/NiceButton"
import { NiceTooltip } from "../../Nice/NiceTooltip"
import { DoRepairModal } from "./DoRepairModal"
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
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Stack>
                        <FlipMove>
                            {repairJobsRender.map((repairJob) => {
                                return (
                                    <div key={`repair-job-${repairJob.id}`} style={{ marginBottom: "1.3rem" }}>
                                        <RepairJobItem
                                            repairJob={repairJob}
                                            removeByID={removeByID}
                                            repairJobModal={repairJobModal}
                                            setRepairJobModal={setRepairJobModal}
                                        />
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
                            height: "10rem",
                            opacity: 0.7,
                            filter: "grayscale(100%)",
                            background: `url(${EmptyWarMachinesPNG})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "bottom center",
                            backgroundSize: "contain",
                        }}
                    />
                    <Typography
                        variant="body2"
                        sx={{
                            px: "1.28rem",
                            pt: "1.28rem",
                            color: colors.grey,
                            fontFamily: fonts.nostromoBold,
                            textAlign: "center",
                        }}
                    >
                        Repair jobs will appear here.
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [removeByID, repairJobModal, repairJobsRender])

    const main = useMemo(
        () => (
            <Stack sx={{ position: "relative", height: "100%" }}>
                <TotalAndPageSizeOptions sortOptions={sortOptions} selectedSort={sort} onSetSort={setSort} />

                <Stack sx={{ px: "1rem", py: "1rem", flex: 1 }}>
                    <Box
                        sx={{
                            ml: ".5rem",
                            pr: ".5rem",
                            my: ".6rem",
                            flex: 1,
                            overflowY: "auto",
                            overflowX: "hidden",
                            direction: "ltr",
                        }}
                    >
                        {content}
                    </Box>
                </Stack>
            </Stack>
        ),
        [content, sort],
    )

    return (
        <>
            {main}
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

    return (
        <Stack
            spacing="1rem"
            direction="row"
            sx={{
                width: "100%",
                p: "1rem",
                alignItems: "center",
                backgroundColor: isOpen ? `#1B0313` : `#1c1424`,
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
                    <SvgRepair size="3rem" />
                </NiceButton>
            </NiceTooltip>
            <Typography
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    fontSize: "1.8rem",
                }}
            >
                Repair Jobs
            </Typography>
            <Box flex={1} />
            <Typography
                sx={{
                    color: repairJobs.length > 0 ? colors.lightGrey : colors.darkGrey,
                }}
            >
                {repairJobs.length} jobs
            </Typography>
        </Stack>
    )
}
RepairJobs.Header = Header
