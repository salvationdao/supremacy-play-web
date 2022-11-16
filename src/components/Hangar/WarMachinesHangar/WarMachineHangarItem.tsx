import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { SvgDropdownArrow } from "../../../assets"
import { shadeColor } from "../../../helpers"
import { TruncateTextLines } from "../../../theme/styles"
import { colors, fonts } from "../../../theme/theme"
import { MechBasic, MechDetails } from "../../../types"
import { MechRepairBlocks } from "../../Common/Mech/MechRepairBlocks"
import { MediaPreview } from "../../Common/MediaPreview/MediaPreview"
import { MechBarStats } from "./Common/MechBarStats"
import { MechLoadoutIcons } from "./Common/MechLoadoutIcons"

export const MechCommonArea = ({
    primaryColor,
    secondaryColor,
    isGridView,
    mech,
    mechDetails,
    isExpanded,
    toggleIsExpanded,
    label,
    hideRepairBlocks,
}: {
    primaryColor: string
    secondaryColor: string
    isGridView?: boolean
    mech?: MechBasic
    mechDetails?: MechDetails
    isExpanded?: boolean
    toggleIsExpanded?: (value?: boolean) => void
    label?: string
    hideRepairBlocks?: boolean
}) => {
    const backgroundColor = useMemo(() => shadeColor(primaryColor, -90), [primaryColor])

    const mech1 = mechDetails || mech

    const avatarUrl = mechDetails?.chassis_skin?.avatar_url || mech?.avatar_url || ""
    const imageUrl = mechDetails?.chassis_skin?.image_url || mech?.image_url || ""
    const largeImageUrl = mechDetails?.chassis_skin?.large_image_url || mech?.large_image_url || ""

    return useMemo(
        () => (
            <Stack direction={isGridView ? "column" : "row"} alignItems={isGridView ? "flex-start" : "center"} spacing="1.4rem" sx={{ position: "relative" }}>
                <Box
                    sx={{
                        position: "relative",
                        height: isGridView ? "20rem" : "100%",
                        width: isGridView ? "100%" : "8rem",
                        flexShrink: 0,
                    }}
                >
                    <MediaPreview imageUrl={avatarUrl || imageUrl || largeImageUrl} objectFit={isGridView ? "cover" : "contain"} />
                </Box>

                <Stack
                    spacing=".2rem"
                    sx={{
                        flex: 1,
                        pr: !isGridView && toggleIsExpanded ? "3rem" : "unset",
                        ":hover": {
                            ".expandArrow": {
                                transform: "translateX(4px)",
                            },
                        },
                    }}
                    onClick={(e) => {
                        if (!toggleIsExpanded) return
                        e.preventDefault()
                        e.stopPropagation()
                        toggleIsExpanded()
                    }}
                >
                    <MechLoadoutIcons mechDetails={mechDetails} />

                    <Typography
                        sx={{
                            color: mech1?.name ? colors.offWhite : "#FFFFFF",
                            fontFamily: fonts.nostromoBlack,
                            ...TruncateTextLines(1),
                        }}
                    >
                        {mech1?.name || mech1?.label || label}
                    </Typography>

                    {!hideRepairBlocks && <MechRepairBlocks mechID={mech?.id || mechDetails?.id} defaultBlocks={mechDetails?.repair_blocks} />}

                    {toggleIsExpanded && !isGridView && (
                        <Stack
                            direction="row"
                            sx={{
                                position: "absolute",
                                top: "-2rem",
                                left: "calc(100% - 2.5rem)",
                                bottom: "-1rem",
                            }}
                        >
                            <Stack
                                className="expandArrow"
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    px: ".6rem",
                                    background: isExpanded ? `${primaryColor}CC` : `linear-gradient(to right, #FFFFFF00, ${primaryColor}50 80%, #FFFFFF00)`,
                                    transition: "all .2s",
                                }}
                            >
                                <SvgDropdownArrow
                                    size="1.3rem"
                                    fill={isExpanded ? secondaryColor : "#FFFFFF95"}
                                    sx={{ transform: isExpanded ? "rotate(90deg)" : "rotate(-90deg)" }}
                                />
                            </Stack>

                            <Box
                                sx={{
                                    backgroundColor,
                                    zIndex: 99,
                                    width: isExpanded ? "100%" : 0,
                                    minWidth: isExpanded ? "100%" : 0,
                                    overflow: "hidden",
                                    transition: "all .3s",
                                    border: isExpanded ? `${primaryColor}CC 1px solid` : "unset",
                                    borderLeft: "unset",
                                }}
                            >
                                <Stack direction="row" spacing="4rem" sx={{ p: "1.5rem 2.1rem", height: "100%" }}>
                                    {mech1 && (
                                        <Stack justifyContent="center" sx={{ width: "40rem" }}>
                                            <MechBarStats fontSize="1.5rem" mech={mech1} mechDetails={mechDetails} color={primaryColor} iconVersion />
                                        </Stack>
                                    )}
                                </Stack>
                            </Box>
                        </Stack>
                    )}
                </Stack>
            </Stack>
        ),
        [
            isGridView,
            avatarUrl,
            imageUrl,
            largeImageUrl,
            toggleIsExpanded,
            mechDetails,
            mech1,
            label,
            hideRepairBlocks,
            mech?.id,
            isExpanded,
            primaryColor,
            secondaryColor,
            backgroundColor,
        ],
    )
}
