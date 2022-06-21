import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { useStream } from "../../containers"
import { useTheme } from "../../containers/theme"
import { colors } from "../../theme/theme"

export const ResolutionSelect = () => {
    const theme = useTheme()
    const { resolutions, selectedResolution, setSelectedResolution } = useStream()

    if (!resolutions || resolutions.length <= 0) return null

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

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
                    ".MuiTypography-root": {
                        px: ".8rem",
                        pt: ".48rem",
                    },
                    "& .MuiSelect-outlined": { p: 0 },
                }}
                defaultValue={resolutions[0]}
                value={selectedResolution || resolutions[0] || -1}
                MenuProps={{
                    variant: "menu",
                    sx: {
                        "&& .Mui-selected": {
                            ".MuiTypography-root": {
                                color: secondaryColor,
                            },
                            backgroundColor: primaryColor,
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
                {resolutions.map((x) => {
                    return (
                        <MenuItem
                            key={x}
                            value={x}
                            onClick={() => setSelectedResolution(x)}
                            sx={{
                                "&:hover": {
                                    backgroundColor: `#FFFFFF30`,
                                },
                            }}
                        >
                            <Typography textTransform="uppercase" variant="body2" sx={{ lineHeight: 1 }}>
                                {x === 0 ? "Automatic" : `${x}P`}
                            </Typography>
                        </MenuItem>
                    )
                })}
            </Select>
        </Stack>
    )
}
