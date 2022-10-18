import { Box, Stack, Typography } from "@mui/material"
import { colors, fonts } from "../../../theme/theme"
import { Faction } from "../../../types"
import { AdminGetUserAsset } from "../../../types/admin"
import { MediaPreview } from "../../Common/MediaPreview/MediaPreview"

interface AdminUserAssetProps {
    userAsset: AdminGetUserAsset
    faction: Faction
}

export const AdminUserAsset = ({ userAsset }: AdminUserAssetProps) => {
    return (
        <Stack sx={{ p: "2rem" }}>
            {userAsset.mechs ? (
                <Box
                    sx={{
                        width: "100%",
                        display: "grid",
                        gridTemplateColumns: "repeat(4, minmax(26rem, 1fr))",
                        gap: "2rem",
                        alignItems: "start",
                        justifyContent: "start",
                        overflow: "visible",
                    }}
                >
                    {userAsset.mechs.map((mechDetails) => {
                        const avatarUrl = mechDetails.chassis_skin?.avatar_url || mechDetails.avatar_url || ""
                        const imageUrl = mechDetails.chassis_skin?.image_url || mechDetails.image_url || ""
                        const largeImageUrl = mechDetails.chassis_skin?.large_image_url || mechDetails.large_image_url || ""
                        const name = mechDetails.name || mechDetails.label

                        return (
                            <Stack key={mechDetails.id} spacing="1rem">
                                <MediaPreview
                                    imageUrl={avatarUrl || imageUrl || largeImageUrl}
                                    objectFit="cover"
                                    sx={{
                                        height: "20rem",
                                    }}
                                />
                                <Typography
                                    sx={{
                                        color: mechDetails.name ? colors.offWhite : "#FFFFFF",
                                        fontFamily: fonts.nostromoBlack,
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        overflowWrap: "anywhere",
                                        textOverflow: "ellipsis",
                                        WebkitLineClamp: 1, // change to max number of lines
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {name}
                                </Typography>
                            </Stack>
                        )
                    })}
                </Box>
            ) : (
                <Typography>User Has No Mechs</Typography>
            )}
        </Stack>
    )
}
