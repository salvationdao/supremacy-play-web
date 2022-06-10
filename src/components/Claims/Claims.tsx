import { Fade, Stack } from "@mui/material"
import { ConnectWallet } from "./ConnectWallet"
import { SelectFaction } from "../Common/SelectFaction"
import { CodeRedemption } from "./CodeRedemption"
import { ClaimedRewards } from "./ClaimedRewards"
import { useAuth } from "../../containers"
import { useState } from "react"
import { Box } from "@mui/system"
import { RewardResponse } from "../../types"

export const Claims = () => {
    const { userID, factionID } = useAuth()
    const [rewards, setRewards] = useState<RewardResponse[]>()

    return (
        <Stack sx={{ minHeight: "100%", minWidth: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Fade in>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    {!userID && <ConnectWallet />}
                    {userID && !factionID && <SelectFaction />}
                    {userID && factionID && !rewards && <CodeRedemption setRewards={setRewards} />}
                    {userID && factionID && rewards && <ClaimedRewards rewards={rewards} />}
                </Box>
            </Fade>
        </Stack>
    )
}
