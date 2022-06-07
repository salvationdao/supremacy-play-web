import { Stack, Typography } from "@mui/material"
import { useCallback, useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import { MARKETPLACE_TABS } from "."
import { HangarBg, SvgBack } from "../assets"
import { ConnectButton, FancyButton } from "../components"
import { WarMachineMarketDetails } from "../components/Marketplace/WarMachinesMarket/WarMachineMarketDetails/WarMachineMarketDetails"
import { useAuth } from "../containers"
import { ROUTES_MAP } from "../routes"
import { fonts, siteZIndex } from "../theme/theme"

export const MarketplaceItemPage = () => {
    const { userID } = useAuth()

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
            {!userID ? (
                <Stack spacing="1.3rem" alignItems="center" sx={{ alignSelf: "center", my: "auto", px: "3.6rem", py: "2.8rem", backgroundColor: "#00000060" }}>
                    <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                        You need to be logged in to view this page.
                    </Typography>
                    <ConnectButton width="12rem" />
                </Stack>
            ) : (
                <MarketplaceItemPageInner />
            )}
        </Stack>
    )
}

const MarketplaceItemPageInner = () => {
    const { type, id } = useParams<{ type: MARKETPLACE_TABS; id: string }>()
    const history = useHistory()

    const goBack = useCallback(() => {
        history.push(`${ROUTES_MAP.marketplace.path.replace(":type", MARKETPLACE_TABS.WarMachines)}${location.hash}`)
    }, [history])

    // If invalid url, then redirect to marketplace page
    useEffect(() => {
        if (!Object.values(MARKETPLACE_TABS).includes(type) || !id) goBack()
    }, [goBack, history, id, type])

    return (
        <Stack spacing=".6rem" sx={{ mt: "1.5rem", mb: "2rem", height: "100%", width: "calc(100% - 3rem)", maxWidth: "132rem" }}>
            <FancyButton
                excludeCaret
                clipThingsProps={{
                    clipSize: "9px",
                    corners: { topLeft: true },
                    opacity: 1,
                    sx: { position: "relative", alignSelf: "flex-start", opacity: 0.5, ":hover": { opacity: 1 } },
                }}
                sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                onClick={goBack}
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

            <Inner />
        </Stack>
    )
}

const Inner = () => {
    const { type, id } = useParams<{ type: MARKETPLACE_TABS; id: string }>()

    if (type === MARKETPLACE_TABS.WarMachines && !!id) {
        return <WarMachineMarketDetails id={id} />
    }

    return null
}
