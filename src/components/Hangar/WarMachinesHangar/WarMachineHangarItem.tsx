import { Box, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { FancyButton } from "../.."
import { SvgDropdownArrow } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { getRarityDeets, shadeColor } from "../../../helpers"
import { useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { MechBasic, MechDetails } from "../../../types"
import { MediaPreview } from "../../Common/MediaPreview/MediaPreview"
import { General } from "../../Marketplace/Common/MarketItem/General"
import { MechBarStats } from "./Common/MechBarStats"
import { MechGeneralStatus } from "./Common/MechGeneralStatus"
import { MechLoadoutIcons } from "./Common/MechLoadoutIcons"

export const WarMachineHangarItem = ({ mech, isGridView }: { mech: MechBasic; isGridView?: boolean }) => {
    const location = useLocation()
    const theme = useTheme()
    const [mechDetails, setMechDetails] = useState<MechDetails>()

    useGameServerSubscriptionFaction<MechDetails>(
        {
            URI: `/mech/${mech.id}/details`,
            key: GameServerKeys.GetMechDetails,
        },
        (payload) => {
            if (!payload) return
            setMechDetails(payload)
        },
    )

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    return (
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
                    backgroundColor: backgroundColor,
                    opacity: 0.9,
                    border: { isFancy: !isGridView, borderColor: primaryColor, borderThickness: ".25rem" },
                    sx: { position: "relative", height: "100%" },
                }}
                sx={{ color: primaryColor, textAlign: "start", height: "100%" }}
                to={`/mech/${mech.id}${location.hash}`}
            >
                <Box
                    sx={{
                        position: "relative",
                        height: "100%",
                        p: isGridView ? ".5rem .6rem" : ".1rem .3rem",
                        display: isGridView ? "block" : "grid",
                        gridTemplateRows: "7rem",
                        gridTemplateColumns: `minmax(38rem, auto) 20rem 32rem`,
                        gap: "1.4rem",
                        ...(isGridView
                            ? {
                                  "&>*:not(:last-child)": {
                                      mb: ".8rem",
                                  },
                              }
                            : {}),
                    }}
                >
                    <MechCommonArea isGridView={isGridView} mech={mech} mechDetails={mechDetails} primaryColor={primaryColor} secondaryColor={secondaryColor} />

                    <General isGridView={isGridView} title="STATUS">
                        <MechGeneralStatus mechID={mech.id} hideBox />
                    </General>

                    <MechBarStats fontSize="1.5rem" mech={mech} mechDetails={mechDetails} color={primaryColor} iconVersion />
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
        </Box>
    )
}

export const MechCommonArea = ({
    primaryColor,
    secondaryColor,
    isGridView,
    mech,
    mechDetails,
    isExpanded,
    toggleIsExpanded,
    label,
}: {
    primaryColor: string
    secondaryColor: string
    isGridView?: boolean
    mech?: MechBasic
    mechDetails?: MechDetails
    isExpanded?: boolean
    toggleIsExpanded?: (value?: boolean) => void
    label?: string
}) => {
    const rarityDeets = useMemo(() => getRarityDeets(mechDetails?.chassis_skin?.tier || mechDetails?.tier || mech?.tier || ""), [mech, mechDetails])
    const backgroundColor = useMemo(() => shadeColor(primaryColor, -90), [primaryColor])

    const mechh = mechDetails || mech

    const avatarUrl = mechDetails?.chassis_skin?.avatar_url || mech?.avatar_url || ""
    const imageUrl = mechDetails?.chassis_skin?.image_url || mech?.image_url || ""
    const largeImageUrl = mechDetails?.chassis_skin?.large_image_url || mech?.large_image_url || ""

    return (
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
                spacing={isGridView ? ".1rem" : ".2rem"}
                sx={{
                    flex: 1,
                    pr: toggleIsExpanded ? "3rem" : "unset",
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
                <Typography
                    variant="body2"
                    sx={{
                        color: mechh?.name ? primaryColor : colors.grey,
                        fontFamily: fonts.nostromoBlack,
                        display: "-webkit-box",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1, // change to max number of lines
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {mechh?.name || "Unnamed"}
                </Typography>

                <Typography
                    sx={{
                        fontFamily: fonts.nostromoBlack,
                        display: "-webkit-box",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1, // change to max number of lines
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {mechh?.label || label}
                </Typography>

                <Stack
                    direction={isGridView ? "column-reverse" : "row"}
                    spacing={isGridView ? ".2rem" : ".8rem"}
                    alignItems={isGridView ? "flex-start" : "center"}
                >
                    <MechLoadoutIcons mechDetails={mechDetails} />

                    {mechDetails?.chassis_skin && (
                        <Typography
                            variant="caption"
                            sx={{
                                fontFamily: fonts.nostromoBold,
                                display: "-webkit-box",
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1, // change to max number of lines
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            <span style={{ color: colors.chassisSkin, fontFamily: "inherit" }}>{mechDetails?.chassis_skin?.label}</span>{" "}
                            <span style={{ color: rarityDeets.color, fontFamily: "inherit" }}>[{rarityDeets.label}]</span>
                        </Typography>
                    )}
                </Stack>

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
                                {mechh && (
                                    <Stack justifyContent="center" sx={{ width: "40rem" }}>
                                        <MechBarStats fontSize="1.5rem" mech={mechh} mechDetails={mechDetails} color={primaryColor} iconVersion />
                                    </Stack>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                )}
            </Stack>
        </Stack>
    )
}
