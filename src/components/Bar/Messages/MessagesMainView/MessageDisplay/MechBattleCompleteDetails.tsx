import { Box, Divider, Stack, Typography } from "@mui/material"
import { SvgCrown, SvgSupToken } from "../../../../../assets"
import { colors, fonts } from "../../../../../theme/theme"
import { PlayerAbility, SystemMessageDataMechBattleComplete } from "../../../../../types"
import { ClipThing } from "../../../../Common/ClipThing"
import { supFormatterNoFixed } from "../../../../../helpers"
import { PlayerAbilityCard } from "../../../../LeftDrawer/BattleArena/PlayerAbilities/PlayerAbilityCard"
import { useSupremacy } from "../../../../../containers"

export interface MechBattleCompleteDetailsProps {
    message: string
    data: SystemMessageDataMechBattleComplete
}

export const MechBattleCompleteDetails = ({ message, data }: MechBattleCompleteDetailsProps) => {
    const { getFaction } = useSupremacy()
    const sups = data.rewarded_sups
    const ability = data.rewarded_player_ability
    const playerAbility: PlayerAbility | undefined = ability
        ? {
              id: "",
              blueprint_id: "",
              count: 1,
              last_purchased_at: new Date(),
              cooldown_expires_on: new Date(),
              ability: ability,
          }
        : undefined

    return (
        <Stack spacing=".3rem">
            <Typography variant="h6">{message}</Typography>

            <Divider sx={{ my: "1rem !important", borderColor: "#FFFFFF28" }} />

            <Typography sx={{ fontFamily: fonts.nostromoBold, pb: "1rem" }}>REWARDS:</Typography>

            <Stack alignItems="center" direction="row" spacing="2rem">
                {sups != "0" && (
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
                            <Stack alignItems="center" justifyContent="center" spacing=".5rem" sx={{ height: "100%", backgroundColor: `${colors.yellow}12` }}>
                                <SvgSupToken size="3rem" fill={colors.yellow} />
                                <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "fontWeightBold" }}>
                                    {supFormatterNoFixed(sups, 2)}
                                </Typography>
                            </Stack>
                        </ClipThing>

                        <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                            SUPS
                        </Typography>
                    </Stack>
                )}

                {playerAbility && (
                    <Stack alignItems="center" spacing=".8rem">
                        <Box sx={{ width: "10rem", minHeight: "13rem" }}>
                            <PlayerAbilityCard playerAbility={playerAbility} viewOnly />
                        </Box>

                        <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                            ABILITY
                        </Typography>
                    </Stack>
                )}
            </Stack>

            <Divider sx={{ my: "1rem !important", borderColor: "#FFFFFF28" }} />

            {data.mech_battle_briefs && data.mech_battle_briefs.length > 0 && (
                <>
                    <Typography sx={{ fontFamily: fonts.nostromoBold, pb: "1rem" }}>{`MECH${data.mech_battle_briefs.length > 1 ? "S" : ""}:`}</Typography>
                    <Stack direction="row">
                        {data.mech_battle_briefs.map((battleBrief) => (
                            <Box key={battleBrief.mech_id}>
                                <Stack direction="row" spacing=".6rem" alignItems="center">
                                    {!battleBrief.killed && <SvgCrown size="1.7rem" fill={colors.gold} />}
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: "fontWeightBold",
                                            span: {
                                                color: (theme) => theme.factionTheme.primary,
                                            },
                                        }}
                                    >
                                        NAME: <span>{battleBrief.name}</span>
                                    </Typography>
                                </Stack>

                                <Stack direction="row" spacing=".2rem" alignItems="center">
                                    <Typography
                                        sx={{
                                            fontWeight: "fontWeightBold",
                                            span: { color: battleBrief.killed ? colors.red : colors.green },
                                        }}
                                    >
                                        STATUS: <span>{battleBrief.killed ? "OUT OF COMMISSION" : "SURVIVED"}</span>
                                    </Typography>
                                </Stack>

                                {battleBrief.kills && battleBrief.kills.length > 0 && (
                                    <>
                                        <Stack direction="column" spacing=".2rem">
                                            <Typography
                                                sx={{
                                                    fontWeight: "fontWeightBold",
                                                }}
                                            >
                                                KILLS:
                                            </Typography>

                                            {battleBrief.kills.map((k, i) => (
                                                <Typography
                                                    key={i}
                                                    sx={{
                                                        fontWeight: "fontWeightBold",
                                                        color: getFaction(k.faction_id)?.primary_color,
                                                        pl: "4rem",
                                                    }}
                                                >
                                                    {k.name}
                                                </Typography>
                                            ))}
                                        </Stack>
                                    </>
                                )}
                                {battleBrief.killed && (
                                    <Stack direction="column" spacing=".2rem">
                                        <Typography
                                            sx={{
                                                fontWeight: "fontWeightBold",
                                            }}
                                        >
                                            KILLED BY:
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontWeight: "fontWeightBold",
                                                color: getFaction(battleBrief.killed.faction_id)?.primary_color,
                                                pl: "4rem",
                                            }}
                                        >
                                            {battleBrief.killed.name}
                                        </Typography>
                                    </Stack>
                                )}
                            </Box>
                        ))}
                    </Stack>
                </>
            )}
        </Stack>
    )
}
