import { Box, CircularProgress, IconButton, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTimer } from "use-timer"
import { SvgMoreOptions } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { getRarityDeets } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { TruncateTextLines } from "../../../../theme/styles"
import { colors, fonts } from "../../../../theme/theme"
import { MechDetails, RepairSlot } from "../../../../types"
import { ClipThing } from "../../../Common/Deprecated/ClipThing"
import { MechRepairBlocks } from "../Common/MechRepairBlocks"
import { RepairBayItemActions } from "./RepairBayItemActions"

export const RepairBayItem = ({
    repairSlot,
    isBigVersion,
    aboveSlot,
    belowSlot,
    removeRepairBay,
    swapRepairBay,
}: {
    repairSlot: RepairSlot
    isBigVersion?: boolean
    aboveSlot?: RepairSlot
    belowSlot?: RepairSlot
    removeRepairBay?: (mechIDs: string[]) => Promise<void>
    swapRepairBay?: (mechIDs: [string, string]) => Promise<void>
}) => {
    const popoverRef = useRef(null)
    const { mech_id, next_repair_time } = repairSlot
    const theme = useTheme()
    const [mechDetails, setMechDetails] = useState<MechDetails>()
    const rarityDeets = useMemo(() => getRarityDeets(mechDetails?.tier || ""), [mechDetails])
    const [isActionsPopoverOpen, toggleIsActionsPopoverOpen] = useToggle(false)

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
        <>
            <ClipThing clipSize="6px" opacity={0.8} border={{ borderColor: primaryColor }} backgroundColor={backgroundColor} sx={{ width: "100%" }}>
                <Stack
                    direction={isBigVersion ? "column" : "row"}
                    spacing="1.2rem"
                    alignItems={isBigVersion ? "stretch" : "center"}
                    sx={{ position: "relative", p: ".8rem 1rem", borderRadius: 0.8 }}
                >
                    {/* Mech image */}
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
                    <Stack spacing="1.2rem" direction="row" alignItems="flex-start" sx={{ position: "relative", py: ".2rem", flex: 1 }}>
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
                                        ...TruncateTextLines(1),
                                    }}
                                >
                                    {mechDetails.name || "Unnamed"}
                                </Typography>
                            </Box>

                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: fonts.nostromoBlack,
                                    fontWeight: "bold",
                                    ...TruncateTextLines(1),
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

                        <Box ref={popoverRef} sx={{ position: "absolute", right: "0rem", top: "0rem", backgroundColor: "#000000", borderRadius: "50%" }}>
                            <IconButton size="small" onClick={() => toggleIsActionsPopoverOpen()}>
                                <SvgMoreOptions size="1.4rem" />
                            </IconButton>
                        </Box>
                    </Stack>
                </Stack>
            </ClipThing>

            {isActionsPopoverOpen && (
                <RepairBayItemActions
                    open={isActionsPopoverOpen}
                    onClose={() => toggleIsActionsPopoverOpen(false)}
                    popoverRef={popoverRef}
                    repairSlot={repairSlot}
                    aboveSlot={aboveSlot}
                    belowSlot={belowSlot}
                    removeRepairBay={removeRepairBay}
                    swapRepairBay={swapRepairBay}
                />
            )}
        </>
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
                    <CircularProgress size="2rem" />
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
    const { time } = useTimer({
        autostart: true,
        initialTime: ((nextRepairTime || new Date()).getTime() - new Date().getTime()) / 1000,
        endTime: 0,
        timerType: "DECREMENTAL",
    })

    const totalTimeDurationSec = useRef(nextRepairTime ? (nextRepairTime.getTime() - new Date().getTime()) / 1000 : 0)
    const pulsateEffectPercent = useRef(0)

    useEffect(() => {
        pulsateEffectPercent.current = totalTimeDurationSec.current ? 100 - Math.max(0, (100 * time) / totalTimeDurationSec.current) : 0
    }, [time])

    return <MechRepairBlocks mechID={mechID} defaultBlocks={defaultBlocks} pulsateEffectPercent={pulsateEffectPercent.current} />
}
