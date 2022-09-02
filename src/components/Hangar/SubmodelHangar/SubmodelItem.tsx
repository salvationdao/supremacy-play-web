import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { SvgSkin } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { getRarityDeets } from "../../../helpers"
import { fonts } from "../../../theme/theme"
import { Submodel } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"
import { MediaPreview } from "../../Common/MediaPreview/MediaPreview"

interface SubmodelItemProps {
    submodel: Submodel
}

export const SubmodelItem = ({ submodel }: SubmodelItemProps) => {
    return <>{submodel && <SubmodelItemInner submodel={submodel} />}</>
}

const SubmodelItemInner = ({ submodel }: SubmodelItemProps) => {
    const theme = useTheme()
    const rarityDeets = useMemo(() => getRarityDeets(submodel.tier), [submodel.tier])

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                transition: "all .15s",
                ":hover": {
                    transform: "translateY(-.4rem)",
                },
            }}
        >
            <ClipThing
                clipSize="12px"
                border={{
                    borderColor: primaryColor,
                    borderThickness: ".2rem",
                }}
                opacity={0.9}
                backgroundColor={backgroundColor}
                sx={{ height: "100%" }}
            >
                <Stack spacing={"1.5rem"} justifyContent="center" sx={{ height: "100%", p: "1.5rem" }}>
                    {/* Image */}
                    <Box sx={{ position: "relative", height: "23rem" }}>
                        <MediaPreview sx={{ p: "1.5rem" }} imageUrl={submodel.images.image_url ?? submodel.images.avatar_url ?? ""} />
                    </Box>

                    <Stack direction="row" alignItems="flex-start">
                        <Stack sx={{ flex: 1, px: ".4rem", py: ".3rem" }}>
                            <Stack spacing=".4rem" direction="row" alignItems="center">
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: rarityDeets.color,
                                        fontFamily: fonts.nostromoBold,
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        overflowWrap: "anywhere",
                                        textOverflow: "ellipsis",
                                        WebkitLineClamp: 1, // change to max number of lines
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {rarityDeets.label}
                                </Typography>
                                <SvgSkin fill={rarityDeets.color} size="1.7rem" />

                                {submodel.level && (
                                    <Typography
                                        variant="body2"
                                        sx={{ ml: "auto !important", color: theme.factionTheme.secondary, fontFamily: fonts.nostromoBlack }}
                                    >
                                        Level: {submodel.level}
                                    </Typography>
                                )}
                            </Stack>

                            <Typography variant="h6" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                                {submodel.label}
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </ClipThing>
        </Box>
    )
}
