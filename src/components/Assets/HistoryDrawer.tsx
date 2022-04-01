import { Box, Drawer, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { SvgGoldBars, SvgZaibatsuKillIcon } from "../../assets"
import { RIGHT_DRAWER_WIDTH } from "../../constants"
import { SocketState, useGameServerWebsocket } from "../../containers"
import { GameServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { Asset } from "../../types/assets"
import { PercentageDisplay } from "./PercentageDisplay"

export interface HistoryDrawerProps {
    open: boolean
    onClose: () => void
    asset: Asset
}

export const HistoryDrawer = ({ open, onClose, asset }: HistoryDrawerProps) => {
    const { state, send } = useGameServerWebsocket()
    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
        if (state !== SocketState.OPEN || !send) return
        ;(async () => {
            const resp = await send(GameServerKeys.BattleMechHistoryList, {
                mech_id: asset.id,
            })

            console.log(resp)
        })()
    }, [])

    useEffect(() => {
        const t = setTimeout(() => {
            setShouldRender(open)
        }, 50)

        return () => clearTimeout(t)
    }, [open])

    return (
        <Drawer
            open={shouldRender}
            onClose={onClose}
            anchor="right"
            sx={{
                width: `${RIGHT_DRAWER_WIDTH}rem`,
                flexShrink: 0,
                zIndex: 9999,
            }}
            PaperProps={{
                sx: {
                    width: `${RIGHT_DRAWER_WIDTH}rem`,
                    backgroundColor: colors.darkNavy,
                    padding: "1rem",
                },
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    marginBottom: "1rem",
                }}
            >
                {asset.data.mech.name || asset.data.mech.label}
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "1rem 0",
                }}
            >
                <Box
                    component="img"
                    src={asset.data.mech.image_url}
                    alt={`Image for ${asset.data.mech.name} || ${asset.data.mech.label}`}
                    sx={{
                        maxHeight: "180px",
                    }}
                />
                <Stack
                    spacing="1rem"
                    justifyContent="center"
                    sx={{
                        marginBottom: "1rem",
                    }}
                >
                    <PercentageDisplay displayValue="70%" percentage={70} label="Win Rate" />
                    <PercentageDisplay displayValue="50%" percentage={50} label="Survival Rate" color={colors.gold} />
                    <PercentageDisplay displayValue="80%" percentage={80} label="Kill Rate" color={colors.red} />
                </Stack>
            </Box>
            <Typography variant="h6">Recent Matches</Typography>
            <Stack
                spacing=".6rem"
                sx={{
                    overflowY: "auto",
                    overflowX: "hidden",
                    direction: "ltr",
                    scrollbarWidth: "none",
                    "::-webkit-scrollbar": {
                        width: ".4rem",
                    },
                    "::-webkit-scrollbar-track": {
                        background: "#FFFFFF15",
                        borderRadius: 3,
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: colors.assetsBanner,
                        borderRadius: 3,
                    },
                }}
            >
                <HistoryEntry
                    mapName="Desert City"
                    backgroundImage="https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/desert_city.jpg"
                    isWin={true}
                    mechSurvived={false}
                />
                <HistoryEntry
                    mapName="Neo Tokyo"
                    backgroundImage="https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/neo_tokyo.jpg"
                    isWin={false}
                    mechSurvived={false}
                />
                <HistoryEntry
                    mapName="Urban City"
                    backgroundImage="https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/urban_city.jpg"
                    isWin={false}
                    mechSurvived={false}
                />
                <HistoryEntry
                    mapName="Arctic Bay"
                    backgroundImage="https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/artic_bay.jpg"
                    isWin={true}
                    mechSurvived={true}
                />
                <HistoryEntry
                    mapName="Desert City"
                    backgroundImage="https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/desert_city.jpg"
                    isWin={true}
                    mechSurvived={false}
                />
                <HistoryEntry
                    mapName="Neo Tokyo"
                    backgroundImage="https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/neo_tokyo.jpg"
                    isWin={false}
                    mechSurvived={false}
                />
                <HistoryEntry
                    mapName="Urban City"
                    backgroundImage="https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/urban_city.jpg"
                    isWin={false}
                    mechSurvived={false}
                />
                <HistoryEntry
                    mapName="Arctic Bay"
                    backgroundImage="https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/artic_bay.jpg"
                    isWin={true}
                    mechSurvived={true}
                />
                <HistoryEntry
                    mapName="Desert City"
                    backgroundImage="https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/desert_city.jpg"
                    isWin={true}
                    mechSurvived={false}
                />
                <HistoryEntry
                    mapName="Neo Tokyo"
                    backgroundImage="https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/neo_tokyo.jpg"
                    isWin={false}
                    mechSurvived={false}
                />
                <HistoryEntry
                    mapName="Urban City"
                    backgroundImage="https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/urban_city.jpg"
                    isWin={false}
                    mechSurvived={false}
                />
                <HistoryEntry
                    mapName="Arctic Bay"
                    backgroundImage="https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/artic_bay.jpg"
                    isWin={true}
                    mechSurvived={true}
                />
            </Stack>
        </Drawer>
    )
}

interface HistoryEntryProps {
    mapName: string
    isWin: boolean
    mechSurvived: boolean
    backgroundImage?: string
}

const HistoryEntry = ({ mapName, isWin, mechSurvived, backgroundImage }: HistoryEntryProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "70px",
                padding: "0.8rem 1.04rem",
                background: `center center`,
                backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 20%, ${
                    isWin ? colors.green : colors.red
                }80), url(${backgroundImage})`,
                backgroundSize: "cover",
                // filter: "grayscale(1)",
            }}
        >
            <Box>
                <Typography>{mapName}</Typography>
                <Typography
                    variant="h5"
                    sx={{
                        fontFamily: ["Nostromo Regular Bold", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
                    }}
                >
                    {isWin ? "Victory" : "Defeat"}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        sx={{
                            marginRight: ".5rem",
                            textTransform: "uppercase",
                            color: mechSurvived ? colors.neonBlue : colors.grey,
                        }}
                    >
                        {mechSurvived ? "Mech Survived" : "Mech Destroyed"}
                    </Typography>
                    {mechSurvived && <SvgGoldBars size="1.5rem" />}
                </Box>
            </Box>
            <SvgZaibatsuKillIcon
                sx={{
                    alignSelf: "center",
                    marginLeft: "auto",
                }}
                size="4rem"
            />
        </Box>
    )
}
