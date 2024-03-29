import { Box, Stack, Typography } from "@mui/material"
import { fonts } from "../../../../../../theme/theme"
import { BlueprintPlayerAbility } from "../../../../../../types"
import { PlayerAbilitySmallCard } from "../../../../../Common/PlayerAbility/PlayerAbilitySmallCard"

export const RewardAbility = ({ ability, amount }: { ability: BlueprintPlayerAbility; amount?: number }) => {
    const playerAbility = {
        id: "",
        blueprint_id: "",
        count: amount || 1,
        last_purchased_at: new Date(),
        cooldown_expires_on: new Date(),
        ability: ability,
    }

    return (
        <Stack alignItems="center" spacing=".8rem">
            <Box sx={{ width: "10rem", minHeight: "13rem" }}>
                <PlayerAbilitySmallCard
                    anyAbility={playerAbility.ability}
                    playerAbility={playerAbility}
                    onClickAction="nothing"
                    ownedCount={playerAbility.count}
                />
            </Box>

            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                ABILITY
            </Typography>
        </Stack>
    )
}
