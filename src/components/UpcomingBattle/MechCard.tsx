import { Box, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { BcBorder, BcMask, RmBorder, RmMask, ZhiBorder, ZhiMask } from "../../assets"
import { FactionIDs } from "../../constants"
import { useAuth, useUI } from "../../containers"
import { useGameServerSubscription } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { LEFT_DRAWER_MAP } from "../../routes"
import { colors } from "../../theme/theme"
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
    const { factionID } = useAuth()
    const { setLeftDrawerActiveTabID } = useUI()
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

    const clickToDeploy = faction.id === factionID && !mechID
    const avatarUrl = mechDetails?.chassis_skin?.avatar_url || mechDetails?.avatar_url

    return (
        <Stack alignItems="center" sx={{ position: "relative", height: "100%", width: "100%", zIndex: 9, mt: "-2.8rem" }}>
            {/* The fancy box border */}
            <img
                style={{ position: "absolute", top: "-.9rem", left: 0, width: "100%", height: "100%", zIndex: 4, pointerEvents: "none" }}
                src={border}
                alt=""
            />

            {/* Mech image */}
            <Box
                sx={{
                    width: "calc(100% - 2rem)",
                    height: "calc(100% - 2rem)",
                    backgroundColor: colors.darkNavy,
                    clipPath: "polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)",
                    zIndex: 3,
                }}
            >
                <Box
                    onClick={clickToDeploy ? () => setLeftDrawerActiveTabID(LEFT_DRAWER_MAP["quick_deploy"]?.id) : undefined}
                    sx={{
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${avatarUrl || mask})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        opacity: clickToDeploy ? 0.3 : 1,
                        cursor: clickToDeploy ? "pointer" : "unset",
                        ":hover": {
                            opacity: 1,
                        },
                        ":active": {
                            opacity: 0.8,
                        },
                    }}
                />
            </Box>

            {/* Mech name */}
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: faction.primary_color,
                    borderThickness: ".2rem",
                }}
                corners={{ bottomLeft: true, bottomRight: true }}
                backgroundColor={faction.background_color}
                sx={{ position: "absolute", left: "1rem", right: "1rem", bottom: "-3.4rem", zIndex: -1 }}
            >
                <Box sx={{ p: "1rem", pt: "2.5rem" }}>
                    <Typography
                        variant="h6"
                        sx={{
                            textAlign: "center",
                            opacity: !mechID ? 0.4 : 1,
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
