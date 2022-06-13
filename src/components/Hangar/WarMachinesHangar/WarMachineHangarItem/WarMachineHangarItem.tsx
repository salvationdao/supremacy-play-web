import { Box, Skeleton, Stack } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { ClipThing } from "../../.."
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { MechBasic, MechDetails } from "../../../../types"
import { MechBarStats } from "./MechBarStats"
import { MechButtons } from "./MechButtons"
import { MechGeneralStatus } from "./MechGeneralStatus"
import { MechLoadout } from "./MechLoadout"
import { MechMiniStats } from "./MechMiniStats"
import { MechThumbnail } from "./MechThumbnail"
import { MechTitle } from "./MechTitle"

interface WarMachineHangarItemProps {
    mech: MechBasic
    index: number
    isSelected: boolean
    setSelectedMechDetails: React.Dispatch<React.SetStateAction<MechDetails | undefined>>
    setDeployMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setLeaveMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setHistoryMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setRentalMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setSellMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const WarMachineHangarItem = ({
    mech,
    index,
    isSelected,
    setSelectedMechDetails,
    setDeployMechModalOpen,
    setLeaveMechModalOpen,
    setHistoryMechModalOpen,
    setRentalMechModalOpen,
    setSellMechModalOpen,
}: WarMachineHangarItemProps) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [mechDetails, setMechDetails] = useState<MechDetails>()
    const [mechQueuePosition, setMechQueuePosition] = useState<number>(-1)

    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<MechDetails>(GameServerKeys.GetMechDetails, {
                    mech_id: mech.id,
                })

                if (!resp) return
                setMechDetails(resp)
                if (index === 0) setSelectedMechDetails(resp)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [index, mech.id, send, setSelectedMechDetails])

    useGameServerSubscriptionFaction<number>(
        {
            URI: `/queue/${mech.id}`,
            key: GameServerKeys.SubMechQueuePosition,
        },
        (payload) => {
            if (typeof payload === "undefined") return
            setMechQueuePosition(payload)
        },
    )

    return useMemo(
        () => (
            <WarMachineHangarItemInner
                mech={mech}
                isSelected={isSelected}
                mechDetails={mechDetails}
                mechQueuePosition={mechQueuePosition}
                setSelectedMechDetails={setSelectedMechDetails}
                setDeployMechModalOpen={setDeployMechModalOpen}
                setLeaveMechModalOpen={setLeaveMechModalOpen}
                setHistoryMechModalOpen={setHistoryMechModalOpen}
                setRentalMechModalOpen={setRentalMechModalOpen}
                setSellMechModalOpen={setSellMechModalOpen}
            />
        ),
        [
            mech,
            isSelected,
            mechDetails,
            mechQueuePosition,
            setSelectedMechDetails,
            setDeployMechModalOpen,
            setLeaveMechModalOpen,
            setHistoryMechModalOpen,
            setRentalMechModalOpen,
            setSellMechModalOpen,
        ],
    )
}

