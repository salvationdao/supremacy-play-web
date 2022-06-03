import { Stack } from "@mui/material"
import { useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import { MARKETPLACE_TABS } from "."
import { HangarBg } from "../assets"
import { WarMachineMarketDetails } from "../components/Marketplace/WarMachinesMarket/WarMachineMarketDetails/WarMachineMarketDetails"
import { ROUTES_MAP } from "../routes"
import { siteZIndex } from "../theme/theme"

export const MarketplaceItemPage = () => {
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
            <Stack sx={{ my: "1.5rem", height: "100%", width: "calc(100% - 3rem)", maxWidth: "160rem" }}>
                <MarketplaceItemPageInner />
            </Stack>
        </Stack>
    )
}

const MarketplaceItemPageInner = () => {
    const { type, id } = useParams<{ type: MARKETPLACE_TABS; id: string }>()
    const history = useHistory()

    // If invalid url, then redirect to marketplace page
    useEffect(() => {
        if (!Object.values(MARKETPLACE_TABS).includes(type) || !id) {
            history.replace(`${ROUTES_MAP.marketplace.path.replace(":type", MARKETPLACE_TABS.WarMachines)}${location.hash}`)
        }
    }, [history, id, type])

    if (type === MARKETPLACE_TABS.WarMachines && !!id) {
        return <WarMachineMarketDetails id={id} />
    }

    return null
}
