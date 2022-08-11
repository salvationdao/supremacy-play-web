import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { useTheme } from "../../../../containers/theme"
import { colors } from "../../../../theme/theme"
import { LeaderboardRound } from "../../../../types"

export const RoundSelect = ({
    roundOptions,
    selectedRound,
    setSelectedRound,
}: {
    roundOptions: LeaderboardRound[]
    selectedRound: number
    setSelectedRound: React.Dispatch<React.SetStateAction<number>>
}) => {
    const theme = useTheme()

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
            >
                {roundOptions.map((x, i) => {
                    return (
                        <MenuItem
                            key={x.id + i}
                            value={x.round_number}
                            onClick={() => {
                                setSelectedRound(x.round_number)
                            }}
                            sx={{ "&:hover": { backgroundColor: "#FFFFFF20" } }}
                        >
                            <Typography textTransform="uppercase">ROUND #{x.round_number}</Typography>
                        </MenuItem>
                    )
                })}
            </Select>
        </Stack>
    )
}
