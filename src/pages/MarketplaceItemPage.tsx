import { useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import { MARKETPLACE_TABS } from "."
import { WarMachineMarketDetails } from "../components/Marketplace/WarMachinesMarket/WarMachineMarketDetails/WarMachineMarketDetails"
import { ROUTES_MAP } from "../routes"

export const MarketplaceItemPage = () => {
    const { type, itemID } = useParams<{ type: MARKETPLACE_TABS; itemID: string }>()
    const history = useHistory()

    // If invalid url, then redirect to marketplace page
    useEffect(() => {
        if (!Object.values(MARKETPLACE_TABS).includes(type) || !itemID) {
            history.replace(`${ROUTES_MAP.marketplace.path.replace(":type", MARKETPLACE_TABS.WarMachines)}${location.hash}`)
        }
    }, [history, itemID, type])

    if (type === MARKETPLACE_TABS.WarMachines) {
        return <WarMachineMarketDetails itemID={itemID} />
    }

    return (
        <div>
            <p>{type}</p>
            <p>{itemID}</p>
        </div>
    )
}
