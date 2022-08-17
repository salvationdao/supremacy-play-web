import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useTheme } from "../../../../containers/theme"
import { colors } from "../../../../theme/theme"
import { LeaderboardRound } from "../../../../types"

export const RoundSelect = ({
    roundOptions,
    selectedRound,
    setSelectedRound,
}: {
    roundOptions: LeaderboardRound[]
    selectedRound?: LeaderboardRound
    setSelectedRound: React.Dispatch<React.SetStateAction<LeaderboardRound | undefined>>
}) => {
    const theme = useTheme()

    const label = useMemo(() => {
        const selected = roundOptions.find((i) => i.id === selectedRound?.id)
        if (!selected) return null
        return `${selected.name}`
    }, [roundOptions, selectedRound?.id])

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
                value={selectedRound}
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
                <MenuItem value="" onClick={() => setSelectedRound(undefined)}>
                    <Typography textTransform="uppercase" sx={{ fontWeight: "fontWeightBold" }}>
                        ALL TIME
                    </Typography>
                </MenuItem>
                {roundOptions.map((x, i) => {
                    return (
                        <MenuItem
                            key={x.id + i}
                            value={x.id}
                            onClick={() => {
                                setSelectedRound(x)
                            }}
                            sx={{ "&:hover": { backgroundColor: "#FFFFFF20" } }}
                        >
                            <Typography textTransform="uppercase" sx={{ fontWeight: "fontWeightBold" }}>
                                {x.name}
                            </Typography>
                        </MenuItem>
                    )
                })}
            </Select>
        </Stack>
    )
}
