import { Typography } from "@mui/material"
import { StyledImageText } from "../../.."
import { SvgEmergency } from "../../../../assets"
import { acronym } from "../../../../helpers"
import { colors } from "../../../../theme/theme"
import { BattleFactionAbilityAlertProps, FactionWithPalette } from "../../../../types"
import { NiceBoxThing } from "../../../Common/Nice/NiceBoxThing"

export const FactionAbilityAlert = ({ data, getFaction }: { data: BattleFactionAbilityAlertProps; getFaction: (factionID: string) => FactionWithPalette }) => {
    const { user, ability } = data
    const { label, colour, image_url } = ability

    const faction = getFaction(user?.faction_id)
    const mainColor = faction.palette.primary

    return (
        <NiceBoxThing border={{ color: `${mainColor || colors.grey}80` }} background={{ colors: [colors.darkNavy], opacity: 0.6 }} sx={{ p: ".6rem 1.4rem" }}>
            <Typography>
                <StyledImageText sx={{ color: mainColor || "grey !important" }} imageUrl={faction.logo_url}>
                    {user ? acronym(faction.label) : "GABS"}
                </StyledImageText>{" "}
                <SvgEmergency inline fill="#FFFFFF" size="1.2rem" />{" "}
                <StyledImageText sx={{ color: colour }} imageUrl={`${image_url}`}>
                    {label}
                </StyledImageText>
            </Typography>
        </NiceBoxThing>
    )
}
