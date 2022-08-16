import { Box, CircularProgress, IconButton, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { TooltipHelper } from "../.."
import { SvgNotification, SvgSupToken } from "../../../assets"
import { useAuth } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { parseString, supFormatter } from "../../../helpers"
import { usePagination, useToggle } from "../../../hooks"
import { useGameServerCommandsUser, useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { MechBasic } from "../../../types"
import { SortTypeLabel } from "../../../types/marketplace"
import { PreferencesModal } from "../../Bar/ProfileCard/PreferencesModal/PreferencesModal"
import { TelegramRegisterModal } from "../../Bar/ProfileCard/PreferencesModal/TelegramRegisterModal"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { QueueFeed } from "../../Hangar/WarMachinesHangar/WarMachineDetails/Modals/DeployModal"
import { QuickDeployItem } from "./QuickDeployItem"

const sortOptions = [
    { label: SortTypeLabel.MechQueueAsc, value: SortTypeLabel.MechQueueAsc },
    { label: SortTypeLabel.MechQueueDesc, value: SortTypeLabel.MechQueueDesc },
]

interface GetMechsRequest {
    queue_sort?: string
    sort_by?: string
    sort_dir?: string
    search?: string
    page: number
    page_size: number
    rarities?: string[]
    statuses: string[]
    include_market_listed: boolean
    exclude_damaged_mech: boolean
}

interface GetAssetsResponse {
    mechs: MechBasic[]
    total: number
}

export const QuickDeploy = () => {
    const { userID } = useAuth()
    if (!userID) return null
    return <QuickDeployInner />
}

const QuickDeployInner = () => {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [preferencesModalOpen, togglePreferencesModalOpen] = useToggle()
    const [addDeviceModalOpen, toggleAddDeviceModalOpen] = useToggle()
    const [telegramShortcode, setTelegramShortcode] = useState<string>("")

    // Mechs
    const [mechs, setMechs] = useState<MechBasic[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()

    const [sort, setSort] = useState<string>(SortTypeLabel.MechQueueAsc)
    const { page, changePage, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: parseString(localStorage.getItem("quickDeployPageSize"), 5),
        page: 1,
    })

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    // Queuing cost, queue length win reward etc.
    const queueFeed = useGameServerSubscriptionFaction<QueueFeed>({
        URI: "/queue",
        key: GameServerKeys.SubQueueFeed,
    })

    useEffect(() => {
        localStorage.setItem("quickDeployPageSize", pageSize.toString())
    }, [pageSize])

    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)

            let sortDir = "asc"
            if (sort === SortTypeLabel.MechQueueDesc) sortDir = "desc"

            const resp = await send<GetAssetsResponse, GetMechsRequest>(GameServerKeys.GetMechs, {
                queue_sort: sortDir,
                page,
                page_size: pageSize,
                statuses: ["BATTLE_READY"],
                include_market_listed: false,
                exclude_damaged_mech: true,
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
    }, [send, sort, page, pageSize, setTotalItems])

    useEffect(() => {
        getItems()
    }, [getItems])

    const queueLength = queueFeed?.queue_length || 0
    const queueCost = queueFeed?.queue_cost || "0"

    return (
        <>
            <Stack sx={{ position: "relative", height: "100%", backgroundColor: theme.factionTheme.background }}>
                <Stack
                    direction="row"
                    spacing=".96rem"
                    alignItems="center"
                    sx={{
                        position: "relative",
                        pl: "2.2rem",
                        pr: "4.8rem",
                        height: `${5}rem`,
                        background: `linear-gradient(${theme.factionTheme.primary} 26%, ${theme.factionTheme.primary}95)`,
                        boxShadow: 1.5,
                    }}
                >
                    <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, color: theme.factionTheme.secondary }}>
                        QUICK DEPLOY
                    </Typography>
                </Stack>

                <Stack sx={{ flex: 1 }}>
                    <Stack spacing="1.5rem" direction="row" sx={{ p: ".5rem 1rem", backgroundColor: "#00000099" }}>
                        {queueLength >= 0 && (
                            <AmountItem
                                key={`${queueLength}-queue_length`}
                                title={"NEXT POSITION: "}
                                color="#FFFFFF"
                                value={`${queueLength + 1}`}
                                tooltip="The queue position of your war machine if you deploy now."
                                disableIcon
                            />
                        )}

                        {queueCost && (
                            <AmountItem
                                title={"FEE: "}
                                color={colors.yellow}
                                value={supFormatter(queueCost, 2)}
                                tooltip="The cost to place your war machine into the battle queue."
                            />
                        )}

                        <IconButton size="small" onClick={() => togglePreferencesModalOpen(true)}>
                            <SvgNotification size="1.3rem" />
                        </IconButton>
                    </Stack>

                    <TotalAndPageSizeOptions
                        countItems={mechs?.length}
                        pageSize={pageSize}
                        changePageSize={changePageSize}
                        changePage={changePage}
                        manualRefresh={getItems}
                        sortOptions={sortOptions}
                        selectedSort={sort}
                        onSetSort={setSort}
                    />

                    {loadError && (
                        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "20rem" }}>
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem" }}>
                                <Typography sx={{ color: colors.red, fontFamily: fonts.nostromoBold, textAlign: "center" }}>{loadError}</Typography>
                            </Stack>
                        </Stack>
                    )}

                    {isLoading && !loadError && (
                        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "20rem" }}>
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem" }}>
                                <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                            </Stack>
                        </Stack>
                    )}

                    {!isLoading && !loadError && mechs && mechs.length > 0 && (
                        <Stack sx={{ minHeight: "20rem", p: "1.1rem" }}>
                            {mechs.map((mech) => {
                                return <QuickDeployItem key={mech.id} mech={mech} queueFeed={queueFeed} />
                            })}
                        </Stack>
                    )}

                    {!isLoading && !loadError && mechs && mechs.length <= 0 && (
                        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "20rem" }}>
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        px: "1.28rem",
                                        color: colors.grey,
                                        fontFamily: fonts.nostromoBold,
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
                                mt: "auto",
                                px: "1rem",
                                py: ".7rem",
                                borderTop: `${primaryColor}70 1.5px solid`,
                                borderBottom: `${primaryColor}70 1.5px solid`,
                                backgroundColor: "#00000070",
                            }}
                        >
                            <Pagination
                                size="small"
                                count={totalPages}
                                page={page}
                                sx={{
                                    ".MuiButtonBase-root": { borderRadius: 0.8, fontFamily: fonts.nostromoBold, fontSize: "1.2rem" },
                                    ".Mui-selected": {
                                        color: secondaryColor,
                                        backgroundColor: `${primaryColor} !important`,
                                    },
                                }}
                                onChange={(e, p) => changePage(p)}
                            />
                        </Box>
                    )}
                </Stack>
            </Stack>

            {/* preferences modal */}
            {preferencesModalOpen && (
                <PreferencesModal
                    onClose={() => togglePreferencesModalOpen(false)}
                    setTelegramShortcode={setTelegramShortcode}
                    toggleAddDeviceModal={() => toggleAddDeviceModalOpen(!addDeviceModalOpen)}
                />
            )}

            {/* telegram register modal */}
            {!!telegramShortcode && <TelegramRegisterModal code={telegramShortcode} onClose={() => setTelegramShortcode("")} />}
        </>
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
        <TooltipHelper placement="bottom-start" text={tooltip}>
            <Stack direction="row" alignItems="center">
                <Typography sx={{ mr: ".4rem", fontWeight: "fontWeightBold" }}>{title}</Typography>

                {!disableIcon && <SvgSupToken size="1.7rem" fill={color} sx={{ mr: ".1rem", pb: ".2rem" }} />}

                <Typography sx={{ color: color, fontWeight: "fontWeightBold" }}>{value || "---"}</Typography>
            </Stack>
        </TooltipHelper>
    )
}
