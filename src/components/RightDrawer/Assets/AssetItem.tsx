import { Box, Button, Fade, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { AssetQueue, DeployConfirmation, QueueFeedResponse } from "../.."
import { getRarityDeets, supFormatter } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { Asset } from "../../../types/assets"
import { MechDrawer } from "./MechDrawer"
import { LeaveConfirmation } from "./LeaveConfirmation"
import { PassportServerKeys } from "../../../keys"
import { SvgSupToken } from "../../../assets"
import { usePassportSubscriptionUser } from "../../../hooks/usePassport"
import { useAuth } from "../../../containers/auth"

export const AssetItem = ({
    assetQueue,
    queueFeed,
    setTelegramShortcode,
    isGridView,
    togglePreventAssetsRefresh,
}: {
    assetQueue: AssetQueue
    queueFeed: QueueFeedResponse
    telegramShortcode?: string
    setTelegramShortcode?: (s: string) => void
    isGridView: boolean
    togglePreventAssetsRefresh: (value?: boolean | undefined) => void
}) => {
    const { userID } = useAuth()

    const [assetData, setAssetData] = useState<Asset>()

    const [mechDrawerOpen, toggleMechDrawerOpen] = useToggle()
    const [deployModalOpen, toggleDeployModalOpen] = useToggle()
    const [leaveModalOpen, toggleLeaveModalOpen] = useToggle()

    const rarityDeets = useMemo(() => getRarityDeets(assetData?.tier || ""), [assetData])

    // Status
    const isInQueue = useMemo(() => assetQueue && assetQueue.position && assetQueue.position >= 1, [assetQueue])

    // Subscribe on asset data
    usePassportSubscriptionUser<{ purchased_item: Asset }>(
        {
            URI: `/xxxxxxxxxx/${assetQueue.hash}`,
            key: PassportServerKeys.SubAssetData,
        },
        (payload) => {
            if (!payload || !payload.purchased_item) return
            setAssetData(payload.purchased_item)
        },
    )

    const statusArea = useMemo(() => {
        if (assetQueue && assetQueue.in_battle) {
            return (
                <>
                    <Typography
                        variant="body2"
                        sx={{
                            width: isGridView ? "unset" : "8.5rem",
                            alignSelf: isGridView ? "stretch" : "unset",
                            textAlign: "center",
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
                    {assetQueue.contract_reward && !isGridView && (
                        <Stack direction="row" alignItems="center" sx={{ pt: ".24rem" }}>
                            <Typography variant="caption">REWARD:&nbsp;</Typography>
                            <SvgSupToken size="1.2rem" fill={colors.yellow} sx={{ pb: 0.4 }} />
                            <Typography variant="caption" sx={{ color: colors.yellow }}>
                                {supFormatter(assetQueue.contract_reward, 2)}
                            </Typography>
                        </Stack>
                    )}
                </>
            )
        }

        if (isInQueue && assetQueue) {
            return (
                <>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation()
                            toggleLeaveModalOpen(true)
                            togglePreventAssetsRefresh(true)
                        }}
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
                            color: colors.yellow,
                            lineHeight: 1,
                            border: `${colors.yellow} 1px solid`,
                            borderRadius: 0.3,
                            whiteSpace: "nowrap",
                            transition: "all 0s",
                            "& > p": {
                                "::after": {
                                    content: '"IN QUEUE"',
                                },
                            },
                            ":hover": {
                                color: colors.red,
                                backgroundColor: "transparent",
                                boxShadow: "none",
                                opacity: 1,
                                border: `${colors.red} 1px solid`,
                                "& > p": {
                                    color: `${colors.red} !important`,
                                    "::after": {
                                        content: '"LEAVE QUEUE"',
                                    },
                                },
                            },
                        }}
                    >
                        <Typography variant="body2" lineHeight={1} sx={{ color: colors.yellow }}></Typography>
                    </Button>
                    {assetQueue.contract_reward && !isGridView && (
                        <Stack direction="row" alignItems="center" sx={{ pt: ".24rem" }}>
                            <Typography variant="caption">REWARD:&nbsp;</Typography>
                            <SvgSupToken size="1.2rem" fill={colors.yellow} sx={{ pb: 0.4 }} />
                            <Typography variant="caption" sx={{ color: colors.yellow }}>
                                {supFormatter(assetQueue.contract_reward, 2)}
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
                    e.stopPropagation()
                    toggleDeployModalOpen(true)
                    togglePreventAssetsRefresh(true)
                }}
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
    }, [assetQueue, isInQueue, isGridView, toggleLeaveModalOpen, toggleDeployModalOpen, togglePreventAssetsRefresh])

    const mechItem = useMemo(() => {
        if (!assetData) return <></>
        const { name, label, image_url } = assetData.data.mech

        if (isGridView) {
            return (
                <Box sx={{ p: ".4rem", width: "33.33%" }}>
                    <Box
                        onClick={() => {
                            toggleMechDrawerOpen()
                            togglePreventAssetsRefresh(true)
                        }}
                        sx={{
                            height: "100%",
                            borderRadius: 0.2,
                            cursor: "pointer",
                            ":hover": { backgroundColor: `#FFFFFF20` },
                        }}
                    >
                        <Stack
                            sx={{
                                height: "100%",
                                px: ".7rem",
                                pt: ".6rem",
                                pb: ".8rem",
                                backgroundColor: `${colors.navy}80`,
                            }}
                        >
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

                                {isInQueue && assetQueue && assetQueue.position && (
                                    <Box sx={{ position: "absolute", bottom: ".1rem", left: ".5rem" }}>
                                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{assetQueue.position}</Typography>
                                    </Box>
                                )}
                            </Box>

                            <Typography
                                variant="caption"
                                sx={{
                                    fontFamily: fonts.nostromoBold,
                                    letterSpacing: ".1rem",
                                    fontSize: "1rem",
                                    lineHeight: 1.25,
                                    mt: ".6rem",
                                    display: "-webkit-box",
                                    overflow: "hidden",
                                    overflowWrap: "anywhere",
                                    textOverflow: "ellipsis",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                }}
                            >
                                {name || label}
                            </Typography>

                            <Stack spacing=".3rem" alignItems="center" sx={{ mt: "auto", pt: ".7rem" }}>
                                {statusArea}
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            )
        }

        return (
            <Box
                onClick={() => {
                    toggleMechDrawerOpen()
                    togglePreventAssetsRefresh(true)
                }}
                sx={{
                    cursor: "pointer",
                    ":hover": { backgroundColor: `#FFFFFF20` },
                }}
            >
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

                        {isInQueue && assetQueue && assetQueue.position && (
                            <Box sx={{ position: "absolute", bottom: ".1rem", left: ".5rem" }}>
                                <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{assetQueue.position}</Typography>
                            </Box>
                        )}
                    </Box>

                    <Stack sx={{ flex: 1 }}>
                        <Typography variant="caption" sx={{ lineHeight: 1, color: rarityDeets.color, fontFamily: fonts.nostromoBlack }}>
                            {rarityDeets.label}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                my: ".2rem",
                                fontFamily: fonts.nostromoBold,
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
                        </Stack>
                    </Stack>
                </Stack>
            </Box>
        )
    }, [assetData, isGridView, isInQueue, assetQueue, rarityDeets.color, rarityDeets.label, statusArea, toggleMechDrawerOpen, togglePreventAssetsRefresh])

    if (!assetData || !userID) return null

    return (
        <>
            <Fade key={`${isGridView}`} in={true}>
                {mechItem}
            </Fade>

            {deployModalOpen && (
                <DeployConfirmation
                    open={deployModalOpen}
                    asset={assetData}
                    queueFeed={queueFeed}
                    onClose={() => {
                        toggleDeployModalOpen(false)
                        togglePreventAssetsRefresh(false)
                    }}
                    setTelegramShortcode={setTelegramShortcode}
                />
            )}

            {leaveModalOpen && (
                <LeaveConfirmation
                    open={leaveModalOpen}
                    asset={assetData}
                    onClose={() => {
                        toggleLeaveModalOpen(false)
                        togglePreventAssetsRefresh(false)
                    }}
                />
            )}

            {mechDrawerOpen && (
                <MechDrawer
                    open={mechDrawerOpen}
                    asset={assetData}
                    assetQueue={assetQueue}
                    onClose={() => {
                        toggleMechDrawerOpen(false)
                        togglePreventAssetsRefresh(false)
                    }}
                    openDeployModal={() => {
                        toggleDeployModalOpen(true)
                        togglePreventAssetsRefresh(true)
                    }}
                    openLeaveModal={() => {
                        toggleLeaveModalOpen(true)
                        togglePreventAssetsRefresh(true)
                    }}
                />
            )}
        </>
    )
}
