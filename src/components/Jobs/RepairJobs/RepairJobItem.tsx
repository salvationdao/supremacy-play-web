import { Box, Stack, Typography } from "@mui/material"
import { SvgCubes, SvgSupToken } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { supFormatterNoFixed, timeSinceInWords } from "../../../helpers"
import { useTimer } from "../../../hooks"
import { useGameServerSubscription } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { RepairOffer } from "../../../types/jobs"
import { FancyButton } from "../../Common/FancyButton"
import { Player } from "../../Common/Player"
import { RepairBlocks } from "../../Hangar/WarMachinesHangar/Common/MechRepairBlocks"
import { General } from "../../Marketplace/Common/MarketItem/General"

interface RepairJobStatus extends RepairOffer {
    blocks_repaired: number
    sups_worth_per_block: string
    working_agent_count: number
}

export const RepairJobItem = ({ repairJob, isGridView }: { repairJob: RepairOffer; isGridView?: boolean }) => {
    const theme = useTheme()

    const repairStatus = useGameServerSubscription<RepairJobStatus>({
        URI: `/public/repair_offer/${repairJob.id}`,
        key: GameServerKeys.SubRepairJobStatus,
    })

    const remainDamagedBlocks = repairStatus ? repairJob.blocks_total - repairStatus.blocks_repaired : 0
    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

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
                // TODO: onClick
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
                                    span: { color: colors.orange, fontFamily: "inherit" },
                                }}
                            >
                                <span>{remainDamagedBlocks}</span> BLOCKS REMAINING
                            </Typography>
                            <RepairBlocks defaultBlocks={repairJob.blocks_total} remainDamagedBlocks={remainDamagedBlocks} hideNumber />
                        </Stack>
                    </Stack>

                    <General
                        isGridView={isGridView}
                        title="ACTIVE AGENTS"
                        text={repairStatus?.working_agent_count.toString()}
                        textColor={!repairStatus?.working_agent_count ? colors.green : colors.orange}
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
                                {supFormatterNoFixed(repairStatus?.sups_worth_per_block || "0", 2)} / BLOCK
                            </Typography>
                        </Stack>
                    </General>

                    <General isGridView={isGridView} title="JOB OWNER">
                        <Player player={repairJob.job_owner} />
                    </General>

                    {repairStatus?.closed_at || repairJob.expires_at < new Date() ? (
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
            textColor={totalSecRemain < 180 ? colors.orange : "#FFFFFF"}
        />
    )
}
