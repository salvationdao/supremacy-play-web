import { EnlistBanner, EnlistButtonGroup } from "../.."
import { usePassportServerAuth } from "../../../containers"

export const Enlist = () => {
    const { factionID } = usePassportServerAuth()
    return factionID ? <EnlistBanner /> : <EnlistButtonGroup />
}
