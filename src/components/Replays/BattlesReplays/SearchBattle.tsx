import { TextField } from "@mui/material"
import { useTheme } from "../../../containers/theme"

export const SearchBattle = ({
    searchValueInstant,
    setSearchValue,
    placeholder,
}: {
    searchValueInstant: string
    setSearchValue: React.Dispatch<React.SetStateAction<string>>
    placeholder?: string
}) => {
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary

    return (
        <TextField
            variant="outlined"
            hiddenLabel
            fullWidth
            placeholder={placeholder || "Enter keywords..."}
            sx={{
                backgroundColor: "unset",
                ".MuiOutlinedInput-input": {
                    px: "1.5rem",
                    py: ".5rem",
                    height: "unset",
                    "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                        WebkitAppearance: "none",
                    },
                    borderRadius: 0.5,
                    border: `${primaryColor}50 2px solid`,
                    ":hover, :focus, :active": { backgroundColor: "#00000080", border: `${primaryColor}99 2px solid` },
                },
                ".MuiOutlinedInput-notchedOutline": { border: "unset" },
            }}
            value={searchValueInstant}
            onChange={(e) => setSearchValue(e.target.value)}
        />
    )
}
