import { Box, Checkbox, Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { FancyButton } from "../.."
import { SvgDropdownArrow } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { shadeColor } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { MechBasic, MechBasicWithQueueStatus, MechDetails } from "../../../types"
import { MediaPreview } from "../../Common/MediaPreview/MediaPreview"
import { General } from "../../Marketplace/Common/MarketItem/General"
import { MechBarStats } from "./Common/MechBarStats"
import { MechLoadoutIcons } from "./Common/MechLoadoutIcons"
import { MechRepairBlocks } from "./Common/MechRepairBlocks"
import { MechGeneralStatus } from "./Common/MechGeneralStatus"

interface WarMachineHangarItemProps {
    isSelected?: boolean
    toggleIsSelected?: () => void
    mech: MechBasicWithQueueStatus
    isGridView?: boolean
}

const propsAreEqual = (prevProps: WarMachineHangarItemProps, nextProps: WarMachineHangarItemProps) => {
    return (
        prevProps.isGridView === nextProps.isGridView &&
        prevProps.mech.id === nextProps.mech.id &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.mech.damaged_blocks === nextProps.mech.damaged_blocks
    )
}

export const WarMachineHangarItem = React.memo(function WarMachineHangarItem({ isSelected, toggleIsSelected, mech, isGridView }: WarMachineHangarItemProps) {
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background
    const selectedBackgroundColor = useMemo(() => shadeColor(primaryColor, -72), [primaryColor])

    return useMemo(
        () => (
            <Box sx={{ position: "relative", overflow: "visible", height: "100%" }}>
                <FancyButton
                    disableRipple
                    clipThingsProps={{
                        clipSize: "7px",
                        clipSlantSize: "0px",
                        corners: {
                            topLeft: true,
                            topRight: true,
                            bottomLeft: true,
                            bottomRight: true,
                        },
                        backgroundColor: isSelected ? selectedBackgroundColor : backgroundColor,
                        opacity: 0.9,
                        border: { isFancy: !isGridView, borderColor: `${primaryColor}50`, borderThickness: ".25rem" },
                        sx: { position: "relative", height: "100%" },
                    }}
                    sx={{ color: primaryColor, textAlign: "start", height: "100%", ":hover": { opacity: 1 } }}
                    to={`/mech/${mech.id}`}
                >
                    <Box
                        sx={{
                            position: "relative",
                            height: "100%",
                            p: isGridView ? ".5rem .6rem" : ".1rem .3rem",
                            display: isGridView ? "block" : "grid",
                            gridTemplateRows: "7rem",
                            gridTemplateColumns: `minmax(38rem, auto) 28rem 32rem`,
                            gap: "1.4rem",
                            ...(isGridView
                                ? {
                                      "&>*:not(:last-child)": {
                                          mb: "1rem",
                                      },
                                  }
                                : {}),
                        }}
                    >
                        <MechCommonArea isGridView={isGridView} mech={mech} primaryColor={primaryColor} secondaryColor={secondaryColor} />

                        <General isGridView={isGridView} title="STATUS">
                            <MechGeneralStatus mechID={mech.id} smallVersion />
                        </General>

                        <MechBarStats fontSize="1.5rem" mech={mech} color={primaryColor} iconVersion />
                    </Box>

                    <Box
                        sx={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            background: `linear-gradient(to top, #FFFFFF08, ${backgroundColor}90)`,
                            zIndex: -1,
                        }}
                    />
                </FancyButton>

                {toggleIsSelected && mech && (
                    <Checkbox
                        size="small"
                        checked={isSelected}
                        onClick={toggleIsSelected}
                        sx={{
                            position: "absolute",
                            bottom: "1rem",
                            right: ".8rem",
                            zIndex: 3,
                            p: 0,
                            color: primaryColor,
                            "& > .MuiSvgIcon-root": { width: "3.5rem", height: "3.5rem" },
                            ".Mui-checked, .MuiSvgIcon-root": { color: `${primaryColor} !important` },
                            ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${primaryColor}50 !important` },
                        }}
                    />
                )}
            </Box>
        ),
        [backgroundColor, isGridView, isSelected, mech, primaryColor, secondaryColor, selectedBackgroundColor, toggleIsSelected],
    )
}, propsAreEqual)

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
                    <MechLoadoutIcons mech={mech1} />

                    <Typography
                        sx={{
                            color: mech1?.name ? colors.offWhite : "#FFFFFF",
                            fontFamily: fonts.nostromoBlack,
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1, // change to max number of lines
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {mech1?.name || mech1?.label || label}
                    </Typography>

                    {!hideRepairBlocks && (
                        <MechRepairBlocks
                            mechID={mech?.id || mechDetails?.id || ""}
                            defaultBlocks={mech?.repair_blocks || mechDetails?.repair_blocks || 0}
                            damagedBlocks={mech?.damaged_blocks}
                        />
                    )}

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
            mech1,
            label,
            hideRepairBlocks,
            mech,
            mechDetails,
            isExpanded,
            primaryColor,
            secondaryColor,
            backgroundColor,
        ],
    )
}
