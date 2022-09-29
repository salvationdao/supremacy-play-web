import moment from "moment"
import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useState, useEffect, useMemo } from "react"
import { useHistory, useParams } from "react-router-dom"
import { HangarBg, SafePNG, SvgBack } from "../assets"
import { ClipThing, FancyButton } from "../components"
import { CoolTable } from "../components/Common/CoolTable"
import { useTheme } from "../containers/theme"
import { generatePriceText } from "../helpers"
import { useGameServerCommandsUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { colors, fonts, siteZIndex } from "../theme/theme"
import { FiatOrder } from "../types/fiat"
import { SvgSupremacyLogo } from "../assets"
import BigNumber from "bignumber.js"
import { useAuth } from "../containers"
import { Player } from "../components/Common/Player"

export const BillingHistoryItemPage = () => {
    const theme = useTheme()
    const history = useHistory()
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

        return (
            <>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ p: "2rem", height: "15rem" }}>
                    <SvgSupremacyLogo width="35rem" height="7rem" />
                    <Box sx={{ width: "15rem" }}>
                        <ClipThing
                            corners={{
                                topRight: true,
                                bottomLeft: true,
                            }}
                            border={{
                                borderColor: theme.factionTheme.primary,
                                borderThickness: ".3rem",
                            }}
                            opacity={0.7}
                            backgroundColor={theme.factionTheme.background}
                            sx={{ p: "1rem" }}
                        >
                            <Typography sx={{ fontFamily: fonts.nostromoBlack, textAlign: "center" }}>INVOICE</Typography>
                        </ClipThing>
                    </Box>
                </Stack>

                <Box sx={{ p: "2rem" }}>
                    <Typography sx={{ fontFamily: fonts.nostromoBlack, fontSize: "1.8rem", mb: "2rem" }}>INVOICE DETAILS</Typography>
                    <Box component={"table"} sx={{ display: "inline-table" }}>
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
                                <Typography>{moment(order.created_at).format("DD/MM/YYYY h:mm A")}</Typography>
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
                    </Box>
                </Box>

                <div>
                    <CoolTable
                        tableHeadings={["PRODUCT NAME", "PRICE", "QTY", "SUBTOTAL"]}
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
                                    <Typography key={1}>{item.name}</Typography>,
                                    <Typography key={2}>{generatePriceText("$USD", item.amount)}</Typography>,
                                    <Typography key={3}>{item.quantity}</Typography>,
                                    <Typography key={4}>{generatePriceText("$USD", subtotal)}</Typography>,
                                ],
                            }
                        }}
                    />
                </div>

                <Stack direction="row" justifyContent="flex-end" sx={{ mt: "4rem", p: "1rem" }}>
                    <Typography variant={"h5"} sx={{ color: "white", fontFamily: fonts.nostromoHeavy }}>
                        Total:
                    </Typography>
                    <Box
                        sx={{
                            ml: "4rem",
                        }}
                    >
                        <Typography variant={"body1"} sx={{ fontFamily: fonts.nostromoLight, color: colors.offWhite }}>
                            {generatePriceText("$USD", total)}
                        </Typography>
                    </Box>
                </Stack>
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
                <FancyButton
                    clipThingsProps={{
                        clipSize: "9px",
                        corners: { topLeft: true },
                        opacity: 1,
                        sx: { position: "relative", alignSelf: "flex-start", opacity: 0.5, ":hover": { opacity: 1 } },
                    }}
                    sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                    onClick={() => history.push("/billing-history")}
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
