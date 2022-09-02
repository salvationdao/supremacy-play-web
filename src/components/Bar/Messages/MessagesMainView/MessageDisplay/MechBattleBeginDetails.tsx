import { Stack, Typography } from "@mui/material"
import { fonts } from "../../../../../theme/theme"
import { SystemMessageDataMechBattleBegin } from "../../../../../types"
import { SystemMessageMech } from "./Common/SystemMessageMech"

export interface MechBattleBeginDetailsProps {
    message: string
    data: SystemMessageDataMechBattleBegin
}

export const MechBattleBeginDetails = ({ message, data }: MechBattleBeginDetailsProps) => {
    return (
        <Stack spacing="3rem" sx={{ px: "1rem", pt: "1rem", pb: "3rem" }}>
            <Typography variant="h6">{message}</Typography>
            <MechsSection data={data} />
        </Stack>
    )
}

const MechsSection = ({ data }: { data: SystemMessageDataMechBattleBegin }) => {
    if (!data.mechs || data.mechs.length <= 0) {
        return null
    }

    return (
        <Stack spacing="1rem">
            <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{`YOUR MECH${data.mechs.length > 1 ? "S" : ""}:`}</Typography>

            <Stack direction="row" spacing="1.4rem">
                {data.mechs.map((mech) => (
                    <SystemMessageMech key={mech.mech_id} mech={mech} />
                ))}
            </Stack>
        </Stack>
    )
}
