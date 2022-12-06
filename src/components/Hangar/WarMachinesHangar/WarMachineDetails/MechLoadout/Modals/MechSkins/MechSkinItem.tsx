import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { SvgChevronDown, SvgChevronUp, SvgDoubleChevronDown, SvgDoubleChevronUp, SvgView } from "../../../../../../../assets"
import { useTheme } from "../../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../../helpers"
import { colors, fonts } from "../../../../../../../theme/theme"
import { MechSkin } from "../../../../../../../types"
import { ClipThing } from "../../../../../../Common/Deprecated/ClipThing"
import { FancyButton } from "../../../../../../Common/Deprecated/FancyButton"

interface MechSkinItemProps {
    levelDifference: number
    skinDetails: MechSkin
    selected: boolean
    onSelect: (w: MechSkin) => void
}

export const MechSkinItem = ({ levelDifference, skinDetails, selected, onSelect }: MechSkinItemProps) => {
    const theme = useTheme()

    const levelIcon = useMemo(() => {
        const commonProps = {
            size: "1.6rem",
            sx: {
                zIndex: 1,
                position: "absolute",
                top: "1rem",
                left: "1rem",
            },
        }
        if (levelDifference > 1) {
            return <SvgDoubleChevronUp {...commonProps} fill={colors.green} />
        } else if (levelDifference > 0) {
            return <SvgChevronUp {...commonProps} fill={colors.green} />
        } else if (levelDifference === 0) {
            return
        } else if (levelDifference < -1) {
            return <SvgDoubleChevronDown {...commonProps} fill={colors.red} />
        } else {
            return <SvgChevronDown {...commonProps} fill={colors.red} />
        }
    }, [levelDifference])

    if (!skinDetails) {
        return (
            <ClipThing
                border={{
                    borderColor: theme.factionTheme.primary,
                }}
                backgroundColor={theme.factionTheme.background}
            >
                <Stack alignItems="center" justifyContent="center">
                    <CircularProgress />
                </Stack>
            </ClipThing>
        )
    }

    return (
        <FancyButton
            clipThingsProps={{
                border: {
                    borderColor: theme.factionTheme.primary,
                },
                backgroundColor: theme.factionTheme.background,
            }}
            sx={{
                position: "relative",
                backgroundColor: selected ? "#ffffff22" : "transparent",
            }}
            innerSx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
            }}
            onClick={() => onSelect(skinDetails)}
        >
            {skinDetails.equipped_on && (
                <Box
                    sx={{
                        zIndex: 1,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "black",
                            opacity: 0.4,
                        }}
                    ></Box>
                    <Typography
                        variant="h2"
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%) rotate(-45deg)",
                            transformOrigin: "center",
                            fontSize: "2rem",
                            whiteSpace: "nowrap",
                        }}
                    >
                        IN USE
                    </Typography>
                </Box>
            )}
            {levelIcon}
            {selected && (
                <SvgView
                    size="3rem"
                    sx={{
                        zIndex: 1,
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        opacity: 0.5,
                    }}
                />
            )}
            <Box>
                <Box
                    sx={{
                        position: "relative",
                        height: "9rem",
                        width: "100%",
                    }}
                >
                    <Box
                        component="img"
                        src={
                            skinDetails.swatch_images?.avatar_url ||
                            skinDetails.swatch_images?.image_url ||
                            skinDetails.swatch_images?.large_image_url ||
                            skinDetails.avatar_url ||
                            skinDetails.image_url ||
                            skinDetails.large_image_url
                        }
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                        }}
                    />
                </Box>

                <Typography
                    variant="h6"
                    sx={{
                        color: getRarityDeets(skinDetails.tier).color,
                        fontFamily: fonts.nostromoBlack,
                        fontSize: "1.6rem",
                        textAlign: "center",
                    }}
                >
                    {getRarityDeets(skinDetails.tier).label}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        textAlign: "center",
                    }}
                >
                    {skinDetails.label}
                </Typography>
            </Box>
        </FancyButton>
    )
}
