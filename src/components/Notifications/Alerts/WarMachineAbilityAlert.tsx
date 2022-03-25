import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { ClipThing, StyledImageText, StyledNormalText } from "../.."
import { GenericWarMachinePNG, SvgEmergency } from "../../../assets"
import { GAME_SERVER_HOSTNAME, PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { FactionsAll, httpProtocol } from "../../../containers"
import { acronym } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { BattleAbility, User, WarMachineState } from "../../../types"

export interface WarMachineAbilityAlertProps {
    user?: User
    ability: BattleAbility
    warMachine: WarMachineState
}

export const WarMachineAbilityAlert = ({
    data,
    factionsAll,
}: {
    data: WarMachineAbilityAlertProps
    factionsAll: FactionsAll
}) => {
    const { ability, warMachine } = data
    const { label, colour, image_url } = ability
    const { hash, name, imageAvatar: warMachineImageUrl, faction } = warMachine

    const wmImageUrl = useMemo(() => warMachineImageUrl || GenericWarMachinePNG, [warMachineImageUrl])
    const mainColor = faction.theme.primary

    return (
        <ClipThing
            clipSize="8px"
            border={{
                borderColor: mainColor || "none",
                isFancy: true,
                borderThickness: ".2rem",
            }}
        >
            <Stack
                spacing=".5rem"
                sx={{
                    px: "1.44rem",
                    pt: "1.2rem",
                    pb: ".8rem",
                    backgroundColor: colors.darkNavy,
                }}
            >
                <Box>
                    <StyledImageText
                        text={acronym(faction.label)}
                        color={mainColor || "grey !important"}
                        imageUrl={`${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[faction.id]?.logo_blob_id}`}
                        imageMb={-0.2}
                    />
                    <SvgEmergency fill="#FFFFFF" size="1.2rem" sx={{ display: "inline", mx: ".4rem" }} />
                    <StyledImageText
                        text={label}
                        color={colour}
                        imageUrl={`${httpProtocol()}://${GAME_SERVER_HOSTNAME}${image_url}`}
                        imageMb={-0.2}
                    />
                </Box>
                <Box>
                    <StyledNormalText text="Mech ability has been initiated by " />
                    <StyledImageText text={name || hash} color={mainColor} imageUrl={wmImageUrl} imageMb={-0.3} />
                </Box>
            </Stack>
        </ClipThing>
    )
}
