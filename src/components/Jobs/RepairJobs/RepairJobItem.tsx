import { Box, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { SvgSupToken } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { supFormatterNoFixed, timeSinceInWords } from "../../../helpers"
import { useTimer } from "../../../hooks"
import { useGameServerSubscription } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { RepairOffer } from "../../../types/jobs"
import { FancyButton } from "../../Common/FancyButton"
import { General } from "../../Marketplace/Common/MarketItem/General"

interface RepairJobStatus extends RepairOffer {
    // closed_at?: Date
    // finished_reason?: string
    // expires_at: Date
    // blocks_total: number
    blocks_repaired: number
    sups_worth_per_block: string
    working_agent_count: number
}

export const RepairJobItem = ({ repairJob, isGridView }: { repairJob: RepairOffer; isGridView?: boolean }) => {
    const theme = useTheme()
    const [repairStatus, setRepairStatus] = useState<RepairJobStatus>()

    useGameServerSubscription<RepairJobStatus>(
        {
            URI: `/public/repair_offer/${repairJob.id}`,
            key: GameServerKeys.SubRepairJobStatus,
        },
        (payload) => {
            if (!payload) return
            setRepairStatus(payload)
        },
    )

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
                        gridTemplateColumns: `minmax(38rem, auto) 20rem 20rem 32rem`,
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
                    <Box />

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

                    {repairStatus?.closed_at ? (
                        <General isGridView={isGridView} title="TIME LEFT" text="EXPIRED" />
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
