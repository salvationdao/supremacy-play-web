import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTimer } from "use-timer"
import { SvgMoreOptions, SvgUserDiamond } from "../../../assets"
import { useSupremacy } from "../../../containers"
import { useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { TruncateTextLines } from "../../../theme/styles"
import { colors, fonts } from "../../../theme/theme"
import { MechDetails, RepairSlot } from "../../../types"
import { MechRepairBlocks } from "../../Common/Mech/MechRepairBlocks"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"
import { NiceButton } from "../../Common/Nice/NiceButton"
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
    const { getFaction } = useSupremacy()
    const [mechDetails, setMechDetails] = useState<MechDetails>()
    const [isActionsPopoverOpen, setIsActionsPopoverOpen] = useState(false)
    const { mech_id, next_repair_time } = repairSlot

    const ownerFaction = useMemo(() => getFaction(mechDetails?.user.faction_id), [getFaction, mechDetails?.user.faction_id])

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

    const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined
    const imageUrl = skin?.avatar_url || skin?.image_url || mechDetails.avatar_url || mechDetails.image_url

    return (
        <>
            <NiceBoxThing
                border={{
                    color: "#FFFFFF20",
                    thickness: "very-lean",
                }}
                background={{ colors: ["#FFFFFF", "#FFFFFF"], opacity: 0.06 }}
                sx={{ width: "100%", height: isBigVersion ? "100%" : "unset" }}
            >
                <Stack
                    direction={isBigVersion ? "column-reverse" : "row"}
                    spacing="1.2rem"
                    alignItems="stretch"
                    sx={{ p: ".8rem 1rem", borderRadius: 0.8, height: "100%" }}
                >
                    {/* Mech image */}
                    <NiceBoxThing
                        border={{ color: `#FFFFFF20`, thickness: "very-lean" }}
                        background={{ colors: [colors.darkerNavy] }}
                        sx={{
                            height: isBigVersion ? "16rem" : "unset",
                            width: isBigVersion ? "100%" : "8rem",
                            boxShadow: 0.4,
                        }}
                    >
                        <Box
                            component="img"
                            src={imageUrl}
                            sx={{
                                height: "100%",
                                width: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                        />
                    </NiceBoxThing>

                    {/* Right side */}
                    <Stack sx={{ position: "relative", flex: 1 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: fonts.nostromoBlack,
                                fontWeight: "bold",
                                ...TruncateTextLines(1),
                            }}
                        >
                            {mechDetails.name || mechDetails.label}
                        </Typography>

                        <Stack sx={{ flex: 1, mt: ".3rem" }} direction={isBigVersion ? "row" : "column"}>
                            <Typography
                                variant="h6"
                                sx={{
                                    flex: 1,
                                    color: ownerfaction.palette.primary,
                                    fontWeight: "bold",
                                    ...TruncateTextLines(1),
                                }}
                            >
                                <SvgUserDiamond size="2.2rem" inline fill={ownerfaction.palette.primary} /> {mechDetails.user.username}#{mechDetails.user.gid}
                            </Typography>

                            <Blocks
                                key={next_repair_time?.toISOString()}
                                mechID={mech_id}
                                defaultBlocks={mechDetails?.repair_blocks}
                                nextRepairTime={next_repair_time}
                            />
                        </Stack>

                        <Box ref={popoverRef} sx={{ position: "absolute", right: "-.5rem", top: ".2rem" }}>
                            <NiceButton sx={{ p: 0 }} onClick={() => setIsActionsPopoverOpen(true)}>
                                <SvgMoreOptions size="1.6rem" />
                            </NiceButton>
                        </Box>
                    </Stack>
                </Stack>
            </NiceBoxThing>

            <RepairBayItemActions
                open={isActionsPopoverOpen}
                onClose={() => setIsActionsPopoverOpen(false)}
                popoverRef={popoverRef}
                repairSlot={repairSlot}
                aboveSlot={aboveSlot}
                belowSlot={belowSlot}
                removeRepairBay={removeRepairBay}
                swapRepairBay={swapRepairBay}
            />
        </>
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

    return <MechRepairBlocks mechID={mechID} defaultBlocks={defaultBlocks} pulsateEffectPercent={pulsateEffectPercent.current} sx={{ width: "unset" }} />
}

export const EmptyRepairBayItem = ({ isBigVersion }: { isLoading?: boolean; isBigVersion?: boolean }) => {
    return (
        <Stack
            justifyContent="center"
            sx={{
                border: "#FFFFFF80 1px dashed",
                backgroundColor: "#FFFFFF10",
                height: isBigVersion ? "100%" : "8rem",
                width: "100%",
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    color: colors.grey,
                    textAlign: "center",
                    fontFamily: fonts.nostromoBold,
                }}
            >
                {isBigVersion ? "Select mechs to add to the repair bay." : "Empty slot"}
            </Typography>
        </Stack>
    )
}
