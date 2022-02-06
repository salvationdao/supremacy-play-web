import { TopMessage, VotingActions } from '..'
import { useAuth } from '../../containers'

export const VotingSystem = () => {
    const { user } = useAuth()
    if (!user || !user.faction) return null

    return (
        <>
            <TopMessage />
            <VotingActions />
        </>
    )
}
