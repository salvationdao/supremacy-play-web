import { TabPanelUnstyled, TabsListUnstyled, TabsUnstyled, TabUnstyled } from "@mui/base"
import { styled } from "@mui/material"
import { BattleAbilityItem } from "./BattleAbilityItem"

export const BattleAndPlayerAbilityTabs = () => {
    return (
        <>
            <TabsUnstyled defaultValue={0}>
                <TabsListUnstyled>
                    <TabUnstyled>Battle Abilities</TabUnstyled>
                    <TabUnstyled>Player Abilities</TabUnstyled>
                </TabsListUnstyled>
                <TabPanelUnstyled value={0}>
                    <BattleAbilityItem />
                </TabPanelUnstyled>
                <TabPanelUnstyled value={1}>Hello there</TabPanelUnstyled>
            </TabsUnstyled>
        </>
    )
}

const Tab = styled(TabUnstyled)({})
