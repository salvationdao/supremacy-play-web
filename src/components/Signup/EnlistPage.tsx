import { useEffect } from "react"
import { FactionSelect } from "../../components/Tutorial/Faction/FactionSelect"
import { useSupremacy, useUI } from "../../containers"

export const EnlistPage = () => {
    const { factionsAll } = useSupremacy()
    const { setLeftDrawerActiveTabID, setRightDrawerActiveTabID } = useUI()

    useEffect(() => {
        setLeftDrawerActiveTabID("")
        setRightDrawerActiveTabID("")
    }, [setLeftDrawerActiveTabID, setRightDrawerActiveTabID])

    if (Object.keys(factionsAll).length < 3) return null
    return <FactionSelect />
}
