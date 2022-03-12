import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { useStream } from "../../containers"
import { colors } from "../../theme/theme"

export const ResolutionSelect = () => {
    const { webRtc, currentStream, streamResolutions, setCurrentResolution } = useStream()
    const [options, setOptions] = useState<number[]>([])

    useMemo(() => {
        if (streamResolutions.length == 0) return
        setOptions(streamResolutions)
        // changeStreamQuality(streamResolutions[0])
    }, [streamResolutions])

    const changeStreamQuality = (quality: number) => {
        if (webRtc?.current && currentStream) {
            webRtc.current.forceStreamQuality(currentStream.stream_id, quality)
        }
    }

    if (options.length <= 0) return null

    return (
        <Stack direction="row" spacing={0.3} alignItems="center">
            <Typography variant="body2" sx={{ lineHeight: 1 }}>
                RESOLUTION:{" "}
            </Typography>

            <Select
                sx={{
                    width: 150,
                    borderRadius: 0.5,
                    "&:hover": {
                        backgroundColor: colors.darkNavy,
                    },
                    "& .MuiSelect-outlined": { px: 1, pt: 0.6, pb: 0 },
                }}
                defaultValue={options[0]}
                MenuProps={{
                    variant: "menu",
                    sx: {
                        "&& .Mui-selected": {
                            backgroundColor: colors.darkerNeonBlue,
                        },
                    },
                    PaperProps: {
                        sx: {
                            backgroundColor: colors.darkNavy,
                            borderRadius: 0.5,
                        },
                    },
                }}
            >
                {options.map((x) => {
                    return (
                        <MenuItem
                            key={x}
                            value={x}
                            onClick={() => {
                                setCurrentResolution(x)
                                changeStreamQuality(x)
                            }}
                            sx={{
                                "&:hover": {
                                    backgroundColor: colors.darkNavyBlue,
                                },
                            }}
                        >
                            <Typography textTransform="uppercase" variant="body2">
                                {x === 0 ? "Automatic" : `${x}P`}
                            </Typography>
                        </MenuItem>
                    )
                })}
            </Select>
        </Stack>
    )
}
