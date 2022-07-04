import { Box, Stack, Typography, useTheme } from "@mui/material"
import { useLocation } from "react-router-dom"
import { MARKETPLACE_TABS } from "../../../pages"
import { colors, fonts } from "../../../theme/theme"
import { Weapon } from "../../../types"
import { ItemType } from "../../../types/marketplace"
import { ClipThing } from "../../Common/ClipThing"
import { FancyButton } from "../../Common/FancyButton"
import { TooltipHelper } from "../../Common/TooltipHelper"

export const WeaponButtons = ({ weapon, marketLocked }: { weapon: Weapon; marketLocked: boolean }) => {
    const location = useLocation()
    const theme = useTheme()

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".25rem",
            }}
            opacity={0.7}
            backgroundColor={theme.factionTheme.background}
            sx={{ m: "-.3rem" }}
        >
            <Stack spacing="1.2rem" sx={{ p: "2.5rem 2.8rem" }}>
                <TooltipHelper
                    placement={"right"}
                    text={marketLocked ? "Unfortunately assets on the old staking contract cannot be listed on our marketplace." : ""}
                >
                    <Box>
                        <ReusableButton
                            isFancy={marketLocked}
                            primaryColor={colors.red}
                            secondaryColor={colors.red}
                            backgroundColor={theme.factionTheme.background}
                            label={marketLocked ? "VIEW LISTING" : "SELL"}
                            disabled={marketLocked}
                            to={
                                weapon.locked_to_marketplace
                                    ? !weapon.item_sale_id
                                        ? undefined
                                        : `/marketplace/${MARKETPLACE_TABS.Weapon}/${weapon.item_sale_id}${location.hash}`
                                    : `/marketplace/sell?itemType=${ItemType.Weapon}&assetID=${weapon.id}${location.hash}`
                            }
                        />
                    </Box>
                </TooltipHelper>
            </Stack>
        </ClipThing>
    )
}

const ReusableButton = ({
    primaryColor,
    secondaryColor,
    backgroundColor,
    label,
    onClick,
    disabled,
    to,
    href,
}: {
    isFancy?: boolean
    primaryColor: string
    secondaryColor?: string
    backgroundColor: string
    label: string
    onClick?: () => void
    disabled?: boolean
    to?: string
    href?: string
}) => {
    return (
        <FancyButton
            to={to}
            href={href}
            disabled={(!onClick && !to) || disabled}
            clipThingsProps={{
                clipSize: "8px",
                clipSlantSize: ".5px",
                backgroundColor: backgroundColor,
                border: { isFancy: false, borderColor: primaryColor, borderThickness: "1.5px" },
                sx: { position: "relative", minWidth: "10rem" },
            }}
            sx={{ px: "1.3rem", py: ".5rem", color: secondaryColor || primaryColor }}
            onClick={onClick}
        >
            <Typography
                variant="caption"
                sx={{
                    color: secondaryColor || "#FFFFFF",
                    fontFamily: fonts.nostromoBlack,
                }}
            >
                {label}
            </Typography>
        </FancyButton>
    )
}
