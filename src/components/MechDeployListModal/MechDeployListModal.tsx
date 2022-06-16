import { Box, CircularProgress, IconButton, Modal, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import Draggable, { DraggableData, DraggableEvent } from "react-draggable"
import { ClipThing, DeployModal } from ".."
import { SvgClose } from "../../assets"
import { useDimension } from "../../containers"
import { useTheme } from "../../containers/theme"
import { usePagination } from "../../hooks"
import { useGameServerCommandsUser } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { MechBasic, MechDetails } from "../../types"
import { PageHeader } from "../Common/PageHeader"
import { TotalAndPageSizeOptions } from "../Common/TotalAndPageSizeOptions"
import { LeaveModal } from "../Hangar/WarMachinesHangar/LeaveQueue/LeaveModal"
import { MechDeployListItem } from "./MechDeployListItem"

interface GetMechsRequest {
    page: number
    page_size: number
    include_market_listed: boolean
}

interface GetAssetsResponse {
    mechs: MechBasic[]
    total: number
}

export const MechDeployListModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [selectedMechDetails, setSelectedMechDetails] = useState<MechDetails>()
    const [deployMechModalOpen, setDeployMechModalOpen] = useState<boolean>(false)
    const [leaveMechModalOpen, setLeaveMechModalOpen] = useState<boolean>(false)

    // Dragging
    const {
        gameUIDimensions: { width, height },
    } = useDimension()
    const [curPosX, setCurPosX] = useState(65)
    const [curPosY, setCurPosY] = useState(80)

    // When dragging stops, just set the position and save to local storage
    // The bounds in the  Draggable component already limits it's range of motion
    const onDragStop = useCallback((e: DraggableEvent, data: DraggableData) => {
        setCurPosX(data.x)
        setCurPosY(data.y)
    }, [])

    // Mechs
    const [mechs, setMechs] = useState<MechBasic[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, setPageSize } = usePagination({ pageSize: 5, page: 1 })

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

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

    return (
        <>
            <Modal open={open} onClose={onClose} sx={{ zIndex: siteZIndex.Modal, ".MuiBackdrop-root": { backgroundColor: "#00000020" } }}>
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: siteZIndex.MoveableResizableHover,
                        filter: "drop-shadow(0 3px 3px #00000050)",
                    }}
                >
                    <Draggable
                        allowAnyClick
                        handle=".handle"
                        position={{
                            x: curPosX,
                            y: curPosY,
                        }}
                        onStop={onDragStop}
                        bounds={{
                            top: 60,
                            bottom: height - 80,
                            left: 38,
                            right: width - 80,
                        }}
                    >
                        <Box sx={{ width: "50rem", maxWidth: "calc(100vw - 18rem)" }}>
                            <ClipThing
                                clipSize="8px"
                                border={{
                                    borderColor: primaryColor,
                                    borderThickness: ".3rem",
                                }}
                                opacity={0.99}
                                sx={{ position: "relative" }}
                                backgroundColor={backgroundColor}
                            >
                                <Stack
                                    sx={{
                                        position: "relative",
                                        height: "72rem",
                                        maxHeight: "calc(100vh - 18rem)",
                                        overflow: "hidden",
                                    }}
                                >
                                    <Box className="handle" sx={{ cursor: "move" }}>
                                        <PageHeader title="QUICK DEPLOY"></PageHeader>
                                    </Box>
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
                                                pr: ".5rem",
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
                                                        return (
                                                            <MechDeployListItem
                                                                key={mech.id}
                                                                mech={mech}
                                                                setDeployMechModalOpen={setDeployMechModalOpen}
                                                                setLeaveMechModalOpen={setLeaveMechModalOpen}
                                                                setSelectedMechDetails={setSelectedMechDetails}
                                                            />
                                                        )
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
                            </ClipThing>
                        </Box>
                    </Draggable>
                </Box>
            </Modal>

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
        </>
    )
}
