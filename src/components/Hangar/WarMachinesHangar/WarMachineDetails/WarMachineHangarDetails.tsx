import { Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { ClipThing } from "../../.."
import { BATTLE_ARENA_OPEN } from "../../../../constants"
import { useTheme } from "../../../../containers/theme"
import { useGameServerSubscription, useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { pulseEffect } from "../../../../theme/keyframes"
import { MechDetails, MechStatus, MechStatusEnum } from "../../../../types"
import { BorderThickness, NiceBoxThing } from "../../../Common/Nice/NiceBoxThing"
import { MechLoadout } from "./MechLoadout/MechLoadout"
import { MechPicker } from "./MechPicker/MechPicker"
import { DeployModal } from "./Modals/DeployModal"
import { RepairModal } from "./Modals/RepairModal/RepairModal"
import { StakeModal } from "./Modals/StakeModal"

interface WarMachineHangarDetailsProps {
    drawerContainerRef: React.MutableRefObject<HTMLElement | undefined>
    mechID: string
}

export const WarMachineHangarDetails = ({ drawerContainerRef, mechID }: WarMachineHangarDetailsProps) => {
    const [selectedMechDetails, setSelectedMechDetails] = useState<MechDetails>()
    const [deployMechModalOpen, setDeployMechModalOpen] = useState<boolean>(false)
    const [stakeMechModalOpen, setStakeMechModalOpen] = useState<boolean>(false)
    const [repairMechModalOpen, setRepairMechModalOpen] = useState<boolean>(false)

    return (
        <>
            <WarMachineHangarDetailsInner
                drawerContainerRef={drawerContainerRef}
                mechID={mechID}
                setSelectedMechDetails={setSelectedMechDetails}
                setDeployMechModalOpen={setDeployMechModalOpen}
                setStakeMechModalOpen={setStakeMechModalOpen}
                setRepairMechModalOpen={setRepairMechModalOpen}
            />

            {BATTLE_ARENA_OPEN && selectedMechDetails && deployMechModalOpen && (
                <DeployModal
                    selectedMechDetails={selectedMechDetails}
                    deployMechModalOpen={deployMechModalOpen}
                    setDeployMechModalOpen={setDeployMechModalOpen}
                />
            )}

            {selectedMechDetails && stakeMechModalOpen && (
                <StakeModal selectedMechDetails={selectedMechDetails} rentalMechModalOpen={stakeMechModalOpen} setRentalMechModalOpen={setStakeMechModalOpen} />
            )}

            {selectedMechDetails && repairMechModalOpen && (
                <RepairModal
                    selectedMechDetails={selectedMechDetails}
                    repairMechModalOpen={repairMechModalOpen}
                    setRepairMechModalOpen={setRepairMechModalOpen}
                />
            )}
        </>
    )
}

interface WarMachineHangarDetailsInnerProps {
    drawerContainerRef: React.MutableRefObject<HTMLElement | undefined>
    mechID: string
    setSelectedMechDetails: React.Dispatch<React.SetStateAction<MechDetails | undefined>>
    setDeployMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setStakeMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setRepairMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const WarMachineHangarDetailsInner = ({
    drawerContainerRef,
    mechID,
    setSelectedMechDetails,
    setDeployMechModalOpen,
    setStakeMechModalOpen,
    setRepairMechModalOpen,
}: WarMachineHangarDetailsInnerProps) => {
    const theme = useTheme()
    const [mechDetails, setMechDetails] = useState<MechDetails>()
    const [inheritWeaponSkins, setInheritWeaponSkins] = useState(false)

    useEffect(() => {
        if (!mechDetails) return
        setInheritWeaponSkins(mechDetails.inherit_all_weapon_skins)
    }, [mechDetails])

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
                <MechPicker
                    mechDetails={mechDetails}
                    mechStatus={mechStatus}
                    onSelect={(mid) => console.log(mid)}
                    onUpdate={(newMechDetails) => setMechDetails(newMechDetails)}
                    onUpdateWeaponSkinInherit={(newInheritSkins) => setInheritWeaponSkins(newInheritSkins)}
                />
            ) : (
                <NiceBoxThing
                    border={{
                        color: theme.factionTheme.primary,
                        thickness: BorderThickness.Thicc,
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
                <MechLoadout
                    drawerContainerRef={drawerContainerRef}
                    mechDetails={mechDetails}
                    mechStatus={mechStatus}
                    inheritWeaponSkins={inheritWeaponSkins}
                    onUpdate={updateMechDetails}
                />
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
