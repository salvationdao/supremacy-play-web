import { Box, Stack } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { ClipThing } from "../../.."
import { useHangarWarMachine } from "../../../../containers/hangar/hangarWarMachines"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
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
}

export const WarMachineHangarItem = ({ mech, index }: WarMachineHangarItemProps) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")
    const { selectedMechDetails, setSelectedMechDetails } = useHangarWarMachine()
    const [mechDetails, setMechDetails] = useState<MechDetails>()

    const isSelected = useMemo(() => selectedMechDetails?.id === mech.id, [mech.id, selectedMechDetails?.id])

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

    return (
        <Box sx={{ position: "relative", overflow: "visible", cursor: "pointer" }} onClick={() => setSelectedMechDetails(mechDetails)}>
            <MechTitle mech={mech} mechDetails={mechDetails} isSelected={isSelected} />

            <ClipThing
                clipSize="10px"
                border={{
                    isFancy: isSelected ? false : true,
                    borderColor: theme.factionTheme.primary,
                    borderThickness: isSelected ? ".4rem" : ".15rem",
                }}
                opacity={isSelected ? 1 : 0.7}
                backgroundColor={theme.factionTheme.background}
            >
                <Stack direction="row" alignItems="center" spacing="1.2rem" sx={{ height: "23rem", px: "1.8rem", pt: "2.4rem", pb: "1.4rem" }}>
                    <Stack spacing="1rem" sx={{ height: "100%" }}>
                        <MechThumbnail mech={mech} mechDetails={mechDetails} />
                        <MechGeneralStatus mech={mech} />
                    </Stack>

                    <Stack spacing="1.1rem" sx={{ flex: 1, height: "100%" }}>
                        <Stack direction="row" spacing="1rem" sx={{ flex: 1, height: 0 }}>
                            <MechLoadout mech={mech} mechDetails={mechDetails} />
                            <MechMiniStats mech={mech} mechDetails={mechDetails} />
                            <MechBarStats mech={mech} mechDetails={mechDetails} />
                        </Stack>

                        <MechButtons mech={mech} mechDetails={mechDetails} />
                    </Stack>
                </Stack>
            </ClipThing>
        </Box>
    )
}
