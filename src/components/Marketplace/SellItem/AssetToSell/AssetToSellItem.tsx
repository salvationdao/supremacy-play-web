import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { KeycardPNG, SafePNG } from "../../../../assets"
import { getRarityDeets } from "../../../../helpers"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { fonts } from "../../../../theme/theme"
import { Keycard, MechDetails, MysteryCrate } from "../../../../types"
import { MechLoadoutIcons } from "../../WarMachinesMarket/WarMachineMarketItem"
import { AssetToSellStruct } from "../SellItem"

export const AssetToSellItem = ({
    assetToSell,
    playVideo,
    onClick,
    orientation,
}: {
    assetToSell: AssetToSellStruct
    playVideo?: boolean
    onClick?: () => void
    orientation?: "horizontal" | "vertical"
}) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")
    // Additional fetched data
    const [mechDetails, setMechDetails] = useState<MechDetails>()
    const [mysteryCrate, setMysteryCrate] = useState<MysteryCrate>()
    const [keycard, setKeycard] = useState<Keycard>()

    // Things for render
    const [avatarUrl, setAvatarUrl] = useState<string>()
    const [imageUrl, setImageUrl] = useState<string>()
    const [videoUrl, setVideoUrl] = useState<string>()
    const [label, setLabel] = useState<string>()
    const [description, setDescription] = useState<string>()
    const [rarityDeets, setRarityDeets] = useState<{
        label: string
        color: string
    }>()

    // Initial populate
    useEffect(() => {
        if (assetToSell.mech) {
            setAvatarUrl(assetToSell.mech.avatar_url || mechDetails?.chassis_skin?.avatar_url)
            setImageUrl(assetToSell.mech.large_image_url || mechDetails?.chassis_skin?.large_image_url)
            setVideoUrl(assetToSell.mech.animation_url || mechDetails?.chassis_skin?.animation_url)
            setLabel(assetToSell.mech.name || assetToSell.mech.label || mechDetails?.name || mechDetails?.label)
            const tier = assetToSell.mech.tier || mechDetails?.tier
            setRarityDeets(tier ? getRarityDeets(tier) : undefined)
        } else if (assetToSell.mysteryCrate) {
            setAvatarUrl(assetToSell.mysteryCrate.avatar_url || mysteryCrate?.avatar_url || SafePNG)
            setImageUrl(assetToSell.mysteryCrate.large_image_url || mysteryCrate?.large_image_url || SafePNG)
            setVideoUrl(assetToSell.mysteryCrate.animation_url || mysteryCrate?.animation_url)
            setLabel(assetToSell.mysteryCrate.label || mysteryCrate?.label)
            setDescription(assetToSell.mysteryCrate.description || mysteryCrate?.description)
        } else if (assetToSell.keycard) {
            setAvatarUrl(assetToSell.keycard.blueprints.image_url || keycard?.blueprints.image_url || KeycardPNG)
            setImageUrl(assetToSell.keycard.blueprints.image_url || keycard?.blueprints.image_url || KeycardPNG)
            setVideoUrl(assetToSell.keycard.blueprints.animation_url || keycard?.blueprints.animation_url)
            setLabel(assetToSell.keycard.blueprints.label || keycard?.blueprints.label)
            setDescription(assetToSell.keycard.blueprints.description || keycard?.blueprints.description)
        }
    }, [assetToSell, mechDetails, mysteryCrate, keycard])

    // Get addition mech data
    useEffect(() => {
        ;(async () => {
            try {
                if (!assetToSell.mech) return
                const resp = await send<MechDetails>(GameServerKeys.GetMechDetails, {
                    mech_id: assetToSell.id,
                })
                if (!resp) return
                setMechDetails(resp)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [assetToSell, send])

    // Get additional mystery crate data
    useEffect(() => {
        ;(async () => {
            try {
                if (!assetToSell.mysteryCrate) return
                const resp = await send<MysteryCrate>(GameServerKeys.GetPlayerMysteryCrate, {
                    id: assetToSell.id,
                })

                if (!resp) return
                setMysteryCrate(resp)
            } catch (err) {
                console.error(err)
            }
        })()
    }, [assetToSell, send])

    // Get additional keycard data
    useEffect(() => {
        ;(async () => {
            try {
                if (!assetToSell.keycard) return
                const resp = await send<Keycard>(GameServerKeys.GetPlayerKeycard, {
                    id: assetToSell.id,
                })

                if (!resp) return
                setKeycard(resp)
            } catch (err) {
                console.error(err)
            }
        })()
    }, [assetToSell, send])

    return (
        <Stack
            direction={orientation === "horizontal" ? "row" : "column"}
            spacing="1.5rem"
            alignItems="center"
            sx={{
                position: "relative",
                py: "1rem",
                px: "1rem",
                width: orientation === "horizontal" ? "unset" : "31rem",
                cursor: onClick ? "pointer" : "unset",
                ":hover": { backgroundColor: onClick ? "#FFFFFF15" : "unset" },
            }}
            onClick={onClick}
        >
            <Box
                component="video"
                sx={{
                    height: orientation === "horizontal" ? "7rem" : "28rem",
                    width: orientation === "horizontal" ? "7rem" : "100%",
                    overflow: "hidden",
                    objectFit: "contain",
                    objectPosition: "center",
                    borderRadius: 1,
                    border: "#FFFFFF18 2px solid",
                    boxShadow: "inset 0 0 12px 6px #00000040",
                    background: `radial-gradient(#FFFFFF20 10px, #00000080)`,
                }}
                loop
                muted
                autoPlay
                poster={playVideo ? imageUrl : avatarUrl}
            >
                {playVideo && <source src={videoUrl} type="video/mp4" />}
            </Box>

            <Stack spacing=".3rem">
                {rarityDeets && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: rarityDeets.color,
                            fontFamily: fonts.nostromoBlack,
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: orientation === "horizontal" ? 1 : 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {rarityDeets.label}
                    </Typography>
                )}

                {label && (
                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: orientation === "horizontal" ? 1 : 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {label}
                    </Typography>
                )}

                {description && (
                    <Typography
                        sx={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: orientation === "horizontal" ? 1 : 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {description}
                    </Typography>
                )}

                {mechDetails && (
                    <Box sx={{ pt: ".4rem" }}>
                        <MechLoadoutIcons mechDetails={mechDetails} />
                    </Box>
                )}
            </Stack>
        </Stack>
    )
}
