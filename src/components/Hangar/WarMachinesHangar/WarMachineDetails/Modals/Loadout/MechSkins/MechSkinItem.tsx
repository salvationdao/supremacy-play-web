import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { SvgView } from "../../../../../../../assets"
import { useTheme } from "../../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../../helpers"
import { fonts } from "../../../../../../../theme/theme"
import { MechSkin } from "../../../../../../../types"
import { ClipThing } from "../../../../../../Common/ClipThing"
import { FancyButton } from "../../../../../../Common/FancyButton"

interface MechSkinItemProps {
    submodelDetails: MechSkin
    equipped?: MechSkin
    selected: boolean
    onSelect: (w: MechSkin) => void
}

export const MechSkinItem = ({ submodelDetails, equipped, selected, onSelect }: MechSkinItemProps) => {
    const theme = useTheme()

    if (!submodelDetails) {
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
                alignItems: "center",
            }}
            onClick={() => onSelect(submodelDetails)}
        >
            {submodelDetails.equipped_on && (
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
                            submodelDetails.swatch_images?.avatar_url ||
                            submodelDetails.swatch_images?.image_url ||
                            submodelDetails.swatch_images?.large_image_url ||
                            submodelDetails.avatar_url ||
                            submodelDetails.image_url ||
                            submodelDetails.large_image_url
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
                        color: getRarityDeets(submodelDetails.tier).color,
                        fontFamily: fonts.nostromoBlack,
                    }}
                >
                    {submodelDetails.tier}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        textAlign: "center",
                    }}
                >
                    {submodelDetails.label}
                </Typography>
            </Box>
        </FancyButton>
    )
}
