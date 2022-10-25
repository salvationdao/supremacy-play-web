import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { BlobProvider } from "@react-pdf/renderer"
import BigNumber from "bignumber.js"
import moment from "moment"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { ClipThing, FancyButton } from ".."
import { HangarBg, SvgBack, SvgSupremacyLogo } from "../../assets"
import { useAuth } from "../../containers"
import { useTheme } from "../../containers/theme"
import { generatePriceText, getOrderStatusDeets } from "../../helpers"
import { useGameServerCommandsUser } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { FiatOrder } from "../../types/fiat"
import { CoolTable } from "../Common/CoolTable"
import { Player } from "../Common/Player"
import { PDFInvoice } from "./PDFInvoice"

export const BillingHistorySingle = () => {
    const theme = useTheme()
    const { user } = useAuth()
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
    const background = theme.factionTheme.background

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

        let total = new BigNumber(0)
        order.items.forEach((item) => {
            total = total.plus(new BigNumber(item.amount).multipliedBy(item.quantity))
        })

        const statusDeets = getOrderStatusDeets(order.order_status)

        return (
            <>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ p: "2rem", mb: "2rem" }}>
                    <SvgSupremacyLogo width="35rem" height="7rem" />
                    <Box sx={{ width: "15rem" }}>
                        <ClipThing
                            corners={{
                                topRight: true,
                                bottomLeft: true,
                            }}
                            border={{
                                borderColor: primaryColor,
                                borderThickness: ".3rem",
                            }}
                            opacity={0.7}
                            backgroundColor={background}
                            sx={{ p: "1rem" }}
                        >
                            <Typography sx={{ fontFamily: fonts.nostromoBlack, textAlign: "center" }}>INVOICE</Typography>
                        </ClipThing>
                    </Box>
                </Stack>

                <Box sx={{ p: "2rem" }}>
                    <Typography sx={{ fontFamily: fonts.nostromoBlack, fontSize: "1.8rem", mb: "2rem" }}>INVOICE DETAILS</Typography>
                    <Box component={"table"} sx={{ display: "inline-table" }}>
                        <tbody>
                            <tr>
                                <Box component={"td"} sx={{ pr: "4rem" }}>
                                    <Typography>Buyer:</Typography>
                                </Box>
                                <td>{user && <Player player={user} />}</td>
                            </tr>
                            <tr>
                                <Box component={"td"} sx={{ pr: "4rem" }}>
                                    <Typography>Order Date:</Typography>
                                </Box>
                                <td>
                                    <Typography>{moment(order.created_at).format("DD/MM/YYYY")}</Typography>
                                </td>
                            </tr>
                            <tr>
                                <Box component={"td"} sx={{ pr: "4rem" }}>
                                    <Typography>Order Number:</Typography>
                                </Box>
                                <td>
                                    <Typography>{order.order_number}</Typography>
                                </td>
                            </tr>
                        </tbody>
                    </Box>
                </Box>

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ m: "2rem" }}>
                    <Typography sx={{ fontFamily: fonts.nostromoBlack, fontSize: "1.8rem" }}>ORDER SUMMARY</Typography>
                    <BlobProvider document={<PDFInvoice order={order} buyer={user} />}>
                        {({ loading, url }) => (
                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "6px",
                                    backgroundColor: colors.neonBlue,
                                    opacity: 1,
                                    border: { borderColor: colors.neonBlue, borderThickness: "1px" },
                                    sx: { position: "relative" },
                                }}
                                sx={{ px: "1.2rem", py: 0, color: colors.darkestNeonBlue }}
                                href={url || undefined}
                                target="_blank"
                            >
                                <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBold, color: colors.darkestNeonBlue }}>
                                    {loading ? "Generating PDF..." : "Download PDF"}
                                </Typography>
                            </FancyButton>
                        )}
                    </BlobProvider>
                </Stack>

                <div>
                    <CoolTable
                        tableHeadings={["QTY", "DESCRIPTION", "PRICE", "SUBTOTAL"]}
                        alignments={["left", "center", "center", "center"]}
                        widths={["25%", "25%", "25%", "25%"]}
                        titleRowHeight="3.5rem"
                        cellPadding=".4rem 1rem"
                        items={order.items}
                        autoHeight
                        renderItem={(item) => {
                            const subtotal = new BigNumber(item.amount).multipliedBy(item.quantity)
                            return {
                                cells: [
                                    <Typography key={1}>{item.quantity}</Typography>,
                                    <Typography key={2}>{item.name}</Typography>,
                                    <Typography key={3}>{generatePriceText("$USD", item.amount)}</Typography>,
                                    <Typography key={4}>{generatePriceText("$USD", subtotal)}</Typography>,
                                ],
                            }
                        }}
                    />
                </div>

                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mt: "4rem", p: "1rem" }}>
                    <Stack sx={{ width: "25rem" }}>
                        <ClipThing
                            corners={{
                                topRight: true,
                                bottomLeft: true,
                            }}
                            border={{
                                borderColor: primaryColor,
                                borderThickness: ".3rem",
                            }}
                            opacity={0.7}
                            backgroundColor={background}
                            sx={{ p: "1rem" }}
                        >
                            <Typography sx={{ fontFamily: fonts.nostromoBlack, textAlign: "center" }}>PAYMENT TYPE</Typography>
                        </ClipThing>
                        <Typography sx={{ mt: "1rem", textAlign: "center", fontSize: "1.8rem" }}>Credit Card</Typography>
                    </Stack>
                    <Stack>
                        <ClipThing
                            corners={{
                                topRight: true,
                                bottomLeft: true,
                            }}
                            border={{
                                borderColor: primaryColor,
                                borderThickness: ".3rem",
                            }}
                            opacity={0.7}
                            backgroundColor={background}
                            sx={{ p: "1rem" }}
                        >
                            <Stack direction="row" justifyContent="space-between" spacing="4rem">
                                <Typography sx={{ fontFamily: fonts.nostromoBlack, textAlign: "center" }}>TOTAL</Typography>
                                <ClipThing
                                    key={3}
                                    clipSize="6px"
                                    corners={{
                                        bottomLeft: true,
                                        topRight: true,
                                    }}
                                    border={{
                                        borderColor: colors.offWhite,
                                        borderThickness: "1px",
                                    }}
                                    backgroundColor={statusDeets.color}
                                    sx={{ position: "relative", px: "2rem", py: 0 }}
                                >
                                    <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBold, color: statusDeets.textColor }}>
                                        {statusDeets.label.toUpperCase()}
                                    </Typography>
                                </ClipThing>
                                ,
                            </Stack>
                        </ClipThing>
                        <Typography
                            variant={"body1"}
                            sx={{
                                color: colors.offWhite,
                                mt: "1rem",
                                textAlign: "center",
                                fontSize: "1.8rem",
                            }}
                        >
                            {generatePriceText("$USD", total)}
                        </Typography>
                    </Stack>
                </Stack>
            </>
        )
    }, [order, isLoading, loadError, primaryColor, background, user])

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
                <FancyButton
                    clipThingsProps={{
                        clipSize: "9px",
                        corners: { topLeft: true },
                        opacity: 1,
                        sx: { position: "relative", alignSelf: "flex-start", opacity: 0.5, ":hover": { opacity: 1 } },
                    }}
                    sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                    to="/billing-history"
                >
                    <Stack spacing=".6rem" direction="row" alignItems="center">
                        <SvgBack size="1.4rem" fill={"#FFFFFF"} />
                        <Typography
                            variant="caption"
                            sx={{
                                color: "#FFFFFF",
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            GO BACK
                        </Typography>
                    </Stack>
                </FancyButton>

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
