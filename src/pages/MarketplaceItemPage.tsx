import { Stack, Typography } from "@mui/material"
import { useCallback, useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import { MARKETPLACE_TABS } from "."
import { HangarBg, SvgBack } from "../assets"
import { FancyButton } from "../components"
import { WarMachineMarketDetails } from "../components/Marketplace/WarMachinesMarket/WarMachineMarketDetails/WarMachineMarketDetails"
import { ROUTES_MAP } from "../routes"
import { fonts, siteZIndex } from "../theme/theme"

export const MarketplaceItemPage = () => {
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

                <MarketplaceItemPageInner />
            </Stack>
        </Stack>
    )
}

const MarketplaceItemPageInner = () => {
    const { type, id } = useParams<{ type: MARKETPLACE_TABS; id: string }>()

    if (type === MARKETPLACE_TABS.WarMachines && !!id) {
        return <WarMachineMarketDetails id={id} />
    }

    return null
}
