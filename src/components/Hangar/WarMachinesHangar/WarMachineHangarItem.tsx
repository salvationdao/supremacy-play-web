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
import { General } from "../../Marketplace/Common/MarketItem/General"
import { MechGeneralStatus } from "./Common/MechGeneralStatus"
import { MechLoadoutIcons } from "./Common/MechLoadoutIcons"

export const WarMachineHangarItem = ({ mech, isGridView }: { mech: MechBasic; isGridView?: boolean }) => {
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
    const largeImageUrl = mechDetails?.large_image_url || mech.large_image_url

    return (
        <Box sx={{ position: "relative", overflow: "visible", height: "100%" }}>
            <FancyButton
                clipThingsProps={{
                    clipSize: "7px",
                    clipSlantSize: "0px",
                    corners: {
                        topLeft: true,
                        topRight: true,
                        bottomLeft: true,
                        bottomRight: true,
                    },
                    backgroundColor: backgroundColor,
                    opacity: 0.9,
                    border: { isFancy: !isGridView, borderColor: primaryColor, borderThickness: ".25rem" },
                    sx: { position: "relative", height: "100%" },
                }}
                sx={{ color: primaryColor, textAlign: "start", height: "100%" }}
                to={`/mech/${mech.id}${location.hash}`}
            >
                <Box
                    sx={{
                        position: "relative",
                        height: "100%",
                        p: isGridView ? ".5rem .6rem" : ".1rem .3rem",
                        display: isGridView ? "block" : "grid",
                        gridTemplateRows: "7rem",
                        gridTemplateColumns: `8rem auto repeat(2, 20rem)`, // hard-coded to have 6 columns, adjust as required
                        gap: "1.4rem",
                        ...(isGridView
                            ? {
                                  "&>*:not(:last-child)": {
                                      mb: ".8rem",
                                  },
                              }
                            : {}),
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            height: isGridView ? "15rem" : "100%",
                            width: "100%",
                        }}
                    >
                        <MediaPreview imageUrl={imageUrl} objectFit={isGridView ? "cover" : "contain"} />
                    </Box>

                    <Stack>
                        <Typography variant="body2" sx={{ color: rarityDeets.color, fontFamily: fonts.nostromoHeavy }}>
                            {rarityDeets.label}
                        </Typography>

                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{mech.label}</Typography>

                        <Typography variant="h6" sx={{}}>
                            {mech.name}
                        </Typography>
                    </Stack>

                    <General isGridView={isGridView} title="LOADOUT">
                        <Box sx={{ pt: ".4rem" }}>
                            <MechLoadoutIcons mechDetails={mechDetails} />
                        </Box>
                    </General>

                    <General isGridView={isGridView} title="STATUS">
                        <MechGeneralStatus mechID={mech.id} hideBox />
                    </General>
                </Box>

                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: `url(${largeImageUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "top",
                        backgroundSize: "cover",
                        opacity: 0.06,
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
                        background: `linear-gradient(to top, #FFFFFF08, ${backgroundColor}90)`,
                        zIndex: -1,
                    }}
                />
            </FancyButton>
        </Box>
    )

    return (
        <ClipThing
            clipSize="12px"
            border={{
                borderColor: primaryColor,
                borderThickness: ".2rem",
            }}
            opacity={0.9}
            backgroundColor={backgroundColor}
            sx={{ height: "100%", width: "100%" }}
        >
            <Stack spacing={"1.5rem"} direction={isGridView ? "column" : "row"} justifyContent="center" sx={{ height: "100%", p: "1.5rem" }}>
                <Box
                    sx={{
                        position: "relative",
                        height: isGridView ? "20rem" : "9rem",
                    }}
                >
                    <MediaPreview imageUrl={imageUrl} objectFit={isGridView ? "cover" : "contain"} />

                    <Box
                        sx={
                            isGridView
                                ? {
                                      position: "absolute",
                                      bottom: ".4rem",
                                      left: ".6rem",
                                      minWidth: "10rem",
                                      backgroundColor: `${backgroundColor}DF`,
                                  }
                                : { mt: ".8rem" }
                        }
                    >
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
    )
}
