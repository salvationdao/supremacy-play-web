import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useMemo } from "react"
import { FancyButton } from "../../.."
import { useHangarWarMachine } from "../../../../containers/hangar/hangarWarMachines"
import { getRarityDeets } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"
import { MechModal } from "../Common/MechModal"

export const HistoryModal = () => {
    const { historyMechDetails, setHistoryMechDetails } = useHangarWarMachine()

    const rarityDeets = useMemo(() => getRarityDeets(historyMechDetails?.tier || ""), [historyMechDetails?.tier])

    const onClose = useCallback(() => {
        setHistoryMechDetails(undefined)
    }, [setHistoryMechDetails])

    if (!historyMechDetails) return null

    const { hash, name, label } = historyMechDetails

    return (
        <MechModal mechDetails={historyMechDetails} onClose={onClose}>
            <Stack spacing="1.5rem">sss</Stack>
        </MechModal>
    )
}
