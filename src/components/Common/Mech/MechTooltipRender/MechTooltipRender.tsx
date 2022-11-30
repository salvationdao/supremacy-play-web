import { Box, Divider, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { SvgLoadoutSkin, SvgMechDeaths, SvgMechKills, SvgMechLosses, SvgMechWins, SvgUserDiamond2 } from "../../../../assets"
import { useSupremacy } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { getRarityDeets, numFormatter } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"
import { NewMechStruct } from "../../../../types"
import { TypographyTruncated } from "../../TypographyTruncated"
import { MechIdleStatus } from "../MechIdleStatus"
import { RepairBlocks } from "../MechRepairBlocks"
import { MechStats } from "./MechStats"

export const MechTooltipRender = ({ mech }: { mech: NewMechStruct }) => {
    const theme = useTheme()
    const { getFaction } = useSupremacy()

    const ownerFaction = useMemo(() => getFaction(mech.owner.faction_id), [getFaction, mech.owner.faction_id])

    const rarityDeets = useMemo(() => getRarityDeets(mech.tier), [mech.tier])

    return (
        <Box sx={{ width: "45rem", backgroundColor: theme.factionTheme.s800 }}>
            {/* Mech name and general info */}
            <Stack
                spacing=".4rem"
                sx={{
                    p: "1rem 1.5rem",
                    pr: ".5rem",
                    backgroundColor: theme.factionTheme.s700,
                }}
            >
                <TypographyTruncated variant="h5" fontFamily={fonts.nostromoBlack}>
                    {mech.name || mech.label}
                </TypographyTruncated>

                <TypographyTruncated variant="h6">
                    <SvgUserDiamond2 inline /> {mech.owner.username}#{mech.owner.gid}
                </TypographyTruncated>

                <TypographyTruncated variant="h6">
                    <SvgLoadoutSkin inline /> {mech.skin_label} |{" "}
                    <strong style={{ color: rarityDeets.color, textTransform: "uppercase" }}>{rarityDeets.label}</strong>
                </TypographyTruncated>
            </Stack>

            {/* Repair status etc */}
            <Stack direction="row" alignItems="center" sx={{ p: ".7rem 1rem", backgroundColor: `${colors.red}18` }}>
                <MechIdleStatus mech={mech} hideMoreOptionButtons />

                <Box flex={1} />

                <RepairBlocks defaultBlocks={mech.repair_blocks} remainDamagedBlocks={mech.damaged_blocks} size={9} sx={{ width: "fit-content" }} />
            </Stack>

            {/* KDWL stats */}
            <Stack direction="row" alignItems="center" spacing=".8rem" sx={{ p: ".8rem 1rem", "&>*": { flex: 1 } }}>
                <Stack alignItems="center">
                    <TypographyTruncated whiteSpace="nowrap">
                        <SvgMechKills inline size="1.8rem" /> {numFormatter(mech.stats.total_kills)}
                    </TypographyTruncated>

                    <Typography variant="body2" fontFamily={fonts.nostromoBlack}>
                        KILLS
                    </Typography>
                </Stack>

                <Stack alignItems="center">
                    <TypographyTruncated whiteSpace="nowrap">
                        <SvgMechDeaths inline size="1.8rem" /> {numFormatter(mech.stats.total_deaths)}
                    </TypographyTruncated>

                    <Typography variant="body2" fontFamily={fonts.nostromoBlack}>
                        DEATHS
                    </Typography>
                </Stack>

                <Stack alignItems="center">
                    <TypographyTruncated whiteSpace="nowrap">
                        <SvgMechWins inline size="1.8rem" /> {numFormatter(mech.stats.total_wins)}
                    </TypographyTruncated>

                    <Typography variant="body2" fontFamily={fonts.nostromoBlack}>
                        WINS
                    </Typography>
                </Stack>

                <Stack alignItems="center">
                    <TypographyTruncated whiteSpace="nowrap">
                        <SvgMechLosses inline size="1.8rem" /> {numFormatter(mech.stats.total_losses)}
                    </TypographyTruncated>

                    <Typography variant="body2" fontFamily={fonts.nostromoBlack}>
                        LOSSES
                    </Typography>
                </Stack>
            </Stack>

            <Divider />

            {/* Mech bar stats */}
            <MechStats mech={mech} sx={{ p: "1rem 1rem" }} />
        </Box>
    )
}
