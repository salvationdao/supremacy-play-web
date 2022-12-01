import { Typography } from "@mui/material"
import { useMemo } from "react"
import { StyledImageText } from "../../.."
import { SvgLocation } from "../../../../assets"
import { FallbackUser } from "../../../../containers"
import { colors } from "../../../../theme/theme"
import { FactionWithPalette, LocationSelectAlertProps } from "../../../../types"
import { NiceBoxThing } from "../../../Common/Nice/NiceBoxThing"

export const LocationSelectAlert = ({ data, getFaction }: { data: LocationSelectAlertProps; getFaction: (factionID: string) => FactionWithPalette }) => {
    const { currentUser, ability } = data
    const { label, colour, image_url } = ability
    const { faction_id } = currentUser || FallbackUser

    const faction = getFaction(faction_id)
    const abilityImageUrl = useMemo(() => `${image_url}`, [image_url])
    const mainColor = faction.palette.primary

    return (
        <NiceBoxThing border={{ color: `${mainColor || colors.grey}80` }} background={{ colors: [colors.darkNavy], opacity: 0.3 }} sx={{ p: ".6rem 1.4rem" }}>
            <Typography>
                <StyledImageText sx={{ color: getFaction((currentUser || FallbackUser).faction_id).palette.primary }} imageUrl={faction.logo_url}>
                    {(currentUser || FallbackUser).username}#{(currentUser || FallbackUser).gid}
                </StyledImageText>{" "}
                <SvgLocation inline fill="#FFFFFF" size="1.2rem" />{" "}
                <StyledImageText sx={{ color: colour }} imageUrl={abilityImageUrl}>
                    {label}
                </StyledImageText>
            </Typography>
        </NiceBoxThing>
    )
}
