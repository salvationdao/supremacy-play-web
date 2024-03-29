import { Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useUI } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { useGameServerSubscription, useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { pulseEffect } from "../../../../theme/keyframes"
import { MechDetails, MechStatus, MechStatusEnum } from "../../../../types"
import { NiceBoxThing } from "../../../Common/Nice/NiceBoxThing"
import { MechLoadout } from "./MechLoadout/MechLoadout"
import { MechPicker } from "./MechPicker/MechPicker"

interface WarMachineHangarDetailsProps {
    mechID: string
}

export const WarMachineHangarDetails = ({ mechID }: WarMachineHangarDetailsProps) => {
    return (
        <>
            <WarMachineHangarDetailsInner mechID={mechID} />
        </>
    )
}

interface WarMachineHangarDetailsInnerProps {
    mechID: string
}

export const WarMachineHangarDetailsInner = ({ mechID }: WarMachineHangarDetailsInnerProps) => {
    const { setRightDrawerActiveTabID } = useUI()
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

    useEffect(() => {
        setRightDrawerActiveTabID("")
    }, [setRightDrawerActiveTabID])

    return (
        <Stack position="relative" direction="row" spacing="1rem" sx={{ height: "100%" }}>
            {/* Left side */}
            {mechDetails ? (
                <MechPicker mechDetails={mechDetails} mechStatus={mechStatus} mechStaked={mechIsStaked} onUpdate={updateMechDetails} />
            ) : (
                <NiceBoxThing
                    border={{
                        color: theme.factionTheme.s700,
                        thickness: "very-lean",
                    }}
                    background={{
                        colors: [theme.factionTheme.u800],
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
                        fontWeight="bold"
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
                <MechLoadout mechDetails={mechDetails} mechStatus={mechStatus} mechStaked={mechIsStaked} onUpdate={updateMechDetails} />
            ) : (
                <>
                    <NiceBoxThing
                        border={{
                            color: theme.factionTheme.s700,
                            thickness: "very-lean",
                        }}
                        background={{
                            colors: [theme.factionTheme.u800],
                        }}
                        sx={{ height: "100%", flex: 1 }}
                    >
                        <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                            <Typography
                                variant="h4"
                                fontWeight="bold"
                                sx={{
                                    animation: `${pulseEffect} 2s infinite`,
                                }}
                            >
                                LOADING LOADOUT...
                            </Typography>
                        </Stack>
                    </NiceBoxThing>
                    <NiceBoxThing
                        border={{
                            color: theme.factionTheme.s700,
                            thickness: "very-lean",
                        }}
                        background={{
                            colors: [theme.factionTheme.u800],
                        }}
                        sx={{
                            height: "100%",
                            flexBasis: 450,
                        }}
                    ></NiceBoxThing>
                </>
            )}
        </Stack>
    )
}
