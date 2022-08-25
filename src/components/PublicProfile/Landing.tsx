import { Box, Typography } from "@mui/material"

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
            <Box sx={{ display: "flex", width: "100%", height: "100%", justifyContent: "center" }}>
                <Box
                    sx={{
                        position: "relative",
                        display: "flex",
                        width: "90%",
                        height: "80%",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                    }}
                >
                    {/* left */}
                    <Box sx={{ top: "25rem", position: "absolute", left: 0 }}>
                        <BoxThing mechIDs={nextBattle?.bc_mech_ids || []} faction="bc" />
                    </Box>

                    {/* right */}
                    <Box sx={{ top: "25rem", position: "absolute", right: 0 }}>
                        <BoxThing mechIDs={nextBattle?.zhi_mech_ids || []} faction="zhi" />
                    </Box>

                    {/* center */}
                    <Box sx={{ position: "absolute", top: "4rem" }}>
                        <BoxThing mechIDs={nextBattle?.rm_mech_ids || []} faction="rm" />
                    </Box>

                    <Box sx={{ position: "absolute", bottom: 0 }}>
                        <Typography variant="h4" textAlign={"center"}>
                            NEXT BATTLE
                        </Typography>
                        <img height="150rem" src={nextBattle?.map?.logo_url} alt="" />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

const BoxThing = ({ faction, mechIDs }: { faction: string; mechIDs: string[] }) => {
    return (
        <Box position="relative" width="75rem" height="70rem" margin="1rem">
            <Box sx={{ position: "absolute", top: 0, left: "34%", margin: "1rem" }}>
                <Card mechID={""} faction={faction} />
            </Box>

            <Box sx={{ position: "absolute", top: "35%", left: 0, margin: "1rem" }}>
                <Card mechID={mechIDs[0] || ""} faction={faction} />
            </Box>

            <Box sx={{ position: "absolute", top: "35%", right: 0, margin: "1rem" }}>
                <Card mechID={mechIDs[1] || ""} faction={faction} />
            </Box>

            <Box sx={{ position: "absolute", bottom: 0, left: "34%", margin: "1rem" }}>
                <Card mechID={mechIDs[2] || ""} faction={faction} />
            </Box>
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
        <Box position="relative" height={h} width={w}>
            <img style={{ position: "absolute", top: "-35px", zIndex: 4 }} width={"100%"} src={border} alt="" />
            {avatarUrl ? (
                <div
                    style={{
                        position: "absolute",
                        top: "-26px",
                        left: "4px",
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
                        top: "-26px",
                        left: "4px",
                        background: "black",
                        height: "82%",
                        width: "96%",
                        zIndex: 3,
                        clipPath: "polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)",
                    }}
                ></div>
            )}

            <img style={{ bottom: 0, zIndex: 3, left: "4px", position: "absolute" }} width={"96.5%"} src={borderBottom} alt="" />
            <img style={{ bottom: 0, zIndex: 2, left: "4px", position: "absolute" }} width={"96.5%"} src={bottom} alt="" />
            <Typography
                sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    ml: "auto",
                    mr: "auto",
                    width: "180px",
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
