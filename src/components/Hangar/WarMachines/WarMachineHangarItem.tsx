import { Box, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { ClipThing } from "../.."
import { useTheme } from "../../../containers/theme"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { MechBasic, MechDetails } from "../../../types"
import { MechBarStats } from "./Common/MechBarStats"
import { MechButtons } from "./Common/MechButtons"
import { MechLoadout } from "./Common/MechLoadout"
import { MechMiniStats } from "./Common/MechMiniStats"
import { MechThumbnail } from "./Common/MechThumbnail"
import { MechTitle } from "./Common/MechTitle"

interface WarMachineHangarItemProps {
    mech: MechBasic
}

export const WarMachineHangarItem = ({ mech }: WarMachineHangarItemProps) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [mechDetails, setMechDetails] = useState<MechDetails>()

    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<MechDetails>(GameServerKeys.GetMechDetails, {
                    mech_id: mech.id,
                })

                if (!resp) return
                setMechDetails(resp)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [mech.id, send])

    return (
        <Box sx={{ position: "relative", overflow: "visible" }}>
            <MechTitle mech={mech} mechDetails={mechDetails} />

            <ClipThing
                clipSize="10px"
                border={{
                    isFancy: true,
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".15rem",
                }}
                opacity={0.7}
                backgroundColor={theme.factionTheme.background}
            >
                <Stack direction="row" alignItems="center" spacing="1.2rem" sx={{ height: "23rem", px: "1.8rem", pt: "2.4rem", pb: "1.4rem" }}>
                    <Stack spacing="1.1rem" sx={{ flex: 1, height: "100%" }}>
                        <Stack direction="row" spacing="1rem" sx={{ flex: 1 }}>
                            <MechThumbnail mech={mech} mechDetails={mechDetails} />
                            <MechLoadout mech={mech} mechDetails={mechDetails} />
                        </Stack>

                        <MechButtons mech={mech} mechDetails={mechDetails} />
                    </Stack>

                    <MechMiniStats mech={mech} mechDetails={mechDetails} />

                    <MechBarStats mech={mech} mechDetails={mechDetails} />
                </Stack>
            </ClipThing>
        </Box>
    )
}
