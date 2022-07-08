import { Box } from "@mui/material"
import { Faction, SystemBanMessageData } from "../../../../../types"

export const SystemBanMessage = ({
    data,
    sentAt,
    fontSize,
    getFaction,
}: {
    data?: SystemBanMessageData
    sentAt: Date
    fontSize: number
    getFaction: (factionID: string) => Faction
}) => {
    console.log(data)
    console.log(sentAt)
    console.log(fontSize)
    console.log(data?.faction_id && getFaction(data.faction_id))
    return <Box> message </Box>
}