const WarMachineHangarItemInner = ({
    mech,
    mechDetails,
    isSelected,
    setSelectedMechDetails,
    mechQueuePosition,
    setDeployMechModalOpen,
    setLeaveMechModalOpen,
    setHistoryMechModalOpen,
    setRentalMechModalOpen,
    setSellMechModalOpen,
}: {
    mechQueuePosition: number
    mech: MechBasic
    mechDetails?: MechDetails
    isSelected: boolean
    setSelectedMechDetails: React.Dispatch<React.SetStateAction<MechDetails | undefined>>
    setDeployMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setLeaveMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setHistoryMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setRentalMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setSellMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const theme = useTheme()

    const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined
    const imageUrl = skin?.large_image_url

    const loadout = useMemo(() => <MechLoadout mech={mech} mechDetails={mechDetails} />, [mech, mechDetails])

    return (
        <Box sx={{ position: "relative", overflow: "visible" }} onClick={() => setSelectedMechDetails(mechDetails)}>
            <MechTitle mech={mech} mechDetails={mechDetails} isSelected={isSelected} />

            <ClipThing
                clipSize="10px"
                border={{
                    isFancy: isSelected,
                    borderColor: theme.factionTheme.primary,
                    borderThickness: isSelected ? ".4rem" : ".2rem",
                }}
                corners={{
                    topRight: true,
                    bottomLeft: true,
                }}
                opacity={isSelected ? 1 : 0.7}
                backgroundColor={theme.factionTheme.background}
            >
                <Stack direction="row" alignItems="center" spacing="1.2rem" sx={{ height: "23rem", px: "1.8rem", pt: "2.4rem", pb: "1.4rem" }}>
                    <Stack spacing="1rem" sx={{ height: "100%" }}>
                        <MechThumbnail mech={mech} mechDetails={mechDetails} />
                        <MechGeneralStatus mechQueuePosition={mechQueuePosition} />
                    </Stack>

                    <Stack spacing="1.1rem" sx={{ flex: 1, height: "100%" }}>
                        <Stack direction="row" spacing="1rem" sx={{ flex: 1, height: 0 }}>
                            {loadout}
                            <MechMiniStats mech={mech} mechDetails={mechDetails} />
                            <MechBarStats mech={mech} mechDetails={mechDetails} />
                        </Stack>

                        {mechDetails ? (
                            <MechButtons
                                mechDetails={mechDetails}
                                mechQueuePosition={mechQueuePosition}
                                setSelectedMechDetails={setSelectedMechDetails}
                                setDeployMechModalOpen={setDeployMechModalOpen}
                                setLeaveMechModalOpen={setLeaveMechModalOpen}
                                setHistoryMechModalOpen={setHistoryMechModalOpen}
                                setRentalMechModalOpen={setRentalMechModalOpen}
                                setSellMechModalOpen={setSellMechModalOpen}
                            />
                        ) : (
                            <Box sx={{ height: "3rem" }} />
                        )}
                    </Stack>
                </Stack>

                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: `url(${imageUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "top",
                        backgroundSize: "cover",
                        opacity: 0.08,
                        zIndex: -2,
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: `linear-gradient(65deg, ${theme.factionTheme.background} 50%, #FFFFFF10)`,
                        zIndex: -1,
                    }}
                />
            </ClipThing>
        </Box>
    )
}

export const WarMachineHangarItemLoadingSkeleton = () => {
    const theme = useTheme()

    return (
        <Box sx={{ position: "relative", overflow: "visible" }}>
            <ClipThing
                clipSize="10px"
                border={{
                    isFancy: true,
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".2rem",
                }}
                corners={{
                    topRight: true,
                    bottomLeft: true,
                }}
                opacity={0.5}
                backgroundColor={theme.factionTheme.background}
            >
                <Stack direction="row" alignItems="center" spacing="1.2rem" sx={{ height: "22rem", px: "1.8rem", py: "1.6rem" }}>
                    <Stack spacing="1rem" sx={{ height: "100%" }}>
                        <Skeleton variant="rectangular" width="20rem" sx={{ flex: 1 }} />
                        <Skeleton variant="rectangular" width="100%" height="4rem" />
                    </Stack>

                    <Stack spacing="1rem" sx={{ flex: 1, height: "100%" }}>
                        <Stack direction="row" spacing="1.2rem" sx={{ flex: 1, height: 0 }}>
                            <Stack sx={{ height: "100%", flex: 1.2 }}>
                                {new Array(2).fill(0).map((_, index) => (
                                    <Stack key={index} direction="row" sx={{ flexWrap: "wrap", flexBasis: "50%" }}>
                                        {new Array(3).fill(0).map((_, index) => (
                                            <Box key={index} sx={{ flexBasis: "33.33%", p: ".4rem" }}>
                                                <Skeleton variant="rectangular" height="100%" />
                                            </Box>
                                        ))}
                                    </Stack>
                                ))}
                            </Stack>

                            <Stack spacing=".6rem">
                                {new Array(4).fill(0).map((_, index) => (
                                    <Skeleton key={index} variant="rectangular" width="6rem" sx={{ flex: 1 }} />
                                ))}
                            </Stack>

                            <Stack spacing="1rem" sx={{ flex: 1 }}>
                                {new Array(4).fill(0).map((_, index) => (
                                    <Skeleton key={index} variant="rectangular" height="1.8rem" />
                                ))}
                            </Stack>
                        </Stack>

                        <Stack direction="row" spacing="1rem">
                            {new Array(5).fill(0).map((_, index) => (
                                <Skeleton key={index} variant="rectangular" height="3.8rem" sx={{ flex: 1 }} />
                            ))}
                        </Stack>
                    </Stack>
                </Stack>
            </ClipThing>
        </Box>
    )
}