import { useState } from "react"
import { createContainer } from "unstated-next"
import { MechDetails } from "../../types"

export const HangarWarMachineContainer = createContainer(() => {
    // Mech selection
    const [selectedMechDetails, setSelectedMechDetails] = useState<MechDetails>()
    const [deployMechDetails, setDeployMechDetails] = useState<MechDetails>()
    const [leaveMechDetails, setLeaveMechDetails] = useState<MechDetails>()
    const [historyMechDetails, setHistoryMechDetails] = useState<MechDetails>()
    const [rentalMechDetails, setRentalMechDetails] = useState<MechDetails>()
    const [sellMechDetails, setSellMechDetails] = useState<MechDetails>()

    return {
        // Mech viewer
        selectedMechDetails,
        setSelectedMechDetails,
        deployMechDetails,
        setDeployMechDetails,
        leaveMechDetails,
        setLeaveMechDetails,
        historyMechDetails,
        setHistoryMechDetails,
        rentalMechDetails,
        setRentalMechDetails,
        sellMechDetails,
        setSellMechDetails,
    }
})

export const HangarWarMachineProvider = HangarWarMachineContainer.Provider
export const useHangarWarMachine = HangarWarMachineContainer.useContainer
