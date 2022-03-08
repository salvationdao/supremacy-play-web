import { Box } from "@mui/material"
import { StyledImageText } from "../.."
import { SvgDeath, SvgSkull2 } from "../../../assets"
import { WarMachineState } from "../../../types"

interface KillAlertProps {
    destroyedWarMachine: WarMachineState
    killedByWarMachine?: WarMachineState
    killedBy?: string
}

export const KillAlert = ({ data }: { data: KillAlertProps }) => {
    const { destroyedWarMachine, killedByWarMachine, killedBy } = data

    return (
        <Box>
            <StyledImageText
                text={killedByWarMachine ? killedByWarMachine.name : killedBy || "UNKNOWN"}
                color={killedByWarMachine ? killedByWarMachine.faction.theme.primary : "grey !important"}
                imageUrl={killedByWarMachine ? killedByWarMachine.imageAvatar : ""}
            />
            <SvgDeath size="11px" sx={{ display: "inline", mx: 0.6 }} />
            <SvgSkull2 size="11px" sx={{ display: "inline", mr: 0.8 }} />
            <StyledImageText
                text={destroyedWarMachine.name}
                color={destroyedWarMachine.faction.theme.primary}
                imageUrl={destroyedWarMachine.imageAvatar}
            />
        </Box>
    )
}
