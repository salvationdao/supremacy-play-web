import { Box, Button, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { SvgEdit } from "../../../assets"
import { Faction, MechDetails, User } from "../../../types"
import { AdminGetUserAsset } from "../../../types/admin"
import { MediaPreview } from "../../Common/MediaPreview/MediaPreview"
import { AdminUpdateMechNameModal } from "./AdminUpdateMechNameModal"

interface AdminUserAssetProps {
    user: User
    faction: Faction
    userAsset: AdminGetUserAsset
}

export const AdminUserAsset = ({ user, faction, userAsset }: AdminUserAssetProps) => {
    return (
        <>
            <Stack sx={{ p: "2rem" }}>
                {userAsset.mechs && userAsset.mechs.length > 0 ? (
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
                        {userAsset.mechs.map((mechDetails, index) => (
                            <MechEntry key={index} user={user} faction={faction} mech={mechDetails} />
                        ))}
                    </Box>
                ) : (
                    <Typography>User Has No Mechs</Typography>
                )}
            </Stack>
        </>
    )
}

interface MechEntryProps {
    user: User
    faction: Faction
    mech: MechDetails
}

const MechEntry = ({ user, faction, mech }: MechEntryProps) => {
    const [updatedMech, setUpdatedMech] = useState(mech)
    const [updateMechNameModalOpen, setUpdateMechNameModalOpen] = useState(false)

    const avatarUrl = updatedMech.chassis_skin?.avatar_url || updatedMech.avatar_url || ""
    const imageUrl = updatedMech.chassis_skin?.image_url || updatedMech.image_url || ""
    const largeImageUrl = updatedMech.chassis_skin?.large_image_url || updatedMech.large_image_url || ""
    const name = updatedMech.name || updatedMech.label

    return (
        <>
            <Stack spacing="1rem">
                <MediaPreview
                    imageUrl={avatarUrl || imageUrl || largeImageUrl}
                    objectFit="cover"
                    sx={{
                        height: "20rem",
                    }}
                />
                <Button
                    disabled={updateMechNameModalOpen}
                    onClick={() => setUpdateMechNameModalOpen(true)}
                    endIcon={<SvgEdit size="2rem" />}
                    sx={{
                        ml: "-1rem",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "1.8rem",
                            color: "#FFFFFF",
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {name}
                    </Typography>
                </Button>
            </Stack>

            {updateMechNameModalOpen && (
                <AdminUpdateMechNameModal
                    user={user}
                    mech={updatedMech}
                    onClose={() => setUpdateMechNameModalOpen(false)}
                    onSuccess={(newMechName) => {
                        setUpdatedMech((prev) => {
                            return {
                                ...prev,
                                name: newMechName,
                            }
                        })
                        setUpdateMechNameModalOpen(false)
                    }}
                    faction={faction}
                />
            )}
        </>
    )
}
