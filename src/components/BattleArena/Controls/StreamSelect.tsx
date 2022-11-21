import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useOvenStream } from "../../../containers/oven"
import { NiceSelect } from "../../Common/Nice/NiceSelect"

export const OvenStreamSelect = () => {
    const { currentOvenStream, changeOvenStream, ovenStreamOptions } = useOvenStream()

    const options = useMemo(() => ovenStreamOptions.map((o) => ({ label: o.name, value: o.name })), [ovenStreamOptions])

    return (
        <Stack direction="row" alignItems="center" spacing="1rem">
            <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                STREAM SERVER:
            </Typography>

            <NiceSelect
                options={options}
                defaultValue={currentOvenStream?.name}
                selected={currentOvenStream ? currentOvenStream.name : ""}
                onSelected={(value) => {
                    const ovenStream = ovenStreamOptions.find((o) => o.name === value)
                    if (ovenStream) changeOvenStream(ovenStream)
                }}
                sx={{
                    minWidth: "14rem",
                    ".MuiOutlinedInput-root": { border: "none" },
                }}
            />
        </Stack>
    )
}
