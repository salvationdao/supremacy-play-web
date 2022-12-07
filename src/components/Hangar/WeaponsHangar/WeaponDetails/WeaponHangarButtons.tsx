import { Box, useTheme } from "@mui/material"
import { colors } from "../../../../theme/theme"
import { Weapon } from "../../../../types"
import { ItemType } from "../../../../types/marketplace"
import { NiceButton } from "../../../Common/Nice/NiceButton"
import { NiceTooltip } from "../../../Common/Nice/NiceTooltip"

export const WeaponButtons = ({ weaponDetails }: { weaponDetails: Weapon }) => {
    const theme = useTheme()

    const marketLocked = weaponDetails.market_locked
    const isInMarketplace = !!weaponDetails.item_sale_id

    return (
        <NiceTooltip placement={"right"} text={marketLocked ? "Unfortunately assets on the old staking contract cannot be listed on the marketplace." : ""}>
            <Box p="1rem">
                <NiceButton
                    corners
                    disabled={!!weaponDetails.equipped_on}
                    buttonColor={isInMarketplace ? theme.factionTheme.u800 : colors.red}
                    route={{
                        to: weaponDetails.item_sale_id
                            ? `/marketplace/weapons/${weaponDetails.item_sale_id}`
                            : `/marketplace/sell?itemType=${ItemType.Weapon}&assetID=${weaponDetails.id}`,
                    }}
                    sx={{
                        width: "100%",
                    }}
                >
                    {isInMarketplace ? "View Listing" : "Sell"}
                </NiceButton>
            </Box>
        </NiceTooltip>
    )
}
