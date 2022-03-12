import { EnlistBanner, EnlistButtonGroup } from "../.."
import { usePassportServerAuth } from "../../../containers"

export const Enlist = () => {
    const { user, faction_id } = usePassportServerAuth()
    return user?.faction && faction_id ? <EnlistBanner /> : <EnlistButtonGroup />
}
