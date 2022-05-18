import { Stack } from "@mui/material"
import { ClipThing } from "../.."
import { useTheme } from "../../../containers/theme"
import { MechBasic } from "../../../types"

interface WarMachineHangarItemProps {
    mech: MechBasic
}

export const WarMachineHangarItem = ({ mech }: WarMachineHangarItemProps) => {
    const theme = useTheme()
    const {
        collection_slug,
        hash,
        token_id,
        item_type,
        item_id,
        tier,
        owner_id,
        on_chain_status,
        id,
        label,
        weapon_hardpoints,
        utility_slots,
        speed,
        max_hitpoints,
        is_default,
        is_insured,
        name,
        genesis_token_id,
        limited_release_token_id,
        power_core_size,
        blueprint_id,
        brand_id,
        faction_id,
        model_id,
        default_chassis_skin_id,
        chassis_skin_id,
        intro_animation_id,
        outro_animation_id,
        power_core_id,
    } = mech

    return (
        <ClipThing
            clipSize="10px"
            border={{
                isFancy: true,
                borderColor: theme.factionTheme.primary,
                borderThickness: ".15rem",
            }}
            opacity={0.7}
            backgroundColor={theme.factionTheme.background}
        >
            <Stack direction="row">
                {/* <Stack>
                    <MechTitle mech={mech} />

                    <Stack direction="row">
                        <Mech />
                    </Stack>
                </Stack>

                <MechMiniStats />

                <MechBarStats /> */}
            </Stack>
        </ClipThing>
    )
}
