import { Box, useTheme } from "@mui/material"
import { useLocation } from "react-router-dom"
import { MARKETPLACE_TABS } from "../../../../pages"
import { colors } from "../../../../theme/theme"
import { Weapon } from "../../../../types"
import { ItemType } from "../../../../types/marketplace"
import { ClipThing } from "../../../Common/ClipThing"
import { TooltipHelper } from "../../../Common/TooltipHelper"
import { ReusableButton } from "../../WarMachinesHangar/WarMachineDetails/MechButtons"

export const WeaponButtons = ({ weaponDetails }: { weaponDetails: Weapon }) => {
    const location = useLocation()
    const theme = useTheme()

    const marketLocked = weaponDetails.market_locked
    const isInMarketplace = !!weaponDetails.item_sale_id

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: "2.2px",
            }}
            opacity={0.7}
            backgroundColor={theme.factionTheme.background}
            sx={{ m: "-.3rem" }}
        >
            <Box sx={{ p: "1rem", gap: ".8rem", display: "grid", gridTemplateColumns: "repeat(1, 1fr)" }}>
                <TooltipHelper
                    placement={"right"}
                    text={marketLocked ? "Unfortunately assets on the old staking contract cannot be listed on the marketplace." : ""}
                >
                    <Box>
                        <ReusableButton
                            disabled={!!weaponDetails.equipped_on}
                            isFancy={!isInMarketplace}
                            primaryColor={colors.red}
                            secondaryColor={isInMarketplace ? colors.red : undefined}
                            backgroundColor={isInMarketplace ? theme.factionTheme.background : colors.red}
                            label={isInMarketplace ? "VIEW LISTING" : "SELL"}
                            to={
                                weaponDetails.item_sale_id
                                    ? `/marketplace/${MARKETPLACE_TABS.Weapons}/${weaponDetails.item_sale_id}${location.hash}`
                                    : `/marketplace/sell?itemType=${ItemType.Weapon}&assetID=${weaponDetails.id}${location.hash}`
                            }
                        />
                    </Box>
                </TooltipHelper>
            </Box>
        </ClipThing>
    )
}
