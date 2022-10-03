import { getCardStyles } from "./UpcomingBattle/MechCard"
import { Box, Typography } from "@mui/material"
import React, { useState } from "react"
import { CustomAvatar } from "./PublicProfile/Avatar/CustomAvatar"
import { useGameServerSubscription } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"

export const Avatar = ({
    zIndexAdded,
    marginLeft,
    factionID,
    username,
    avatarURL,
    customAvatarID,
}: {
    zIndexAdded: number
    marginLeft: number
    factionID: string
    username: string
    avatarURL: string | undefined
    customAvatarID: string | undefined
}) => {
    const { border } = getCardStyles(factionID)

    return (
        <Box
            sx={{
                position: "relative",
                height: "75px",
                width: "75px",
                overflow: "hidden",
                marginLeft: marginLeft,
                zIndex: zIndexAdded + 1,
            }}
        >
            <Box
                component={"img"}
                src={border}
                sx={{
                    height: "100%",
                    width: "100%",
                    maxHeight: "100%",
                    maxWidth: "100%",
                    zIndex: zIndexAdded + 2,
                    overflow: "hidden",
                    pointerEvents: "none",
                    position: "absolute",
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: zIndexAdded,
                    backgroundColor: "black",
                    clipPath: "polygon(11% 4%, 90% 4%, 97% 11%, 97% 93%, 2% 93%, 2% 11%)",
                }}
            />
            {!customAvatarID && !avatarURL && (
                <Typography
                    variant={"h5"}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: zIndexAdded + 1,
                    }}
                    color={"primary"}
                >
                    {username}
                </Typography>
            )}
            {!avatarURL && customAvatarID && <CustomAvatarImg zIndexAdded={zIndexAdded} customAvatarID={customAvatarID} />}
            {!customAvatarID && avatarURL && (
                <img
                    key={`${avatarURL}-username`}
                    style={{ zIndex: zIndexAdded + 3, position: "absolute", top: "0", left: "0", maxHeight: "100%" }}
                    src={avatarURL}
                    alt="avatar"
                />
            )}
        </Box>
    )
}

const CustomAvatarImg = ({ customAvatarID, zIndexAdded }: { customAvatarID: string; zIndexAdded: number }) => {
    const [avatarDetails, setAvatarDetails] = useState<CustomAvatar>()

    useGameServerSubscription<CustomAvatar>(
        {
            URI: `/public/custom_avatar/${customAvatarID}/details`,
            key: GameServerKeys.PlayerProfileCustomAvatarDetails,
        },
        (payload) => {
            if (!payload) return
            setAvatarDetails(payload)
        },
    )

    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                maxHeight: "100%",
                zIndex: zIndexAdded + 1,
            }}
        >
            {avatarDetails?.accessory && (
                <img
                    key={avatarDetails?.accessory?.image_url}
                    style={{ zIndex: zIndexAdded + 3, position: "absolute", top: "0", left: "0", maxHeight: "100%" }}
                    src={avatarDetails?.accessory?.image_url}
                    alt="accessory"
                />
            )}

            {avatarDetails?.hair && (
                <img
                    key={avatarDetails?.hair?.image_url}
                    style={{ zIndex: zIndexAdded + 3, position: "absolute", top: "0", left: "0", maxHeight: "100%" }}
                    src={avatarDetails?.hair?.image_url}
                    alt="hair"
                />
            )}

            <img
                key={avatarDetails?.face?.image_url}
                style={{ zIndex: zIndexAdded + 2, top: "0", left: "0", maxHeight: "100%" }}
                src={avatarDetails?.face?.image_url}
                alt="face"
            />
            <img
                key={avatarDetails?.body?.image_url}
                style={{ zIndex: zIndexAdded + 1, position: "absolute", top: "0", left: "0", maxHeight: "100%" }}
                src={avatarDetails?.body?.image_url}
                alt="body"
            />
        </Box>
    )
}
