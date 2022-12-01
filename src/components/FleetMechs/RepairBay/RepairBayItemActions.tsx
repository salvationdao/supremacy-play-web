import { Stack } from "@mui/material"
import { MutableRefObject } from "react"
import { SvgDelete, SvgDownArrow, SvgUpArrow } from "../../../assets"
import { RepairSlot } from "../../../types"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NicePopover } from "../../Common/Nice/NicePopover"

export const RepairBayItemActions = ({
    open,
    popoverRef,
    onClose,
    repairSlot,
    aboveSlot,
    belowSlot,
    removeRepairBay,
    swapRepairBay,
}: {
    open: boolean
    popoverRef: MutableRefObject<null>
    onClose: () => void
    repairSlot: RepairSlot
    aboveSlot?: RepairSlot
    belowSlot?: RepairSlot
    removeRepairBay?: (mechIDs: string[]) => Promise<void>
    swapRepairBay?: (mechIDs: [string, string]) => Promise<void>
}) => {
    const { mech_id } = repairSlot

    return (
        <NicePopover
            open={open}
            anchorEl={popoverRef.current}
            onClose={onClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        >
            <Stack>
                {aboveSlot && swapRepairBay && (
                    <NiceButton
                        sx={{ justifyContent: "flex-start" }}
                        onClick={() => {
                            swapRepairBay([mech_id, aboveSlot.mech_id])
                            onClose()
                        }}
                    >
                        <SvgUpArrow inline size="1.4rem" /> MOVE UP
                    </NiceButton>
                )}

                {belowSlot && swapRepairBay && (
                    <NiceButton
                        sx={{ justifyContent: "flex-start" }}
                        onClick={() => {
                            swapRepairBay([mech_id, belowSlot.mech_id])
                            onClose()
                        }}
                    >
                        <SvgDownArrow inline size="1.4rem" /> MOVE DOWN
                    </NiceButton>
                )}

                {removeRepairBay && (
                    <NiceButton
                        sx={{ justifyContent: "flex-start" }}
                        onClick={() => {
                            removeRepairBay([mech_id])
                        }}
                    >
                        <SvgDelete inline size="1.4rem" /> REMOVE
                    </NiceButton>
                )}
            </Stack>
        </NicePopover>
    )
}
