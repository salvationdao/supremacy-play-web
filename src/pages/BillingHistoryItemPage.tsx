import moment from "moment"
import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import { HangarBg, SafePNG } from "../assets"
import { ClipThing } from "../components"
import { CoolTable } from "../components/Common/CoolTable"
import { PageHeader } from "../components/Common/PageHeader"
import { useTheme } from "../containers/theme"
import { generatePriceText, parseString } from "../helpers"
import { usePagination, useUrlQuery } from "../hooks"
import { useGameServerCommandsUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { colors, fonts, siteZIndex } from "../theme/theme"
import { FiatOrder } from "../types/fiat"
import BigNumber from "bignumber.js"

export const BillingHistoryItemPage = () => {
    const theme = useTheme()
    const { id } = useParams<{ id: string }>()
    const { send } = useGameServerCommandsUser("/user_commander")

    const [order, setOrder] = useState<FiatOrder>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()

    useEffect(() => {
        if (!id || order) return
        ;(async () => {
            try {
                setIsLoading(true)

                const resp = await send<FiatOrder>(GameServerKeys.FiatBillingHistoryGet, { id })
                if (!resp) return

                setOrder(resp)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get order details."
                setLoadError(message)
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [id, order, send])

    // Render
    const primaryColor = theme.factionTheme.primary

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
                            {loadError ? loadError : "Failed to load listing details."}
                        </Typography>
                    </Stack>
                </Stack>
            )
        }

        if (!order || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                    </Stack>
                </Stack>
            )
        }

        return (
            <>
                <PageHeader title={`ORDER #${order.order_number}`} imageUrl={SafePNG} />

                <Box sx={{ flex: 1 }}>
                    <CoolTable
                        tableHeadings={["PRODUCT NAME", "PRICE", "QTY", "SUBTOTAL"]}
                        alignments={["left", "center", "center", "center"]}
                        widths={["25%", "25%", "25%", "25%"]}
                        titleRowHeight="3.5rem"
                        cellPadding=".4rem 1rem"
                        items={order.items}
                        renderItem={(item) => {
                            const subtotal = new BigNumber(item.amount).multipliedBy(item.quantity)
                            return {
                                cells: [
                                    <Typography key={1}>{item.name}</Typography>,
                                    <Typography key={2}>{generatePriceText("$USD", item.amount)}</Typography>,
                                    <Typography key={3}>{item.quantity}</Typography>,
                                    <Typography key={4}>{generatePriceText("$USD", subtotal)}</Typography>,
                                ],
                            }
                        }}
                    />
                </Box>
            </>
        )
    }, [order, isLoading, loadError, primaryColor])

    return (
        <Stack
            alignItems="center"
            sx={{
                height: "100%",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${HangarBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                boxShadow: `inset 0 0 50px 60px #00000090`,
            }}
        >
            <Stack sx={{ mt: "1.5rem", mb: "2rem", height: "100%", width: "calc(100% - 3rem)", maxWidth: "160rem" }}>
                <ClipThing
                    clipSize="10px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".3rem",
                    }}
                    opacity={0.7}
                    backgroundColor={theme.factionTheme.background}
                    sx={{ height: "100%", flex: 1 }}
                >
                    <Stack sx={{ position: "relative", height: "100%" }}>
                        <Stack sx={{ flex: 1 }}>{content}</Stack>
                    </Stack>
                </ClipThing>
            </Stack>
        </Stack>
    )
}
