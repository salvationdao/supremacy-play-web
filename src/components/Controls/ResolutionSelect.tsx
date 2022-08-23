import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { useStream } from "../../containers"
import { useOvenStream } from "../../containers/oven"
import { useTheme } from "../../containers/theme"
import { colors } from "../../theme/theme"

export const ResolutionSelect = () => {
    const theme = useTheme()
    const { resolutions, selectedResolution, setSelectedResolution, currentStream } = useStream()

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
                    ".MuiTypography-root": {
                        px: ".8rem",
                        pt: ".48rem",
                    },
                    "& .MuiSelect-outlined": { p: 0 },
                }}
                defaultValue={resolutions[0]}
                value={selectedResolution || resolutions[0] || 0}
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
                            onClick={() => {
                                setSelectedResolution(x)
                                localStorage.setItem(`${currentStream?.host}-resolution`, x.toString())
                            }}
                            sx={{ "&:hover": { backgroundColor: `#FFFFFF30` } }}
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
    const { ovenResolutions, selectedOvenResolution, setSelectedOvenResolution, currentOvenStream } = useOvenStream()

    if (!ovenResolutions || ovenResolutions.length <= 0) return null

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
                                localStorage.setItem(`${currentOvenStream?.name}-resolution`, x.toString())
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
