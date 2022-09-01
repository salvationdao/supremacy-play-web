import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTheme } from "../../../../containers/theme"
import { getRarityDeets } from "../../../../helpers"
import { useTimer } from "../../../../hooks"
import { useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { MechDetails, RepairSlot } from "../../../../types"
import { ClipThing } from "../../../Common/ClipThing"
import { MechRepairBlocks } from "../Common/MechRepairBlocks"

export const RepairBayItem = ({ repairSlot, isBigVersion }: { repairSlot: RepairSlot; isBigVersion?: boolean }) => {
    const { mech_id, next_repair_time } = repairSlot
    const theme = useTheme()
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
        return <EmptyRepairBayItem isLoading isBigVersion={isBigVersion} />
    }

    const backgroundColor = theme.factionTheme.background
    const primaryColor = colors.bronze
    const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined
    const imageUrl = skin?.avatar_url || skin?.image_url || mechDetails.avatar_url || mechDetails.image_url

    return (
        <ClipThing clipSize="6px" opacity={0.8} border={{ borderColor: primaryColor }} backgroundColor={backgroundColor} sx={{ width: "100%" }}>
            <Stack
                direction={isBigVersion ? "column" : "row"}
                spacing="1.2rem"
                alignItems={isBigVersion ? "flex-start" : "center"}
                sx={{
                    position: "relative",
                    p: ".8rem 1rem",
                    borderRadius: 0.8,
                }}
            >
                {/* Mech image and deploy button */}
                <Box
                    sx={{
                        height: isBigVersion ? "16rem" : "8rem",
                        width: isBigVersion ? "100%" : "8rem",
                        overflow: "hidden",
                        background: `url(${imageUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        borderRadius: 0.3,
                    }}
                />

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
                                {mechDetails.name || "Unnamed"}
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

                        <Blocks
                            key={next_repair_time?.toISOString()}
                            mechID={mech_id}
                            defaultBlocks={mechDetails?.repair_blocks}
                            nextRepairTime={next_repair_time}
                        />
                    </Stack>
                </Stack>
            </Stack>
        </ClipThing>
    )
}

export const EmptyRepairBayItem = ({ isLoading, isBigVersion }: { isLoading?: boolean; isBigVersion?: boolean }) => {
    const theme = useTheme()

    const backgroundColor = theme.factionTheme.background
    const primaryColor = isLoading ? colors.bronze : backgroundColor

    return (
        <ClipThing
            clipSize="6px"
            opacity={0.6}
            border={{ borderColor: primaryColor }}
            backgroundColor={backgroundColor}
            sx={{ height: isBigVersion ? "100%" : "8rem", width: "100%" }}
        >
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

const Blocks = ({ mechID, defaultBlocks, nextRepairTime }: { mechID: string; defaultBlocks?: number; nextRepairTime?: Date }) => {
    const { totalSecRemain } = useTimer(nextRepairTime)
    const totalTimeDurationSec = useRef(nextRepairTime ? (nextRepairTime.getTime() - new Date().getTime()) / 1000 : 0)
    const pulsateEffectPercent = useRef(0)

    useEffect(() => {
        pulsateEffectPercent.current = totalTimeDurationSec.current ? 100 - Math.min(100, (100 * totalSecRemain) / totalTimeDurationSec.current) : 0
    }, [totalSecRemain])

    return (
        <Box>
            <MechRepairBlocks mechID={mechID} defaultBlocks={defaultBlocks} pulsateEffectPercent={pulsateEffectPercent.current} />
        </Box>
    )
}
