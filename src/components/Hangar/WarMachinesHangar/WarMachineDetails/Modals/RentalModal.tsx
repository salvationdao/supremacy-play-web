import { Stack } from "@mui/material"
import { useCallback } from "react"
import { MechModal } from "../../Common/MechModal"
import { MechDetails } from "../../../../../types"

export const RentalModal = ({
    selectedMechDetails: rentalMechDetails,
    rentalMechModalOpen,
    setRentalMechModalOpen,
}: {
    selectedMechDetails: MechDetails
    rentalMechModalOpen: boolean
    setRentalMechModalOpen: (close: boolean) => void
}) => {
    // // Fetch
    // const { send } = useGameServerCommandsYYY("xxxxxxxxx")

    // useEffect(() => {
    //     ;(async () => {
    //         try {
    //             const resp = await send<RESPONSE_TYPE>(GameServerKeys.XXXXXX, {
    //                 payload: something,
    //             })

    //             if (!resp) return
    //             setFactionsData(resp)
    //         } catch (e) {
    //             console.error(e)
    //         }
    //     })()
    // }, [send])

    // // Subscription
    // const payload = useGameServerSubscriptionYYY<RESPONSE_TYPE>({
    //     URI: "/xxxxxxxxx",
    //     key: GameServerKeys.SomeKey,
    // })

    // useGameServerSubscriptionYYY<RESPONSE_TYPE>(
    //     {
    //         URI: "/xxxxxxxxx",
    //         key: GameServerKeys.SomeKey,
    //     },
    //     (payload) => {
    //         if (!payload) return
    //         setState(payload)
    //     },
    // )

    const onClose = useCallback(() => {
        setRentalMechModalOpen(false)
    }, [setRentalMechModalOpen])

    if (!rentalMechDetails) return null

    const { hash, name, label } = rentalMechDetails

    return (
        <MechModal open={rentalMechModalOpen} mechDetails={rentalMechDetails} onClose={onClose}>
            <Stack spacing="1.5rem">
                hash: {hash}
                name: {name}
                label: {label}
            </Stack>
        </MechModal>
    )
}
