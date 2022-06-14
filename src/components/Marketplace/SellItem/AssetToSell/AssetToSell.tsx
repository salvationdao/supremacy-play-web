import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { ClipThing, FancyButton } from "../../.."
import { useTheme } from "../../../../containers/theme"
import { useToggle } from "../../../../hooks"
import { fonts } from "../../../../theme/theme"
import { ItemType } from "../../../../types/marketplace"
import { QuestionSection } from "../QuestionSection"
import { AssetToSellStruct, itemTypes } from "../SellItem"
import { AssetChooseModal } from "./AssetChooseModal"
import { AssetToSellItem } from "./AssetToSellItem"

export const AssetToSell = ({
    itemType,
    assetToSell,
    setAssetToSell,
}: {
    itemType?: ItemType
    assetToSell?: AssetToSellStruct
    setAssetToSell: React.Dispatch<React.SetStateAction<AssetToSellStruct | undefined>>
}) => {
    const theme = useTheme()
    const [assetChooseModalOpen, toggleAssetChooseModalOpen] = useToggle()

    const itemTypeLabel = useMemo(() => itemTypes.find((i) => i.value === itemType)?.label, [itemType])
    const question = itemTypeLabel ? `Choose a ${itemTypeLabel}` : "Choose an item type"

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    return (
        <>
            <QuestionSection
                disabled={!itemType}
                primaryColor={primaryColor}
                question={question}
                description={`Choose which ${itemTypeLabel || "item"} you which to put onto the marketplace.`}
            >
                <Stack alignItems="flex-start" spacing="1.2rem" sx={{ flex: 1 }}>
                    {assetToSell && assetToSell.id && (
                        <ClipThing
                            clipSize="10px"
                            border={{
                                borderColor: primaryColor,
                                borderThickness: ".2rem",
                            }}
                            opacity={0.7}
                            backgroundColor={backgroundColor}
                        >
                            <Stack sx={{ height: "100%", px: ".9rem", py: ".9rem" }}>
                                <AssetToSellItem key={assetToSell.id} assetToSell={assetToSell} playVideo orientation="vertical" />
                            </Stack>
                        </ClipThing>
                    )}
                    <FancyButton
                        excludeCaret
                        disabled={!itemType}
                        clipThingsProps={{
                            clipSize: "9px",
                            backgroundColor: primaryColor,
                            opacity: 1,
                            border: { isFancy: true, borderColor: primaryColor, borderThickness: "2px" },
                            sx: { position: "relative" },
                        }}
                        sx={{ px: "1.6rem", py: ".6rem", color: secondaryColor }}
                        onClick={() => toggleAssetChooseModalOpen(true)}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                color: secondaryColor,
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            {assetToSell && assetToSell.id ? "CHANGE" : "CHOOSE"}
                        </Typography>
                    </FancyButton>
                </Stack>
            </QuestionSection>

            {assetChooseModalOpen && itemType && (
                <AssetChooseModal
                    open={assetChooseModalOpen}
                    itemType={itemType}
                    setAssetToSell={setAssetToSell}
                    onClose={() => toggleAssetChooseModalOpen(false)}
                />
            )}
        </>
    )
}
