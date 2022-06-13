import { IconButton, Stack, Typography } from "@mui/material"
import { SvgGridView, SvgListView } from "../../assets"
import { fonts } from "../../theme/theme"

interface TotalAndPageSizeOptionsProps {
    countItems?: number
    totalItems: number
    pageSize: number
    isGridView?: boolean
    setPageSize: (value: number) => void
    changePage: (value: number) => void
    toggleIsGridView?: (value: boolean) => void
}

export const TotalAndPageSizeOptions = ({
    countItems,
    totalItems,
    pageSize,
    isGridView,
    setPageSize,
    changePage,
    toggleIsGridView,
}: TotalAndPageSizeOptionsProps) => {
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
                strong: { fontFamily: fonts.nostromoBlack },
            }}
        >
            <Typography variant="caption" sx={{ lineHeight: 1 }}>
                <strong>DISPLAYING:</strong> {countItems || 0} of {totalItems}
            </Typography>
            <Stack
                direction="row"
                spacing=".6rem"
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
                {toggleIsGridView && (
                    <>
                        <IconButton size="small" onClick={() => toggleIsGridView(false)}>
                            <SvgListView size="1.2rem" sx={{ opacity: isGridView ? 0.3 : 1 }} />
                        </IconButton>
                        <IconButton size="small" onClick={() => toggleIsGridView(true)}>
                            <SvgGridView size="1.2rem" sx={{ opacity: isGridView ? 1 : 0.3 }} />
                        </IconButton>
                    </>
                )}

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