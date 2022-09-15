import { Box, Stack, Typography } from "@mui/material"
import React, { useMemo, useState } from "react"
import { BCBorder, BCDeploy, BCWaiting, RMBorder, RMDeploy, RMWaiting, ZHIBorder, ZHIDeploy, ZHIWaiting } from "../../assets"
import { FactionIDs } from "../../constants"
import { useAuth, useUI } from "../../containers"
import { useGameServerSubscription } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { LEFT_DRAWER_MAP } from "../../routes"
import { zoomEffect } from "../../theme/keyframes"
import { colors } from "../../theme/theme"
import { Faction } from "../../types"
import { MechDetails } from "../../types/assets"
import { ClipThing } from "../Common/ClipThing"

const getCardStyles = (factionID: string) => {
    if (factionID === FactionIDs.BC) {
        return {
            border: BCBorder,
            waiting: BCWaiting,
            deploy: BCDeploy,
        }
    }

    if (factionID === FactionIDs.ZHI) {
        return {
            border: ZHIBorder,
            waiting: ZHIWaiting,
            deploy: ZHIDeploy,
        }
    }

    if (factionID === FactionIDs.RM) {
        return {
            border: RMBorder,
            waiting: RMWaiting,
            deploy: RMDeploy,
        }
    }

    return {
        border: RMBorder,
        waiting: RMWaiting,
        deploy: RMDeploy,
    }
}

interface MechCardProps {
    mechID: string
    faction: Faction

    mechName?: string
    avatarURL?: string
}

const propsAreEqual = (prevProps: MechCardProps, nextProps: MechCardProps) => {
    return prevProps.mechID === nextProps.mechID && prevProps.faction.id === nextProps.faction.id
}

export const MechCard = React.memo(function MechCard({ mechID, faction, mechName, avatarURL }: MechCardProps) {
    const { factionID } = useAuth()
    const { setLeftDrawerActiveTabID } = useUI()
    const [mechDetails, setMechDetails] = useState<MechDetails>()
    const { border, waiting, deploy } = getCardStyles(faction.id)

    useGameServerSubscription<MechDetails>(
        {
            URI: `/public/mech/${mechID}/details`,
            key: GameServerKeys.PlayerAssetMechDetailPublic,
            ready: !!mechID && (!mechName || !avatarURL), // don't subscribe, if data is already provided
        },
        (payload) => {
            if (!payload) return
            setMechDetails(payload)
        },
    )

    const clickToDeploy = faction.id === factionID && !mechID
    const avatarUrl = avatarURL || mechDetails?.chassis_skin?.avatar_url || mechDetails?.avatar_url
    const showMechLabel = useMemo((): string => {
        if (mechName) return mechName

        if (!mechDetails) return "Waiting..."

        if (mechDetails.name) return mechDetails.name

        if (mechDetails.label) return mechDetails.label

        return "Unnamed"
    }, [mechName, mechDetails])

    return (
        <Stack alignItems="center" sx={{ position: "relative", height: "100%", width: "100%", zIndex: 9, mt: "-2.8rem" }}>
            {/* The fancy box border */}
            <img
                style={{ position: "absolute", top: "-.85rem", left: 0, width: "100%", height: "100%", zIndex: 4, pointerEvents: "none" }}
                src={border}
                alt=""
            />

            {/* Mech image */}
            <Box
                sx={{
                    position: "relative",
                    width: "calc(100% - 2rem)",
                    height: "calc(100% - 2rem)",
                    backgroundColor: colors.darkNavy,
                    clipPath: "polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)",
                    zIndex: 3,
                    overflow: "hidden",
                }}
            >
                <Box
                    onClick={clickToDeploy ? () => setLeftDrawerActiveTabID(LEFT_DRAWER_MAP["quick_deploy"]?.id) : undefined}
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${avatarUrl || (clickToDeploy ? deploy : waiting)})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        opacity: clickToDeploy ? 0.8 : !mechID ? 0.3 : 1,
                        cursor: clickToDeploy ? "pointer" : "unset",
                        ...(clickToDeploy
                            ? {
                                  animation: `${zoomEffect(1.08)} 3s infinite`,
                                  ":hover": {
                                      opacity: 1,
                                  },
                                  ":active": {
                                      opacity: 0.8,
                                  },
                              }
                            : {}),
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
                <Box sx={{ p: ".6rem", pt: "2.5rem" }}>
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
                        {showMechLabel}
                    </Typography>
                </Box>
            </ClipThing>
        </Stack>
    )
}, propsAreEqual)
