import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { BattleEndTooltip } from "../../.."
import { GenericWarMachinePNG, SvgCrown } from "../../../../assets"
import { useSupremacy } from "../../../../containers"
import { colors, fonts } from "../../../../theme/theme"
import { BattleEndDetail } from "../../../../types"
import { TypographyTruncated } from "../../../Common/TypographyTruncated"

export const SectionWinner = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
    const { getFaction } = useSupremacy()
    const { winning_faction_id_order, winning_war_machines } = battleEndDetail

    const faction = useMemo(() => getFaction(winning_faction_id_order[0]), [getFaction, winning_faction_id_order])

    return (
        <Stack spacing="2.4rem">
            <Box sx={{ px: "2rem", py: ".88rem", pr: "3.2rem", backgroundColor: "#FFFFFF15" }}>
                <Typography
                    component="span"
                    variant="h6"
                    sx={{
                        position: "relative",
                        fontFamily: fonts.nostromoBlack,
                    }}
                >
                    The Winner
                    <BattleEndTooltip text="The faction that won the battle" />
                </Typography>
            </Box>

            <Stack spacing="1.5rem" sx={{ px: "1.6rem" }}>
                <Box sx={{ position: "relative" }}>
                    <SvgCrown fill={colors.yellow} size="2rem" sx={{ position: "absolute", bottom: "calc(100% - .7rem)", left: ".8rem" }} />

                    <TypographyTruncated variant="h6" fontWeight="bold">
                        <Box
                            sx={{
                                display: "inline-block",
                                width: "3.6rem",
                                height: "3.6rem",
                                verticalAlign: "middle",
                                background: `url(${faction.logo_url})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "contain",
                            }}
                        />{" "}
                        {faction.label}
                    </TypographyTruncated>
                </Box>

                {winning_war_machines && winning_war_machines.length > 0 ? (
                    <Stack spacing=".8rem" sx={{ pl: ".5rem" }}>
                        {winning_war_machines.map((wm) => {
                            return (
                                <TypographyTruncated key={`${wm.hash}-${wm.participantID}`} variant="h6" fontWeight="bold" sx={{ color: colors.text }}>
                                    <Box
                                        sx={{
                                            display: "inline-block",
                                            width: "2.8rem",
                                            height: "2.8rem",
                                            verticalAlign: "middle",
                                            background: `url(${wm.imageAvatar || GenericWarMachinePNG})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center",
                                            backgroundSize: "contain",
                                        }}
                                    />{" "}
                                    {(wm.name || wm.hash).toUpperCase()}
                                </TypographyTruncated>
                            )
                        })}
                    </Stack>
                ) : (
                    <Typography variant="h6" sx={{ pl: ".8rem", opacity: 0.8 }}>
                        Nothing to show...
                    </Typography>
                )}
            </Stack>
        </Stack>
    )
}
