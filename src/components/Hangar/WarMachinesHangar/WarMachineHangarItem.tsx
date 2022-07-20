import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { FancyButton } from "../.."
import { SvgDropdownArrow } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { getRarityDeets, shadeColor } from "../../../helpers"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
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
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [mechDetails, setMechDetails] = useState<MechDetails>()

    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<MechDetails>(GameServerKeys.GetMechDetails, {
                    mech_id: mech.id,
                })

                if (!resp) return
                setMechDetails(resp)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [mech.id, send])

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background
    const avatarUrl = mechDetails?.chassis_skin?.avatar_url || mech.avatar_url
    const imageUrl = mechDetails?.chassis_skin?.image_url || mech.image_url
    const largeImageUrl = mechDetails?.chassis_skin?.large_image_url || mech.large_image_url

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
                        gridTemplateColumns: `8rem auto 35rem 20rem`, // hard-coded to have 4 columns, adjust as required
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
                    <Box
                        sx={{
                            position: "relative",
                            height: isGridView ? "15rem" : "100%",
                            width: "100%",
                        }}
                    >
                        <MediaPreview imageUrl={avatarUrl || imageUrl || largeImageUrl} objectFit={isGridView ? "cover" : "contain"} />
                    </Box>

                    <MechCommonArea isGridView={isGridView} mech={mech} mechDetails={mechDetails} primaryColor={primaryColor} secondaryColor={secondaryColor} />

                    <General isGridView={isGridView} title="STATS">
                        <MechBarStats fontSize="1.5rem" mech={mech} mechDetails={mechDetails} color={primaryColor} iconVersion />
                    </General>

                    <General isGridView={isGridView} title="STATUS">
                        <MechGeneralStatus mechID={mech.id} hideBox />
                    </General>
                </Box>

                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: `url(${largeImageUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "top",
                        backgroundSize: "cover",
                        opacity: 0.06,
                        zIndex: -2,
                    }}
                />

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
    const rarityDeets = useMemo(() => getRarityDeets(mech?.tier || mechDetails?.tier || ""), [mech, mechDetails])
    const backgroundColor = useMemo(() => shadeColor(primaryColor, -90), [primaryColor])

    const mechh = mech || mechDetails

    return (
        <Stack
            spacing={isGridView ? ".1rem" : ".2rem"}
            sx={{
                position: "relative",
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
                    color: mech?.name || mechDetails?.name ? primaryColor : colors.grey,
                    fontFamily: fonts.nostromoBlack,
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 1, // change to max number of lines
                    WebkitBoxOrient: "vertical",
                }}
            >
                {mech?.name || mechDetails?.name || "Unnamed"}
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
                {mech?.label || mechDetails?.label || label}
            </Typography>

            <Stack direction={isGridView ? "column-reverse" : "row"} spacing={isGridView ? ".2rem" : ".8rem"} alignItems={isGridView ? "flex-start" : "center"}>
                <MechLoadoutIcons mechDetails={mechDetails} />
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
            </Stack>

            {toggleIsExpanded && !isGridView && (
                <Stack
                    direction="row"
                    sx={{
                        position: "absolute",
                        top: "-2rem",
                        left: "calc(100% - 3rem)",
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
                        <Stack direction="row" spacing="4rem" sx={{ p: "1.5rem 2.1rem" }}>
                            {mechh && (
                                <General isGridView={isGridView} title="STATS">
                                    <Box sx={{ width: "40rem" }}>
                                        <MechBarStats fontSize="1.5rem" mech={mechh} mechDetails={mechDetails} color={primaryColor} iconVersion />
                                    </Box>
                                </General>
                            )}
                        </Stack>
                    </Box>
                </Stack>
            )}
        </Stack>
    )
}
