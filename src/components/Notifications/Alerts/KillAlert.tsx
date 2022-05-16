import { Box } from "@mui/material"
import { ClipThing, StyledImageText, StyledNormalText } from "../.."
import { SvgDeath, SvgSkull2 } from "../../../assets"
import { colors } from "../../../theme/theme"
import { Faction, User, WarMachineState } from "../../../types"

export interface KillAlertProps {
    destroyed_war_machine: WarMachineState
    killed_by_war_machine?: WarMachineState
    killed_by?: string
    killed_by_user?: User
}

export const KillAlert = ({ data, getFaction }: { data: KillAlertProps; getFaction: (factionID: string) => Faction }) => {
    const { destroyed_war_machine, killed_by_war_machine, killed_by, killed_by_user } = data

    if (!destroyed_war_machine) return null

    const mainColor = getFaction(killed_by_war_machine?.factionID || killed_by_user?.faction_id || "").primary_color

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
                text={
                    <>
                        {`${killed_by_user.username}`}
                        <span style={{ marginLeft: ".2rem", opacity: 0.7 }}>{`#${killed_by_user.gid}`}</span>
                        {`${killed_by ? ` ${killed_by}` : ""}`}
                    </>
                }
                color={getFaction(killed_by_user.faction_id).primary_color}
                imageUrl={getFaction(killed_by_user.faction_id).logo_url}
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
                borderThickness: ".15rem",
            }}
            opacity={0.8}
            backgroundColor={colors.darkNavy}
        >
            <Box
                sx={{
                    px: "1.44rem",
                    pt: "1.2rem",
                    pb: ".8rem",
                }}
            >
                {killedBy}
                <SvgDeath size="1.1rem" sx={{ display: "inline", mx: ".48rem" }} />
                <SvgSkull2 size="1.1rem" sx={{ display: "inline", mr: ".64rem" }} />
                <StyledImageText
                    textSx={{ textDecoration: "line-through" }}
                    text={destroyed_war_machine.name || destroyed_war_machine.hash}
                    color={getFaction(destroyed_war_machine.factionID).primary_color}
                    imageUrl={destroyed_war_machine.imageAvatar}
                    imageMb={-0.2}
                />
            </Box>
        </ClipThing>
    )
}
