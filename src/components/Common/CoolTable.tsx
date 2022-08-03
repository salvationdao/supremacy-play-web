import FirstPageIcon from "@mui/icons-material/FirstPage"
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight"
import LastPageIcon from "@mui/icons-material/LastPage"
import {
    Box,
    CircularProgress,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from "@mui/material"
import { ReactNode, useMemo } from "react"
import { useTheme } from "../../containers/theme"
import { colors, fonts } from "../../theme/theme"

interface CoolTableProps<T> {
    title?: string
    tableHeadings: string[]
    alignments?: ("left" | "right" | "center")[]
    widths?: string[]
    items?: T[]
    renderItem: (item: T, index: number) => ReactNode[]
    isLoading?: boolean
    loadError?: string
    titleRowHeight?: string
    cellPadding?: string
    paginationProps?: {
        page: number // Starts from 0
        pageSize: number
        totalItems: number
        changePage: (newPage: number) => void
        changePageSize: (newPageSize: number) => void
        pageSizeOptions?: number[]
    }
}

export const CoolTable = <T,>({
    title,
    tableHeadings,
    alignments,
    widths,
    items,
    renderItem,
    isLoading,
    loadError,
    titleRowHeight = "5.5rem",
    cellPadding = ".8rem 1rem",
    paginationProps,
}: CoolTableProps<T>) => {
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    const tableBody = useMemo(() => {
        if (loadError) {
            return (
                <TableRow sx={{ height: "100% !important" }}>
                    <TableCell sx={{ flex: 1, justifyContent: "center", borderBottom: "none" }}>
                        <Stack alignItems="center" justifyContent="center" sx={{ height: "8rem" }}>
                            <Typography
                                sx={{
                                    color: colors.red,
                                    fontFamily: fonts.nostromoBold,
                                    textAlign: "center",
                                }}
                            >
                                {loadError}
                            </Typography>
                        </Stack>
                    </TableCell>
                </TableRow>
            )
        }

        if (!items || isLoading) {
            return (
                <TableRow sx={{ height: "100% !important" }}>
                    <TableCell sx={{ flex: 1, justifyContent: "center", borderBottom: "none" }}>
                        <Stack alignItems="center" justifyContent="center" sx={{ height: "8rem" }}>
                            <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                        </Stack>
                    </TableCell>
                </TableRow>
            )
        }

        if (items && items.length > 0) {
            return (
                <>
                    {items.map((item, i) => {
                        return (
                            <TableRow
                                key={i}
                                sx={{ height: 0, "&:nth-of-type(odd)": { backgroundColor: "#FFFFFF10" }, ".MuiTableCell-root": { p: cellPadding } }}
                            >
                                {renderItem(item, i).map((node, j) => {
                                    return (
                                        <TableCell
                                            key={j}
                                            sx={{
                                                width: widths ? widths[j] : undefined,
                                                flex: widths && widths[j] === "auto" ? 1 : undefined,
                                                borderBottom: "none",
                                                justifyContent: alignments ? alignments[j] : "left",
                                            }}
                                        >
                                            {node}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        )
                    })}

                    {/* Need this empty row for a bug fix, don't delete */}
                    <TableRow sx={{ backgroundColor: "transparent" }}>
                        <TableCell sx={{ p: "0 !important", border: "none !important" }} />
                    </TableRow>
                </>
            )
        }

        return (
            <TableRow sx={{ height: "100% !important" }}>
                <TableCell sx={{ flex: 1, justifyContent: "center", borderBottom: "none" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "8rem" }}>
                        <Typography
                            sx={{
                                px: "1.28rem",
                                pt: "1.28rem",
                                color: colors.grey,
                                fontFamily: fonts.nostromoBold,
                                textAlign: "center",
                            }}
                        >
                            {"There's nothing to show, please contact support."}
                        </Typography>
                    </Stack>
                </TableCell>
            </TableRow>
        )
    }, [loadError, items, isLoading, primaryColor, cellPadding, renderItem, alignments, widths])

    return (
        <Box sx={{ position: "relative", height: "100%" }}>
            <TableContainer sx={{ position: "absolute", width: "100%", height: "100%", "thead, tr, tbody, tfoot": { display: "block" } }}>
                <Table
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        borderRadius: 0.5,
                        overflow: "hidden",
                        ".MuiTableRow-root": { height: "unset", display: "flex", alignItems: "center" },
                        ".MuiTableCell-root": { p: "1.2rem", display: "flex", alignItems: "center" },
                    }}
                >
                    <TableHead sx={{ boxShadow: 5 }}>
                        {title && (
                            <TableRow sx={{ backgroundColor: primaryColor }}>
                                <TableCell sx={{ flex: 1, height: titleRowHeight, justifyContent: "center" }}>
                                    <Typography variant="h6" sx={{ textAlign: "center", color: secondaryColor, fontFamily: fonts.nostromoHeavy }}>
                                        {title}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}

                        <TableRow sx={{ backgroundColor: `${primaryColor}40` }}>
                            {tableHeadings.map((heading, i) => {
                                return (
                                    <TableCell
                                        key={i}
                                        sx={{
                                            borderRight: "#FFFFFF20 1px solid",
                                            borderBottom: `${primaryColor}60 1px solid`,
                                            height: titleRowHeight,
                                            py: "0 !important",
                                            width: widths ? widths[i] : undefined,
                                            flex: widths && widths[i] === "auto" ? 1 : undefined,
                                            justifyContent: alignments ? alignments[i] : "left",
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ py: ".3rem", fontFamily: fonts.nostromoBlack }}>
                                            {heading}
                                        </Typography>
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    </TableHead>

                    <TableBody
                        sx={{
                            overflow: "auto",
                            mr: ".6rem",
                            height: `calc(100% - ${title ? titleRowHeight : "0px"} - ${titleRowHeight} - ${paginationProps ? titleRowHeight : "0px"})`,
                            scrollbarWidth: "none",
                            "::-webkit-scrollbar": {
                                width: ".4rem",
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#FFFFFF15",
                                borderRadius: 3,
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: (theme) => theme.factionTheme.primary,
                                borderRadius: 3,
                            },
                        }}
                    >
                        {tableBody}
                    </TableBody>

                    {paginationProps && (
                        <TableFooter>
                            <TableRow
                                sx={{
                                    borderTop: `${primaryColor}60 1px solid`,
                                    ".MuiTableCell-root": {
                                        borderBottom: "none",
                                    },
                                    ".MuiToolbar-root": {
                                        flex: 1,
                                        height: titleRowHeight,
                                        minHeight: "0 !important",
                                        overflow: "hidden",
                                    },
                                }}
                            >
                                <TablePagination
                                    sx={{
                                        flex: 1,
                                        "p, select, option": {
                                            fontFamily: `${fonts.nostromoBold} !important`,
                                            fontSize: "1.3rem !important",
                                        },
                                    }}
                                    rowsPerPageOptions={paginationProps.pageSizeOptions || [5, 10, 25]}
                                    count={paginationProps.totalItems}
                                    rowsPerPage={paginationProps.pageSize}
                                    page={paginationProps.page}
                                    SelectProps={{ native: true }}
                                    onPageChange={(e, newPage: number) => paginationProps.changePage(newPage)}
                                    onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                                        paginationProps.changePageSize(parseInt(event.target.value, 10))
                                    }
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    )}
                </Table>
            </TableContainer>
        </Box>
    )
}

interface TablePaginationActionsProps {
    count: number
    page: number
    rowsPerPage: number
    onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void
}

const TablePaginationActions = (props: TablePaginationActionsProps) => {
    const { count, page, rowsPerPage, onPageChange } = props

    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, 0)
    }

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1)
    }

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1)
    }

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
    }

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
                <FirstPageIcon fontSize="large" />
            </IconButton>

            <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
                <KeyboardArrowLeft fontSize="large" />
            </IconButton>

            <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
                <KeyboardArrowRight fontSize="large" />
            </IconButton>

            <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
                <LastPageIcon fontSize="large" />
            </IconButton>
        </Box>
    )
}
