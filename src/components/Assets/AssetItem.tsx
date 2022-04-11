import { Box, Button, Fade, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { DeployConfirmation } from ".."
import { UNDER_MAINTENANCE } from "../../constants"
import { useGameServerWebsocket, usePassportServerAuth, usePassportServerWebsocket } from "../../containers"
import { getRarityDeets } from "../../helpers"
import { useToggle } from "../../hooks"
import { colors } from "../../theme/theme"
import { Asset, AssetQueueStat } from "../../types/assets"
import { MechDrawer } from "./MechDrawer"
import { LeaveConfirmation } from "./LeaveConfirmation"
import { PassportServerKeys } from "../../keys"
import { SvgNext } from "../../assets"

export const AssetItem = ({
    asset,
    assetQueueStatus,
    queueLength,
    queueCost,
    contractReward,
    setTelegramShortcode,
    isGridView,
}: {
    asset: Asset
    assetQueueStatus?: AssetQueueStat
    queueLength: number
    queueCost: string
    contractReward: string
    telegramShortcode?: string
    setTelegramShortcode?: (s: string) => void
    isGridView: boolean
}) => {
    const { user } = usePassportServerAuth()
    const { state } = useGameServerWebsocket()
    const { state: psState, subscribe: psSubscribe } = usePassportServerWebsocket()
    const [assetData, setAssetData] = useState<Asset>(asset)

    const [mechDrawerOpen, toggleMechDrawerOpen] = useToggle()
    const [deployModalOpen, toggleDeployModalOpen] = useToggle()
    const [leaveModalOpen, toggleLeaveModalOpen] = useToggle()

    const rarityDeets = useMemo(() => getRarityDeets(assetData.tier), [assetData])

    // Status
    const [mouseOver, setMouseOver] = useState<boolean>(false)
    const isGameServerUp = useMemo(() => state == WebSocket.OPEN && !UNDER_MAINTENANCE, [state])
    const isRepairing = false // To be implemented on gameserver
    const isInBattle = useMemo(() => assetQueueStatus && assetQueueStatus.queue_position && assetQueueStatus.queue_position === -1, [assetQueueStatus])
    const isInQueue = useMemo(() => assetQueueStatus && assetQueueStatus.queue_position && assetQueueStatus.queue_position >= 1, [assetQueueStatus])

    // Subscribe on asset data
    useEffect(() => {
        if (psState !== WebSocket.OPEN || !psSubscribe || !asset) return
        return psSubscribe<{ purchased_item: Asset }>(
            PassportServerKeys.SubAssetData,
            (payload) => {
                if (!payload || !payload.purchased_item) return
                setAssetData(payload.purchased_item)
            },
            { asset_hash: asset.hash },
        )
    }, [psState, psSubscribe, asset])

    if (!assetData || !user) return null

    const { name, label, image_url } = assetData.data.mech

    const statusArea = useMemo(() => {
        if (!isGameServerUp) {
            return (
                <Typography
                    variant="body2"
                    sx={{
                        width: isGridView ? "unset" : "8.5rem",
                        alignSelf: isGridView ? "stretch" : "unset",
                        px: ".8rem",
                        pt: ".3rem",
                        pb: ".2rem",
                        color: "grey",
                        lineHeight: 1,
                        border: `${"grey"} 1px solid`,
                        borderRadius: 0.3,
                        opacity: 0.6,
                    }}
                >
                    GAME OFFLINE
                </Typography>
            )
        }

        if (isInBattle && assetQueueStatus) {
            return (
                <Typography
                    variant="body2"
                    sx={{
                        width: isGridView ? "unset" : "8.5rem",
                        alignSelf: isGridView ? "stretch" : "unset",
                        px: ".8rem",
                        pt: ".3rem",
                        pb: ".2rem",
                        color: colors.orange,
                        lineHeight: 1,
                        border: `${colors.orange} 1px solid`,
                        borderRadius: 0.3,
                    }}
                >
                    IN BATTLE
                </Typography>
            )
        }

        if (isInQueue && assetQueueStatus) {
            return (
                <>
                    <Button
                        onMouseEnter={() => setMouseOver(true)}
                        onMouseLeave={() => setMouseOver(false)}
                        onFocus={() => setMouseOver(true)}
                        onBlur={() => setMouseOver(false)}
                        onClick={() => toggleLeaveModalOpen(true)}
                        variant="contained"
                        size="small"
                        sx={{
                            position: "relative",
                            display: "inline",
                            padding: 0,
                            width: isGridView ? "unset" : "8.5rem",
                            alignSelf: isGridView ? "stretch" : "unset",
                            px: ".8rem",
                            pt: ".3rem",
                            pb: ".2rem",
                            cursor: "pointer",
                            textAlign: "center",
                            backgroundColor: "transparent",
                            color: mouseOver ? colors.red : colors.yellow,
                            lineHeight: 1,
                            border: `${mouseOver ? colors.red : colors.yellow} 1px solid`,
                            borderRadius: 0.3,
                            whiteSpace: "nowrap",
                            ":hover": {
                                backgroundColor: "transparent",
                                boxShadow: "none",
                                opacity: 1,
                            },
                        }}
                    >
                        <Typography variant="body2" lineHeight={1} sx={{ color: mouseOver ? colors.red : colors.yellow }}>
                            {mouseOver ? "LEAVE QUEUE" : "IN QUEUE"}
                        </Typography>
                    </Button>
                </>
            )
        }

        return (
            <Button
                variant="contained"
                size="small"
                onClick={() => toggleDeployModalOpen(true)}
                sx={{
                    position: "relative",
                    width: isGridView ? "unset" : "8.5rem",
                    alignSelf: isGridView ? "stretch" : "unset",
                    px: ".8rem",
                    pt: ".3rem",
                    pb: ".2rem",
                    boxShadow: 0,
                    backgroundColor: colors.green,
                    borderRadius: 0.3,
                    ":hover": { backgroundColor: `${colors.green}90` },
                }}
            >
                <Typography variant="body2" sx={{ lineHeight: 1 }}>
                    DEPLOY
                </Typography>
            </Button>
        )
    }, [isGameServerUp, isRepairing, isInQueue, mouseOver, assetQueueStatus, isGridView])

    const mechItem = useMemo(() => {
        if (isGridView) {
            return (
                <Box sx={{ p: ".4rem", width: "33.33%" }}>
                    <Box sx={{ px: ".7rem", py: ".6rem", backgroundColor: `${colors.navy}80`, borderRadius: 0.2 }}>
                        <Box
                            sx={{
                                position: "relative",
                                flexShrink: 0,
                                alignSelf: "stretch",
                                px: ".48rem",
                                py: ".8rem",
                                boxShadow: "inset 0 0 8px 6px #00000055",
                                overflow: "hidden",
                                borderRadius: 0.5,
                            }}
                        >
                            <Box
                                sx={{
                                    height: "5.5rem",
                                    flexShrink: 0,
                                    overflow: "hidden",
                                    backgroundImage: `url(${image_url})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundSize: "contain",
                                }}
                            />

                            {isGameServerUp && isInQueue && assetQueueStatus && assetQueueStatus.queue_position && (
                                <Box sx={{ position: "absolute", bottom: ".1rem", left: ".5rem" }}>
                                    <Typography sx={{ fontFamily: "Nostromo Regular Black" }}>{assetQueueStatus.queue_position}</Typography>
                                </Box>
                            )}
                        </Box>

                        <Stack spacing=".3rem" alignItems="center" sx={{ mt: ".7rem" }}>
                            {statusArea}

                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => toggleMechDrawerOpen()}
                                sx={{
                                    mt: ".2rem",
                                    position: "relative",
                                    width: isGridView ? "unset" : "8.5rem",
                                    alignSelf: isGridView ? "stretch" : "unset",
                                    px: ".8rem",
                                    pt: ".3rem",
                                    pb: ".2rem",
                                    boxShadow: 0,
                                    backgroundColor: user.faction.theme.primary,
                                    borderRadius: 0.3,
                                    ":hover": { backgroundColor: `${user.faction.theme.primary}90` },
                                }}
                            >
                                <Typography variant="body2" sx={{ lineHeight: 1, color: user.faction.theme.secondary }}>
                                    VIEW MECH
                                </Typography>
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            )
        }

        return (
            <Stack
                direction="row"
                alignItems="center"
                spacing="1.44rem"
                sx={{
                    position: "relative",
                    px: "1.3rem",
                    py: "1rem",
                    backgroundColor: `${colors.navy}80`,
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        flexShrink: 0,
                        px: ".48rem",
                        py: ".8rem",
                        boxShadow: "inset 0 0 8px 6px #00000055",
                        overflow: "hidden",
                        borderRadius: 0.5,
                    }}
                >
                    <Box
                        sx={{
                            width: "5.5rem",
                            height: "5.5rem",
                            flexShrink: 0,
                            overflow: "hidden",
                            backgroundImage: `url(${image_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                        }}
                    />

                    {isGameServerUp && isInQueue && assetQueueStatus && assetQueueStatus.queue_position && (
                        <Box sx={{ position: "absolute", bottom: ".1rem", left: ".5rem" }}>
                            <Typography sx={{ fontFamily: "Nostromo Regular Black" }}>{assetQueueStatus.queue_position}</Typography>
                        </Box>
                    )}
                </Box>

                <Stack sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ lineHeight: 1, color: rarityDeets.color, fontFamily: "Nostromo Regular Black" }}>
                        {rarityDeets.label}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            my: ".2rem",
                            fontFamily: "Nostromo Regular Bold",
                            fontWeight: "fontWeightBold",
                            letterSpacing: ".1rem",
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {name || label}
                    </Typography>

                    <Stack alignItems="center" direction="row" spacing=".6rem" sx={{ mt: ".1rem" }}>
                        {statusArea}

                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => toggleMechDrawerOpen()}
                            sx={{
                                mt: ".2rem",
                                position: "relative",
                                width: "8.5rem",
                                px: ".8rem",
                                pt: ".3rem",
                                pb: ".2rem",
                                boxShadow: 0,
                                backgroundColor: user.faction.theme.primary,
                                borderRadius: 0.3,
                                ":hover": { backgroundColor: `${user.faction.theme.primary}90` },
                            }}
                        >
                            <Typography variant="body2" sx={{ lineHeight: 1, color: user.faction.theme.secondary }}>
                                VIEW MECH
                            </Typography>
                            <SvgNext size="1rem" fill={user.faction.theme.secondary} sx={{ ml: ".4rem", pb: ".2rem" }} />
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        )
    }, [isGridView])

    return (
        <>
            <Fade key={`${isGridView}`} in={true}>
                {mechItem}
            </Fade>

            {deployModalOpen && (
                <DeployConfirmation
                    open={deployModalOpen}
                    asset={assetData}
                    queueLength={queueLength}
                    queueCost={queueCost}
                    contractReward={contractReward}
                    onClose={() => toggleDeployModalOpen(false)}
                    setTelegramShortcode={setTelegramShortcode}
                />
            )}

            {leaveModalOpen && <LeaveConfirmation open={leaveModalOpen} asset={assetData} onClose={() => toggleLeaveModalOpen(false)} />}

            {mechDrawerOpen && (
                <MechDrawer
                    user={user}
                    open={mechDrawerOpen}
                    asset={assetData}
                    assetQueueStatus={assetQueueStatus}
                    onClose={() => toggleMechDrawerOpen(false)}
                    openDeployModal={() => toggleDeployModalOpen(true)}
                    openLeaveModal={() => toggleLeaveModalOpen(true)}
                />
            )}
        </>
    )
}
