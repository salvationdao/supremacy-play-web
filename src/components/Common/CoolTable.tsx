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
    isLoading: boolean
    loadError?: string
    titleRowHeight?: string
    cellPadding?: string
    paginationProps?: {
        page: number
        pageSize: number
        totalItems: number
        changePage: (newPage: number) => void
        changePageSize: (newPageSize: number) => void
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
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={tableHeadings.length}>
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
                </TableBody>
            )
        }

        if (!items || isLoading) {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={tableHeadings.length}>
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "8rem" }}>
                                <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                            </Stack>
                        </TableCell>
                    </TableRow>
                </TableBody>
            )
        }

        if (items && items.length > 0) {
            return (
                <TableBody>
                    {items.map((item, i) => {
                        return (
                            <TableRow key={i} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#FFFFFF10" }, ".MuiTableCell-root": { p: cellPadding } }}>
                                {renderItem(item, i).map((node, j) => {
                                    return (
                                        <TableCell
                                            key={j}
                                            align={alignments ? alignments[j] : "left"}
                                            sx={{ width: widths ? widths[j] : undefined, borderBottom: "none" }}
                                        >
                                            {node}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        )
                    })}
                </TableBody>
            )
        }

        return (
            <TableBody>
                <TableRow>
                    <TableCell colSpan={tableHeadings.length}>
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
            </TableBody>
        )
    }, [loadError, items, isLoading, tableHeadings.length, primaryColor, cellPadding, renderItem, alignments, widths])

    return (
        <TableContainer sx={{ height: "100%" }}>
            <Table sx={{ height: "100%", borderRadius: 0.5, overflow: "hidden", ".MuiTableCell-root": { p: "1.2rem" } }}>
                <TableHead sx={{ boxShadow: 5 }}>
                    {title && (
                        <TableRow sx={{ backgroundColor: primaryColor }}>
                            <TableCell colSpan={tableHeadings.length} align="center" sx={{ height: titleRowHeight }}>
                                <Typography variant="h6" sx={{ color: secondaryColor, fontFamily: fonts.nostromoHeavy }}>
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
                                    align={alignments ? alignments[i] : "left"}
                                    sx={{
                                        borderRight: "#FFFFFF20 1px solid",
                                        borderBottom: `${primaryColor}60 1px solid`,
                                        height: titleRowHeight,
                                        py: "0 !important",
                                        width: widths ? widths[i] : undefined,
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

                {tableBody}

                {paginationProps && (
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                sx={{
                                    minHeight: 0,
                                    "p, select, option": {
                                        fontFamily: `${fonts.nostromoBold} !important`,
                                        fontSize: "1.3rem !important",
                                    },
                                }}
                                rowsPerPageOptions={[5, 10, 25]}
                                colSpan={tableHeadings.length}
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
