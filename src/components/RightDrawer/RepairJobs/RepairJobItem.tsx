import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo } from "react"
import { SvgCubes, SvgSupToken } from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"
import { supFormatterNoFixed, timeSinceInWords } from "../../../helpers"
import { useTimer } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { RepairJob } from "../../../types/jobs"
import { FancyButton } from "../../Common/FancyButton"
import { Player } from "../../Common/Player"
import { RepairBlocks } from "../../Hangar/WarMachinesHangar/Common/MechRepairBlocks"
import { General } from "../../Marketplace/Common/MarketItem/General"

export const RepairJobItem = ({
    repairJob,
    removeByID,
    repairJobModal,
    setRepairJobModal,
}: {
    repairJob: RepairJob
    removeByID: (id: string) => void
    repairJobModal?: RepairJob
    setRepairJobModal: React.Dispatch<React.SetStateAction<RepairJob | undefined>>
}) => {
    const { userID } = useAuth()
    const { getFaction } = useSupremacy()

    const jobOwnerFaction = useMemo(() => getFaction(repairJob.job_owner.faction_id), [getFaction, repairJob.job_owner.faction_id])

    const isFinished = repairJob.closed_at || repairJob.expires_at < new Date()
    const remainDamagedBlocks = repairJob.blocks_required_repair - repairJob.blocks_repaired
    const primaryColor = jobOwnerFaction.primary_color
    const backgroundColor = jobOwnerFaction.background_color

    useEffect(() => {
        if (isFinished && !repairJobModal) {
            setTimeout(() => {
                removeByID(repairJob.id)
            }, 10000) // Wait 10seconds before un-rendering the item, allows enough time for players to see why job was closed
        }
    }, [repairJobModal, isFinished, removeByID, repairJob.id])

    return useMemo(
        () => (
            <Box sx={{ position: "relative", overflow: "visible", height: "100%" }}>
                <FancyButton
                    disableRipple
                    clipThingsProps={{
                        clipSize: "7px",
                        clipSlantSize: "0px",
                        corners: {
                            topLeft: true,
                            topRight: true,
                            bottomLeft: true,
                            bottomRight: true,
                        },
                        backgroundColor: backgroundColor,
                        opacity: isFinished ? 0.6 : 0.9,
                        border: { borderColor: primaryColor, borderThickness: isFinished ? "0" : ".15rem" },
                        sx: { position: "relative", height: "100%" },
                    }}
                    sx={{ p: 0, color: primaryColor, textAlign: "start", height: "100%", ":hover": { opacity: 1 } }}
                    onClick={() => !isFinished && setRepairJobModal(repairJob)}
                >
                    <Stack spacing=".4rem" sx={{ position: "relative", height: "100%", p: "1rem 1.5rem" }}>
                        <Stack spacing="1.5rem" direction="row" alignItems="center" sx={{ pl: ".5rem", pb: ".6rem" }}>
                            <SvgCubes size="2.8rem" />
                            <Stack>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontFamily: fonts.nostromoBlack,
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        overflowWrap: "anywhere",
                                        textOverflow: "ellipsis",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        span: { color: colors.orange },
                                    }}
                                >
                                    <span>{remainDamagedBlocks}</span> BLOCKS REMAINING
                                </Typography>
                                <RepairBlocks size={7} defaultBlocks={repairJob.blocks_required_repair} remainDamagedBlocks={remainDamagedBlocks} hideNumber />
                            </Stack>
                        </Stack>

                        <General
                            isGridViewCompact={true}
                            title="ACTIVE WORKERS"
                            text={repairJob.working_agent_count.toString()}
                            textColor={repairJob.working_agent_count <= 3 ? colors.green : colors.orange}
                        />

                        <General isGridViewCompact={true} title="REWARD">
                            <Stack direction="row" alignItems="center">
                                <SvgSupToken size="1.8rem" fill={colors.yellow} />
                                <Typography
                                    sx={{
                                        fontWeight: "fontWeightBold",
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        overflowWrap: "anywhere",
                                        textOverflow: "ellipsis",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {supFormatterNoFixed(repairJob.sups_worth_per_block || "0", 2)} / BLOCK
                                </Typography>
                            </Stack>
                        </General>

                        <General isGridViewCompact={true} title="JOB OWNER">
                            <Box>
                                <Player player={repairJob.job_owner} />
                                {repairJob.offered_by_id === userID && <Typography sx={{ display: "inline", color: colors.neonBlue }}>&nbsp;(YOU)</Typography>}
                            </Box>
                        </General>

                        {isFinished ? (
                            <General
                                isGridViewCompact={true}
                                title="TIME LEFT"
                                text={repairJob ? `JOB ${repairJob.finished_reason}` : "EXPIRED"}
                                textColor={colors.lightGrey}
                            />
                        ) : (
                            <CountdownGeneral isGridViewCompact={true} endTime={repairJob.expires_at} />
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
                </FancyButton>
            </Box>
        ),
        [backgroundColor, isFinished, primaryColor, remainDamagedBlocks, repairJob, setRepairJobModal, userID],
    )
}

const CountdownGeneral = ({ isGridViewCompact, endTime }: { isGridViewCompact?: boolean; endTime: Date }) => {
    const { totalSecRemain } = useTimer(endTime)

    return (
        <General
            isGridViewCompact={isGridViewCompact}
            title="TIME LEFT"
            text={timeSinceInWords(new Date(), new Date(new Date().getTime() + totalSecRemain * 1000))}
            textColor={totalSecRemain < 300 ? colors.orange : "#FFFFFF"}
        />
    )
}
