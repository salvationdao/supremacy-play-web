import { Box, Button, InputAdornment, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { ClipThing, FancyButton } from ".."
import { SvgSearch } from "../../assets"
import { useTheme } from "../../containers/theme"
import { colors, fonts } from "../../theme/theme"
import { SortType } from "../../types/marketplace"

export interface FilterSection {
    options: string[]
    onSetFilter: React.Dispatch<React.SetStateAction<string[]>>
}

interface SortAndFiltersProps {
    onSetSearch: React.Dispatch<React.SetStateAction<string>>
    onSetSort: React.Dispatch<React.SetStateAction<SortType>>
    filters?: FilterSection[]
}

export const SortAndFilters = ({ onSetSearch, onSetSort, filters }: SortAndFiltersProps) => {
    const theme = useTheme()
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState<SortType>(SortType.NewestFirst)

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            opacity={0.7}
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%", minWidth: "30rem", maxWidth: "45rem" }}
        >
            <Stack spacing="2.5rem" sx={{ position: "relative", height: "100%", px: "1.4rem", py: "1.2rem" }}>
                <Box>
                    <Typography gutterBottom variant="caption" sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                        SEARCH
                    </Typography>

                    <Stack direction="row" spacing=".5rem">
                        <ClipThing
                            clipSize="5px"
                            clipSlantSize="2px"
                            border={{
                                isFancy: true,
                                borderColor: primaryColor,
                                borderThickness: "1px",
                            }}
                            backgroundColor={backgroundColor}
                            sx={{ height: "100%", flex: 1 }}
                        >
                            <Stack sx={{ height: "100%" }}>
                                <TextField
                                    variant="outlined"
                                    hiddenLabel
                                    fullWidth
                                    placeholder="Enter keyword..."
                                    sx={{
                                        backgroundColor: "unset",
                                        ".MuiOutlinedInput-input": {
                                            px: "1.5rem",
                                            py: ".5rem",
                                            height: "unset",
                                            "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                                                "-webkit-appearance": "none",
                                            },
                                            borderRadius: 0.5,
                                            border: `${primaryColor}50 2px solid`,
                                            ":hover, :focus, :active": { backgroundColor: "#00000080", border: `${primaryColor}99 2px solid` },
                                        },
                                        ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                                    }}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Stack>
                        </ClipThing>

                        <Box sx={{ py: ".1rem" }}>
                            <FancyButton
                                excludeCaret
                                clipThingsProps={{
                                    clipSize: "5px",
                                    clipSlantSize: "2px",
                                    backgroundColor: primaryColor,
                                    opacity: 1,
                                    border: { isFancy: true, borderColor: primaryColor, borderThickness: "1px" },
                                    sx: { position: "relative", width: "4.5rem", height: "100%" },
                                }}
                                sx={{ py: ".6rem", color: secondaryColor, minWidth: 0, height: "100%" }}
                                onClick={() => onSetSearch(search)}
                            >
                                <SvgSearch size="1.4rem" fill={secondaryColor} sx={{ pt: ".1rem" }} />
                            </FancyButton>
                        </Box>
                    </Stack>
                </Box>

                <Box>
                    <Typography gutterBottom variant="caption" sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                        SORT
                    </Typography>
                </Box>
            </Stack>
        </ClipThing>
    )
}
