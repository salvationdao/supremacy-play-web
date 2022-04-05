import { Box } from "@mui/material"
import { ClipThing, StyledImageText, StyledNormalText } from "../.."
import { SvgDeath, SvgSkull2 } from "../../../assets"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { colors } from "../../../theme/theme"
import { User, WarMachineState } from "../../../types"

export interface KillAlertProps {
    destroyed_war_machine: WarMachineState
    killed_by_war_machine?: WarMachineState
    killed_by?: string
    killed_by_user?: User
}

export const KillAlert = ({ data }: { data: KillAlertProps }) => {
    const { destroyed_war_machine, killed_by_war_machine, killed_by, killed_by_user } = data

    if (!destroyed_war_machine) return null

    const mainColor = killed_by_war_machine?.faction.theme.primary || killed_by_user?.faction.theme.primary

    let killedBy = null
    if (killed_by_war_machine) {
        killedBy = (
            <StyledImageText
                text={killed_by_war_machine.name || killed_by_war_machine.hash}
                color={mainColor || "grey !important"}
                imageUrl={killed_by_war_machine.imageAvatar}
                imageMb={-0.2}
            />
        )
    } else if (killed_by_user) {
        killedBy = (
            <StyledImageText
                text={`${killed_by_user.username}#${killed_by_user.gid}${killed_by ? ` ${killed_by}` : ""}`}
                color={killed_by_user.faction.theme.primary}
                imageUrl={`${PASSPORT_SERVER_HOST_IMAGES}/api/files/${killed_by_user.faction.logo_blob_id}`}
                imageMb={-0.2}
            />
        )
    } else {
        killedBy = <StyledNormalText sx={{ fontWeight: "fontWeightBold" }} text={killed_by || "UNKNOWN"} />
    }

    return (
        <ClipThing
            clipSize="3px"
            border={{
                borderColor: mainColor || colors.grey,
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
                {killedBy}
                <SvgDeath size="1.1rem" sx={{ display: "inline", mx: ".48rem" }} />
                <SvgSkull2 size="1.1rem" sx={{ display: "inline", mr: ".64rem" }} />
                <StyledImageText
                    textSx={{ textDecoration: "line-through" }}
                    text={destroyed_war_machine.name || destroyed_war_machine.hash}
                    color={destroyed_war_machine.faction.theme.primary}
                    imageUrl={destroyed_war_machine.imageAvatar}
                    imageMb={-0.2}
                />
            </Box>
        </ClipThing>
    )
}
