import { Stack } from "@mui/material"
import { useCallback } from "react"
import { useHangarWarMachine } from "../../../../containers/hangar/hangarWarMachines"
import { MechModal } from "../Common/MechModal"

export const RentalModal = () => {
    const { rentalMechDetails, setRentalMechDetails } = useHangarWarMachine()

    const onClose = useCallback(() => {
        setRentalMechDetails(undefined)
    }, [setRentalMechDetails])

    if (!rentalMechDetails) return null

    const { hash, name, label } = rentalMechDetails

    return (
        <MechModal mechDetails={rentalMechDetails} onClose={onClose}>
            <Stack spacing="1.5rem">
                hash: {hash}
                name: {name}
                label: {label}
            </Stack>
        </MechModal>
    )
}
