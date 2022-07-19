import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { ReactNode, useMemo } from "react"
import { EmptyWarMachinesPNG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { colors, fonts } from "../../../theme/theme"
import { ClipThing } from "../../Common/ClipThing"

interface RanksTableProps<T> {
    rankItems?: T[]
    renderItem: (rankItem: T) => ReactNode
    isLoading: boolean
    loadError?: string
}

export const RanksTable = <T,>({ rankItems, renderItem, isLoading, loadError }: RanksTableProps<T>) => {
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    const content = useMemo(() => {
        if (loadError) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: "100%", maxWidth: "100%", width: "75rem", px: "3rem", pt: "1.28rem" }}
                        spacing="1.5rem"
                    >
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
                </Stack>
            )
        }

        if (!rankItems || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                    </Stack>
                </Stack>
            )
        }

        if (rankItems && rankItems.length > 0) {
            return (
                <Box
                    sx={{
                        width: "100%",
                        pt: "1rem",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(32rem, 1fr))",
                        gap: "2.4rem",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "visible",
                        height: "100%",
                    }}
                >
                    {rankItems.map((item) => renderItem(item))}
                </Box>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "40rem" }}>
                    <Box
                        sx={{
                            width: "80%",
                            height: "16rem",
                            opacity: 0.7,
                            filter: "grayscale(100%)",
                            background: `url(${EmptyWarMachinesPNG})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "bottom center",
                            backgroundSize: "contain",
                        }}
                    />
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
                        {"There's nothing to show, please contact support'."}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [loadError, rankItems, isLoading, primaryColor, renderItem])

    return (
        <ClipThing
            clipSize="10px"
            border={{
                isFancy: true,
                borderColor: primaryColor,
                borderThickness: ".3rem",
            }}
            opacity={0.7}
            backgroundColor={backgroundColor}
        >
            <Stack sx={{ height: "100%" }}>{content}</Stack>
        </ClipThing>
    )
}
