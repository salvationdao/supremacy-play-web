import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useOvenStream } from "../../../containers/oven"
import { NiceSelect } from "../../Common/Nice/NiceSelect"

const resolutionToText = (resolution: string) => {
    if (resolution === "1080_60") {
        return "1080p 60fps"
    }
    if (resolution === "potato") {
        return "potato"
    }
    return resolution + "p"
}

export const OvenResolutionSelect = () => {
    const { ovenResolutions, selectedOvenResolution, setSelectedOvenResolution } = useOvenStream()

    const options = useMemo(() => ovenResolutions.map((o) => ({ label: resolutionToText(o), value: o })), [ovenResolutions])

    if (!ovenResolutions || ovenResolutions.length <= 0) return null

    return (
        <Stack direction="row" alignItems="center" spacing="1rem">
            <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                RESOLUTION:
            </Typography>

            <NiceSelect
                options={options}
                defaultValue={ovenResolutions[0]}
                selected={selectedOvenResolution || ovenResolutions[0] || "0"}
                onSelected={(value) => setSelectedOvenResolution(value)}
                sx={{
                    minWidth: "14rem",
                    ".MuiOutlinedInput-root": { border: "none" },
                }}
            />
        </Stack>
    )
}
