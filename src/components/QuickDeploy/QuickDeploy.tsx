import { Box, CircularProgress, Fade, IconButton, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { MoveableResizable, MoveableResizableConfig, QueueFeed, TooltipHelper } from ".."
import { SvgClose, SvgSupToken } from "../../assets"
import { useTheme } from "../../containers/theme"
import { supFormatter } from "../../helpers"
import { usePagination } from "../../hooks"
import { useGameServerCommandsUser, useGameServerSubscriptionFaction } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { MechBasic } from "../../types"
import { PageHeader } from "../Common/PageHeader"
import { TotalAndPageSizeOptions } from "../Common/TotalAndPageSizeOptions"
import { QuickDeployItem } from "./QuickDeployItem"

interface GetMechsRequest {
    page: number
    page_size: number
    include_market_listed: boolean
}

interface GetAssetsResponse {
    mechs: MechBasic[]
    total: number
}

export const QuickDeploy = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    if (!open) return null
    return <QuickDeployInner onClose={onClose} />
}

const QuickDeployInner = ({ onClose }: { onClose: () => void }) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")

    // Mechs
    const [mechs, setMechs] = useState<MechBasic[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, setPageSize } = usePagination({ pageSize: 5, page: 1 })

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    // Queuing cost, queue length win reward etc.
    const queueFeed = useGameServerSubscriptionFaction<QueueFeed>({
        URI: "/queue",
        key: GameServerKeys.SubQueueFeed,
    })

    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)
            const resp = await send<GetAssetsResponse, GetMechsRequest>(GameServerKeys.GetMechs, {
                page,
                page_size: pageSize,
                include_market_listed: false,
            })

            if (!resp) return
            setLoadError(undefined)
            setMechs(resp.mechs)
            setTotalItems(resp.total)
        } catch (e) {
            setLoadError(typeof e === "string" ? e : "Failed to get war machines.")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [send, page, pageSize, setTotalItems])

    useEffect(() => {
        getItems()
    }, [getItems])

    const config: MoveableResizableConfig = useMemo(
        () => ({
            localStoragePrefix: "quickDeploy",
            // Defaults
            defaultPosX: 0,
            defaultPosY: 0,
            defaultWidth: 420,
            defaultHeight: 600,
            // Size limits
            minWidth: 350,
            minHeight: 400,
            maxWidth: 1000,
            maxHeight: 1000,
            // Others
            CaptionArea: <Box sx={{ pl: ".3rem" }}></Box>,
            infoTooltipText: "TODO",
        }),
        [],
    )

    const queueLength = queueFeed?.queue_length || 0
    const contractReward = queueFeed?.contract_reward || ""

    return (
        <Fade in>
            <Box>
                <MoveableResizable config={config}>
                    <Box sx={{ height: "100%" }}>
                        <Stack
                            sx={{
                                height: "100%",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            <PageHeader
                                title="QUICK DEPLOY"
                                description={
                                    <Stack spacing="1.5rem" direction="row">
                                        {queueLength >= 0 && (
                                            <AmountItem
                                                key={`${queueLength}-queue_length`}
                                                title={"POSITION: "}
                                                color="#FFFFFF"
                                                value={`${queueLength + 1}`}
                                                tooltip="The queue position of your war machine if you deploy now."
                                                disableIcon
                                            />
                                        )}

                                        <AmountItem
                                            key={`${contractReward}-contract_reward`}
                                            title={"REWARD: "}
                                            color={colors.yellow}
                                            value={supFormatter(contractReward, 2)}
                                            tooltip="Your reward if your mech survives the battle giving your syndicate a victory."
                                        />

                                        <AmountItem
                                            title={"FEE: "}
                                            color={"#FF4136"}
                                            value={supFormatter(queueFeed?.queue_cost || "0", 2)}
                                            tooltip="The cost to place your war machine into the battle queue."
                                        />
                                    </Stack>
                                }
                            ></PageHeader>

                            <TotalAndPageSizeOptions
                                countItems={mechs?.length}
                                totalItems={totalItems}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                changePage={changePage}
                                manualRefresh={getItems}
                            />

                            {loadError && (
                                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                                        <Typography
                                            sx={{
                                                color: colors.red,
                                                fontFamily: fonts.nostromoBold,
                                                textAlign: "center",
                                            }}
                                        >
                                            {loadError}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            )}

                            {isLoading && !loadError && (
                                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                                        <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                                    </Stack>
                                </Stack>
                            )}

                            {!isLoading && !loadError && mechs && mechs.length > 0 && (
                                <Box
                                    sx={{
                                        flex: 1,
                                        overflowY: "auto",
                                        overflowX: "hidden",
                                        ml: "1rem",
                                        mr: ".5rem",
                                        pr: ".6rem",
                                        my: "1rem",
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
                                            background: primaryColor,
                                            borderRadius: 3,
                                        },
                                    }}
                                >
                                    <Box sx={{ direction: "ltr", height: 0 }}>
                                        <Stack>
                                            {mechs.map((mech) => {
                                                return <QuickDeployItem key={mech.id} mech={mech} queueFeed={queueFeed} />
                                            })}
                                        </Stack>
                                    </Box>
                                </Box>
                            )}

                            {!isLoading && !loadError && mechs && mechs.length <= 0 && (
                                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "40rem" }}>
                                        <Typography
                                            sx={{
                                                px: "1.28rem",
                                                pt: "1.28rem",
                                                color: colors.grey,
                                                fontFamily: fonts.nostromoBold,
                                                userSelect: "text !important",
                                                opacity: 0.9,
                                                textAlign: "center",
                                            }}
                                        >
                                            {`You don't own any war machines.`}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            )}

                            {totalPages > 1 && (
                                <Box
                                    sx={{
                                        px: "1rem",
                                        py: ".7rem",
                                        borderTop: `${primaryColor}70 1.5px solid`,
                                        borderBottom: `${primaryColor}70 1.5px solid`,
                                        backgroundColor: "#00000070",
                                    }}
                                >
                                    <Pagination
                                        size="medium"
                                        count={totalPages}
                                        page={page}
                                        sx={{
                                            ".MuiButtonBase-root": { borderRadius: 0.8, fontFamily: fonts.nostromoBold },
                                            ".Mui-selected": {
                                                color: secondaryColor,
                                                backgroundColor: `${primaryColor} !important`,
                                            },
                                        }}
                                        onChange={(e, p) => changePage(p)}
                                        showFirstButton
                                        showLastButton
                                    />
                                </Box>
                            )}
                        </Stack>

                        <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                            <SvgClose size="1.9rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                        </IconButton>
                    </Box>
                </MoveableResizable>
            </Box>
        </Fade>
    )
}

const AmountItem = ({
    title,
    color,
    value,
    tooltip,
    disableIcon,
}: {
    title: string
    color: string
    value: string | number
    tooltip: string
    disableIcon?: boolean
}) => {
    return (
        <TooltipHelper placement="bottom" text={tooltip}>
            <Stack direction="row" alignItems="center">
                <Typography variant="body1" sx={{ mr: ".4rem", fontWeight: "fontWeightBold" }}>
                    {title}
                </Typography>

                {!disableIcon && <SvgSupToken size="1.6rem" fill={color} sx={{ mr: ".1rem", pb: ".4rem" }} />}

                <Typography variant="body1" sx={{ color: color }}>
                    {value || "---"}
                </Typography>
            </Stack>
        </TooltipHelper>
    )
}
