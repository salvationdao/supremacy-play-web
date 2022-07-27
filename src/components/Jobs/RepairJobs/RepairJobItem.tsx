import { Box } from "@mui/material"
import { useState } from "react"
import { useTheme } from "../../../containers/theme"
import { useGameServerSubscription } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { RepairOffer } from "../../../types/jobs"
import { FancyButton } from "../../Common/FancyButton"
import { General } from "../../Marketplace/Common/MarketItem/General"

interface RepairJobStatus {
    id: string
    offered_by_id: string
    closed_at?: Date
    finished_reason?: string
    blocks_total: number
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
    const secondaryColor = theme.factionTheme.secondary
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
                        gridTemplateColumns: `minmax(38rem, auto) 20rem 32rem`,
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
                    {/* <MechCommonArea isGridView={isGridView} mech={mech} mechDetails={mechDetails} primaryColor={primaryColor} secondaryColor={secondaryColor} /> */}

                    <General isGridView={isGridView} title="STATUS">
                        {/* <MechGeneralStatus mechID={mech.id} hideBox smallVersion /> */}
                    </General>
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
