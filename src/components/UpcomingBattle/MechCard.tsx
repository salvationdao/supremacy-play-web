import { Box, Typography } from "@mui/material"
import React, { useState } from "react"
import { BCBorder, BCDeploy, BCWaiting, RMBorder, RMDeploy, RMWaiting, ZHIBorder, ZHIDeploy, ZHIWaiting } from "../../assets"
import { FactionIDs } from "../../constants"
import { useAuth, useUI } from "../../containers"
import { useGameServerSubscription } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { LEFT_DRAWER_MAP } from "../../routes"
import { zoomEffect } from "../../theme/keyframes"
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
}

const propsAreEqual = (prevProps: MechCardProps, nextProps: MechCardProps) => {
    return prevProps.mechID === nextProps.mechID && prevProps.faction.id === nextProps.faction.id
}

export const MechCard = React.memo(function MechCard({ mechID, faction }: MechCardProps) {
    const { factionID } = useAuth()
    const { setLeftDrawerActiveTabID } = useUI()
    const [mechDetails, setMechDetails] = useState<MechDetails>()
    const { border, waiting, deploy } = getCardStyles(faction.id)

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
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                flex: 1,
                width: "100%",
                height: "100%",
                maxWidth: "210px",
                maxHeight: "300px",
                minHeight: "100px",
                gap: "0.5rem",
                zIndex: 9,
                overflow: "hidden",
            }}
        >
            <Box
                component={"img"}
                src={border}
                onClick={clickToDeploy ? () => setLeftDrawerActiveTabID(LEFT_DRAWER_MAP["quick_deploy"]?.id) : undefined}
                sx={{
                    position: "relative",
                    height: "80%",
                    width: "100%",
                    maxHeight: "80%",
                    maxWidth: "100%",
                    zIndex: 3,
                    overflow: "hidden",
                    pointerEvents: "none",
                }}
            />
            <Box
                onClick={clickToDeploy ? () => setLeftDrawerActiveTabID(LEFT_DRAWER_MAP["quick_deploy"]?.id) : undefined}
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "80%",
                    clipPath: "polygon(11% 4%, 90% 4%, 97% 11%, 97% 93%, 2% 93%, 2% 11%)",
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
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: faction.primary_color,
                    borderThickness: ".2rem",
                }}
                corners={{ bottomLeft: true, bottomRight: true }}
                backgroundColor={faction.background_color}
                sx={{
                    display: "flex",
                    margin: "auto",
                    flex: 1,
                    width: "100%",
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        textAlign: "center",
                        opacity: !mechID ? 0.4 : 1,
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                    }}
                >
                    {mechID ? mechDetails?.name || mechDetails?.label || "Unnamed" : "Waiting..."}
                </Typography>
            </ClipThing>
        </Box>
    )
}, propsAreEqual)
