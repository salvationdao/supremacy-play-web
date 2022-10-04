import { Autocomplete, Box, TextField, Typography } from "@mui/material"
import { useArena } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"

export const ArenaSelector = () => {
    const { factionTheme } = useTheme()
    const { arenaList, currentArena, setCurrentArena } = useArena()

    return (
        <Autocomplete
            fullWidth
            disableClearable
            options={arenaList.map((a) => ({ id: a.id, name: a?.name?.toUpperCase() || "" }))}
            onChange={(event, value) => {
                const it: { id: string; name: string } | string = value
                if (typeof it === "string") return
                setCurrentArena((prev) => arenaList.find((a) => a.id === it.id) || prev)
            }}
            value={currentArena}
            getOptionLabel={(option) => `ARENA - ${option?.name?.toUpperCase() || ""}`}
            sx={{
                "&& .MuiInputBase-hiddenLabel": {
                    p: 0,
                    backgroundColor: "unset",
                },
                "&& .MuiOutlinedInput-root": {
                    p: 0,
                    backgroundColor: "unset",
                },
                "&& .MuiAutocomplete-input": {
                    px: "1.5rem",
                    py: ".8rem",
                },
            }}
            componentsProps={{
                paper: {
                    sx: {
                        backgroundColor: factionTheme.background,
                        borderRadius: 0.5,
                    },
                },
            }}
            renderOption={(props, option: { id: string; name: string }) => (
                <Box component="li" {...props}>
                    <Typography variant="body1" sx={{ fontFamily: fonts.nostromoBold }}>
                        Arena - {option.name}
                    </Typography>
                </Box>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    hiddenLabel
                    fullWidth
                    sx={{
                        ".MuiOutlinedInput-input": {
                            height: "unset",
                            fontSize: "1.8rem",
                            color: factionTheme.secondary,
                            fontFamily: fonts.nostromoBold,
                            borderRadius: 0,
                            border: `${factionTheme.primary}50 2px solid`,
                            backgroundColor: factionTheme.primary,
                            cursor: "pointer",
                            ":hover, :focus, :active": { border: `${factionTheme.primary}99 2px solid` },
                            "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                                WebkitAppearance: "none",
                            },
                        },
                        ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                        ".MuiSvgIcon-root": {
                            fill: factionTheme.secondary,
                        },
                    }}
                />
            )}
        />
    )
}
