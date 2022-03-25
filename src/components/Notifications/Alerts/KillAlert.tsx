import { Box } from "@mui/material"
import { ClipThing, StyledImageText } from "../.."
import { SvgDeath, SvgSkull2 } from "../../../assets"
import { colors } from "../../../theme/theme"
import { WarMachineState } from "../../../types"

export interface KillAlertProps {
    destroyed_war_machine: WarMachineState
    killed_by_war_machine_id?: WarMachineState
    killed_by?: string
}

export const KillAlert = ({ data }: { data: KillAlertProps }) => {
    const { destroyed_war_machine, killed_by_war_machine_id, killed_by } = data

    if (!destroyed_war_machine) return null

    const mainColor = killed_by_war_machine_id?.faction.theme.primary

    return (
        <ClipThing
            clipSize="8px"
            border={{
                borderColor: mainColor || "none",
                isFancy: true,
                borderThickness: ".2rem",
            }}
        >
            <Box
                sx={{
                    px: "1.44rem",
                    pt: "1.2rem",
                    pb: ".8rem",
                    backgroundColor: colors.darkNavy,
                }}
            >
                <StyledImageText
                    text={
                        killed_by_war_machine_id
                            ? killed_by_war_machine_id.name || killed_by_war_machine_id.hash
                            : killed_by || "UNKNOWN"
                    }
                    color={mainColor || "grey !important"}
                    imageUrl={killed_by_war_machine_id ? killed_by_war_machine_id.imageAvatar : ""}
                    imageMb={-0.2}
                />
                <SvgDeath size="1.1rem" sx={{ display: "inline", mx: ".48rem" }} />
                <SvgSkull2 size="1.1rem" sx={{ display: "inline", mr: ".64rem" }} />
                <StyledImageText
                    text={destroyed_war_machine.name || destroyed_war_machine.hash}
                    color={destroyed_war_machine.faction.theme.primary}
                    imageUrl={destroyed_war_machine.imageAvatar}
                    imageMb={-0.2}
                />
            </Box>
        </ClipThing>
    )
}
