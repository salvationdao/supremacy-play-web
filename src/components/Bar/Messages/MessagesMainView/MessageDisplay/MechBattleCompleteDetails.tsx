import { Box, Divider, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { SvgCrown } from "../../../../../assets"
import { useSupremacy } from "../../../../../containers"
import { colors, fonts } from "../../../../../theme/theme"
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

            <Typography
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    color: data.faction_won ? colors.green : colors.red,
                }}
            >
                {data.faction_won ? "FACTION WIN!" : "FACTION DEFEATED!"}
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
                                opacity: d.killed ? 0.6 : 1,
                            }}
                        >
                            {d.name || d.label}
                        </Typography>
                    </Stack>
                ))}
            </Box>

            {ownedMechBrief && (
                <>
                    <Divider sx={{ borderColor: "#FFFFFF28" }} />

                    <Stack direction="row" spacing=".6rem" alignItems="center" sx={{ pt: ".8rem" }}>
                        {!ownedMechBrief.killed && <SvgCrown size="1.7rem" fill={colors.gold} />}
                        <Typography variant="h6">{ownedMechBrief.name || ownedMechBrief.label}</Typography>
                    </Stack>

                    <Stack direction="row" spacing=".2rem" alignItems="center">
                        <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                            STATUS:{" "}
                            <span style={{ color: ownedMechBrief.killed ? colors.red : colors.green, fontFamily: "inherit" }}>
                                {ownedMechBrief.killed ? "OUT OF COMMISSION" : "SURVIVED"}
                            </span>
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing=".2rem" alignItems="center">
                        <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                            KILLS: {ownedMechBrief.kills}
                        </Typography>
                    </Stack>
                </>
            )}
        </Stack>
    )
}
