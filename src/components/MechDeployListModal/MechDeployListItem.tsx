import { Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { getRarityDeets } from "../../helpers"
import { useGameServerCommandsFaction } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { fonts } from "../../theme/theme"
import { MechBasic, MechDetails } from "../../types"
import { MechGeneralStatus } from "../Hangar/WarMachinesHangar/WarMachineHangarItem/MechGeneralStatus"
import { MechThumbnail } from "../Hangar/WarMachinesHangar/WarMachineHangarItem/MechThumbnail"

interface MechDeployListItemProps {
    mech: MechBasic
}

export const MechDeployListItem = ({ mech }: MechDeployListItemProps) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [mechDetails, setMechDetails] = useState<MechDetails>()
    const rarityDeets = useMemo(() => getRarityDeets(mech.tier || mechDetails?.tier || ""), [mech, mechDetails])

    // Get addition mech data
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
        <Stack
            direction="row"
            spacing="1.5rem"
            alignItems="flex-start"
            sx={{
                position: "relative",
                py: ".7rem",
                px: ".5rem",
            }}
            // onClick={onClick}
        >
            <Stack sx={{ height: "8rem" }}>
                <MechThumbnail mech={mech} mechDetails={mechDetails} smallSize />
            </Stack>

            <Stack alignItems="flex-start" sx={{ py: ".2rem" }}>
                <Typography
                    variant="caption"
                    sx={{
                        fontFamily: fonts.nostromoHeavy,
                        color: rarityDeets.color,
                    }}
                >
                    {rarityDeets.label}
                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
                    sx={{
                        fontFamily: fonts.nostromoBlack,
                        fontWeight: "fontWeightBold",
                        display: "-webkit-box",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {mech.name || mech.label}
                </Typography>

                <MechGeneralStatus mechID={mech.id} smallSize />
            </Stack>
        </Stack>
    )
}
