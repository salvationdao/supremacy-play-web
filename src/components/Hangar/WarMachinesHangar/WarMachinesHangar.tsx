import { Box, Pagination, Stack, Typography } from "@mui/material"
import React, { useEffect, useMemo, useState } from "react"
import { useHistory } from "react-router"
import { ClipThing, FancyButton } from "../.."
import { PASSPORT_WEB } from "../../../constants"
import { useSnackbar } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { usePagination } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { MechBasic, MechDetails } from "../../../types"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { DeployModal } from "./DeployQueue/DeployModal"
import { LeaveModal } from "./LeaveQueue/LeaveModal"
import { HistoryModal } from "./MechHistory/HistoryModal"
import { RentalModal } from "./MechRental/RentalModal"
import { SellModal } from "./MechSell/SellModal"
import { MechViewer } from "./MechViewer/MechViewer"
import { WarMachineHangarItem, WarMachineHangarItemLoadingSkeleton } from "./WarMachineHangarItem/WarMachineHangarItem"

interface GetMechsRequest {
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
    const [sellMechModalOpen, setSellMechModalOpen] = useState<boolean>(false)

    return (
        <>
            <WarMachinesHangarInner
                selectedMechDetails={selectedMechDetails}
                setSelectedMechDetails={setSelectedMechDetails}
                setDeployMechModalOpen={setDeployMechModalOpen}
                setLeaveMechModalOpen={setLeaveMechModalOpen}
                setHistoryMechModalOpen={setHistoryMechModalOpen}
                setRentalMechModalOpen={setRentalMechModalOpen}
                setSellMechModalOpen={setSellMechModalOpen}
            />
            {selectedMechDetails && (
                <DeployModal
                    selectedMechDetails={selectedMechDetails}
                    deployMechModalOpen={deployMechModalOpen}
                    setDeployMechModalOpen={setDeployMechModalOpen}
                />
            )}
            {selectedMechDetails && (
                <LeaveModal selectedMechDetails={selectedMechDetails} leaveMechModalOpen={leaveMechModalOpen} setLeaveMechModalOpen={setLeaveMechModalOpen} />
            )}
            {selectedMechDetails && (
                <HistoryModal
                    selectedMechDetails={selectedMechDetails}
                    historyMechModalOpen={historyMechModalOpen}
                    setHistoryMechModalOpen={setHistoryMechModalOpen}
                />
            )}
            {selectedMechDetails && (
                <RentalModal
                    selectedMechDetails={selectedMechDetails}
                    rentalMechModalOpen={rentalMechModalOpen}
                    setRentalMechModalOpen={setRentalMechModalOpen}
                />
            )}
            {selectedMechDetails && (
                <SellModal selectedMechDetails={selectedMechDetails} sellMechModalOpen={sellMechModalOpen} setSellMechModalOpen={setSellMechModalOpen} />
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
    setSellMechModalOpen,
}: {
    selectedMechDetails?: MechDetails
    setSelectedMechDetails: React.Dispatch<React.SetStateAction<MechDetails | undefined>>
    setDeployMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setLeaveMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setHistoryMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setRentalMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setSellMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const history = useHistory()
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsUser("/user_commander")
    const theme = useTheme()
    const [mechs, setMechs] = useState<MechBasic[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, setPageSize } = usePagination({ pageSize: 5, page: 1 })

    // Get mechs
    useEffect(() => {
        ;(async () => {
            try {
                setIsLoading(true)
                const resp = await send<GetAssetsResponse, GetMechsRequest>(GameServerKeys.GetMechs, {
                    page,
                    page_size: pageSize,
                    include_market_listed: true,
                })

                if (!resp) return
                setLoadError(undefined)
                setMechs(resp.mechs)
                setTotalItems(resp.total)
            } catch (e) {
                setLoadError(typeof e === "string" ? e : "Failed to get war machines.")
                newSnackbarMessage(typeof e === "string" ? e : "Failed to get war machines.", "error")
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [send, page, pageSize, setTotalItems, newSnackbarMessage])

    const content = useMemo(() => {
        return (
            <Box sx={{ direction: "ltr", height: 0 }}>
                <Stack spacing="2.4rem" sx={{ px: ".5rem", py: "1.5rem" }}>
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
                            setSellMechModalOpen={setSellMechModalOpen}
                        />
                    ))}
                </Stack>
            </Box>
        )
    }, [
        mechs,
        selectedMechDetails,
        setSelectedMechDetails,
        setDeployMechModalOpen,
        setLeaveMechModalOpen,
        setHistoryMechModalOpen,
        setRentalMechModalOpen,
        setSellMechModalOpen,
    ])

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
                        setPageSize={setPageSize}
                        changePage={changePage}
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
                            <Stack spacing="1.6rem" sx={{ width: "100%", px: "1rem", py: ".8rem", height: 0 }}>
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
                                        onClick={() => history.push("/marketplace/war-machines")}
                                        excludeCaret
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
                                        excludeCaret
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
