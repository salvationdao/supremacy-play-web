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
    const backgroundColor = theme.factionTheme.background
    const imageUrl = mechDetails?.chassis_skin?.avatar_url || mech.avatar_url
    const largeImageUrl = mechDetails?.chassis_skin?.large_image_url || mech.large_image_url

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
                        gridTemplateColumns: `8rem auto repeat(2, 20rem)`, // hard-coded to have 4 columns, adjust as required
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
                        <Typography
                            variant="body2"
                            sx={{
                                mb: ".2rem",
                                color: rarityDeets.color,
                                fontFamily: fonts.nostromoHeavy,
                                display: "-webkit-box",
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1, // change to max number of lines
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {rarityDeets.label}
                        </Typography>

                        <Typography
                            sx={{
                                fontFamily: fonts.nostromoBlack,
                                display: "-webkit-box",
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1, // change to max number of lines
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {mech.label}
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                display: "-webkit-box",
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1, // change to max number of lines
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {mech.name}
                        </Typography>
                    </Stack>

                    <General isGridView={isGridView} title="EQUIPPED">
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
}
