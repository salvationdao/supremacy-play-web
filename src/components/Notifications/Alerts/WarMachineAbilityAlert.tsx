import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { ClipThing, StyledImageText, StyledNormalText } from "../.."
import { GenericWarMachinePNG, SvgEmergency } from "../../../assets"
import { acronym } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { BattleAbility, Faction, User, WarMachineState } from "../../../types"

export interface WarMachineAbilityAlertProps {
    user: User
    ability: BattleAbility
    warMachine: WarMachineState
}

export const WarMachineAbilityAlert = ({ data, getFaction }: { data: WarMachineAbilityAlertProps; getFaction: (factionID: string) => Faction }) => {
    const { ability, warMachine } = data
    const { label, colour, image_url } = ability
    const { hash, name, imageAvatar: warMachineImageUrl, factionID } = warMachine

    const faction = getFaction(factionID)
    const wmImageUrl = useMemo(() => warMachineImageUrl || GenericWarMachinePNG, [warMachineImageUrl])
    const mainColor = faction.primary_color

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
            <Stack
                spacing=".5rem"
                sx={{
                    px: "1.44rem",
                    pt: "1.2rem",
                    pb: ".8rem",
                }}
            >
                <Box>
                    <StyledImageText text={acronym(faction.label)} color={mainColor || "grey !important"} imageUrl={faction.logo_url} imageMb={-0.2} />
                    <SvgEmergency fill="#FFFFFF" size="1.2rem" sx={{ display: "inline", mx: ".4rem" }} />
                    <StyledImageText text={label} color={colour} imageUrl={`${image_url}`} imageMb={-0.2} />
                </Box>
                <Box>
                    <StyledNormalText text="Mech ability has been initiated by " />
                    <StyledImageText text={name || hash} color={mainColor} imageUrl={wmImageUrl} imageMb={-0.3} />
                </Box>
            </Stack>
        </ClipThing>
    )
}
