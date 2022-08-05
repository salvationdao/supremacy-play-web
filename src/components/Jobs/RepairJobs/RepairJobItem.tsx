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
    isGridView,
    removeByID,
    repairJobModal,
    setRepairJobModal,
}: {
    repairJob: RepairJob
    isGridView?: boolean
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
        if (isFinished && repairJobModal) {
            setTimeout(() => {
                removeByID(repairJob.id)
            }, 5000)
        }
    }, [repairJobModal, isFinished, removeByID, repairJob.id])

    return (
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
                    opacity: 0.9,
                    border: { isFancy: !isGridView, borderColor: primaryColor, borderThickness: ".25rem" },
                    sx: { position: "relative", height: "100%" },
                }}
                sx={{ color: primaryColor, textAlign: "start", height: "100%", ":hover": { opacity: 1 } }}
                onClick={() => !isFinished && setRepairJobModal(repairJob)}
            >
                <Box
                    sx={{
                        position: "relative",
                        height: "100%",
                        p: isGridView ? ".5rem .6rem" : ".1rem .3rem",
                        display: isGridView ? "block" : "grid",
                        gridTemplateRows: "7rem",
                        gridTemplateColumns: `minmax(38rem, auto) 20rem 20rem 32rem 32rem`,
                        gap: "1.4rem",
                        ...(isGridView
                            ? {
                                  "&>*:not(:last-child)": {
                                      mb: "1rem",
                                  },
                              }
                            : {}),
                    }}
                >
                    <Stack spacing="1.8rem" direction="row" alignItems="center" sx={{ pl: ".5rem" }}>
                        <SvgCubes size="3.2rem" />
                        <Stack spacing=".6rem">
                            <Typography
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
                            <RepairBlocks defaultBlocks={repairJob.blocks_required_repair} remainDamagedBlocks={remainDamagedBlocks} hideNumber />
                        </Stack>
                    </Stack>

                    <General
                        isGridView={isGridView}
                        title="ACTIVE AGENTS"
                        text={repairJob.working_agent_count.toString()}
                        textColor={repairJob.working_agent_count <= 3 ? colors.green : colors.orange}
                    />

                    <General isGridView={isGridView} title="REWARD">
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

                    <General isGridView={isGridView} title="JOB OWNER">
                        <Box>
                            <Player player={repairJob.job_owner} />
                            {repairJob.offered_by_id === userID && <Typography sx={{ display: "inline", color: colors.neonBlue }}>&nbsp;(YOU)</Typography>}
                        </Box>
                    </General>

                    {isFinished ? (
                        <General isGridView={isGridView} title="TIME LEFT" text="EXPIRED" textColor={colors.lightGrey} />
                    ) : (
                        <CountdownGeneral isGridView={isGridView} endTime={repairJob.expires_at} />
                    )}
                </Box>

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
    )
}

const CountdownGeneral = ({ isGridView, endTime }: { isGridView?: boolean; endTime: Date }) => {
    const { totalSecRemain } = useTimer(endTime)

    return (
        <General
            isGridView={isGridView}
            title="TIME LEFT"
            text={timeSinceInWords(new Date(), new Date(new Date().getTime() + totalSecRemain * 1000)) + " left"}
            textColor={totalSecRemain < 300 ? colors.orange : "#FFFFFF"}
        />
    )
}
