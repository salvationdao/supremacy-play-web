import { Box, Stack, Typography } from "@mui/material"
import { SvgCrown, SvgDeath, SvgSkull, SvgSkull2 } from "../../../../../../assets"
import { useSupremacy } from "../../../../../../containers"
import { useTheme } from "../../../../../../containers/theme"
import { truncateTextLines } from "../../../../../../helpers"
import { colors, fonts } from "../../../../../../theme/theme"
import { SystemMessageMechStruct } from "../../../../../../types"
import { RepairBlocks } from "../../../../../Common/Mech/MechRepairBlocks"
import { NiceBoxThing } from "../../../../../Common/Nice/NiceBoxThing"
import { TypographyTruncated } from "../../../../../Common/TypographyTruncated"

export const SystemMessageMech = ({ mech }: { mech: SystemMessageMechStruct }) => {
    const { name, image_url, total_blocks, damaged_blocks, kills, killed } = mech

    const theme = useTheme()
    const { getFaction } = useSupremacy()

    return (
        <Stack spacing="1rem" sx={{ width: "15rem" }}>
            <NiceBoxThing border={{ color: theme.factionTheme.primary }} background={{ colors: [`${theme.factionTheme.background}60`] }}>
                <Stack
                    spacing="1.2rem"
                    alignItems="stretch"
                    sx={{
                        position: "relative",
                        p: ".8rem",
                        borderRadius: 0.8,
                    }}
                >
                    {/* Mech image */}
                    <Box
                        sx={{
                            position: "relative",
                            height: "10rem",
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
                                    px: "3rem",
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
                    <Stack sx={{ flex: 1 }}>
                        <TypographyTruncated>{name}</TypographyTruncated>

                        {total_blocks && <RepairBlocks defaultBlocks={total_blocks} remainDamagedBlocks={damaged_blocks || 0} />}
                    </Stack>
                </Stack>
            </NiceBoxThing>

            {killed && (
                <Stack spacing=".3rem" sx={{ px: ".6rem" }}>
                    <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                        KILLED BY:
                    </Typography>

                    <TypographyTruncated sx={{ fontWeight: "bold", color: getFaction(killed.faction_id).palette.primary }}>
                        <SvgSkull2 inline size="1.6rem" /> {killed.name}
                    </TypographyTruncated>
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
                                            fontWeight: "bold",
                                            color: killedFaction.palette.primary,
                                            textDecoration: "line-through",
                                            lineHeight: 1.2,
                                            ...truncateTextLines(2),
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
