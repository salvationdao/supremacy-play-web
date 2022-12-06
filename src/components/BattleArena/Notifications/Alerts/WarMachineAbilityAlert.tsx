import { Typography } from "@mui/material"
import { useMemo } from "react"
import { StyledImageText } from "../../.."
import { GenericWarMachinePNG, SvgEmergency } from "../../../../assets"
import { colors } from "../../../../theme/theme"
import { FactionWithPalette, WarMachineAbilityAlertProps } from "../../../../types"
import { NiceBoxThing } from "../../../Common/Nice/NiceBoxThing"

export const WarMachineAbilityAlert = ({ data, getFaction }: { data: WarMachineAbilityAlertProps; getFaction: (factionID: string) => FactionWithPalette }) => {
    const { ability, warMachine } = data
    const { label, colour, image_url } = ability
    const { hash, name, imageAvatar: warMachineImageUrl, factionID } = warMachine

    const faction = getFaction(factionID)
    const wmImageUrl = useMemo(() => warMachineImageUrl || GenericWarMachinePNG, [warMachineImageUrl])
    const mainColor = faction.palette.primary

    return (
        <NiceBoxThing border={{ color: `${mainColor || colors.grey}80` }} background={{ colors: [colors.darkNavy], opacity: 0.6 }} sx={{ p: ".6rem 1.4rem" }}>
            <Typography>
                <StyledImageText sx={{ color: mainColor }} imageUrl={wmImageUrl}>
                    {name || hash}
                </StyledImageText>{" "}
                <SvgEmergency inline fill="#FFFFFF" size="1.2rem" />{" "}
                <StyledImageText sx={{ color: colour }} imageUrl={`${image_url}`}>
                    {label}
                </StyledImageText>
            </Typography>
        </NiceBoxThing>
    )
}
