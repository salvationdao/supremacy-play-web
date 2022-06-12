import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { ClipThing, FancyButton } from "../.."
import { useTheme } from "../../../containers/theme"
import { useToggle } from "../../../hooks"
import { fonts } from "../../../theme/theme"
import { ItemType } from "../../../types/marketplace"
import { AssetChooseModal } from "./AssetChooseModal"
import { QuestionSection } from "./QuestionSection"
import { AssetToSellStruct, itemTypes } from "./SellItem"

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
                {assetToSell ? (
                    <ClipThing
                        clipSize="10px"
                        border={{
                            isFancy: true,
                            borderColor: primaryColor,
                            borderThickness: ".2rem",
                        }}
                        opacity={0.7}
                        backgroundColor={backgroundColor}
                    >
                        <Stack sx={{ height: "100%" }}>{assetToSell.label}</Stack>
                    </ClipThing>
                ) : (
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
                            {question}
                        </Typography>
                    </FancyButton>
                )}
            </QuestionSection>

            {assetChooseModalOpen && itemType && !assetToSell && (
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
