import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { FancyButton } from "../../.."
import { SvgPlus, SvgSkin, SvgWrapperProps } from "../../../../assets"
import { shadeColor } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { colors, fonts } from "../../../../theme/theme"
import { Rarity } from "../../../../types"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"
import { MediaPreviewModal } from "../../../Common/MediaPreview/MediaPreviewModal"

export const MechLoadoutItem = ({
    imageUrl,
    videoUrls,
    label,
    primaryColor,
    onClick,
    isEmpty,
    Icon,
    rarity,
    hasSkin,
    imageTransform,
    disabled,
}: {
    imageUrl?: string
    videoUrls?: (string | undefined)[] | undefined
    label: string
    primaryColor: string
    onClick?: () => void
    isEmpty?: boolean
    Icon?: React.VoidFunctionComponent<SvgWrapperProps>
    rarity?: Rarity
    hasSkin?: boolean
    imageTransform?: string
    disabled?: boolean
}) => {
    const [showPreviewModal, toggleShowPreviewModal] = useToggle()
    const backgroundColor = useMemo(() => shadeColor(primaryColor, -90), [primaryColor])

    return (
        <>
            <Box sx={{ p: ".8rem", width: "fit-content" }}>
                <FancyButton
                    disabled={disabled}
                    clipThingsProps={{
                        clipSize: "10px",
                        clipSlantSize: "0px",
                        corners: { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true },
                        backgroundColor,
                        opacity: 0.9,
                        border: { isFancy: false, borderColor: primaryColor, borderThickness: ".3rem" },
                        sx: { position: "relative" },
                    }}
                    sx={{ p: 0, color: primaryColor }}
                    onClick={() => {
                        onClick && onClick()
                        toggleShowPreviewModal(true)
                    }}
                >
                    <Stack spacing="1rem" alignItems="center" sx={{ height: "16rem", width: "16rem", p: "1rem", textAlign: "center" }}>
                        <Stack justifyContent="center" sx={{ position: "relative", height: "9rem", alignSelf: "stretch", backgroundColor: "#00000060" }}>
                            {isEmpty ? (
                                <SvgPlus fill={`${primaryColor}80`} size="2rem" />
                            ) : (
                                <MediaPreview
                                    imageUrl={imageUrl}
                                    videoUrls={videoUrls}
                                    objectFit="contain"
                                    sx={{ p: ".5rem" }}
                                    imageTransform={imageTransform}
                                />
                            )}

                            <Stack spacing=".3rem" direction="row" alignItems="center" sx={{ position: "absolute", top: ".1rem", left: ".5rem" }}>
                                {Icon && <Icon fill={primaryColor} size="1.8rem" />}
                                {hasSkin && <SvgSkin fill={colors.chassisSkin} size="1.8rem" />}
                            </Stack>

                            {rarity && (
                                <Typography
                                    variant="caption"
                                    sx={{ position: "absolute", bottom: ".3rem", left: 0, right: 0, color: rarity.color, fontFamily: fonts.nostromoBlack }}
                                >
                                    {rarity.label}
                                </Typography>
                            )}
                        </Stack>

                        <Typography
                            variant="body2"
                            sx={{
                                color: primaryColor,
                                fontFamily: fonts.nostromoBold,
                                display: "-webkit-box",
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {label}
                        </Typography>
                    </Stack>
                </FancyButton>
            </Box>

            {showPreviewModal && <MediaPreviewModal imageUrl={imageUrl} videoUrls={videoUrls} onClose={() => toggleShowPreviewModal(false)} />}
        </>
    )
}
