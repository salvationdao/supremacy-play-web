import { MenuItem, Select, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { colors } from '../../theme/theme'

interface ResolutionSelectProps {
    options: number[]
    defaultValue: number
    forceResolutionFn: (quality: number) => void
}

export const ResolutionSelect = (props: ResolutionSelectProps) => {
    const [currentResolution, setCurrentResolution] = useState<number>()

    return (
        <Stack direction="row" spacing={0.3} alignItems="center">
            <Typography variant="body2" sx={{ lineHeight: 1 }}>
                RESOLUTION:{' '}
            </Typography>

            <Select
                sx={{
                    width: 150,
                    borderRadius: 0.5,
                    '&:hover': {
                        backgroundColor: colors.darkNavy,
                    },
                    '& .MuiSelect-outlined': { px: 1, pt: 0.6, pb: 0 },
                }}
                defaultValue={currentResolution}
                value={currentResolution}
                MenuProps={{
                    variant: 'menu',
                    sx: {
                        '&& .Mui-selected': {
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
                {props.options.map((x) => {
                    return (
                        <MenuItem
                            key={x}
                            value={x}
                            onClick={() => {
                                setCurrentResolution(x)
                                props.forceResolutionFn(x)
                            }}
                            sx={{
                                '&:hover': {
                                    backgroundColor: colors.darkNavyBlue,
                                },
                            }}
                        >
                            <Typography variant="body2">{x}</Typography>
                        </MenuItem>
                    )
                })}
            </Select>
        </Stack>
    )
}
