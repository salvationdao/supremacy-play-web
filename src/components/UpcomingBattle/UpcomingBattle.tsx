import { Box, CircularProgress, Stack, Typography, useMediaQuery } from "@mui/material"
import { useState } from "react"
import {
    BcBorder,
    BcBorderBottom,
    BcBottom,
    BcMask,
    RmBorder,
    RmBorderBottom,
    RmBottom,
    RmMask,
    ZhiBorder,
    ZhiBorderBottom,
    ZhiBottom,
    ZhiMask,
} from "../../assets"
import { useSupremacy, useUI } from "../../containers"
import { useGameServerSubscription } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { opacityEffect } from "../../theme/keyframes"
import { theme } from "../../theme/theme"
import { Faction, GameMap } from "../../types"
import { MechDetails } from "../../types/assets"

interface NextBattle {
    map: GameMap
    bc_id: string
    zhi_id: string
    rm_id: string
    bc_mech_ids: string[]
    zhi_mech_ids: string[]
    rm_mech_ids: string[]
}

export const UpcomingBattle = () => {
    const [nextBattle, setNextBattle] = useState<NextBattle | undefined>()
    const { rightDrawerActiveTabID } = useUI()
    const below1150 = useMediaQuery("(max-width:1150px)")
    const [loading, setLoading] = useState(true)

    // Subscribe on battle end information
    useGameServerSubscription<NextBattle>(
        {
            URI: `/public/arena/upcomming_battle`,
            key: GameServerKeys.NextBattleDetails,
        },
        (payload) => {
            if (!payload) {
                setLoading(false)
                return
            }
            setNextBattle(payload)
            setLoading(false)
        },
    )

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                backgroundImage: `url(${nextBattle?.map?.background_url})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                animation: `${opacityEffect} .1s ease-in`,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",

                    "@media (max-width:1550px)": {
                        justifyContent: "center",
                        alignItems: "center",
                    },
                }}
            >
                {loading && (
                    <Stack justifyContent="center" alignItems="center" sx={{ height: "6rem" }}>
                        <CircularProgress size="2rem" sx={{ mt: "2rem", color: theme.factionTheme.primary }} />
                    </Stack>
                )}
                <Box
                    sx={{
                        position: "relative",
                        display: "flex",
                        width: rightDrawerActiveTabID ? "89%" : "75%",
                        "@media (max-width:2900px)": {
                            width: "90%",
                        },
                        "@media (max-width:2700px)": {
                            width: rightDrawerActiveTabID ? "100%" : "96%",
                        },
                        "@media (max-width:2150px)": {
                            width: "100%",
                        },

                        height: "80%",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                    }}
                >
                    {below1150 ? (
                        <Box
                            sx={{
                                transform: "scale(.8)",
                                "@media (max-width:980px)": {
                                    transform: "scale(.9)",
                                },
                            }}
                        >
                            <Box marginBottom={"5rem"}>
                                <CardGroupMobile
                                    rightDrawerOpen={!!rightDrawerActiveTabID}
                                    mechIDs={nextBattle?.bc_mech_ids || []}
                                    factionID={nextBattle?.bc_id || ""}
                                />
                            </Box>
                            <Box marginBottom={"5rem"}>
                                <CardGroupMobile
                                    rightDrawerOpen={!!rightDrawerActiveTabID}
                                    mechIDs={nextBattle?.zhi_mech_ids || []}
                                    factionID={nextBattle?.zhi_id || ""}
                                />
                            </Box>
                            <Box>
                                <CardGroupMobile
                                    rightDrawerOpen={!!rightDrawerActiveTabID}
                                    mechIDs={nextBattle?.rm_mech_ids || []}
                                    factionID={nextBattle?.rm_id || ""}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <>
                            <Box
                                sx={{
                                    top: "25rem",
                                    position: "absolute",
                                    left: 0,

                                    "@media (max-width: 1250px)": {
                                        left: "-10rem",
                                    },
                                }}
                            >
                                <CardGroup
                                    rightDrawerOpen={!!rightDrawerActiveTabID}
                                    mechIDs={nextBattle?.bc_mech_ids || []}
                                    factionID={nextBattle?.bc_id || ""}
                                />
                            </Box>
                            <Box
                                sx={{
                                    top: "25rem",
                                    position: "absolute",
                                    right: 0,

                                    "@media (max-width: 1250px)": {
                                        right: "-10rem",
                                    },
                                }}
                            >
                                <CardGroup
                                    rightDrawerOpen={!!rightDrawerActiveTabID}
                                    mechIDs={nextBattle?.zhi_mech_ids || []}
                                    factionID={nextBattle?.zhi_id || ""}
                                />
                            </Box>
                            <Box sx={{ position: "absolute", top: "4rem" }}>
                                <CardGroup
                                    rightDrawerOpen={!!rightDrawerActiveTabID}
                                    mechIDs={nextBattle?.rm_mech_ids || []}
                                    factionID={nextBattle?.rm_id || ""}
                                />
                            </Box>
                        </>
                    )}

                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 0,

                            "@media (max-width:1550px)": {
                                bottom: "15%",
                            },
                            "@media (max-width:1150px)": {
                                position: "static",
                                mt: "0",
                            },
                        }}
                    >
                        <Typography variant="h4" textAlign={"center"}>
                            NEXT BATTLE
                        </Typography>

                        <img
                            style={{
                                height: below1150 ? "7rem" : "10rem",
                            }}
                            src={nextBattle?.map?.logo_url}
                            alt=""
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

const CardGroup = ({ rightDrawerOpen, factionID, mechIDs }: { rightDrawerOpen: boolean; factionID: string; mechIDs: string[] }) => {
    const { getFaction } = useSupremacy()
    const faction = getFaction(factionID)

    return (
        <Box
            position="relative"
            height="70rem"
            margin="1rem"
            sx={{
                width: "75rem",

                "@media (max-width:2550px)": {
                    transform: rightDrawerOpen ? "scale(.85)" : "scale(1)",
                },

                "@media (max-width:2450px)": {
                    transform: rightDrawerOpen ? "scale(.75)" : "scale(.85)",
                },

                "@media (max-width:2250px)": {
                    transform: rightDrawerOpen ? "scale(.65)" : "scale(.8)",
                },
                "@media (max-width:1850px)": {
                    transform: rightDrawerOpen ? "scale(.60)" : "scale(.8)",
                },
                "@media (max-width:1750px)": {
                    transform: rightDrawerOpen ? "scale(.60)" : "scale(.7)",
                },
                "@media (max-width:1450px)": {
                    transform: rightDrawerOpen ? "scale(.5)" : "scale(.6)",
                },
            }}
        >
            <Box sx={{ position: "absolute", top: 0, left: "33.5%", margin: "1rem" }}>
                <FactionLogoCard faction={faction} />
            </Box>

            <Box sx={{ position: "absolute", top: "20%", left: 0, margin: "1rem" }}>
                <MechCard mechID={mechIDs[0] || ""} faction={faction} />
            </Box>

            <Box sx={{ position: "absolute", top: "20%", right: 0, margin: "1rem" }}>
                <MechCard mechID={mechIDs[1] || ""} faction={faction} />
            </Box>

            <Box sx={{ position: "absolute", bottom: "20%", left: "33.5%", margin: "1rem" }}>
                <MechCard mechID={mechIDs[2] || ""} faction={faction} />
            </Box>
        </Box>
    )
}

const CardGroupMobile = ({ factionID, mechIDs }: { rightDrawerOpen: boolean; factionID: string; mechIDs: string[] }) => {
    const { getFaction } = useSupremacy()
    const faction = getFaction(factionID)
    return (
        <Box sx={{ display: "flex", width: "100%" }}>
            <Box sx={{ margin: "2rem" }}>
                <MechCard mechID={mechIDs[0] || ""} faction={faction} />
            </Box>
            <Box sx={{ margin: "2rem" }}>
                <MechCard mechID={mechIDs[1] || ""} faction={faction} />
            </Box>
            <Box sx={{ margin: "2rem" }}>
                <MechCard mechID={mechIDs[2] || ""} faction={faction} />
            </Box>
        </Box>
    )
}

const getCardInfo = (factionLabel: string) => {
    if (factionLabel === "Boston Cybernetics") {
        return {
            border: BcBorder,
            borderBottom: BcBorderBottom,
            bottom: BcBottom,
            mask: BcMask,
        }
    }

    if (factionLabel === "Zaibatsu Heavy Industries") {
        return {
            border: ZhiBorder,
            borderBottom: ZhiBorderBottom,
            bottom: ZhiBottom,
            mask: ZhiMask,
        }
    }

    if (factionLabel === "Red Mountain Offworld Mining Corporation") {
        return {
            border: RmBorder,
            borderBottom: RmBorderBottom,
            bottom: RmBottom,
            mask: RmMask,
        }
    }

    return {
        border: RmBorder,
        borderBottom: RmBorderBottom,
        bottom: RmBottom,
        mask: RmMask,
    }
}
const MechCard = ({ mechID, faction }: { mechID: string; faction: Faction }) => {
    const cardInfo = getCardInfo(faction.label)
    const border = cardInfo?.border || ""
    const borderBottom = cardInfo?.borderBottom || ""
    const bottom = cardInfo?.bottom || ""
    const emptySlot = cardInfo?.mask || ""

    const h = "27rem"
    const w = "23rem"

    const [mechDetails, setMechDetails] = useState<MechDetails>()

    useGameServerSubscription<MechDetails>(
        {
            URI: `/public/mech/${mechID}/details`,
            key: GameServerKeys.PlayerAssetMechDetailPublic,
            ready: !!mechID,
        },
        (payload) => {
            if (!payload) return
            setMechDetails(payload)
        },
    )
    const avatarUrl = mechDetails?.chassis_skin?.avatar_url || mechDetails?.avatar_url

    return (
        <Box position="relative" height={h} width={w}>
            <img style={{ position: "absolute", top: "-14%", zIndex: 4 }} width={"100%"} src={border} alt="" />
            {mechID && avatarUrl ? (
                <div
                    style={{
                        position: "absolute",
                        top: "-10%",
                        left: "2%",
                        backgroundImage: `url(${avatarUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                        height: "82%",
                        width: "96%",
                        zIndex: 3,
                        clipPath: "polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)",
                    }}
                />
            ) : (
                <div
                    style={{
                        position: "absolute",
                        top: "-10%",
                        left: "2%",
                        backgroundImage: `url(${emptySlot})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                        height: "82%",
                        width: "96%",
                        zIndex: 3,
                        clipPath: "polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)",
                    }}
                ></div>
            )}

            <img style={{ bottom: 0, zIndex: 3, left: "2%", position: "absolute" }} width={"96.5%"} src={borderBottom} alt="" />
            <img style={{ bottom: 0, zIndex: 2, left: "2%", position: "absolute" }} width={"96.5%"} src={bottom} alt="" />
            <Typography
                sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    ml: "auto",
                    mr: "auto",
                    minWidth: "100px",
                    textAlign: "center",

                    bottom: "2rem",
                    zIndex: 3,
                    opacity: !mechID ? 0.5 : 1,
                }}
                variant="h5"
            >
                {mechID ? mechDetails?.name || mechDetails?.label : "Waiting"}
            </Typography>
        </Box>
    )
}

const FactionLogoCard = ({ faction }: { faction: Faction }) => {
    const border = getCardInfo(faction.label)?.border || ""
    const h = "27rem"
    const w = "23rem"
    const avatarUrl = faction.logo_url

    return (
        <Box position="relative" height={h} width={w}>
            <img style={{ position: "absolute", top: "-14%", zIndex: 4 }} width={"100%"} src={border} alt="" />

            <div
                style={{
                    position: "absolute",
                    top: "-10%",
                    left: "2%",
                    backgroundColor: faction.primary_color,
                    filter: "brightness(28%)",
                    height: "82%",
                    width: "96%",
                    zIndex: 2,
                    clipPath: "polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    top: "-10%",
                    left: "10%",
                    backgroundImage: `url(${avatarUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                    height: "80%",
                    width: "80%",
                    zIndex: 3,
                }}
            />
        </Box>
    )
}
