import { Box, Divider, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { SvgCrown } from "../../../../../assets"
import { useSupremacy } from "../../../../../containers"
import { colors } from "../../../../../theme/theme"
import { MechBattleBrief, SystemMessageDataMechBattleComplete } from "../../../../../types"

export interface MechBattleCompleteDetailsProps {
    message: string
    data: SystemMessageDataMechBattleComplete
}

export const MechBattleCompleteDetails = ({ message, data }: MechBattleCompleteDetailsProps) => {
    const { getFaction } = useSupremacy()

    const [ownedMechBrief, restOfTheBriefs] = useMemo(() => {
        let ownedMechBrief: MechBattleBrief | null = null
        const restOfTheBriefs: MechBattleBrief[] = []

        for (let i = 0; i < data.briefs.length; i++) {
            const e = data.briefs[i]
            if (e.mech_id === data.mech_id) {
                ownedMechBrief = e
            } else {
                restOfTheBriefs.push(e)
            }
        }

        return [ownedMechBrief, restOfTheBriefs]
    }, [data])

    return (
        <Stack spacing=".3rem">
            <Typography variant="h6">{message}</Typography>

            <Divider sx={{ my: "1rem !important", borderColor: "#FFFFFF28" }} />

            {ownedMechBrief && (
                <>
                    <Stack direction="row" spacing=".6rem" alignItems="center">
                        {!ownedMechBrief.killed && <SvgCrown size="1.7rem" fill={colors.gold} />}
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: "fontWeightBold",
                                span: {
                                    fontFamily: "inherit",
                                    color: (theme) => theme.factionTheme.primary,
                                },
                            }}
                        >
                            YOUR MECH: <span>{ownedMechBrief.name || ownedMechBrief.label}</span>
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing=".2rem" alignItems="center">
                        <Typography
                            sx={{
                                fontWeight: "fontWeightBold",
                                span: { color: ownedMechBrief.killed ? colors.red : colors.green, fontFamily: "inherit" },
                            }}
                        >
                            STATUS: <span>{ownedMechBrief.killed ? "OUT OF COMMISSION" : "SURVIVED"}</span>
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing=".2rem" alignItems="center">
                        <Typography
                            sx={{
                                fontWeight: "fontWeightBold",
                                span: { color: ownedMechBrief.kills > 0 ? colors.red : colors.lightGrey, fontFamily: "inherit" },
                            }}
                        >
                            KILLS: <span>{ownedMechBrief.kills}</span>
                        </Typography>
                    </Stack>

                    <Divider sx={{ my: "1rem !important", borderColor: "#FFFFFF28" }} />
                </>
            )}

            <Typography
                variant="h6"
                sx={{
                    fontWeight: "fontWeightBold",
                    span: {
                        fontFamily: "inherit",
                        color: data.faction_won ? colors.green : colors.red,
                    },
                }}
            >
                FACTION: <span>{data.faction_won ? " VICTORY!" : "DEFEATED!"}</span>
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 50%)",
                    gap: ".2rem",
                }}
            >
                {restOfTheBriefs.map((d, index) => (
                    <Stack key={index} direction="row" spacing=".3rem" alignItems="center">
                        {!d.killed && <SvgCrown size="1.2rem" fill={colors.gold} />}

                        <Typography
                            sx={{
                                overflowX: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                color: getFaction(d.faction_id).primary_color,
                                textDecoration: d.killed ? "line-through" : "none",
                                opacity: d.killed ? 0.9 : 1,
                            }}
                        >
                            {d.name || d.label}
                        </Typography>
                    </Stack>
                ))}
            </Box>
        </Stack>
    )
}
