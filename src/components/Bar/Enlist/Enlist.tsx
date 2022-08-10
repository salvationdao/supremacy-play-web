import { EnlistBanner, EnlistButtonGroup } from "../.."
import { useAuth } from "../../../containers"

export const Enlist = () => {
    const { factionID } = useAuth()
    return factionID ? <EnlistBanner /> : <EnlistButtonGroup />
}
