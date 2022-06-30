import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { FancyButton } from "../.."
import { useTheme } from "../../../containers/theme"
import { getRarityDeets } from "../../../helpers"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { fonts } from "../../../theme/theme"
import { MechBasic, MechDetails } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"
import { MediaPreview } from "../../Common/MediaPreview/MediaPreview"
import { MechGeneralStatus } from "./Common/MechGeneralStatus"
import { MechLoadoutIcons } from "./Common/MechLoadoutIcons"

export const WarMachineHangarItem = ({ mech }: { mech: MechBasic }) => {
    const location = useLocation()
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [mechDetails, setMechDetails] = useState<MechDetails>()

    const rarityDeets = useMemo(() => getRarityDeets(mech.tier || mechDetails?.tier || ""), [mech, mechDetails])

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

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background
    const imageUrl = mechDetails?.avatar_url || mech.avatar_url

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                transition: "all .15s",
                ":hover": {
                    transform: "translateY(-.4rem)",
                },
            }}
        >
            <ClipThing
                clipSize="12px"
                border={{
                    borderColor: primaryColor,
                    borderThickness: ".2rem",
                }}
                opacity={0.9}
                backgroundColor={backgroundColor}
                sx={{ height: "100%" }}
            >
                <Stack spacing={"1.5rem"} justifyContent="center" sx={{ height: "100%", p: "1.5rem" }}>
                    <Box
                        sx={{
                            position: "relative",
                            height: "20rem",
                        }}
                    >
                        <MediaPreview imageUrl={imageUrl} objectFit="cover" />

                        <Box sx={{ position: "absolute", bottom: ".4rem", left: ".6rem", minWidth: "10rem", backgroundColor: `${backgroundColor}DF` }}>
                            <MechGeneralStatus mechID={mech.id} />
                        </Box>
                    </Box>

                    <Stack spacing=".2rem" sx={{ flex: 1, px: ".4rem", py: ".3rem" }}>
                        <Typography variant="body2" sx={{ color: rarityDeets.color, fontFamily: fonts.nostromoHeavy }}>
                            {rarityDeets.label}
                        </Typography>

                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{mech.label}</Typography>

                        <Typography variant="h6" sx={{}}>
                            {mech.name}
                        </Typography>

                        <Box sx={{ pt: ".4rem" }}>
                            <MechLoadoutIcons mechDetails={mechDetails} />
                        </Box>

                        <Stack alignItems="center" sx={{ mt: "auto !important", pt: ".8rem", alignSelf: "stretch" }}>
                            <FancyButton
                                to={`/mech/${mech.id}${location.hash}`}
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: primaryColor,
                                    opacity: 1,
                                    border: { isFancy: true, borderColor: primaryColor, borderThickness: "1.5px" },
                                    sx: { position: "relative", mt: "1rem", width: "100%" },
                                }}
                                sx={{ px: "1.6rem", py: ".6rem", color: secondaryColor }}
                            >
                                <Typography variant={"caption"} sx={{ fontFamily: fonts.nostromoBlack, color: secondaryColor }}>
                                    VIEW
                                </Typography>
                            </FancyButton>
                        </Stack>
                    </Stack>
                </Stack>
            </ClipThing>
        </Box>
    )
}
