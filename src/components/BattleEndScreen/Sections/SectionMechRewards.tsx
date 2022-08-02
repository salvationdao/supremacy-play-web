import { Box, Stack, Typography } from "@mui/material"
import { BattleEndTooltip } from "../.."
import { GenericWarMachinePNG, SvgSupToken } from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"
import { supFormatterNoFixed } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { BattleEndDetail } from "../../../types"

export const SectionMechRewards = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
    const { userID } = useAuth()
    const { getFaction } = useSupremacy()
    const { mech_rewards } = battleEndDetail

    return (
        <Stack spacing={2}>
            <Box sx={{ px: "2rem", py: ".88rem", pr: "3.2rem", backgroundColor: "#FFFFFF15" }}>
                <Typography
                    component="span"
                    variant="h6"
                    sx={{
                        position: "relative",
                        fontFamily: fonts.nostromoBlack,
                        fontWeight: "fontWeightBold",
                    }}
                >
                    MECH OWNER REWARDS
                    <BattleEndTooltip text="Best to worst performing faction." />
                </Typography>
            </Box>

            {mech_rewards && mech_rewards.length > 0 ? (
                <Stack spacing="1.2rem" sx={{ pl: ".5rem" }}>
                    {mech_rewards.map((wm) => {
                        const faction = getFaction(wm.faction_id)
                        return (
                            <Stack key={wm.id} direction="row" alignItems="center" spacing="1rem">
                                <Box
                                    sx={{
                                        flexShrink: 0,
                                        width: "4.5rem",
                                        height: "4.5rem",
                                        background: `url(${wm.avatar_url || GenericWarMachinePNG})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                        backgroundColor: `${faction.primary_color}60`,
                                        borderRadius: 0.5,
                                        border: `${faction.primary_color} solid .2rem`,
                                    }}
                                />

                                <Stack spacing=".4rem" sx={{ pt: ".5rem" }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            lineHeight: 1,
                                            color: faction.primary_color,
                                            fontWeight: "fontWeightBold",
                                            display: "-webkit-box",
                                            overflow: "hidden",
                                            overflowWrap: "anywhere",
                                            textOverflow: "ellipsis",
                                            WebkitLineClamp: 1, // change to max number of lines
                                            WebkitBoxOrient: "vertical",

                                            span: { color: colors.neonBlue },
                                        }}
                                    >
                                        {wm.owner_id === userID && <span>(YOUR MECH) </span>}
                                        {wm.name || wm.label}
                                    </Typography>

                                    <Stack direction="row" alignItems="center">
                                        <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold", color: colors.offWhite }}>REWARD:&nbsp;</Typography>
                                        <SvgSupToken fill={colors.yellow} size="1.8rem" />
                                        <Typography sx={{ lineHeight: 1 }}>{supFormatterNoFixed(wm.rewarded_sups, 2)}</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        )
                    })}
                </Stack>
            ) : (
                <Typography variant="h6" sx={{ pl: ".8rem", opacity: 0.8 }}>
                    Nothing to show...
                </Typography>
            )}
        </Stack>
    )
}
