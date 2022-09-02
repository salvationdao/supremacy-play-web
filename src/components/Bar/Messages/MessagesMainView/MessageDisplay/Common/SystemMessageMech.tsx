import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { SvgCrown, SvgSkull } from "../../../../../../assets"
import { useSupremacy } from "../../../../../../containers"
import { useTheme } from "../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../helpers"
import { colors, fonts } from "../../../../../../theme/theme"
import { SystemMessageMechStruct } from "../../../../../../types"
import { ClipThing } from "../../../../../Common/ClipThing"
import { RepairBlocks } from "../../../../../Hangar/WarMachinesHangar/Common/MechRepairBlocks"

export const SystemMessageMech = ({ mech }: { mech: SystemMessageMechStruct }) => {
    const { name, image_url, tier, total_blocks, damaged_blocks, kills, killed } = mech

    const theme = useTheme()
    const { getFaction } = useSupremacy()
    const rarityDeets = useMemo(() => getRarityDeets(tier || ""), [tier])

    return (
        <ClipThing
            clipSize="6px"
            opacity={0.8}
            border={{ borderColor: theme.factionTheme.primary, borderThickness: killed ? "0" : "1px" }}
            backgroundColor={theme.factionTheme.background}
        >
            <Stack
                spacing="1.2rem"
                alignItems="stretch"
                sx={{
                    position: "relative",
                    p: ".8rem 1rem",
                    borderRadius: 0.8,
                    width: "20rem",
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

                    {killed ? (
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
                    ) : (
                        <SvgCrown size="2rem" fill={colors.gold} sx={{ position: "absolute", top: ".4rem", left: ".4rem" }} />
                    )}
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
                                display: "-webkit-box",
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {name}
                        </Typography>
                    </Box>

                    {total_blocks && <RepairBlocks defaultBlocks={total_blocks} remainDamagedBlocks={damaged_blocks || 0} />}
                </Stack>
            </Stack>
        </ClipThing>
    )

    // return (
    //     <Box>
    //         <Stack direction="row" spacing=".6rem" alignItems="center">
    //             {!battleBrief.killed && <SvgCrown size="1.7rem" fill={colors.gold} />}
    //         </Stack>

    //         {battleBrief.kills && battleBrief.kills.length > 0 && (
    //             <>
    //                 <Stack direction="column" spacing=".2rem">
    //                     <Typography
    //                         sx={{
    //                             fontWeight: "fontWeightBold",
    //                         }}
    //                     >
    //                         KILLS:
    //                     </Typography>

    //                     {battleBrief.kills.map((k, i) => (
    //                         <Typography
    //                             key={i}
    //                             sx={{
    //                                 fontWeight: "fontWeightBold",
    //                                 color: getFaction(k.faction_id)?.primary_color,
    //                                 pl: "4rem",
    //                             }}
    //                         >
    //                             {k.name}
    //                         </Typography>
    //                     ))}
    //                 </Stack>
    //             </>
    //         )}

    //         {battleBrief.killed && (
    //             <Stack direction="column" spacing=".2rem">
    //                 <Typography
    //                     sx={{
    //                         fontWeight: "fontWeightBold",
    //                     }}
    //                 >
    //                     KILLED BY:
    //                 </Typography>
    //                 <Typography
    //                     sx={{
    //                         fontWeight: "fontWeightBold",
    //                         color: getFaction(battleBrief.killed.faction_id)?.primary_color,
    //                         pl: "4rem",
    //                     }}
    //                 >
    //                     {battleBrief.killed.name}
    //                 </Typography>
    //             </Stack>
    //         )}
    //     </Box>
    // )
}
