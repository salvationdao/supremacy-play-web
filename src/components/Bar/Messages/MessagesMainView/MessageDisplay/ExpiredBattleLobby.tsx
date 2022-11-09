import { SystemMessageMechStruct } from "../../../../../types"
import { Stack, Typography } from "@mui/material"
import { fonts } from "../../../../../theme/theme"
import { SystemMessageMech } from "./Common/SystemMessageMech"
import { useMemo } from "react"

interface ExpiredBattleLobbyProps {
    message: string
    data: SystemMessageMechStruct[]
}

export const ExpiredBattleLobby = ({ message, data }: ExpiredBattleLobbyProps) => {
    const description = useMemo(() => {
        if (!data || data.length === 0) return ""
        if (data.length === 1) {
            return "The following mech has been released:"
        }
        return "The following mechs have been released:"
    }, [data])
    return (
        <Stack spacing="3rem" sx={{ px: "1rem", pt: "1rem", pb: "3rem" }}>
            <Typography variant="h6">{message}</Typography>
            {data && data.length > 0 && (
                <Stack spacing="1rem">
                    <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{description}</Typography>
                    <Stack direction="row" spacing="1.4rem">
                        {data.map((mech) => (
                            <SystemMessageMech key={mech.mech_id} mech={mech} />
                        ))}
                    </Stack>
                </Stack>
            )}
        </Stack>
    )
}
