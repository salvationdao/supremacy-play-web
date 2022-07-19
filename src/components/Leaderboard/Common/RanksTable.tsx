import { CircularProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { ReactNode, useMemo } from "react"
import { useTheme } from "../../../containers/theme"
import { colors, fonts } from "../../../theme/theme"

interface RanksTableProps<T> {
    title: string
    tableHeadings: string[]
    rankItems?: T[]
    renderItem: (rankItem: T, index: number) => ReactNode[]
    isLoading: boolean
    loadError?: string
}

export const RanksTable = <T,>({ title, tableHeadings, rankItems, renderItem, isLoading, loadError }: RanksTableProps<T>) => {
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    const content = useMemo(() => {
        if (loadError) {
            return (
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
            )
        }

        if (!rankItems || isLoading) {
            return (
                <TableCell colSpan={tableHeadings.length}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "8rem" }}>
                        <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                    </Stack>
                </TableCell>
            )
        }

        if (rankItems && rankItems.length > 0) {
            return (
                <TableBody>
                    {rankItems.map((item, i) => {
                        return (
                            <TableRow key={i} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#FFFFFF10" } }}>
                                {renderItem(item, i).map((node, j) => {
                                    return <TableCell key={j}>{node}</TableCell>
                                })}
                            </TableRow>
                        )
                    })}
                </TableBody>
            )
        }

        return (
            <TableCell colSpan={tableHeadings.length}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: "8rem" }}>
                    <Typography
                        sx={{
                            px: "1.28rem",
                            pt: "1.28rem",
                            color: colors.grey,
                            fontFamily: fonts.nostromoBold,
                            userSelect: "text !important",
                            opacity: 0.9,
                            textAlign: "center",
                        }}
                    >
                        {"There's nothing to show, please contact support."}
                    </Typography>
                </Stack>
            </TableCell>
        )
    }, [loadError, rankItems, isLoading, tableHeadings.length, primaryColor, renderItem])

    return (
        <Stack spacing="2rem">
            <Stack direction="row" alignItems="center" sx={{}}>
                <Typography variant="h5" sx={{ fontFamily: fonts.nostromoHeavy }}>
                    {title}
                </Typography>
            </Stack>

            <TableContainer>
                <Table sx={{ borderRadius: 0.5, overflow: "hidden", ".MuiTableCell-root": { p: "1.6rem" } }}>
                    <TableHead sx={{ backgroundColor: primaryColor, boxShadow: 5 }}>
                        <TableRow>
                            {tableHeadings.map((heading, i) => {
                                return (
                                    <TableCell key={i}>
                                        <Typography variant="body2" sx={{ color: secondaryColor, fontFamily: fonts.nostromoBlack }}>
                                            {heading}
                                        </Typography>
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    </TableHead>
                    {content}
                </Table>
            </TableContainer>
        </Stack>
    )
}
