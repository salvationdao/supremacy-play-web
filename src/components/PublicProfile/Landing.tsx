import { Box, Typography, useMediaQuery } from "@mui/material"

// rm
import RmBorder from "../../assets/landing/rm/RmBorder.svg"
import RmBottom from "../../assets/landing/rm/RmBottom.svg"
import RmBorderBottom from "../../assets/landing/rm/RmBorderBottom.svg"

// zhi
import ZhiBorder from "../../assets/landing/zhi/ZHIBorder.svg"
import ZhiBottom from "../../assets/landing/zhi/ZHIBottom.svg"
import ZhiBorderBottom from "../../assets/landing/zhi/ZHIBorderBottom.svg"

// bc
import BcBorder from "../../assets/landing/bc/BCBorder.svg"
import BcBottom from "../../assets/landing/bc/BCBottom.svg"
import BcBorderBottom from "../../assets/landing/bc/BCBorderBottom.svg"
import { useGameServerCommands, useGameServerSubscription } from "../../hooks/useGameServer"
import { useCallback, useEffect, useState } from "react"
import { GameServerKeys } from "../../keys"
import { MechDetails } from "../../types/assets"
import { useUI } from "../../containers"
import { Scale } from "@mui/icons-material"

interface BattleMap {
    name: string
    logo_url: string
    background_url: string
}
interface NextBattle {
    map: BattleMap
    bc_mech_ids: string[]
    zhi_mech_ids: string[]
    rm_mech_ids: string[]
}

