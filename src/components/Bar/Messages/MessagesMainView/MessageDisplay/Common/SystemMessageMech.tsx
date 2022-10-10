import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { SvgCrown, SvgDeath, SvgSkull, SvgSkull2 } from "../../../../../../assets"
import { useSupremacy } from "../../../../../../containers"
import { useTheme } from "../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../helpers"
import { colors, fonts } from "../../../../../../theme/theme"
import { SystemMessageMechStruct } from "../../../../../../types"
import { ClipThing } from "../../../../../Common/ClipThing"
import { RepairBlocks } from "../../../../../Hangar/WarMachinesHangar/Common/MechRepairBlocks"
import { CropMaxLengthText } from "../../../../../../theme/styles"

export const SystemMessageMech = ({ mech }: { mech: SystemMessageMechStruct }) => {
    const { name, image_url, tier, total_blocks, damaged_blocks, kills, killed } = mech

    const theme = useTheme()
    const { getFaction } = useSupremacy()
    const rarityDeets = useMemo(() => getRarityDeets(tier || ""), [tier])

    return (
        <Stack spacing="1rem" sx={{ width: "20rem" }}>
            <ClipThing clipSize="6px" opacity={0.8} border={{ borderColor: theme.factionTheme.primary }} backgroundColor={theme.factionTheme.background}>
                <Stack
                    spacing="1.2rem"
                    alignItems="stretch"
                    sx={{
                        position: "relative",
                        p: ".8rem 1rem",
                        borderRadius: 0.8,
                    }}
                >
                    {/* Mech image */}
                    <Box
                        sx={{
                            position: "relative",
                            height: "16rem",
                            width: "100%",
                            borderRadius: 0.3,
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                height: "100%",
                                width: "100%",
                                background: `url(${image_url})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                            }}
                        />

                        {!total_blocks && killed && (
                            <Stack
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    px: "4rem",
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: "linear-gradient(#00000090, #000000)",
                                    zIndex: 2,
                                }}
                            >
                                <SvgSkull size="90%" />
                            </Stack>
                        )}

                        {!total_blocks && !killed && <SvgCrown size="2rem" fill={colors.gold} sx={{ position: "absolute", top: ".4rem", left: ".4rem" }} />}
                    </Box>

                    {/* Info */}
                    <Stack sx={{ flex: 1, py: ".2rem" }}>
                        <Box sx={{ py: ".2rem", flex: 1 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    fontFamily: fonts.nostromoHeavy,
                                    color: rarityDeets.color,
                                }}
                            >
                                {rarityDeets.label}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: "1.8rem",
                                    ...CropMaxLengthText,
                                }}
                            >
                                {name}
                            </Typography>
                        </Box>

                        {total_blocks && <RepairBlocks defaultBlocks={total_blocks} remainDamagedBlocks={damaged_blocks || 0} />}
                    </Stack>
                </Stack>
            </ClipThing>

            {killed && (
                <Stack spacing=".3rem" sx={{ px: "1rem" }}>
                    <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                        KILLED BY:
                    </Typography>

                    <Stack spacing=".5rem" direction="row" alignItems="flex-start">
                        <SvgSkull2 size="1.4rem" />
                        <Typography
                            sx={{
                                fontWeight: "fontWeightBold",
                                color: getFaction(killed.faction_id).primary_color,
                                lineHeight: 1.2,
                                ...CropMaxLengthText,
                                WebkitLineClamp: 2, // change to max number of lines
                            }}
                        >
                            {killed.name}
                        </Typography>
                    </Stack>
                </Stack>
            )}

            {kills && (
                <Stack spacing=".3rem" sx={{ px: "1rem" }}>
                    <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                        KILLS:
                    </Typography>

                    <>
                        {kills.map((kill, i) => {
                            const killedFaction = getFaction(kill.faction_id)
                            return (
                                <Stack key={i} spacing=".5rem" direction="row" alignItems="flex-start">
                                    <SvgDeath size="1.4rem" />
                                    <Typography
                                        sx={{
                                            fontWeight: "fontWeightBold",
                                            color: killedFaction.primary_color,
                                            textDecoration: "line-through",
                                            lineHeight: 1.2,
                                            ...CropMaxLengthText,
                                            WebkitLineClamp: 2, // change to max number of lines
                                        }}
                                    >
                                        {kill.name}
                                    </Typography>
                                </Stack>
                            )
                        })}
                    </>
                </Stack>
            )}
        </Stack>
    )
}
