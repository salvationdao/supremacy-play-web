import { IconButton, Stack, Typography } from "@mui/material"
import { fonts } from "../../theme/theme"

interface TotalAndPageSizeOptionsProps {
    countItems?: number
    totalItems: number
    pageSize: number
    setPageSize: (value: number) => void
    changePage: (value: number) => void
}

export const TotalAndPageSizeOptions = ({ countItems, totalItems, pageSize, setPageSize, changePage }: TotalAndPageSizeOptionsProps) => {
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
                px: "1.5rem",
                py: ".6rem",
                backgroundColor: "#00000070",
                borderBottom: (theme) => `${theme.factionTheme.primary}70 1.5px solid`,
                span: { fontFamily: fonts.nostromoBold },
            }}
        >
            <Typography variant="caption" sx={{ lineHeight: 1 }}>
                <strong>DISPLAYING:</strong> {countItems || 0} of {totalItems}
            </Typography>
            <Stack
                direction="row"
                spacing=".3rem"
                alignItems="center"
                sx={{
                    "& .MuiIconButton-root": {
                        minWidth: "3rem",
                        borderRadius: 0.8,
                        fontFamily: fonts.nostromoBold,
                        ".Mui-selected": {
                            color: (theme) => theme.factionTheme.secondary,
                            backgroundColor: (theme) => `${theme.factionTheme.primary} !important`,
                        },
                    },
                }}
            >
                <IconButton
                    sx={{
                        color: (theme) => (pageSize === 5 ? `${theme.factionTheme.secondary} !important` : "#FFFFFF60 !important"),
                        backgroundColor: (theme) => (pageSize === 5 ? `${theme.factionTheme.primary} !important` : "unset"),
                    }}
                    size="small"
                    onClick={() => {
                        setPageSize(5)
                        changePage(1)
                    }}
                >
                    <Typography variant="caption" sx={{ color: "inherit" }}>
                        5
                    </Typography>
                </IconButton>
                <IconButton
                    sx={{
                        color: (theme) => (pageSize === 10 ? `${theme.factionTheme.secondary} !important` : "#FFFFFF60 !important"),
                        backgroundColor: (theme) => (pageSize === 10 ? `${theme.factionTheme.primary} !important` : "unset"),
                    }}
                    size="small"
                    onClick={() => {
                        setPageSize(10)
                        changePage(1)
                    }}
                >
                    <Typography variant="caption" sx={{ color: "inherit" }}>
                        10
                    </Typography>
                </IconButton>
                <IconButton
                    sx={{
                        color: (theme) => (pageSize === 15 ? `${theme.factionTheme.secondary} !important` : "#FFFFFF60 !important"),
                        backgroundColor: (theme) => (pageSize === 15 ? `${theme.factionTheme.primary} !important` : "unset"),
                    }}
                    size="small"
                    onClick={() => {
                        setPageSize(15)
                        changePage(1)
                    }}
                >
                    <Typography variant="caption" sx={{ color: "inherit" }}>
                        15
                    </Typography>
                </IconButton>
            </Stack>
        </Stack>
    )
}
