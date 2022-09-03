import { FactionSelect } from "../components/Tutorial/Faction/FactionSelect"
import { useSupremacy } from "../containers"

export const EnlistPage = () => {
    const { factionsAll } = useSupremacy()

    if (Object.keys(factionsAll).length < 3) return null

    return <FactionSelect />
}
