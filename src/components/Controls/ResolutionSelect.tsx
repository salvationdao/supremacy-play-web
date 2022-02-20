import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { StreamContainerType } from "../../containers"
import { colors } from "../../theme/theme"

interface ResolutionSelectProps {
    streamContainer: StreamContainerType
    forceResolutionFn: (quality: number) => void
}

export const ResolutionSelect = (props: ResolutionSelectProps) => {
    const { streamContainer, forceResolutionFn } = props
    const { streamResolutions, setCurrentResolution } = streamContainer
    const [options, setOptions] = useState<number[]>([])
    useMemo(() => {
        if (streamResolutions.length == 0) return
        setOptions(streamResolutions)
    }, [streamResolutions])
    if (options.length === 0) return <></>
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
                                forceResolutionFn(x)
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
