import { Box } from "@mui/material"
import { StyledImageText } from "../.."
import { SvgDeath, SvgSkull2 } from "../../../assets"
import { WarMachineState } from "../../../types"

export interface KillAlertProps {
    destroyed_war_machine: WarMachineState
    killed_by_war_machine_id?: WarMachineState
    killed_by?: string
}

export const KillAlert = ({ data }: { data: KillAlertProps }) => {
    const { destroyed_war_machine, killed_by_war_machine_id, killed_by } = data

    if (!destroyed_war_machine) return null

    return (
        <Box>
            <StyledImageText
                text={
                    killed_by_war_machine_id
                        ? killed_by_war_machine_id.name || killed_by_war_machine_id.hash
                        : killed_by || "UNKNOWN"
                }
                color={killed_by_war_machine_id ? killed_by_war_machine_id.faction.theme.primary : "grey !important"}
                imageUrl={killed_by_war_machine_id ? killed_by_war_machine_id.imageAvatar : ""}
                imageMb={-0.3}
            />
            <SvgDeath size="1.1rem" sx={{ display: "inline", mx: ".48rem" }} />
            <SvgSkull2 size="1.1rem" sx={{ display: "inline", mr: ".64rem" }} />
            <StyledImageText
                text={destroyed_war_machine.name || destroyed_war_machine.hash}
                color={destroyed_war_machine.faction.theme.primary}
                imageUrl={destroyed_war_machine.imageAvatar}
                imageMb={-0.3}
            />
        </Box>
    )
}
