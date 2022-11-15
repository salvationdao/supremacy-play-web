import { IconButton, Popover, Stack } from "@mui/material"
import { MutableRefObject, useEffect } from "react"
import { SvgDelete, SvgDownArrow, SvgUpArrow } from "../../../../assets"
import { useToggle } from "../../../../hooks"
import { colors } from "../../../../theme/theme"
import { RepairSlot } from "../../../../types"
import { ClipThing } from "../../../Common/Deprecated/ClipThing"

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
    const [localOpen, toggleLocalOpen] = useToggle(open)

    const { mech_id } = repairSlot

    useEffect(() => {
        if (!localOpen) {
            const timeout = setTimeout(() => {
                onClose()
            }, 300)

            return () => clearTimeout(timeout)
        }
    }, [localOpen, onClose])

    return (
        <Popover
            open={localOpen}
            anchorEl={popoverRef.current}
            onClose={() => toggleLocalOpen(false)}
            anchorOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        >
            <ClipThing
                clipSize="5px"
                border={{
                    borderColor: colors.bronze,
                    borderThickness: ".2rem",
                }}
                backgroundColor={colors.darkNavy}
            >
                <Stack justifyContent="center" sx={{ p: "1rem 1.3rem" }}>
                    {aboveSlot && swapRepairBay && (
                        <IconButton
                            size="small"
                            onClick={() => {
                                toggleLocalOpen(false)
                                swapRepairBay([mech_id, aboveSlot.mech_id])
                            }}
                        >
                            <SvgUpArrow size="1.4rem" />
                        </IconButton>
                    )}

                    {belowSlot && swapRepairBay && (
                        <IconButton
                            size="small"
                            onClick={() => {
                                toggleLocalOpen(false)
                                swapRepairBay([mech_id, belowSlot.mech_id])
                            }}
                        >
                            <SvgDownArrow size="1.4rem" />
                        </IconButton>
                    )}

                    {removeRepairBay && (
                        <IconButton size="small" onClick={() => removeRepairBay([mech_id])}>
                            <SvgDelete size="1.4rem" fill={colors.red} />
                        </IconButton>
                    )}
                </Stack>
            </ClipThing>
        </Popover>
    )
}
