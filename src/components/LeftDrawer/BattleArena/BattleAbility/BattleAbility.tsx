import { Box, Typography } from "@mui/material"
import { useAuth, useGame } from "../../../../containers"
import { SectionCollapsible } from "../Common/SectionCollapsible"

export const BattleAbility = () => {
    const { factionID } = useAuth()
    const { isAIDrivenMatch } = useGame()

    // if (!bribeStage) return null

    return (
        <Box sx={{ position: "relative" }}>
            <SectionCollapsible
                label={"BATTLE ABILITY"}
                tooltip="Opt into battle abilities and fight for your Faction!"
                initialExpanded={true}
                localStoragePrefix="battleAbility"
            >
                <Typography>your battle abilities will go here</Typography>
            </SectionCollapsible>
        </Box>
    )
}
