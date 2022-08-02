import { Box, Divider, Stack, Typography } from "@mui/material"
import { SvgSupToken } from "../../../../../assets"
import { supFormatterNoFixed } from "../../../../../helpers"
import { colors, fonts } from "../../../../../theme/theme"
import { BlueprintPlayerAbility, PlayerAbility } from "../../../../../types"
import { ClipThing } from "../../../../Common/ClipThing"
import { PlayerAbilityCard } from "../../../../VotingSystem/PlayerAbilities/PlayerAbilityCard"

interface MechOwnerBattleRewardProps {
    message: string
    data: MechOwnerBattleRewardData
}

export interface MechOwnerBattleRewardData {
    rewarded_sups: string
    rewarded_player_ability?: BlueprintPlayerAbility
}

export const MechOwnerBattleReward = ({ message, data }: MechOwnerBattleRewardProps) => {
    const sups = data.rewarded_sups
    const ability = data.rewarded_player_ability
    const playerAbility: PlayerAbility | undefined = ability
        ? {
              id: "",
              blueprint_id: "",
              count: 1,
              last_purchased_at: new Date(),
              ability: ability,
          }
        : undefined

    return (
        <Stack spacing=".3rem">
            <Typography variant="h6">{message}</Typography>

            <Divider sx={{ my: "1rem !important", borderColor: "#FFFFFF28" }} />

            <Typography sx={{ fontFamily: fonts.nostromoBold, pb: "1rem" }}>CONSOLATION REWARDS:</Typography>

            <Stack alignItems="center" direction="row" spacing="2rem">
                <Stack alignItems="center" spacing=".8rem" sx={{ alignSelf: "stretch" }}>
                    <ClipThing
                        clipSize="6px"
                        border={{
                            borderColor: colors.yellow,
                            borderThickness: "1.5px",
                        }}
                        opacity={0.9}
                        backgroundColor="#111111"
                        sx={{ flex: 1, width: "10rem", minHeight: "10rem" }}
                    >
                        <Stack alignItems="center" justifyContent="center" spacing="1rem" sx={{ position: "relative", height: "100%" }}>
                            <SvgSupToken
                                size="8.6rem"
                                fill={colors.yellow}
                                sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: -1, opacity: 0.05 }}
                            />
                            <Typography variant="h6" sx={{ color: colors.neonBlue, textAlign: "center", fontWeight: "fontWeightBold" }}>
                                {supFormatterNoFixed(sups, 2)}
                            </Typography>
                        </Stack>
                    </ClipThing>

                    <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                        SUPS
                    </Typography>
                </Stack>

                {playerAbility && (
                    <Stack alignItems="center">
                        <Box sx={{ width: "10rem", height: "13rem" }}>
                            <PlayerAbilityCard playerAbility={playerAbility} viewOnly />
                        </Box>

                        <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                            ABILITY
                        </Typography>
                    </Stack>
                )}
            </Stack>
        </Stack>
    )
}
