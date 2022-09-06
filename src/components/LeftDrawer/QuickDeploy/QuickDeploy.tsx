import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useRef, useState } from "react"
import { FancyButton } from "../.."
import { useAuth } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { parseString } from "../../../helpers"
import { usePagination } from "../../../hooks"
import { useGameServerCommandsUser, useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { MechBasic, MechBasicWithQueueStatus, MechStatus } from "../../../types"
import { SortTypeLabel } from "../../../types/marketplace"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { BulkDeployConfirmModal } from "../../Hangar/WarMachinesHangar/Common/BulkDeployConfirmModal"
import { QueueFeed } from "../../Hangar/WarMachinesHangar/WarMachineDetails/Modals/DeployModal"
import { ChallengeFundsRemain } from "./ChallengeFundsRemain"
import { QueueDetails } from "./QueueDetails"
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
    mechs: MechBasicWithQueueStatus[]
    total: number
}

export interface PlayerQueueStatus {
    total_queued: number
    queue_limit: number
}

export const QuickDeploy = () => {
    const { userID } = useAuth()
    if (!userID) return null
    return <QuickDeployInner />
}

const QuickDeployInner = () => {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")

    // Player Queue Status
    const [playerQueueStatus, setPlayerQueueStatus] = useState<PlayerQueueStatus>()

    // Mechs
    const [mechs, setMechs] = useState<MechBasicWithQueueStatus[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()

    // Bulk action
    const [selectedMechs, setSelectedMechs] = useState<MechBasic[]>([])
    const [bulkDeployConfirmModalOpen, setBulkDeployConfirmModalOpen] = useState(false)
    const childrenMechStatus = useRef<{ [mechID: string]: MechStatus }>({})

    const [sort, setSort] = useState<string>(SortTypeLabel.MechQueueAsc)
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: parseString(localStorage.getItem("quickDeployPageSize2"), 10),
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
        localStorage.setItem("quickDeployPageSize2", pageSize.toString())
    }, [pageSize])

    const toggleSelected = useCallback((mech: MechBasic) => {
        setSelectedMechs((prev) => {
            const newArray = [...prev]
            const isAlreadySelected = prev.findIndex((s) => s.id === mech.id)
            if (isAlreadySelected >= 0) {
                newArray.splice(isAlreadySelected, 1)
            } else {
                newArray.push(mech)
            }

            return newArray
        })
    }, [])

    const onSelectAll = useCallback(() => {
        setSelectedMechs(mechs)
    }, [mechs])

    const onUnSelectAll = useCallback(() => {
        setSelectedMechs([])
    }, [])

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

            const resp2 = await send<PlayerQueueStatus>(GameServerKeys.PlayerQueueStatus)
            console.log(resp2)
            setPlayerQueueStatus(resp2)

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

    return (
        <>
            <Stack sx={{ position: "relative", height: "100%", backgroundColor: theme.factionTheme.background }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                        flexShrink: 0,
                        px: "2.2rem",
                        height: "5rem",
                        background: `linear-gradient(${theme.factionTheme.primary} 26%, ${theme.factionTheme.primary}95)`,
                        boxShadow: 1.5,
                    }}
                >
                    <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, color: theme.factionTheme.secondary }}>
                        QUICK DEPLOY
                    </Typography>
                </Stack>

                <Stack sx={{ flex: 1 }}>
                    <ChallengeFundsRemain />

                    <TotalAndPageSizeOptions
                        countItems={mechs?.length}
                        totalItems={totalItems}
                        sortOptions={sortOptions}
                        selectedSort={sort}
                        onSetSort={setSort}
                    />

                    <TotalAndPageSizeOptions
                        countItems={mechs?.length}
                        pageSize={pageSize}
                        changePageSize={changePageSize}
                        changePage={changePage}
                        pageSizeOptions={[10, 20, 40]}
                        selectedCount={selectedMechs.length}
                        onSelectAll={onSelectAll}
                        onUnselectedAll={onUnSelectAll}
                        manualRefresh={getItems}
                    >
                        <FancyButton
                            disabled={selectedMechs.length <= 0}
                            clipThingsProps={{
                                clipSize: "6px",
                                backgroundColor: colors.green,
                                opacity: 1,
                                border: { borderColor: colors.green, borderThickness: "1px" },
                                sx: { position: "relative" },
                            }}
                            sx={{ px: "1rem", py: 0, color: "#FFFFFF" }}
                            onClick={() => setBulkDeployConfirmModalOpen(true)}
                        >
                            <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                                DEPLOY SELECTED
                            </Typography>
                        </FancyButton>
                    </TotalAndPageSizeOptions>

                    <Box sx={{ px: "1rem", mt: "1.5rem", backgroundColor: "#00000099" }}>
                        <QueueDetails queueFeed={queueFeed} playerQueueStatus={playerQueueStatus} />
                    </Box>

                    {loadError && (
                        <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem" }}>
                                <Typography sx={{ color: colors.red, fontFamily: fonts.nostromoBold, textAlign: "center" }}>{loadError}</Typography>
                            </Stack>
                        </Stack>
                    )}

                    {isLoading && !loadError && (
                        <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem" }}>
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
                                my: ".8rem",
                                mr: ".7rem",
                                pr: ".7rem",
                                pl: "1.4rem",
                                direction: "ltr",
                                scrollbarWidth: "none",
                                "::-webkit-scrollbar": {
                                    width: "1rem",
                                },
                                "::-webkit-scrollbar-track": {
                                    background: "#FFFFFF15",
                                },
                                "::-webkit-scrollbar-thumb": {
                                    background: (theme) => theme.factionTheme.primary,
                                },
                            }}
                        >
                            <Box sx={{ direction: "ltr", height: 0 }}>
                                <Stack spacing=".3rem" sx={{ height: "100%" }}>
                                    {mechs.map((mech) => {
                                        const isSelected = selectedMechs.findIndex((s) => s.id === mech.id) >= 0
                                        return (
                                            <QuickDeployItem
                                                key={mech.id}
                                                isSelected={isSelected}
                                                toggleIsSelected={() => {
                                                    toggleSelected(mech)
                                                }}
                                                childrenMechStatus={childrenMechStatus}
                                                mech={mech}
                                            />
                                        )
                                    })}
                                </Stack>
                            </Box>
                        </Box>
                    )}

                    {!isLoading && !loadError && mechs && mechs.length <= 0 && (
                        <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
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
                                    {`You don't have any battle-ready war machines.`}
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

            {bulkDeployConfirmModalOpen && (
                <BulkDeployConfirmModal
                    setBulkDeployConfirmModalOpen={setBulkDeployConfirmModalOpen}
                    selectedMechs={selectedMechs}
                    setSelectedMechs={setSelectedMechs}
                    childrenMechStatus={childrenMechStatus}
                    queueFeed={queueFeed}
                />
            )}
        </>
    )
}
