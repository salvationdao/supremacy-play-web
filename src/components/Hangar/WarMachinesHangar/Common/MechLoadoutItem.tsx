import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { FancyButton } from "../../.."
import { SvgPlus } from "../../../../assets"
import { shadeColor } from "../../../../helpers"
import { fonts } from "../../../../theme/theme"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"

export const MechLoadoutItem = ({
    imageUrl,
    label,
    primaryColor,
    onClick,
    isEmpty,
}: {
    imageUrl?: string
    label: string
    primaryColor: string
    onClick?: () => void
    isEmpty?: boolean
}) => {
    const backgroundColor = useMemo(() => shadeColor(primaryColor, -90), [primaryColor])

    return (
        <Box sx={{ p: ".8rem", width: "fit-content", pointerEvents: onClick ? "all" : "none" }}>
            <FancyButton
                clipThingsProps={{
                    clipSize: "10px",
                    clipSlantSize: "0px",
                    corners: { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true },
                    backgroundColor,
                    opacity: 0.7,
                    border: { isFancy: false, borderColor: primaryColor, borderThickness: ".3rem" },
                    sx: { position: "relative" },
                }}
                sx={{ p: 0, color: primaryColor }}
                onClick={onClick}
            >
                <Stack spacing="1rem" alignItems="center" sx={{ height: "16rem", width: "16rem", p: "1rem", textAlign: "center" }}>
                    <Stack justifyContent="center" sx={{ height: "9rem", alignSelf: "stretch", backgroundColor: "#00000060" }}>
                        {isEmpty ? (
                            <SvgPlus fill={`${primaryColor}80`} size="2rem" />
                        ) : (
                            <MediaPreview imageUrl={imageUrl} objectFit="contain" sx={{ p: ".5rem" }} />
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
    )
}
