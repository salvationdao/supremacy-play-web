import { Box } from "@mui/material"
import { StyledImageText } from ".."
import { SvgSkull2 } from "../../assets"
import { colors } from "../../theme/theme"
import { WarMachineState } from "../../types"
import { SvgDeath } from "../GameBar/assets"

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
                imageUrl={killedByWarMachine ? killedByWarMachine.imageUrl : ""}
            />
            <SvgDeath size="11px" fill={colors.text} sx={{ display: "inline", mx: 0.6 }} />
            <SvgSkull2 size="11px" sx={{ display: "inline", mr: 0.8 }} />
            <StyledImageText
                text={destroyedWarMachine.name}
                color={destroyedWarMachine.faction.theme.primary}
                imageUrl={destroyedWarMachine.imageUrl}
            />
        </Box>
    )
}
