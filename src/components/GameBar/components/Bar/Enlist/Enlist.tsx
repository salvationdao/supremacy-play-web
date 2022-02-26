import { EnlistBanner, EnlistButtonGroup } from "../.."
import { useAuth } from "../../../containers"
import { GameBarBaseProps } from "../../../GameBar"

export const Enlist = (props: GameBarBaseProps) => {
	const { user, factionID } = useAuth()
	return user?.faction && factionID ? <EnlistBanner {...props} /> : <EnlistButtonGroup {...props} />
}