export const Landing = () => {
    const { send } = useGameServerCommands("/public/commander")
    const [nextBattle, setNextBattle] = useState<NextBattle | undefined>()
    const { rightDrawerActiveTabID } = useUI()
    const showMobile = useMediaQuery("(max-width:1550px)")

    // get next battle details
    const fetchNextBattle = useCallback(async () => {
        try {
            // setHistoryLoading(true)
            const resp = await send<NextBattle>(GameServerKeys.NextBattleDetails)
            console.log("this is next battle restp", resp)

            if (resp) {
                setNextBattle(resp)
            }
        } catch (e) {
            // if (typeof e === "string") {
            //     setHistoryError(e)
            // } else if (e instanceof Error) {
            //     setHistoryError(e.message)
            // }
        } finally {
            // setHistoryLoading(false)
        }
    }, [send])

    useEffect(() => {
        fetchNextBattle()
    }, [send, fetchNextBattle])
    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",

                backgroundImage: `url(${nextBattle?.map?.background_url})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
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
                <Box
                    sx={{
                        border: "2px solid blue",
                        position: "relative",
                        display: "flex",
                        width: rightDrawerActiveTabID ? "100%" : "75%",
                        "@media (max-width:2900px)": {
                            width: rightDrawerActiveTabID ? "100%" : "90%",
                        },
                        "@media (max-width:2400px)": {
                            width: rightDrawerActiveTabID ? "100%" : "96%",
                        },
                        "@media (max-width:2150px)": {
                            width: "100%",
                        },

                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                    }}
                >
                    {showMobile ? (
                        <Box
                            sx={{
                                "@media (max-width:1550px)": {
                                    transform: "scale(.8)",
                                },
                            }}
                        >
                            <Box marginBottom={"5rem"}>
                                <BoxThingMobile rightDrawerOpen={!!rightDrawerActiveTabID} mechIDs={nextBattle?.bc_mech_ids || []} faction="bc" />
                            </Box>
                            <Box marginBottom={"5rem"}>
                                <BoxThingMobile rightDrawerOpen={!!rightDrawerActiveTabID} mechIDs={nextBattle?.zhi_mech_ids || []} faction="zhi" />
                            </Box>
                            <Box marginBottom={"5rem"}>
                                <BoxThingMobile rightDrawerOpen={!!rightDrawerActiveTabID} mechIDs={nextBattle?.rm_mech_ids || []} faction="rm" />
                            </Box>
                        </Box>
                    ) : (
                        <>
                            <Box sx={{ top: "25rem", position: "absolute", left: 0 }}>
                                <BoxThing rightDrawerOpen={!!rightDrawerActiveTabID} mechIDs={nextBattle?.bc_mech_ids || []} faction="bc" />
                            </Box>
                            <Box sx={{ top: "25rem", position: "absolute", right: 0 }}>
                                <BoxThing rightDrawerOpen={!!rightDrawerActiveTabID} mechIDs={nextBattle?.zhi_mech_ids || []} faction="zhi" />
                            </Box>
                            <Box sx={{ position: "absolute", top: "4rem" }}>
                                <BoxThing rightDrawerOpen={!!rightDrawerActiveTabID} mechIDs={nextBattle?.rm_mech_ids || []} faction="rm" />
                            </Box>
                        </>
                    )}

                    <Box
                        sx={{
                            position: "absolute",
                            bottom: "25%",
                        }}
                    >
                        <Typography variant="h4" textAlign={"center"}>
                            NEXT BATTLE
                        </Typography>
                        <img height="110rem" src={nextBattle?.map?.logo_url} alt="" />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

const BoxThing = ({ rightDrawerOpen, faction, mechIDs }: { rightDrawerOpen: boolean; faction: string; mechIDs: string[] }) => {
    return (
        <Box
            position="relative"
            width="75rem"
            height="70rem"
            margin="1rem"
            sx={{
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
            }}
        >
            <Box sx={{ position: "absolute", top: 0, left: "34%", margin: "1rem" }}>
                <Card mechID={""} faction={faction} />
            </Box>

            <Box sx={{ position: "absolute", top: "35%", left: 0, margin: "1rem" }}>
                <Card mechID={mechIDs[0] || ""} faction={faction} />
            </Box>

            <Box sx={{ position: "absolute", top: "35%", right: 0, margin: "1rem" }}>
                <Card mechID={mechIDs[1] || ""} faction={faction} />
            </Box>

            <Box sx={{ position: "absolute", bottom: "10%", left: "34%", margin: "1rem" }}>
                <Card mechID={mechIDs[2] || ""} faction={faction} />
            </Box>
        </Box>
    )
}

const BoxThingMobile = ({ rightDrawerOpen, faction, mechIDs }: { rightDrawerOpen: boolean; faction: string; mechIDs: string[] }) => {
    return (
        <Box sx={{ display: "flex", width: "100%" }}>
            <Card mechID={mechIDs[0] || ""} faction={faction} />
            <Card mechID={mechIDs[1] || ""} faction={faction} />
            <Card mechID={mechIDs[2] || ""} faction={faction} />
        </Box>
    )
}

const getCardInfo = (faction: string) => {
    if (faction === "bc") {
        return {
            border: BcBorder,
            borderBottom: BcBorderBottom,
            bottom: BcBottom,
        }
    }

    if (faction === "zhi") {
        return {
            border: ZhiBorder,
            borderBottom: ZhiBorderBottom,
            bottom: ZhiBottom,
        }
    }

    if (faction === "rm") {
        return {
            border: RmBorder,
            borderBottom: RmBorderBottom,
            bottom: RmBottom,
        }
    }

    return {
        border: RmBorder,
        borderBottom: RmBorderBottom,
        bottom: RmBottom,
    }
}
const Card = ({ mechID, faction }: { mechID: string; faction: string }) => {
    const border = getCardInfo(faction)?.border || ""
    const borderBottom = getCardInfo(faction)?.borderBottom || ""
    const bottom = getCardInfo(faction)?.bottom || ""
    //
    const h = "27rem"
    const w = "23rem"

    const [mechDetails, setMechDetails] = useState<MechDetails>()

    useGameServerSubscription<MechDetails>(
        {
            URI: `/public/mech/${mechID}/details`,
            key: GameServerKeys.PlayerAssetMechDetailPublic,
        },
        (payload) => {
            if (!payload) return
            setMechDetails(payload)
        },
    )
    const avatarUrl = mechDetails?.chassis_skin?.avatar_url || mechDetails?.avatar_url

    return (
        <Box
            position="relative"
            height={h}
            width={w}
            style={
                {
                    // margin: "2rem"
                }
            }
        >
            <img style={{ position: "absolute", top: "-14%", zIndex: 4 }} width={"100%"} src={border} alt="" />
            {avatarUrl ? (
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
                        background: "black",
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
                    opacity: !mechDetails?.name && !mechDetails?.label ? 0.5 : 1,
                    // left: "20%",
                }}
                variant="h5"
            >
                {mechDetails?.name || mechDetails?.label || "Waiting"}
            </Typography>
        </Box>
    )
}

const CardSVG = ({ width, height }: { width: string; height: string }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 150.631 161.37">
            <path
                id="Path_101109"
                data-name="Path 101109"
                d="M136.561,162.367l-21.9-.382-3.55-3.675-36.3-.634-36.3.634-3.55,3.675-21.9.382L2.237,151.911H2.215V112.48L0,110.266V48.359l2.215-2.215V18.7L14.2,6.716h14.42l-.058-.058L30.013,5.2H63.737l3.2-3.2H82.69l3.2,3.2h33.724l1.456,1.456-.057.057h14.332l12.066,12.066v27.36l2.219,2.22v61.907l-2.219,2.219v39.425h-.025l-10.825,10.455ZM4,19.286V46.131l2.227,2.228v61.907l-2.228,2.228v26.735c2.561,2.525,8.754,8.642,10.958,10.9H134.444c2.235-2.292,8.569-8.547,11.187-11.129V112.49l-2.223-2.222V48.361l2.223-2.223V19.515c-2.558-2.523-8.761-8.649-11.081-11.019H121.063l-1.448,1.448H85.892l-3.2,3.2H66.938l-3.2-3.2H30.013L28.565,8.5H14.843C12.557,10.835,6.5,16.82,4,19.286Z"
                transform="translate(0.5 -1.5)"
                fill="#4da1d9"
                stroke="rgba(0,0,0,0)"
                strokeWidth="1"
            />
        </svg>
    )
}

// import { Box, Typography } from "@mui/material"

// // rm
// import RmBorder from "../../assets/landing/rm/RmBorder.svg"
// import RmBottom from "../../assets/landing/rm/RmBottom.svg"
// import RmBorderBottom from "../../assets/landing/rm/RmBorderBottom.svg"

// // zhi
// import ZhiBorder from "../../assets/landing/zhi/ZHIBorder.svg"
// import ZhiBottom from "../../assets/landing/zhi/ZHIBottom.svg"
// import ZhiBorderBottom from "../../assets/landing/zhi/ZHIBorderBottom.svg"

// // bc
// import BcBorder from "../../assets/landing/bc/BCBorder.svg"
// import BcBottom from "../../assets/landing/bc/BCBottom.svg"
// import BcBorderBottom from "../../assets/landing/bc/BCBorderBottom.svg"
// import { useGameServerCommands, useGameServerSubscription } from "../../hooks/useGameServer"
// import { useCallback, useEffect, useState } from "react"
// import { GameServerKeys } from "../../keys"
// import { MechDetails } from "../../types/assets"
// import { useDimension } from "../../containers"

// interface BattleMap {
//     name: string
//     logo_url: string
//     background_url: string
// }
// interface NextBattle {
//     map: BattleMap
//     bc_mech_ids: string[]
//     zhi_mech_ids: string[]
//     rm_mech_ids: string[]
// }

// export const Landing = () => {
//     const { send } = useGameServerCommands("/public/commander")
//     const [nextBattle, setNextBattle] = useState<NextBattle | undefined>()

//     // get next battle details
//     const fetchNextBattle = useCallback(async () => {
//         try {
//             // setHistoryLoading(true)
//             const resp = await send<NextBattle>(GameServerKeys.NextBattleDetails)
//             console.log("this is next battle restp", resp)

//             if (resp) {
//                 setNextBattle(resp)
//             }
//         } catch (e) {
//             // if (typeof e === "string") {
//             //     setHistoryError(e)
//             // } else if (e instanceof Error) {
//             //     setHistoryError(e.message)
//             // }
//         } finally {
//             // setHistoryLoading(false)
//         }
//     }, [send])

//     useEffect(() => {
//         fetchNextBattle()
//     }, [send, fetchNextBattle])
//     return (
//         <Box
//             sx={{
//                 height: "100%",
//                 width: "100%",

//                 backgroundImage: `url(${nextBattle?.map?.background_url})`,
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "center",
//                 backgroundSize: "cover",
//             }}
//         >
//             <Box sx={{ display: "flex", width: "100%", height: "100%", justifyContent: "center" }}>
//                 <Box
//                     sx={{
//                         position: "relative",
//                         display: "flex",
//                         width: "90%",
//                         height: "80%",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexDirection: "column",
//                     }}
//                 >
//                     {/* left */}
//                     <Box sx={{ width: "32%", height: "65%", top: "25rem", position: "absolute", left: 0 }}>
//                         <BoxThing mechIDs={nextBattle?.bc_mech_ids || []} faction="bc" />
//                     </Box>

//                     {/* right */}
//                     <Box sx={{ width: "32%", height: "65%", top: "25rem", position: "absolute", right: 0 }}>
//                         <BoxThing mechIDs={nextBattle?.zhi_mech_ids || []} faction="zhi" />
//                     </Box>

//                     {/* center */}
//                     <Box sx={{ width: "32%", height: "65%", position: "absolute", top: "4rem" }}>
//                         <BoxThing mechIDs={nextBattle?.rm_mech_ids || []} faction="rm" />
//                     </Box>

//                     <Box sx={{ position: "absolute", bottom: 0 }}>
//                         <Typography variant="h4" textAlign={"center"}>
//                             NEXT BATTLE
//                         </Typography>
//                         <img height="150rem" src={nextBattle?.map?.logo_url} alt="" />
//                     </Box>
//                 </Box>
//             </Box>
//         </Box>
//     )
// }

// const BoxThing = ({ faction, mechIDs }: { faction: string; mechIDs: string[] }) => {
//     return (
//         <Box position="relative" width="100%" height="100%" margin="1rem">
//             <Box sx={{ height: "40%", width: "50%", position: "absolute", top: "10%", left: "25%", margin: "0" }}>
//                 <Card mechID={""} faction={faction} />
//             </Box>

//             <Box sx={{ height: "40%", width: "50%", position: "absolute", top: "35%", left: "-10%", margin: "0" }}>
//                 <Card mechID={mechIDs[0] || ""} faction={faction} />
//             </Box>

//             <Box sx={{ height: "40%", width: "50%", position: "absolute", top: "35%", right: "-10%", margin: "0" }}>
//                 <Card mechID={mechIDs[1] || ""} faction={faction} />
//             </Box>

//             <Box sx={{ height: "40%", width: "50%", position: "absolute", bottom: 0, left: "25%", margin: "0" }}>
//                 <Card mechID={mechIDs[2] || ""} faction={faction} />
//             </Box>
//         </Box>
//     )
// }

// const getCardInfo = (faction: string) => {
//     if (faction === "bc") {
//         return {
//             border: BcBorder,
//             borderBottom: BcBorderBottom,
//             bottom: BcBottom,
//         }
//     }

//     if (faction === "zhi") {
//         return {
//             border: ZhiBorder,
//             borderBottom: ZhiBorderBottom,
//             bottom: ZhiBottom,
//         }
//     }

//     if (faction === "rm") {
//         return {
//             border: RmBorder,
//             borderBottom: RmBorderBottom,
//             bottom: RmBottom,
//         }
//     }

//     return {
//         border: RmBorder,
//         borderBottom: RmBorderBottom,
//         bottom: RmBottom,
//     }
// }
// const Card = ({ mechID, faction }: { mechID: string; faction: string }) => {
//     const border = getCardInfo(faction)?.border || ""
//     const borderBottom = getCardInfo(faction)?.borderBottom || ""
//     const bottom = getCardInfo(faction)?.bottom || ""
//     //
//     const h = "80%"
//     const w = "80%"

//     const [mechDetails, setMechDetails] = useState<MechDetails>()

//     useGameServerSubscription<MechDetails>(
//         {
//             URI: `/public/mech/${mechID}/details`,
//             key: GameServerKeys.PlayerAssetMechDetailPublic,
//         },
//         (payload) => {
//             if (!payload) return
//             setMechDetails(payload)
//         },
//     )
//     const avatarUrl = mechDetails?.chassis_skin?.avatar_url || mechDetails?.avatar_url

//     return (
//         // <CardSVG height={`${h}`} width={`${w}`} />
//         <Box position="relative" height={h} width={w}>
//             <img style={{ position: "absolute", top: "-35px", zIndex: 4 }} width={"100%"} src={border} alt="" />
//             {avatarUrl ? (
//                 <div
//                     style={{
//                         position: "absolute",
//                         top: "-26px",
//                         left: "4px",
//                         backgroundImage: `url(${avatarUrl})`,
//                         backgroundRepeat: "no-repeat",
//                         backgroundPosition: "center",
//                         backgroundSize: "contain",
//                         height: "100%",
//                         width: "100%",
//                         zIndex: 3,
//                         clipPath: "polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)",
//                     }}
//                 />
//             ) : (
//                 <div
//                     style={{
//                         position: "absolute",
//                         top: "-26px",
//                         left: "4px",
//                         background: "black",
//                         height: "100%",
//                         width: "100%",
//                         zIndex: 3,
//                         clipPath: "polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)",
//                     }}
//                 ></div>
//             )}

//             <img style={{ bottom: 0, zIndex: 3, left: "4px", position: "absolute" }} width={"100%"} src={borderBottom} alt="" />
//             <img style={{ bottom: 0, zIndex: 2, left: "4px", position: "absolute" }} width={"100%"} src={bottom} alt="" />
//             <Typography
//                 sx={{
//                     position: "absolute",
//                     left: 0,
//                     right: 0,
//                     ml: "auto",
//                     mr: "auto",
//                     width: "180px",
//                     textAlign: "center",

//                     bottom: "2rem",
//                     zIndex: 3,
//                     opacity: !mechDetails?.name && !mechDetails?.label ? 0.5 : 1,
//                     // left: "20%",
//                 }}
//                 variant="h5"
//             >
//                 {mechDetails?.name || mechDetails?.label || "Waiting"}
//             </Typography>
//         </Box>
//     )
// }

// const CardSVG = ({ width, height }: { width: string; height: string }) => {
//     return (
//         <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 150.631 161.37">
//             <path
//                 id="Path_101109"
//                 data-name="Path 101109"
//                 d="M136.561,162.367l-21.9-.382-3.55-3.675-36.3-.634-36.3.634-3.55,3.675-21.9.382L2.237,151.911H2.215V112.48L0,110.266V48.359l2.215-2.215V18.7L14.2,6.716h14.42l-.058-.058L30.013,5.2H63.737l3.2-3.2H82.69l3.2,3.2h33.724l1.456,1.456-.057.057h14.332l12.066,12.066v27.36l2.219,2.22v61.907l-2.219,2.219v39.425h-.025l-10.825,10.455ZM4,19.286V46.131l2.227,2.228v61.907l-2.228,2.228v26.735c2.561,2.525,8.754,8.642,10.958,10.9H134.444c2.235-2.292,8.569-8.547,11.187-11.129V112.49l-2.223-2.222V48.361l2.223-2.223V19.515c-2.558-2.523-8.761-8.649-11.081-11.019H121.063l-1.448,1.448H85.892l-3.2,3.2H66.938l-3.2-3.2H30.013L28.565,8.5H14.843C12.557,10.835,6.5,16.82,4,19.286Z"
//                 transform="translate(0.5 -1.5)"
//                 fill="#4da1d9"
//                 stroke="rgba(0,0,0,0)"
//                 strokeWidth="1"
//             />
//         </svg>
//     )
// }
