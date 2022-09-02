import { Box, Divider, Stack, Typography } from "@mui/material"
import { SvgCrown } from "../../../../../assets"
import { colors, fonts } from "../../../../../theme/theme"
import { SystemMessageDataMechBattleBegin } from "../../../../../types"

export interface MechBattleBeginDetailsProps {
    message: string
    data: SystemMessageDataMechBattleBegin
}

export const MechBattleBeginDetails = ({ message, data }: MechBattleBeginDetailsProps) => {
    return (
        <Stack spacing=".3rem">
            <Typography variant="h6">{message}</Typography>

            <Divider sx={{ my: "1rem !important", borderColor: "#FFFFFF28" }} />

            <Typography sx={{ fontFamily: fonts.nostromoBold, pb: "1rem" }}>REWARDS:</Typography>

            {data.mechs && data.mechs.length > 0 && (
                <Stack direction="row">
                    {data.mechs.map((mech) => (
                        <Box key={mech.mech_id}>
                            {console.log({ mech })}
                            <Stack direction="row" spacing=".6rem" alignItems="center">
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "fontWeightBold",
                                        span: {
                                            color: (theme) => theme.factionTheme.primary,
                                        },
                                    }}
                                >
                                    NAME: <span>{mech.name}</span>
                                </Typography>
                            </Stack>
                        </Box>
                    ))}
                </Stack>
            )}
        </Stack>
    )
}
