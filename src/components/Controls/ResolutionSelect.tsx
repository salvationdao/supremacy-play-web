import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { useStream } from "../../containers"
import { colors } from "../../theme/theme"

export const ResolutionSelect = () => {
    const { streamResolutions, selectedResolution, setSelectedResolution } = useStream()

    if (!streamResolutions || streamResolutions.length <= 0) return null

    return (
        <Stack direction="row" spacing=".24rem" alignItems="center">
            <Typography variant="body2" sx={{ lineHeight: 1 }}>
                RESOLUTION:{" "}
            </Typography>

            <Select
                sx={{
                    width: "15rem",
                    borderRadius: 0.5,
                    "&:hover": {
                        backgroundColor: colors.darkNavy,
                    },
                    "& .MuiSelect-outlined": { px: ".8rem", pt: ".48rem", pb: 0 },
                }}
                defaultValue={streamResolutions[0]}
                value={selectedResolution}
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
                {streamResolutions.map((x) => {
                    return (
                        <MenuItem
                            key={x}
                            value={x}
                            onClick={() => setSelectedResolution(x)}
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
