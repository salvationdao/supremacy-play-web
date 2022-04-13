import { Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { DeployConfirmation, TooltipHelper } from ".."
import { SvgSupToken, SvgView } from "../../assets"
import { UNDER_MAINTENANCE } from "../../constants"
import { useGameServerWebsocket, usePassportServerAuth, usePassportServerWebsocket, useSnackbar } from "../../containers"
import { getRarityDeets, supFormatter } from "../../helpers"
import { useToggle } from "../../hooks"
import { PassportServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { Asset, AssetQueueStat } from "../../types/assets"
import { HistoryDrawer } from "./HistoryDrawer"
import { LeaveConfirmation } from "./LeaveConfirmation"

// const RepairCountdown = ({ endTime }: { endTime: Date }) => {
//     const { hours, minutes, seconds } = useTimer(endTime)

//     return (
//         <>
//             {hours && hours > 0 ? `${hours}h` : ""} {minutes && minutes > 0 ? `${minutes}h` : ""}{" "}
//             {seconds && seconds > 0 ? `${seconds}h` : ""}
//         </>
//     )
// }

export const AssetItem = ({
    asset,
    assetQueueStatus,
    queueLength,
    queueCost,
    contractReward,
}: {
    asset: Asset
    assetQueueStatus?: AssetQueueStat
    queueLength: number
    queueCost: string
    contractReward: string
}) => {
    const { user } = usePassportServerAuth()
    const { state, subscribe, send } = usePassportServerWebsocket()
    const { state: gsState } = useGameServerWebsocket()
    const [deployModalOpen, toggleDeployModalOpen] = useToggle()

    const [leaveModalOpen, toggleLeaveModalOpen] = useToggle()
    const [historyDrawerOpen, toggleHistoryDrawerOpen] = useToggle()

    const [mouseOver, setMouseOver] = useState<boolean>(false)
    const [assetData, setAssetData] = useState<Asset>(asset)
    const [renaming, setRenaming] = useState<boolean>(false)
    const [renamedValue, setRenamedValue] = useState<string>("")
    const [renameLoading, setRenameLoading] = useState<boolean>(false)
    const renamingRef = useRef<HTMLInputElement>()
    const { newSnackbarMessage } = useSnackbar()

    const rarityDeets = useMemo(() => getRarityDeets(assetData.tier), [assetData])

    // Subscribe on asset data
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !asset) return
        return subscribe<{ purchased_item: Asset }>(
            PassportServerKeys.SubAssetData,
            (payload) => {
                if (!payload || !payload.purchased_item) return
                setAssetData(payload.purchased_item)
                const mech = payload.purchased_item.data.mech
                if (mech.name) {
                    setRenamedValue(mech.name)
                    return
                }
                setRenamedValue(mech.label)
            },
            { asset_hash: asset.hash },
        )
    }, [state, subscribe])

    const isGameServerUp = useMemo(() => gsState == WebSocket.OPEN && !UNDER_MAINTENANCE, [gsState])
    const isRepairing = false // To be implemented on gameserver
    const isInBattle = useMemo(() => assetQueueStatus && assetQueueStatus.queue_position && assetQueueStatus.queue_position === -1, [assetQueueStatus])
    const isInQueue = useMemo(() => assetQueueStatus && assetQueueStatus.queue_position && assetQueueStatus.queue_position >= 1, [assetQueueStatus])

    if (!assetData || !user) return null

    const { hash, name, label, image_url } = assetData.data.mech

    const handleRename = useCallback(async () => {
        setRenameLoading(true)
        try {
            if (state !== WebSocket.OPEN || !send) return
            if (renamedValue === label || renamedValue === name) return
            await send<{ asset: string; user_id: string; name: string }>(PassportServerKeys.UpdateAssetName, {
                asset_hash: hash,
                user_id: user.id,
                name: renamedValue,
            })

            newSnackbarMessage("Successfully renamed asset.", "success")
        } catch (e) {
            newSnackbarMessage(typeof e === "string" ? e : "Failed to rename asset, try again or contact support.", "error")
            setRenamedValue(name || label)
        } finally {
            setRenameLoading(false)
        }
    }, [state, send, renamedValue, hash, user.id, newSnackbarMessage])

    const statusArea = useMemo(() => {
        // If game server is down, don't show deploy button
        if (!isGameServerUp) {
            return (
                <Typography
                    variant="body2"
                    sx={{
                        px: ".8rem",
                        pt: ".48rem",
                        pb: ".24rem",
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

        if (isRepairing) {
            // const { started_at, expect_completed_at } = durability
            // const isFastMode = durability.repair_type == "FAST"
            // return (
            //     <>
            //         <Typography
            //             variant="body2"
            //             sx={{
            //                 px: '.8rem',
            //                 pt: '.48rem',
            //                 pb: '.24rem',
            //                 color: colors.neonBlue,
            //                 lineHeight: 1,
            //                 border: `${colors.neonBlue} 1px solid`,
            //                 borderRadius: 0.3,
            //             }}
            //         >
            //             REPAIRING
            //         </Typography>
            //         <Stack direction="row" alignItems="center" spacing=".32rem" sx={{ pt: '.24rem' }}>
            //             {isFastMode && <SvgFastRepair size="1rem" fill={colors.neonBlue} />}
            //             <SvgCooldown size="1.2rem" fill={colors.neonBlue} />
            //             <Typography
            //                 variant="caption"
            //                 sx={{ lineHeight: 1, color: colors.neonBlue, fontFamily: "Nostromo Regular Bold" }}
            //             >
            //                 <RepairCountdown endTime={expect_completed_at} />
            //             </Typography>
            //         </Stack>
            //     </>
            // )
        }

        if (isInBattle && assetQueueStatus) {
            return (
                <>
                    <Typography
                        variant="body2"
                        sx={{
                            px: ".8rem",
                            pt: ".48rem",
                            pb: ".24rem",
                            color: colors.orange,
                            lineHeight: 1,
                            border: `${colors.orange} 1px solid`,
                            borderRadius: 0.3,
                        }}
                    >
                        IN BATTLE
                    </Typography>
                    {assetQueueStatus.contract_reward && (
                        <Stack direction="row" alignItems="center" sx={{ pt: ".24rem" }}>
                            <Typography variant="caption">REWARD:&nbsp;</Typography>
                            <SvgSupToken size="1.2rem" fill={colors.yellow} sx={{ pb: 0.4 }} />
                            <Typography variant="caption" sx={{ color: colors.yellow }}>
                                {supFormatter(assetQueueStatus.contract_reward, 2)}
                            </Typography>
                        </Stack>
                    )}
                </>
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
                        onClick={(e) => {
                            e.stopPropagation()
                            toggleLeaveModalOpen(true)
                        }}
                        variant="contained"
                        size="small"
                        sx={{
                            zIndex: 2,
                            position: "relative",
                            display: "inline",
                            padding: 0,
                            px: ".8rem",
                            pt: ".48rem",
                            pb: ".24rem",
                            cursor: "pointer",
                            width: "8.2rem",
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
                    {assetQueueStatus.contract_reward && (
                        <Stack direction="row" alignItems="center" sx={{ pt: ".24rem" }}>
                            <Typography variant="caption">REWARD:&nbsp;</Typography>
                            <SvgSupToken size="1.2rem" fill={colors.yellow} sx={{ pb: 0.4 }} />
                            <Typography variant="caption" sx={{ color: colors.yellow }}>
                                {supFormatter(assetQueueStatus.contract_reward, 2)}
                            </Typography>
                        </Stack>
                    )}
                </>
            )
        }

        return (
            <Button
                variant="contained"
                size="small"
                onClick={(e) => {
                    toggleDeployModalOpen(true)
                    e.stopPropagation()
                }}
                sx={{
                    zIndex: 2,
                    position: "relative",
                    minWidth: 0,
                    px: ".8rem",
                    pt: ".48rem",
                    pb: 0.4,
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
    }, [isGameServerUp, isRepairing, isInQueue, mouseOver, assetQueueStatus])

    return (
        <>
            <Box
                role="button"
                tabIndex={0}
                sx={{
                    position: "relative",
                    cursor: "pointer",
                    "::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        opacity: 0,
                        transition: "opacity .2s ease-out",
                    },
                    ":hover::after, :focus::after": {
                        opacity: 1,
                    },
                }}
                onClick={() => {
                    toggleHistoryDrawerOpen(true)
                }}
            >
                <Stack
                    direction="row"
                    spacing="1.44rem"
                    sx={{
                        position: "relative",
                        px: "1.04rem",
                        py: ".8rem",
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
                            <Box sx={{ position: "absolute", top: 0, left: 0 }}>
                                <Typography sx={{ fontFamily: "Nostromo Regular Black" }}>{assetQueueStatus.queue_position}</Typography>
                            </Box>
                        )}

                        <TooltipHelper text={`Rarity: ${rarityDeets.label}`} placement="right">
                            <Stack
                                direction="row"
                                spacing=".08rem"
                                sx={{
                                    position: "absolute",
                                    bottom: "-1.4rem",
                                    left: ".1rem",
                                    height: "4.2rem",
                                    transform: "rotate(-40deg)",
                                    zIndex: 3,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 3,
                                        height: "100%",
                                        backgroundColor: rarityDeets.color,
                                        border: "#00000090 1.5px solid",
                                    }}
                                />
                                <Box
                                    sx={{
                                        width: 3,
                                        height: "100%",
                                        backgroundColor: rarityDeets.color,
                                        border: "#00000090 1.5px solid",
                                    }}
                                />
                            </Stack>
                        </TooltipHelper>
                    </Box>
                    <Stack spacing=".4rem" justifyContent="space-between" sx={{ flex: 1, pb: ".2rem" }}>
                        <TextField
                            inputRef={renamingRef}
                            variant={"standard"}
                            multiline
                            sx={{
                                zIndex: 2,
                                position: "relative",
                                "& .MuiInputBase-root": {
                                    padding: 0,
                                },
                            }}
                            spellCheck={false}
                            InputProps={{
                                disableUnderline: true,
                                style: {
                                    fontFamily: "Nostromo Regular Bold",
                                    fontWeight: "fontWeightBold",
                                    wordBreak: "break-word",
                                    fontSize: "1.1rem",
                                    backgroundColor: renaming ? colors.navy : "unset",
                                    borderRadius: ".3rem",
                                    border: renaming ? `.5px solid ${colors.lightGrey}` : "unset",
                                },
                            }}
                            value={renamedValue}
                            defaultValue={name || label}
                            onChange={(e) => {
                                setRenamedValue(e.target.value)
                            }}
                            onFocus={() => {
                                setRenaming(true)
                            }}
                            onBlur={() => {
                                setRenaming(false)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                    handleRename()
                                    renamingRef.current?.blur()
                                }
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />

                        <Stack alignItems="center" direction="row" spacing=".96rem">
                            {statusArea}
                            {renamedValue !== name && renamedValue !== label && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={(e) => {
                                        handleRename()
                                        e.stopPropagation()
                                    }}
                                    sx={{
                                        zIndex: 2,
                                        position: "relative",
                                        minWidth: "6rem",
                                        minHeight: "100%",
                                        px: ".8rem",
                                        pt: ".48rem",
                                        pb: 0.4,
                                        boxShadow: 0,
                                        backgroundColor: colors.blue,
                                        borderRadius: 0.3,
                                        ":hover": { backgroundColor: `${colors.blue}90` },
                                    }}
                                >
                                    {renameLoading ? (
                                        <CircularProgress size={"1.1rem"} sx={{ color: colors.lightNeonBlue }} />
                                    ) : (
                                        <Typography variant="body2" sx={{ lineHeight: 1 }}>
                                            Rename
                                        </Typography>
                                    )}
                                </Button>
                            )}
                        </Stack>
                    </Stack>

                    <SvgView
                        size="1.3rem"
                        sx={{
                            position: "absolute",
                            bottom: ".5rem",
                            right: ".7rem",
                            opacity: 0.5,
                        }}
                    />
                </Stack>
            </Box>

            {deployModalOpen && (
                <DeployConfirmation
                    open={deployModalOpen}
                    asset={asset}
                    queueLength={queueLength}
                    queueCost={queueCost}
                    contractReward={contractReward}
                    onClose={() => toggleDeployModalOpen(false)}
                />
            )}

            {leaveModalOpen && <LeaveConfirmation open={leaveModalOpen} asset={asset} onClose={() => toggleLeaveModalOpen(false)} />}

            {historyDrawerOpen && <HistoryDrawer user={user} open={historyDrawerOpen} asset={asset} onClose={() => toggleHistoryDrawerOpen(false)} />}
        </>
    )
}
