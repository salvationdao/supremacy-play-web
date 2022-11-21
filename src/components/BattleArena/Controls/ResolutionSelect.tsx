import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { useOvenStream } from "../../../containers/oven"
import { useTheme } from "../../../containers/theme"
import { colors } from "../../../theme/theme"

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
    const theme = useTheme()
    const { ovenResolutions, selectedOvenResolution, setSelectedOvenResolution } = useOvenStream()

    if (!ovenResolutions || ovenResolutions.length <= 0) return null

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.text

    return (
        <Stack direction="row" spacing=".24rem" alignItems="center">
            <Typography variant="body2" sx={{ lineHeight: 1 }}>
                RESOLUTION:{" "}
            </Typography>

            <Select
                sx={{
                    width: "15rem",
                    borderRadius: 0.5,
                    ".MuiTypography-root": {
                        px: ".8rem",
                        pt: ".48rem",
                    },
                    "& .MuiSelect-outlined": { p: 0 },
                }}
                defaultValue={ovenResolutions[0]}
                value={selectedOvenResolution || ovenResolutions[0] || 0}
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
                {ovenResolutions.map((x) => {
                    return (
                        <MenuItem
                            key={x}
                            value={x}
                            onClick={() => {
                                setSelectedOvenResolution(x)
                            }}
                            sx={{ "&:hover": { backgroundColor: `#FFFFFF30` } }}
                        >
                            <Typography variant="body2" sx={{ lineHeight: 1 }}>
                                {resolutionToText(x)}
                            </Typography>
                        </MenuItem>
                    )
                })}
            </Select>
        </Stack>
    )
}
