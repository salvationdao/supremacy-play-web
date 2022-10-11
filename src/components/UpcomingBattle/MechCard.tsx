import { Box, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { BCBorder, BCDeploy, BCWaiting, RMBorder, RMDeploy, RMWaiting, ZHIBorder, ZHIDeploy, ZHIWaiting } from "../../assets"
import { FactionIDs } from "../../constants"
import { useAuth } from "../../containers"
import { zoomEffect } from "../../theme/keyframes"
import { Faction } from "../../types"
import { ClipThing } from "../Common/ClipThing"
import { BattleLobbiesMech } from "../../types/battle_queue"

export const getCardStyles = (factionID: string) => {
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
    mech?: BattleLobbiesMech
    faction: Faction
}

export const MechCard = React.memo(function MechCard({ mech, faction }: MechCardProps) {
    const { factionID } = useAuth()
    const { border, waiting, deploy } = getCardStyles(faction.id)

    const clickToDeploy = faction.id === factionID && !mech
    const avatarUrl = mech?.avatar_url

    const showMechLabel = useMemo((): string => {
        if (!mech) return "Waiting..."

        if (mech.name) return mech.name

        if (mech.label) return mech.label

        return "Unnamed"
    }, [mech])

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                flex: 1,
                width: "100%",
                height: "100%",
                maxWidth: "18rem",
                maxHeight: "25rem",
                minHeight: "6rem",
                minWidth: "4rem",
                gap: "0.5rem",
                zIndex: 9,
                overflow: "hidden",
                margin: "auto",
            }}
        >
            <Box
                component={"img"}
                src={border}
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
                    opacity: clickToDeploy ? 0.8 : !mech ? 0.3 : 1,
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
                innerSx={{
                    margin: "auto",
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        textAlign: "center",
                        opacity: !mech ? 0.4 : 1,
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                    }}
                >
                    {showMechLabel}
                </Typography>
            </ClipThing>
        </Box>
    )
})
