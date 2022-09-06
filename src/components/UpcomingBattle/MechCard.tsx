import { Box, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { BcBorder, BcMask, RmBorder, RmMask, ZhiBorder, ZhiMask } from "../../assets"
import { FactionIDs } from "../../constants"
import { useGameServerSubscription } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { Faction } from "../../types"
import { MechDetails } from "../../types/assets"
import { ClipThing } from "../Common/ClipThing"

const getCardStyles = (factionID: string) => {
    if (factionID === FactionIDs.BC) {
        return {
            border: BcBorder,
            mask: BcMask,
        }
    }

    if (factionID === FactionIDs.ZHI) {
        return {
            border: ZhiBorder,
            mask: ZhiMask,
        }
    }

    if (factionID === FactionIDs.RM) {
        return {
            border: RmBorder,
            mask: RmMask,
        }
    }

    return {
        border: RmBorder,
        mask: RmMask,
    }
}

export const MechCard = ({ mechID, faction }: { mechID: string; faction: Faction }) => {
    const [mechDetails, setMechDetails] = useState<MechDetails>()
    const { border, mask } = getCardStyles(faction.id)

    useGameServerSubscription<MechDetails>(
        {
            URI: `/public/mech/${mechID}/details`,
            key: GameServerKeys.PlayerAssetMechDetailPublic,
            ready: !!mechID,
        },
        (payload) => {
            if (!payload) return
            setMechDetails(payload)
        },
    )

    const avatarUrl = mechDetails?.chassis_skin?.avatar_url || mechDetails?.avatar_url

    return (
        <Stack alignItems="center" sx={{ position: "relative", height: "100%", width: "100%", zIndex: 9, mt: "-2.8rem" }}>
            {/* The fancy box border */}
            <img style={{ position: "absolute", top: "-1rem", left: 0, width: "100%", height: "100%", zIndex: 4 }} src={border} alt="" />

            {/* Mech image */}
            <Box
                sx={{
                    width: "calc(100% - 2rem)",
                    height: "calc(100% - 2rem)",
                    zIndex: 3,
                    backgroundImage: `url(${avatarUrl || mask})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    clipPath: "polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)",
                }}
            />

            {/* Mech name */}
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: faction.primary_color,
                    borderThickness: ".2rem",
                }}
                corners={{ bottomLeft: true, bottomRight: true }}
                backgroundColor={faction.background_color}
                sx={{ position: "absolute", left: ".7rem", right: ".7rem", bottom: "-3.4rem", zIndex: -1 }}
            >
                <Box sx={{ p: "1rem 2rem", pt: "2.5rem" }}>
                    <Typography
                        variant="h6"
                        sx={{
                            textAlign: "center",
                            opacity: !mechID ? 0.5 : 1,
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1, // change to max number of lines
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {mechID ? mechDetails?.name || mechDetails?.label || "Unnamed" : "Waiting..."}
                    </Typography>
                </Box>
            </ClipThing>
        </Stack>
    )
}

export const FactionLogoCard = ({ faction }: { faction: Faction }) => {
    const border = getCardStyles(faction.label)?.border || ""
    const h = "27rem"
    const w = "23rem"
    const avatarUrl = faction.logo_url

    return (
        <Box position="relative" height={h} width={w}>
            <img style={{ position: "absolute", top: "-14%", zIndex: 4 }} width={"100%"} src={border} alt="" />

            <div
                style={{
                    position: "absolute",
                    top: "-10%",
                    left: "2%",
                    backgroundColor: faction.primary_color,
                    filter: "brightness(28%)",
                    height: "82%",
                    width: "96%",
                    zIndex: 2,
                    clipPath: "polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    top: "-10%",
                    left: "10%",
                    backgroundImage: `url(${avatarUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                    height: "80%",
                    width: "80%",
                    zIndex: 3,
                }}
            />
        </Box>
    )
}
