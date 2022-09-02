import { Box, Stack, Typography } from "@mui/material"
import { SvgCrown } from "../../../../../../assets"
import { useSupremacy } from "../../../../../../containers"
import { useTheme } from "../../../../../../containers/theme"
import { colors } from "../../../../../../theme/theme"
import { MechBattleBriefStruct } from "../../../../../../types"
import { ClipThing } from "../../../../../Common/ClipThing"

export const MechBattleBrief = ({ battleBrief }: { battleBrief: MechBattleBriefStruct }) => {
    const theme = useTheme()
    const { getFaction } = useSupremacy()

    return (
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
                {/* Mech image and deploy button */}
                <Box
                    sx={{
                        height: "16rem",
                        width: "100%",
                        overflow: "hidden",
                        background: `url(${imageUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        borderRadius: 0.3,
                    }}
                />

                {/* Right side */}
                <Stack spacing="1.2rem" direction="row" alignItems="flex-start" sx={{ position: "relative", py: ".2rem", flex: 1 }}>
                    <Stack sx={{ flex: 1 }}>
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
                                sx={{
                                    fontSize: "1.8rem",
                                    color: !mechDetails.name ? colors.grey : "#FFFFFF",
                                    display: "-webkit-box",
                                    overflow: "hidden",
                                    overflowWrap: "anywhere",
                                    textOverflow: "ellipsis",
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: "vertical",
                                }}
                            >
                                {mechDetails.name || "Unnamed"}
                            </Typography>
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: fonts.nostromoBlack,
                                fontWeight: "fontWeightBold",
                                display: "-webkit-box",
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {mechDetails.label}
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
        </ClipThing>
    )

    return (
        <Box>
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
    )
}
