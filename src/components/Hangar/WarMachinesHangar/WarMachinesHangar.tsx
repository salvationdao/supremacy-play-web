import { Box, Pagination, Stack, Typography } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { ClipThing, FancyButton } from "../.."
import { PASSPORT_WEB } from "../../../constants"
import { useTheme } from "../../../containers/theme"
import { parseString } from "../../../helpers"
import { usePagination, useUrlQuery } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { MechBasic, MechDetails } from "../../../types"
import { SortType } from "../../../types/marketplace"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { DeployModal } from "./DeployQueue/DeployModal"
import { LeaveModal } from "./LeaveQueue/LeaveModal"
import { HistoryModal } from "./MechHistory/HistoryModal"
import { RentalModal } from "./MechRental/RentalModal"
import { MechViewer } from "./MechViewer/MechViewer"
import { WarMachineHangarItem, WarMachineHangarItemLoadingSkeleton } from "./WarMachineHangarItem/WarMachineHangarItem"

const sortOptions = [
    { label: SortType.MechQueueAsc, value: SortType.MechQueueAsc },
    { label: SortType.MechQueueDesc, value: SortType.MechQueueDesc },
]

interface GetMechsRequest {
    queue_sort: string
    page: number
    page_size: number
    include_market_listed: boolean
}

interface GetAssetsResponse {
    mechs: MechBasic[]
    total: number
}

export const WarMachinesHangar = () => {
    const [selectedMechDetails, setSelectedMechDetails] = useState<MechDetails>()
    const [deployMechModalOpen, setDeployMechModalOpen] = useState<boolean>(false)
    const [leaveMechModalOpen, setLeaveMechModalOpen] = useState<boolean>(false)
    const [historyMechModalOpen, setHistoryMechModalOpen] = useState<boolean>(false)
    const [rentalMechModalOpen, setRentalMechModalOpen] = useState<boolean>(false)

    return (
        <>
            <WarMachinesHangarInner
                selectedMechDetails={selectedMechDetails}
                setSelectedMechDetails={setSelectedMechDetails}
                setDeployMechModalOpen={setDeployMechModalOpen}
                setLeaveMechModalOpen={setLeaveMechModalOpen}
                setHistoryMechModalOpen={setHistoryMechModalOpen}
                setRentalMechModalOpen={setRentalMechModalOpen}
            />
            {selectedMechDetails && deployMechModalOpen && (
                <DeployModal
                    selectedMechDetails={selectedMechDetails}
                    deployMechModalOpen={deployMechModalOpen}
                    setDeployMechModalOpen={setDeployMechModalOpen}
                />
            )}
            {selectedMechDetails && leaveMechModalOpen && (
                <LeaveModal selectedMechDetails={selectedMechDetails} leaveMechModalOpen={leaveMechModalOpen} setLeaveMechModalOpen={setLeaveMechModalOpen} />
            )}
            {selectedMechDetails && historyMechModalOpen && (
                <HistoryModal
                    selectedMechDetails={selectedMechDetails}
                    historyMechModalOpen={historyMechModalOpen}
                    setHistoryMechModalOpen={setHistoryMechModalOpen}
                />
            )}
            {selectedMechDetails && rentalMechModalOpen && (
                <RentalModal
                    selectedMechDetails={selectedMechDetails}
                    rentalMechModalOpen={rentalMechModalOpen}
                    setRentalMechModalOpen={setRentalMechModalOpen}
                />
            )}
        </>
    )
}

