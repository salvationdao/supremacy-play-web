import { Box, Stack, Typography } from "@mui/material"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"
import { Submodel } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"
import { MediaPreview } from "../../Common/MediaPreview/MediaPreview"
import { useMemo } from "react"
import { getRarityDeets } from "../../../helpers"
import { SvgSkin } from "../../../assets"

interface SubmodelItemProps {
    submodel: Submodel
    isGridView: boolean
}

export const SubmodelItem = ({ submodel, isGridView }: SubmodelItemProps) => {
    return <>{submodel && <KeycardHangarItemInner submodel={submodel} isGridView={isGridView} />}</>
}

export const KeycardHangarItemInner = ({ submodel, isGridView }: SubmodelItemProps) => {
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
                    <Box
                        sx={{
                            position: "relative",
                            height: "20rem",
                        }}
                    >
                        <MediaPreview
                            imageUrl={submodel.images.image_url ?? submodel.images.avatar_url ?? ""}
                            videoUrls={[submodel.images.animation_url, submodel.images.card_animation_url]}
                        />
                    </Box>

                    <Stack spacing="0" sx={{ flex: 1, px: ".4rem", py: ".3rem" }}>
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
                        </Stack>
                        <Typography variant="h6" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                            {submodel.label}
                        </Typography>
                    </Stack>
                </Stack>
            </ClipThing>
        </Box>
    )
}
