import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useTheme } from "../../../containers/theme"
import { colors } from "../../../theme/theme"
import { Arena } from "../../../types"

export const ArenaTypeSelect = ({
    arenaTypeOptions,
    selectedArenaType,
    setSelectedArenaType,
}: {
    arenaTypeOptions: Arena[]
    selectedArenaType?: Arena
    setSelectedArenaType: React.Dispatch<React.SetStateAction<Arena | undefined>>
}) => {
    const theme = useTheme()

    const label = useMemo(() => {
        const selected = arenaTypeOptions.find((i) => i.id === selectedArenaType?.id)
        if (!selected) return null
        return `${selected.type}`
    }, [arenaTypeOptions, selectedArenaType?.id])

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    return (
        <Stack>
            <Select
                sx={{
                    width: "100%",
                    borderRadius: 0.5,
                    backgroundColor: primaryColor,
                    "&:hover": {
                        opacity: 0.9,
                    },
                    ".MuiTypography-root": {
                        px: "2.4rem",
                        pt: ".5rem",
                        pb: ".3rem",
                    },
                    "& .MuiSelect-outlined": { p: 0 },
                    ".MuiOutlinedInput-notchedOutline": {
                        border: "none !important",
                    },
                    ".MuiSelect-select": {
                        ".MuiTypography-root": {
                            color: secondaryColor,
                        },
                    },
                    ".MuiSelect-icon": {
                        fill: secondaryColor,
                    },
                }}
                displayEmpty
                value={selectedArenaType}
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
                renderValue={() => {
                    return (
                        <Typography textTransform="uppercase" sx={{ fontWeight: "fontWeightBold" }}>
                            {label || "ALL TIME"}
                        </Typography>
                    )
                }}
            >
                <MenuItem value="" onClick={() => setSelectedArenaType(undefined)}>
                    <Typography textTransform="uppercase" sx={{ fontWeight: "fontWeightBold" }}>
                        ANY
                    </Typography>
                </MenuItem>
                {arenaTypeOptions.map((x, i) => {
                    return (
                        <MenuItem
                            key={x.id + i}
                            value={x.id}
                            onClick={() => {
                                setSelectedArenaType(x)
                            }}
                            sx={{ "&:hover": { backgroundColor: "#FFFFFF20" } }}
                        >
                            <Typography textTransform="uppercase" sx={{ fontWeight: "fontWeightBold" }}>
                                {x.type}
                            </Typography>
                        </MenuItem>
                    )
                })}
            </Select>
        </Stack>
    )
}
