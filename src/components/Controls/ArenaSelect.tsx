import { MenuItem, Select, Stack, Typography } from "@mui/material"
import { useArena } from "../../containers/arena"
import { useTheme } from "../../containers/theme"
import { colors } from "../../theme/theme"

export const ArenaSelect = () => {
    const theme = useTheme()
    const { arenaList, currentArena, setCurrentArena } = useArena()

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    return (
        <Stack direction="row" spacing=".24rem" alignItems="center">
            <Typography variant="body2" sx={{ lineHeight: 1 }}>
                ARENA:{" "}
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
                defaultValue={currentArena?.type}
                value={currentArena?.type || ""}
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
                {arenaList.map((x) => {
                    return (
                        <MenuItem
                            key={x.id}
                            value={x.type}
                            onClick={() => {
                                setCurrentArena(x)
                            }}
                            sx={{ "&:hover": { backgroundColor: `#FFFFFF30` } }}
                        >
                            <Typography sx={{ lineHeight: 1 }} variant="body2">
                                {x.type}
                            </Typography>
                        </MenuItem>
                    )
                })}
            </Select>
        </Stack>
    )
}
