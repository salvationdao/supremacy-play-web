import { Box, Divider, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { SvgLoadoutSkin, SvgMechDeaths, SvgMechKills, SvgMechLosses, SvgMechWins, SvgUserDiamond2 } from "../../../../assets"
import { useSupremacy } from "../../../../containers"
import { getRarityDeets, numFormatter } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"
import { NewMechStruct, Utility } from "../../../../types"
import { TypographyTruncated } from "../../TypographyTruncated"
import { MechIdleStatus } from "../MechIdleStatus"
import { RepairBlocks } from "../MechRepairBlocks"
import { MechLoadout } from "./MechLoadout"
import { MechStats } from "./MechStats"

export const MechTooltipRender = ({ mech }: { mech: NewMechStruct }) => {
    const { getFaction } = useSupremacy()

    const ownerFaction = useMemo(() => getFaction(mech.owner.faction_id), [getFaction, mech.owner.faction_id])

    const rarityDeets = useMemo(() => getRarityDeets(mech.tier), [mech.tier])

    const utilitySlots = useMemo(() => mech.utilities?.map((u) => u.utility).filter((u) => !!u) as Utility[] | undefined, [mech.utilities])

    return (
        <Stack sx={{ width: "45rem", backgroundColor: ownerFaction.palette.s900, overflow: "hidden", maxHeight: "calc(100vh - 4rem)" }}>
            {/* Mech name and general info */}
            <Stack
                spacing=".4rem"
                sx={{
                    p: "1rem 1.5rem",
                    pr: ".5rem",
                    backgroundColor: ownerFaction.palette.s700,
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

            {/* Scrollable content */}
            <Box sx={{ overflowY: "auto", overflowX: "hidden", flex: 1 }}>
                {/* Repair status etc */}
                <Stack direction="row" alignItems="center" sx={{ p: ".7rem 1rem", backgroundColor: `${colors.red}18` }}>
                    <MechIdleStatus mech={mech} hideMoreOptionButtons />

                    <Box flex={1} />

                    <RepairBlocks defaultBlocks={mech.repair_blocks} remainDamagedBlocks={mech.damaged_blocks} size={9} sx={{ width: "fit-content" }} />
                </Stack>

                {/* KDWL stats */}
                {mech.stats && (
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
                )}

                <Divider />

                {/* Mech bar stats */}
                <MechStats mech={mech} sx={{ p: "1rem" }} />

                <Divider />

                {/* Mech loadout */}
                <Stack spacing="1rem" sx={{ p: "1rem 1.6rem" }}>
                    {mech.weapon_slots && mech.weapon_slots.length > 0 && (
                        <MechLoadout
                            items={mech.weapon_slots.map((x) => {
                                const image = x.weapon?.avatar_url || x.weapon?.image_url || ""
                                return { name: x.weapon?.label || "Unknown", imageUrl: image, tier: x.weapon?.tier }
                            })}
                            title="Weapons"
                            fallbackColor={ownerFaction.palette.primary}
                            totalSlots={mech.weapon_hardpoints}
                        />
                    )}

                    {utilitySlots && utilitySlots.length > 0 && (
                        <MechLoadout
                            items={utilitySlots.map((x) => {
                                const image = x.avatar_url || x.image_url || ""
                                return { name: x.label || "Unknown", imageUrl: image, tier: x.tier }
                            })}
                            title="Utilities"
                            fallbackColor={ownerFaction.palette.primary}
                            totalSlots={mech.utility_slots}
                        />
                    )}

                    {/* Singular ones */}
                    <Stack direction="row" alignItems="center" spacing="1.6rem">
                        <MechLoadout
                            items={[{ name: mech.power_core?.label || "Unknown", imageUrl: mech.power_core?.avatar_url || mech.power_core?.image_url || "" }]}
                            title="Core"
                            fallbackColor={ownerFaction.palette.primary}
                        />

                        <MechLoadout
                            items={[
                                {
                                    name: mech.skin_label || "Unknown",
                                    imageUrl: mech.skin_image_url || mech.avatar_url || mech.image_url || "",
                                    tier: mech.tier,
                                },
                            ]}
                            title="Skin"
                            fallbackColor={ownerFaction.palette.primary}
                        />
                    </Stack>
                </Stack>
            </Box>
        </Stack>
    )
}
