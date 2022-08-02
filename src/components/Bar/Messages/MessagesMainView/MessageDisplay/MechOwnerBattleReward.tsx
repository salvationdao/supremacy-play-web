import { Box, Divider, Stack, Typography } from "@mui/material"
import { BlueprintPlayerAbility, PlayerAbility } from "../../../../../types"
import { useMemo } from "react"
import BigNumber from "bignumber.js"
import { SvgSupToken } from "../../../../../assets"
import { colors, fonts } from "../../../../../theme/theme"
import { supFormatterNoFixed } from "../../../../../helpers"
import { PlayerAbilityCard } from "../../../../VotingSystem/PlayerAbilities/PlayerAbilityCard"

interface MechOwnerBattleRewardProps {
    message: string
    data?: MechOwnerBattleRewardData
}

export interface MechOwnerBattleRewardData {
    rewarded_sups: string
    rewarded_player_ability?: BlueprintPlayerAbility
}

export const MechOwnerBattleReward = ({ message, data }: MechOwnerBattleRewardProps) => {
    const rewardedSups = useMemo(() => {
        if (!data?.rewarded_sups) return undefined
        const sups = data.rewarded_sups
        return (
            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    pb: ".4rem",
                    borderRadius: 1,
                }}
            >
                <Typography sx={{ fontFamily: fonts.nostromoBold, lineHeight: 1 }}>Sups: </Typography>
                <SvgSupToken size="1.9rem" fill={colors.yellow} sx={{ mr: ".2rem", pb: ".4rem" }} />
                <Typography variant="h6" sx={{ lineHeight: 1 }}>
                    {supFormatterNoFixed(sups, 2)}
                </Typography>
            </Stack>
        )
    }, [data?.rewarded_sups])

    const rewardAbility = useMemo(() => {
        if (!data?.rewarded_player_ability) return undefined
        const ability = data.rewarded_player_ability
        const playerAbility: PlayerAbility = {
            id: "",
            blueprint_id: "",
            count: 1,
            last_purchased_at: new Date(),
            ability: ability,
        }
        return (
            <Stack direction="column">
                <Typography sx={{ fontFamily: fonts.nostromoBold, lineHeight: 1 }}>Ability: </Typography>

                <Box sx={{ width: "8rem", height: "14rem" }}>
                    <PlayerAbilityCard key={ability.id} playerAbility={playerAbility} viewOnly />
                </Box>
            </Stack>
        )
    }, [data?.rewarded_player_ability])

    return (
        <Stack spacing=".3rem">
            <Typography variant="h6">{message}</Typography>

            {data && (
                <>
                    <Divider sx={{ my: "1rem !important", borderColor: "#FFFFFF28" }} />
                    <Typography sx={{ fontFamily: fonts.nostromoBold, lineHeight: 1, pb: "1rem" }}>Reward:</Typography>
                </>
            )}

            {rewardedSups && rewardedSups}
            {rewardAbility && rewardAbility}
        </Stack>
    )
}
