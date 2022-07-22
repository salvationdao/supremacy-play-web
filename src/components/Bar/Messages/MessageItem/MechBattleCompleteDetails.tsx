import { Box, Divider, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { SvgCrown } from "../../../../assets"
import { colors, fonts } from "../../../../theme/theme"
import { MechBattleBrief, SystemMessageDataMechBattleComplete } from "../../../../types"

export interface MechBattleCompleteDetailsProps {
    message: string
    data: SystemMessageDataMechBattleComplete
}

export const MechBattleCompleteDetails = ({ message, data }: MechBattleCompleteDetailsProps) => {
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
            <Typography>{message}</Typography>
            <Typography
                sx={{
                    fontFamily: fonts.nostromoBold,
                    color: data.faction_won ? colors.green : colors.red,
                }}
            >
                {data.faction_won ? "FACTION WIN" : "LOST"}
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
                                textDecoration: d.killed ? "line-through" : "none",
                                color: d.killed ? colors.grey : colors.gold,
                            }}
                        >
                            {d.name || d.label}
                        </Typography>
                    </Stack>
                ))}
            </Box>
            {ownedMechBrief && (
                <>
                    <Divider
                        sx={{
                            my: ".5rem !important",
                            borderColor: colors.darkGrey,
                        }}
                    />
                    <Stack direction="row" spacing=".2rem" alignItems="baseline">
                        <Typography
                            sx={{
                                fontFamily: fonts.nostromoBold,
                                whiteSpace: "nowrap",
                                textTransform: "uppercase",
                                color: colors.lightGrey,
                            }}
                        >
                            Your Mech:
                        </Typography>
                        <Stack direction="row" spacing=".3rem" alignItems="center">
                            {!ownedMechBrief.killed && <SvgCrown size="1.2rem" fill={colors.gold} />}
                            <Typography
                                sx={{
                                    overflowX: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {ownedMechBrief.name || ownedMechBrief.label}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack direction="row" spacing=".2rem" alignItems="baseline">
                        <Typography
                            sx={{
                                whiteSpace: "nowrap",
                                textTransform: "uppercase",
                                color: colors.lightGrey,
                            }}
                        >
                            Status:
                        </Typography>
                        <Typography
                            sx={{
                                whiteSpace: "nowrap",
                                color: ownedMechBrief.killed ? colors.red : colors.green,
                            }}
                        >
                            {ownedMechBrief.killed ? "OUT OF COMMISION" : "SURVIVED"}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing=".2rem" alignItems="baseline">
                        <Typography
                            sx={{
                                whiteSpace: "nowrap",
                                textTransform: "uppercase",
                                color: colors.lightGrey,
                            }}
                        >
                            Kills:
                        </Typography>
                        <Typography
                            sx={{
                                whiteSpace: "nowrap",
                            }}
                        >
                            {ownedMechBrief.kills}
                        </Typography>
                    </Stack>
                </>
            )}
        </Stack>
    )
}
