import { Stack, Typography } from "@mui/material"
import { useState } from "react"
import { ClipThing } from "../../.."
import { useTheme } from "../../../../containers/theme"
import { useGameServerSubscription, useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { pulseEffect } from "../../../../theme/keyframes"
import { MechDetails, MechStatus, MechStatusEnum } from "../../../../types"
import { NiceBoxThing } from "../../../Common/Nice/NiceBoxThing"
import { MechLoadout } from "./MechLoadout/MechLoadout"
import { MechPicker } from "./MechPicker/MechPicker"

interface WarMachineHangarDetailsProps {
    drawerContainerRef: React.MutableRefObject<HTMLElement | undefined>
    mechID: string
}

export const WarMachineHangarDetails = ({ drawerContainerRef, mechID }: WarMachineHangarDetailsProps) => {
    return (
        <>
            <WarMachineHangarDetailsInner drawerContainerRef={drawerContainerRef} mechID={mechID} />
        </>
    )
}

interface WarMachineHangarDetailsInnerProps {
    drawerContainerRef: React.MutableRefObject<HTMLElement | undefined>
    mechID: string
}

export const WarMachineHangarDetailsInner = ({ drawerContainerRef, mechID }: WarMachineHangarDetailsInnerProps) => {
    const theme = useTheme()
    const [mechDetails, setMechDetails] = useState<MechDetails>()

    useGameServerSubscriptionFaction<MechDetails>(
        {
            URI: `/mech/${mechID}/details`,
            key: GameServerKeys.GetMechDetails,
        },
        (payload) => {
            if (!payload) return
            setMechDetails(payload)
        },
    )

    const [mechStatus, setMechStatus] = useState<MechStatus>()
    useGameServerSubscriptionFaction<MechStatus>(
        {
            URI: `/queue/${mechID}`,
            key: GameServerKeys.SubMechQueuePosition,
        },
        (payload) => {
            if (!payload || payload.status === MechStatusEnum.Sold) return
            setMechStatus(payload)
        },
    )

    const [mechIsStaked, setMechIsStaked] = useState(false)
    useGameServerSubscription<boolean>(
        {
            URI: `/public/mech/${mechID}/is_staked`,
            key: GameServerKeys.SubMechIsStaked,
        },
        setMechIsStaked,
    )

    const updateMechDetails = (newMechDetails: MechDetails) => setMechDetails(newMechDetails)

    return (
        <Stack position="relative" direction="row" spacing="1rem" sx={{ height: "100%" }}>
            {/* Left side */}
            {mechDetails ? (
                <MechPicker mechDetails={mechDetails} mechStatus={mechStatus} onSelect={(mid) => console.log(mid)} onUpdate={updateMechDetails} />
            ) : (
                <NiceBoxThing
                    border={{
                        color: theme.factionTheme.primary,
                        thickness: "thicc",
                    }}
                    background={{
                        color: [theme.factionTheme.background],
                    }}
                    sx={{
                        flexBasis: 310,
                        alignSelf: "start",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 500,
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight="fontWeightBold"
                        sx={{
                            animation: `${pulseEffect} 2s infinite`,
                        }}
                    >
                        LOADING MECH...
                    </Typography>
                </NiceBoxThing>
            )}

            {/* Right side */}
            {mechDetails ? (
                <MechLoadout drawerContainerRef={drawerContainerRef} mechDetails={mechDetails} mechStatus={mechStatus} onUpdate={updateMechDetails} />
            ) : (
                <ClipThing
                    clipSize="10px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".3rem",
                    }}
                    backgroundColor={theme.factionTheme.background}
                    sx={{ height: "100%", flex: 1 }}
                >
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                        <Typography
                            variant="h4"
                            fontWeight="fontWeightBold"
                            sx={{
                                animation: `${pulseEffect} 2s infinite`,
                            }}
                        >
                            LOADING LOADOUT...
                        </Typography>
                    </Stack>
                </ClipThing>
            )}
        </Stack>
    )
}
