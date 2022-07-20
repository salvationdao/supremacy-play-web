import { CircularProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { ReactNode, useMemo } from "react"
import { useTheme } from "../../../containers/theme"
import { zoomEffect } from "../../../theme/keyframes"
import { colors, fonts } from "../../../theme/theme"
import { ClipThing } from "../../Common/ClipThing"

interface RanksTableProps<T> {
    title: string
    tableHeadings: string[]
    alignments?: ("left" | "right" | "center")[]
    widths?: string[]
    rankItems?: T[]
    renderItem: (rankItem: T, index: number) => ReactNode[]
    isLoading: boolean
    loadError?: string
}

export const RanksTable = <T,>({ title, tableHeadings, alignments, widths, rankItems, renderItem, isLoading, loadError }: RanksTableProps<T>) => {
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background
    const secondaryColor = theme.factionTheme.secondary

    const content = useMemo(() => {
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

        if (!rankItems || isLoading) {
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

        if (rankItems && rankItems.length > 0) {
            return (
                <TableBody>
                    {rankItems.map((item, i) => {
                        return (
                            <TableRow key={i} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#FFFFFF10", animation: `${zoomEffect(1.05)} 300ms ease-out` } }}>
                                {renderItem(item, i).map((node, j) => {
                                    return (
                                        <TableCell key={j} align={alignments ? alignments[j] : "left"} sx={{ width: widths ? widths[j] : undefined }}>
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
                                    userSelect: "text !important",
                                    opacity: 0.9,
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
    }, [loadError, rankItems, isLoading, tableHeadings.length, primaryColor, renderItem, alignments, widths])

    return (
        <Stack spacing="1.3rem">
            <Stack spacing="1.3rem" direction="row" alignItems="center" justifyContent="center">
                <Typography variant="h5" sx={{ p: "1.2rem 2rem", fontFamily: fonts.nostromoHeavy, backgroundColor, border: `${primaryColor} 2px solid` }}>
                    {title}
                </Typography>
            </Stack>

            <ClipThing
                clipSize="8px"
                border={{
                    borderColor: primaryColor,
                    borderThickness: ".3rem",
                }}
                backgroundColor={backgroundColor}
            >
                <TableContainer>
                    <Table sx={{ borderRadius: 0.5, overflow: "hidden", ".MuiTableCell-root": { p: "1.2rem" } }}>
                        <TableHead sx={{ backgroundColor: primaryColor, boxShadow: 5 }}>
                            <TableRow>
                                {tableHeadings.map((heading, i) => {
                                    return (
                                        <TableCell
                                            key={i}
                                            align={alignments ? alignments[i] : "left"}
                                            sx={{ height: "5.5rem", py: "0 !important", width: widths ? widths[i] : undefined }}
                                        >
                                            <Typography variant="body2" sx={{ py: ".3rem", color: secondaryColor, fontFamily: fonts.nostromoBlack }}>
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
            </ClipThing>
        </Stack>
    )
}