const WarMachinesHangarInner = ({
    selectedMechDetails,
    setSelectedMechDetails,
    setDeployMechModalOpen,
    setLeaveMechModalOpen,
    setHistoryMechModalOpen,
    setRentalMechModalOpen,
}: {
    selectedMechDetails?: MechDetails
    setSelectedMechDetails: React.Dispatch<React.SetStateAction<MechDetails | undefined>>
    setDeployMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setLeaveMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setHistoryMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setRentalMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const location = useLocation()
    const [query, updateQuery] = useUrlQuery()
    const { send } = useGameServerCommandsUser("/user_commander")
    const theme = useTheme()
    const [mechs, setMechs] = useState<MechBasic[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()

    const [sort, setSort] = useState<string>(query.get("sort") || SortType.MechQueueAsc)
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 5),
        page: parseString(query.get("page"), 1),
    })

    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)

            let sortDir = "asc"
            if (sort === SortType.MechQueueDesc) sortDir = "desc"

            const resp = await send<GetAssetsResponse, GetMechsRequest>(GameServerKeys.GetMechs, {
                queue_sort: sortDir,
                page,
                page_size: pageSize,
                include_market_listed: true,
            })

            updateQuery({
                sort,
                page: page.toString(),
                pageSize: pageSize.toString(),
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
    }, [send, page, pageSize, updateQuery, sort, setTotalItems])

    useEffect(() => {
        getItems()
    }, [getItems])

    const content = useMemo(() => {
        return (
            <Box sx={{ direction: "ltr", height: 0 }}>
                <Stack spacing="2rem" sx={{ px: "1rem", py: "1.5rem" }}>
                    {mechs.map((mech, i) => (
                        <WarMachineHangarItem
                            key={`hangar-mech-${mech.id}`}
                            index={i}
                            mech={mech}
                            isSelected={mech.id === selectedMechDetails?.id}
                            setSelectedMechDetails={setSelectedMechDetails}
                            setDeployMechModalOpen={setDeployMechModalOpen}
                            setLeaveMechModalOpen={setLeaveMechModalOpen}
                            setHistoryMechModalOpen={setHistoryMechModalOpen}
                            setRentalMechModalOpen={setRentalMechModalOpen}
                        />
                    ))}
                </Stack>
            </Box>
        )
    }, [mechs, selectedMechDetails, setSelectedMechDetails, setDeployMechModalOpen, setLeaveMechModalOpen, setHistoryMechModalOpen, setRentalMechModalOpen])

    return (
        <Stack direction="row" sx={{ height: "100%" }}>
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".3rem",
                }}
                corners={{
                    topRight: true,
                    bottomLeft: true,
                    bottomRight: true,
                }}
                opacity={0.7}
                backgroundColor={theme.factionTheme.background}
                sx={{ height: "100%", width: "fit-content", minWidth: "80rem" }}
            >
                <Stack sx={{ position: "relative", height: "100%" }}>
                    <TotalAndPageSizeOptions
                        countItems={mechs?.length}
                        totalItems={totalItems}
                        pageSize={pageSize}
                        changePageSize={changePageSize}
                        changePage={changePage}
                        manualRefresh={getItems}
                        sortOptions={sortOptions}
                        selectedSort={sort}
                        onSetSort={setSort}
                    />

                    <Box
                        sx={{
                            ml: "1.2rem",
                            mr: ".7rem",
                            pr: ".5rem",
                            my: "1rem",
                            flex: 1,
                            overflowY: "auto",
                            overflowX: "hidden",
                            direction: "ltr",

                            "::-webkit-scrollbar": {
                                width: ".4rem",
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#FFFFFF15",
                                borderRadius: 3,
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: theme.factionTheme.primary,
                                borderRadius: 3,
                            },
                        }}
                    >
                        {loadError && (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                <Stack
                                    alignItems="center"
                                    justifyContent="center"
                                    sx={{ height: "100%", maxWidth: "100%", width: "75rem", px: "3rem", pt: "1.28rem" }}
                                    spacing="1.5rem"
                                >
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

                        {isLoading && (
                            <Stack spacing="2rem" sx={{ width: "100%", px: "1rem", py: ".8rem", height: 0 }}>
                                {new Array(5).fill(0).map((_, index) => (
                                    <WarMachineHangarItemLoadingSkeleton key={index} />
                                ))}
                            </Stack>
                        )}

                        {!isLoading && mechs.length <= 0 && (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                <Stack
                                    alignItems="center"
                                    justifyContent="center"
                                    sx={{ height: "100%", maxWidth: "100%", width: "75rem", px: "3rem", pt: "1.28rem" }}
                                    spacing="1.5rem"
                                >
                                    <Typography
                                        sx={{
                                            color: colors.grey,
                                            fontFamily: fonts.nostromoBold,
                                            userSelect: "text !important",
                                            opacity: 0.9,
                                            textAlign: "center",
                                        }}
                                    >
                                        {"You don't have any war machines, go to the Marketplace or go to Xsyn to transfer your assets to Supremacy."}
                                    </Typography>
                                    <FancyButton
                                        to={`/marketplace/war-machines${location.hash}`}
                                        clipThingsProps={{
                                            clipSize: "9px",
                                            backgroundColor: theme.factionTheme.primary,
                                            border: { isFancy: true, borderColor: theme.factionTheme.primary },
                                            sx: { position: "relative", width: "50%" },
                                        }}
                                        sx={{ px: "1.8rem", py: ".8rem", color: theme.factionTheme.secondary }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                textAlign: "center",
                                                color: theme.factionTheme.secondary,
                                                fontFamily: fonts.nostromoBold,
                                            }}
                                        >
                                            GO TO MARKETPLACE
                                        </Typography>
                                    </FancyButton>
                                    <FancyButton
                                        href={`${PASSPORT_WEB}profile`}
                                        target="_blank"
                                        clipThingsProps={{
                                            clipSize: "9px",
                                            backgroundColor: colors.neonPink,
                                            border: { isFancy: true, borderColor: colors.neonPink },
                                            sx: { position: "relative", width: "50%" },
                                        }}
                                        sx={{ px: "1.8rem", py: ".8rem", color: "#FFFFFF" }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                textAlign: "center",
                                                color: "#FFFFFF",
                                                fontFamily: fonts.nostromoBold,
                                            }}
                                        >
                                            GO TO XSYN
                                        </Typography>
                                    </FancyButton>
                                </Stack>
                            </Stack>
                        )}

                        {!loadError && !isLoading && mechs.length > 0 && content}
                    </Box>

                    {totalPages > 1 && (
                        <Box
                            sx={{
                                px: "1rem",
                                py: ".7rem",
                                borderTop: (theme) => `${theme.factionTheme.primary}70 1.5px solid`,
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
                                        color: (theme) => theme.factionTheme.secondary,
                                        backgroundColor: `${theme.factionTheme.primary} !important`,
                                    },
                                }}
                                onChange={(e, p) => changePage(p)}
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    )}
                </Stack>
            </ClipThing>

            {selectedMechDetails && <MechViewer selectedMechDetails={selectedMechDetails} />}
        </Stack>
    )
}
