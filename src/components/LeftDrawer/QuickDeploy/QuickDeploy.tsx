import { Box, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { FancyButton } from "../.."
import { useAuth } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { parseString } from "../../../helpers"
import { usePagination } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { SortTypeLabel } from "../../../types/marketplace"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { ChallengeFundsRemain } from "./ChallengeFundsRemain"
import { QueueDetails } from "./QueueDetails"
import { useBattleLobby } from "../../../containers/battleLobby"
import { NewQuickDeployItem } from "./NewQuickDeployItem"

const sortOptions = [
    { label: SortTypeLabel.MechQueueAsc, value: SortTypeLabel.MechQueueAsc },
    { label: SortTypeLabel.MechQueueDesc, value: SortTypeLabel.MechQueueDesc },
]

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
    const { mechsWithQueueStatus } = useBattleLobby()

    // Bulk action
    // const [bulkDeployConfirmModalOpen, setBulkDeployConfirmModalOpen] = useState(false)
    // const childrenMechStatus = useRef<{ [mechID: string]: MechStatus }>({})

    const [sort, setSort] = useState<string>(SortTypeLabel.MechQueueAsc)
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: parseString(localStorage.getItem("quickDeployPageSize2"), 10),
        page: 1,
    })

    const canDeployMechs = useMemo(() => {
        const list = mechsWithQueueStatus.filter((mq) => mq.can_deploy)
        setTotalItems(list.length)
        return list
    }, [mechsWithQueueStatus, setTotalItems])

    const [selectedMechIDs, setSelectedMechIDs] = useState<string[]>([])

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    useEffect(() => {
        localStorage.setItem("quickDeployPageSize2", pageSize.toString())
    }, [pageSize])

    const onSelectAll = useCallback(() => {
        setSelectedMechIDs(canDeployMechs.map((m) => m.id))
    }, [canDeployMechs])

    const onUnSelectAll = useCallback(() => {
        setSelectedMechIDs([])
    }, [])

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
                        countItems={canDeployMechs.length}
                        totalItems={totalItems}
                        sortOptions={sortOptions}
                        selectedSort={sort}
                        onSetSort={setSort}
                    />

                    <TotalAndPageSizeOptions
                        countItems={canDeployMechs.length}
                        pageSize={pageSize}
                        changePageSize={changePageSize}
                        changePage={changePage}
                        pageSizeOptions={[10, 20, 40]}
                        selectedCount={selectedMechIDs.length}
                        onSelectAll={onSelectAll}
                        onUnselectedAll={onUnSelectAll}
                    >
                        <FancyButton
                            disabled={selectedMechIDs.length <= 0}
                            clipThingsProps={{
                                clipSize: "6px",
                                backgroundColor: colors.green,
                                opacity: 1,
                                border: { borderColor: colors.green, borderThickness: "1px" },
                                sx: { position: "relative" },
                            }}
                            sx={{ px: "1rem", py: 0, color: "#FFFFFF" }}
                            // onClick={() => setBulkDeployConfirmModalOpen(true)}
                        >
                            <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                                DEPLOY SELECTED
                            </Typography>
                        </FancyButton>
                    </TotalAndPageSizeOptions>

                    <Box sx={{ px: "1rem", mt: "1.5rem", backgroundColor: "#00000099" }}>
                        <QueueDetails />
                    </Box>

                    {canDeployMechs && canDeployMechs.length > 0 && (
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
                                    {canDeployMechs.map((mech) => {
                                        return (
                                            <NewQuickDeployItem
                                                key={mech.id}
                                                isSelected={selectedMechIDs.includes(mech.id)}
                                                toggleIsSelected={() => {
                                                    setSelectedMechIDs((prev) => {
                                                        // remove, if exists
                                                        if (prev.includes(mech.id)) {
                                                            return prev.filter((id) => id !== mech.id)
                                                        }

                                                        // otherwise, append
                                                        return prev.concat(mech.id)
                                                    })
                                                }}
                                                mech={mech}
                                            />
                                        )
                                    })}
                                </Stack>
                            </Box>
                        </Box>
                    )}

                    {canDeployMechs && canDeployMechs.length <= 0 && (
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

            {/* all the mech queue from the lobby, bulk deploy may no longer needed */}
            {/*{bulkDeployConfirmModalOpen && (*/}
            {/*    <BulkDeployConfirmModal*/}
            {/*        setBulkDeployConfirmModalOpen={setBulkDeployConfirmModalOpen}*/}
            {/*        selectedMechs={selectedMechs}*/}
            {/*        setSelectedMechs={setSelectedMechs}*/}
            {/*        childrenMechStatus={childrenMechStatus}*/}
            {/*    />*/}
            {/*)}*/}
        </>
    )
}
