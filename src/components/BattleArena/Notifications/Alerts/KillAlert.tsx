import { Typography } from "@mui/material"
import { StyledImageText } from "../../.."
import { SvgDeath, SvgSkull2 } from "../../../../assets"
import { colors } from "../../../../theme/theme"
import { FactionWithPalette, KillAlertProps } from "../../../../types"
import { NiceBoxThing } from "../../../Common/Nice/NiceBoxThing"

export const KillAlert = ({ data, getFaction }: { data: KillAlertProps; getFaction: (factionID: string) => FactionWithPalette }) => {
    const { destroyed_war_machine, killed_by_war_machine, killed_by, killed_by_user } = data

    if (!destroyed_war_machine) return null

    const mainColor = getFaction(killed_by_war_machine?.factionID || killed_by_user?.faction_id || "").palette.primary

    let killedBy = null
    if (killed_by_war_machine) {
        killedBy = (
            <StyledImageText sx={{ color: mainColor || "grey !important" }} imageUrl={killed_by_war_machine.imageAvatar}>
                {killed_by_war_machine.name || killed_by_war_machine.hash}
            </StyledImageText>
        )
    } else if (killed_by_user) {
        const faction = getFaction(killed_by_user.faction_id)
        killedBy = (
            <StyledImageText sx={{ color: getFaction(destroyed_war_machine.factionID).palette.primary }} imageUrl={faction.logo_url}>
                {killed_by_user.username}#{killed_by_user.gid}
            </StyledImageText>
        )
    } else {
        killedBy = <StyledImageText>{killed_by || "UNKNOWN"}</StyledImageText>
    }

    return (
        <NiceBoxThing border={{ color: `${mainColor || colors.grey}80` }} background={{ colors: [colors.darkNavy], opacity: 0.6 }} sx={{ p: ".6rem 1.4rem" }}>
            <Typography>
                {killedBy} <SvgDeath inline size="1.2rem" />
                <SvgSkull2 inline size="1.2rem" />{" "}
                <StyledImageText
                    sx={{ textDecoration: "line-through", color: getFaction(destroyed_war_machine.factionID).palette.primary }}
                    imageUrl={destroyed_war_machine.imageAvatar}
                >
                    {destroyed_war_machine.name || destroyed_war_machine.hash}
                </StyledImageText>
            </Typography>
        </NiceBoxThing>
    )
}
