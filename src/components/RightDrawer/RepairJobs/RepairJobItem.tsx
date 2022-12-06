import { Box, Stack, Typography } from "@mui/material"
import React, { useEffect, useMemo } from "react"
import { useTimer } from "use-timer"
import { SvgCubes, SvgSupToken } from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"
import { supFormatter, timeSinceInWords, truncateTextLines } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { RepairJob } from "../../../types/jobs"
import { RepairBlocks } from "../../Common/Mech/MechRepairBlocks"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { PlayerNameGid } from "../../Common/PlayerNameGid"
import { TypographyTruncated } from "../../Common/TypographyTruncated"
import { General } from "../../Marketplace/Common/MarketItem/General"

interface RepairJobItemProps {
    repairJob: RepairJob
    removeByID: (id: string) => void
    repairJobModal?: RepairJob
    setRepairJobModal: React.Dispatch<React.SetStateAction<RepairJob | undefined>>
}

const propsAreEqual = (prevProps: RepairJobItemProps, nextProps: RepairJobItemProps) => {
    return (
        prevProps.repairJobModal?.id === nextProps.repairJobModal?.id &&
        prevProps.repairJobModal?.working_agent_count === nextProps.repairJobModal?.working_agent_count &&
        prevProps.repairJobModal?.blocks_repaired === nextProps.repairJobModal?.blocks_repaired &&
        prevProps.repairJobModal?.closed_at === nextProps.repairJobModal?.closed_at &&
        prevProps.repairJob.id === nextProps.repairJob.id &&
        prevProps.repairJob.working_agent_count === nextProps.repairJob.working_agent_count &&
        prevProps.repairJob.blocks_repaired === nextProps.repairJob.blocks_repaired &&
        prevProps.repairJob.closed_at === nextProps.repairJob.closed_at
    )
}

export const RepairJobItem = React.memo(function RepairJobItem({ repairJob, removeByID, repairJobModal, setRepairJobModal }: RepairJobItemProps) {
    const { userID } = useAuth()
    const { getFaction } = useSupremacy()

    const jobOwnerFaction = useMemo(() => getFaction(repairJob.job_owner.faction_id), [getFaction, repairJob.job_owner.faction_id])

    const isFinished = repairJob.closed_at || repairJob.expires_at < new Date()
    const remainDamagedBlocks = repairJob.blocks_required_repair - repairJob.blocks_repaired
    const primaryColor = jobOwnerFaction.palette.primary
    const backgroundColor = jobOwnerFaction.palette.background

    useEffect(() => {
        if (isFinished && !repairJobModal) {
            setTimeout(() => {
                removeByID(repairJob.id)
            }, 10000) // Wait 10seconds before un-rendering the item, allows enough time for players to see why job was closed
        }
    }, [repairJobModal, isFinished, removeByID, repairJob.id])

    return useMemo(
        () => (
            <NiceButton
                disableAutoColor
                disabled={true}
                sx={{ position: "relative", width: "99%", height: "100%", border: `${primaryColor}AA 1px solid` }}
                onClick={() => !isFinished && setRepairJobModal(repairJob)}
            >
                <Stack sx={{ position: "relative", width: "100%", height: "100%", p: "1rem 1.5rem" }}>
                    <Stack spacing="1.5rem" direction="row" alignItems="center" sx={{ pl: ".5rem", pb: ".6rem" }}>
                        <SvgCubes size="2.8rem" />
                        <Stack>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: fonts.nostromoBlack,
                                    ...truncateTextLines(2),
                                    span: { color: colors.orange },
                                }}
                            >
                                <span>{remainDamagedBlocks}</span> BLOCKS REMAINING
                            </Typography>
                            <RepairBlocks size={7} defaultBlocks={repairJob.blocks_required_repair} remainDamagedBlocks={remainDamagedBlocks} />
                        </Stack>
                    </Stack>

                    <General
                        isGridViewCompact={true}
                        title="ACTIVE WORKERS"
                        text={repairJob.working_agent_count.toString()}
                        textColor={repairJob.working_agent_count <= remainDamagedBlocks ? colors.green : colors.orange}
                    />

                    <General isGridViewCompact={true} title="REWARD">
                        <Stack direction="row" alignItems="center">
                            <SvgSupToken size="1.8rem" fill={colors.yellow} />
                            <TypographyTruncated sx={{ fontWeight: "bold" }}>
                                {supFormatter(repairJob.sups_worth_per_block || "0", 2)} / BLOCK
                            </TypographyTruncated>
                        </Stack>
                    </General>

                    <General isGridViewCompact={true} title="JOB OWNER">
                        <Stack direction="row" alignItems="center">
                            <PlayerNameGid player={repairJob.job_owner} />
                            {repairJob.offered_by_id === userID && <Typography sx={{ display: "inline", color: colors.neonBlue }}>&nbsp;(YOU)</Typography>}
                        </Stack>
                    </General>

                    {isFinished ? (
                        <General
                            isGridViewCompact={true}
                            title="TIME LEFT"
                            text={repairJob ? `JOB ${repairJob.finished_reason}` : "EXPIRED"}
                            textColor={colors.lightGrey}
                        />
                    ) : (
                        <CountdownGeneral isGridViewCompact={true} initialTime={(repairJob.expires_at.getTime() - new Date().getTime()) / 1000} />
                    )}
                </Stack>

                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: `linear-gradient(to top, #FFFFFF08, ${backgroundColor}90)`,
                        zIndex: -1,
                    }}
                />
            </NiceButton>
        ),
        [backgroundColor, isFinished, primaryColor, remainDamagedBlocks, repairJob, setRepairJobModal, userID],
    )
}, propsAreEqual)

const CountdownGeneral = ({ isGridViewCompact, initialTime }: { isGridViewCompact?: boolean; initialTime: number }) => {
    const { time } = useTimer({
        autostart: true,
        initialTime: Math.round(initialTime),
        endTime: 0,
        timerType: "DECREMENTAL",
    })

    return (
        <General
            isGridViewCompact={isGridViewCompact}
            title="TIME LEFT"
            text={timeSinceInWords(new Date(), new Date(new Date().getTime() + time * 1000))}
            textColor={time < 300 ? colors.orange : "#FFFFFF"}
        />
    )
}
