import { Box, IconButton, Pagination, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { PASSPORT_WEB } from "../../../constants"
import { useSnackbar } from "../../../containers"
import { HangarWarMachineProvider } from "../../../containers/hangar/hangarWarMachines"
import { useTheme } from "../../../containers/theme"
import { usePagination } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { MechBasic } from "../../../types"
import { DeployModal } from "./DeployQueue/DeployModal"
import { LeaveModal } from "./LeaveQueue/LeaveModal"
import { HistoryModal } from "./MechHistory/HistoryModal"
import { RentalModal } from "./MechRental/RentalModal"
import { MechViewer } from "./MechViewer/MechViewer"
import { WarMachineHangarItem, WarMachineHangarItemLoadingSkeleton } from "./WarMachineHangarItem/WarMachineHangarItem"

interface GetMechsRequest {
    page: number
    page_size: number
}

interface GetAssetsResponse {
    mechs: MechBasic[]
    total: number
}

export const WarMachines = () => {
    return (
        <HangarWarMachineProvider>
            <WarMachinesInner />
            <DeployModal />
            <LeaveModal />
            <HistoryModal />
            <RentalModal />
        </HangarWarMachineProvider>
    )
}

const WarMachinesInner = () => {
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsUser("/user_commander")
    const theme = useTheme()
    const [mechs, setMechs] = useState<MechBasic[]>()
    const [isLoading, setIsLoading] = useState(true)
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, setPageSize } = usePagination({ pageSize: 5, page: 1 })

    // Get mechs
    useEffect(() => {
        ;(async () => {
            try {
                setIsLoading(true)
                const resp = await send<GetAssetsResponse, GetMechsRequest>(GameServerKeys.GetMechs, {
                    page,
                    page_size: pageSize,
                })

                if (!resp) return
                setMechs(resp.mechs)
                setTotalItems(resp.total)
            } catch (e) {
                newSnackbarMessage(typeof e === "string" ? e : "Failed to get war machines.", "error")
                console.debug(e)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [send, page, pageSize, setTotalItems, newSnackbarMessage])

    const content = useMemo(() => {
        if (!mechs || isLoading) {
            return (
                <Stack spacing="1.6rem" sx={{ width: "80rem", px: "1rem", py: ".8rem", height: 0 }}>
                    {new Array(5).fill(0).map((_, index) => (
                        <WarMachineHangarItemLoadingSkeleton key={index} />
                    ))}
                </Stack>
            )
        }

        if (mechs && mechs.length > 0) {
            return (
                <Stack spacing="2.4rem" sx={{ px: ".5rem", py: "1.5rem", height: 0 }}>
                    {mechs.map((mech, i) => (
                        <WarMachineHangarItem key={`hangar-mech-${mech.id}`} index={i} mech={mech} />
                    ))}
                </Stack>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "40rem" }} spacing="1rem">
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
                        {"You don't have assets in Supremacy, go to Marketplace or go to Xsyn to transfer your assets to Supremacy."}
                    </Typography>
                    <FancyButton
                        href={`${PASSPORT_WEB}profile`}
                        target="_blank"
                        excludeCaret
                        clipThingsProps={{
                            clipSize: "5px",
                            backgroundColor: theme.factionTheme.background,
                            border: { borderColor: theme.factionTheme.primary },
                            sx: { position: "relative", width: "88%" },
                        }}
                        sx={{ px: "1.8rem", py: ".5rem", color: theme.factionTheme.primary }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                textAlign: "center",
                                color: theme.factionTheme.primary,
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
                            clipSize: "5px",
                            backgroundColor: theme.factionTheme.background,
                            border: { borderColor: colors.neonPink },
                            sx: { position: "relative", width: "88%" },
                        }}
                        sx={{ px: "1.8rem", py: ".5rem", color: colors.neonPink }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                textAlign: "center",
                                color: colors.neonPink,
                                fontFamily: fonts.nostromoBold,
                            }}
                        >
                            GO TO XSYN
                        </Typography>
                    </FancyButton>
                </Stack>
            </Stack>
        )
    }, [mechs, isLoading, theme.factionTheme])

    return (
        <Stack direction="row" sx={{ height: "100%" }}>
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".3rem",
                }}
                opacity={0.7}
                backgroundColor={theme.factionTheme.background}
                sx={{ height: "100%", width: "fit-content", minWidth: "60rem" }}
            >
                <Stack sx={{ position: "relative", height: "100%" }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                            px: "1.5rem",
                            pt: ".6rem",
                            pb: ".3rem",
                            backgroundColor: "#00000070",
                            borderBottom: (theme) => `${theme.factionTheme.primary}70 1px solid`,
                            span: {
                                fontFamily: fonts.nostromoBold,
                            },
                        }}
                    >
                        <Typography variant="caption">
                            <strong>DISPLAYING:</strong> {mechs?.length || 0} of {totalItems}
                        </Typography>
                        <Stack direction="row" spacing=".3rem" alignItems="center">
                            <IconButton
                                sx={{ minWidth: "3rem" }}
                                size="small"
                                onClick={() => {
                                    setPageSize(5)
                                    changePage(1)
                                }}
                            >
                                <Typography variant="caption" sx={{ opacity: pageSize === 5 ? 1 : 0.3 }}>
                                    5
                                </Typography>
                            </IconButton>
                            <IconButton
                                sx={{ minWidth: "3rem" }}
                                size="small"
                                onClick={() => {
                                    setPageSize(10)
                                    changePage(1)
                                }}
                            >
                                <Typography variant="caption" sx={{ opacity: pageSize === 10 ? 1 : 0.3 }}>
                                    10
                                </Typography>
                            </IconButton>
                            <IconButton
                                sx={{ minWidth: "3rem" }}
                                size="small"
                                onClick={() => {
                                    setPageSize(15)
                                    changePage(1)
                                }}
                            >
                                <Typography variant="caption" sx={{ opacity: pageSize === 15 ? 1 : 0.3 }}>
                                    15
                                </Typography>
                            </IconButton>
                        </Stack>
                    </Stack>

                    <Box
                        sx={{
                            my: ".8rem",
                            ml: ".8rem",
                            mr: ".4rem",
                            pr: ".4rem",
                            flex: 1,
                            overflowY: "auto",
                            overflowX: "hidden",
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
                                background: theme.factionTheme.primary,
                                borderRadius: 3,
                            },
                        }}
                    >
                        {content}
                    </Box>

                    {mechs && (
                        <Box
                            sx={{
                                px: "1rem",
                                py: ".5rem",
                                borderTop: (theme) => `${theme.factionTheme.primary}70 1px solid`,
                                backgroundColor: "#00000070",
                            }}
                        >
                            <Pagination
                                size="medium"
                                count={totalPages}
                                page={page}
                                sx={{
                                    ".MuiButtonBase-root": { fontFamily: fonts.nostromoBold },
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

            <MechViewer />
        </Stack>
    )
}
