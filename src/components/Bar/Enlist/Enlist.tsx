import { EnlistBanner, EnlistButtonGroup } from "../.."
import { usePassportServerAuth } from "../../../containers"

export const Enlist = () => {
    const { user, factionID } = usePassportServerAuth()
    return user?.faction && factionID ? <EnlistBanner /> : <EnlistButtonGroup />
}
