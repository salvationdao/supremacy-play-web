import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { StyledImageText, StyledNormalText } from "../.."
import { GenericWarMachinePNG, SvgEmergency } from "../../../assets"
import { GAME_SERVER_HOSTNAME } from "../../../constants"
import { httpProtocol } from "../../../containers"
import { colors } from "../../../theme/theme"
import { BattleAbility, User, WarMachineState } from "../../../types"

export interface WarMachineAbilityAlertProps {
    user?: User
    ability: BattleAbility
    warMachine: WarMachineState
}

export const WarMachineAbilityAlert = ({ data }: { data: WarMachineAbilityAlertProps }) => {
    const { ability, warMachine } = data
    const { label, colour, image_url } = ability
    const { hash, name, imageAvatar: warMachineImageUrl, faction } = warMachine

    const wmImageUrl = useMemo(() => warMachineImageUrl || GenericWarMachinePNG, [warMachineImageUrl])

    return (
        <Stack spacing=".8rem">
            <StyledImageText
                text={label}
                color={colour}
                imageUrl={`${httpProtocol()}://${GAME_SERVER_HOSTNAME}${image_url}`}
                imageMb={-0.3}
            />
            <Box>
                <SvgEmergency fill={colors.orange} size="1.2rem" sx={{ display: "inline", mr: ".4rem" }} />
                <StyledNormalText text="|" sx={{ opacity: 0.2, ml: ".24rem", mr: ".8rem" }} />
                <StyledNormalText text="Initiated by " />
                <StyledImageText
                    text={name || hash}
                    color={faction.theme.primary}
                    imageUrl={wmImageUrl}
                    imageMb={-0.3}
                />
            </Box>
        </Stack>
    )
}
