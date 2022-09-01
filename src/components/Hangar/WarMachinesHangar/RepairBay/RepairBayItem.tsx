import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { useTheme } from "../../../../containers/theme"
import { getRarityDeets } from "../../../../helpers"
import { useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { MechDetails, RepairSlot } from "../../../../types"
import { ClipThing } from "../../../Common/ClipThing"
import { MechRepairBlocks } from "../Common/MechRepairBlocks"
import { MechThumbnail } from "../Common/MechThumbnail"

export const RepairBayItem = ({ repairSlot, isBigVersion }: { repairSlot: RepairSlot; isBigVersion?: boolean }) => {
    const { mech_id, repair_case_id, status, next_repair_time, slot_number } = repairSlot
    const [mechDetails, setMechDetails] = useState<MechDetails>()
    const rarityDeets = useMemo(() => getRarityDeets(mechDetails?.tier || ""), [mechDetails])

    // Get addition mech data
    useGameServerSubscriptionFaction<MechDetails>(
        {
            URI: `/mech/${mech_id}/brief_info`,
            key: GameServerKeys.GetMechDetails,
        },
        (payload) => {
            if (!payload) return
            setMechDetails(payload)
        },
    )

    if (!mechDetails) {
        return <EmptyRepairBayItem isLoading />
    }

    return (
        <Stack
            direction="row"
            spacing="1.2rem"
            alignItems="center"
            sx={{
                position: "relative",
                py: ".8rem",
                pl: ".5rem",
                pr: ".7rem",
                borderRadius: 0.8,
            }}
        >
            {/* Mech image and deploy button */}
            <Box sx={{ height: "8rem" }}>
                <MechThumbnail mech={mechDetails} mechDetails={mechDetails} smallSize />
            </Box>

            {/* Right side */}
            <Stack spacing="1.2rem" direction="row" alignItems="flex-start" sx={{ py: ".2rem", flex: 1 }}>
                <Stack sx={{ flex: 1 }}>
                    <Box sx={{ py: ".2rem", flex: 1 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                fontFamily: fonts.nostromoHeavy,
                                color: rarityDeets.color,
                            }}
                        >
                            {rarityDeets.label}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "1.8rem",
                                color: !mechDetails.name ? colors.grey : "#FFFFFF",
                                display: "-webkit-box",
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {mechDetails.name}
                        </Typography>
                    </Box>

                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            fontWeight: "fontWeightBold",
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {mechDetails.label}
                    </Typography>

                    <MechRepairBlocks mechID={mech_id} defaultBlocks={mechDetails?.repair_blocks} />
                </Stack>
            </Stack>
        </Stack>
    )
}

export const EmptyRepairBayItem = ({ isLoading }: { isLoading?: boolean }) => {
    const theme = useTheme()

    const backgroundColor = theme.factionTheme.background
    const primaryColor = isLoading ? colors.bronze : backgroundColor

    return (
        <ClipThing clipSize="6px" opacity={0.5} border={{ borderColor: primaryColor }} backgroundColor={backgroundColor} sx={{ height: "6rem" }}>
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                {isLoading ? (
                    <CircularProgress size="2rem" sx={{ color: theme.factionTheme.primary }} />
                ) : (
                    <Typography variant="body2" sx={{ textAlign: "center", color: colors.grey, fontFamily: fonts.nostromoBold }}>
                        Empty slot
                    </Typography>
                )}
            </Stack>
        </ClipThing>
    )
}
