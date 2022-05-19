import { Box, useTheme, Theme, Stack, Typography, IconButton, Pagination, CircularProgress } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { PASSPORT_WEB } from "../../../constants"
import { useSnackbar } from "../../../containers"
import { usePagination } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { MechBasic } from "../../../types"
import { WarMachineHangarItem } from "./WarMachineHangarItem"

interface GetMechsRequest {
    page: number
    page_size: number
}

interface GetAssetsResponse {
    mechs: MechBasic[]
    total: number
}

export const WarMachines = () => {
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsUser("/user_commander")
    const theme = useTheme<Theme>()
    const [mechs, setMechs] = useState<MechBasic[]>()
    const [isLoading, setIsLoading] = useState(true)
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, setPageSize } = usePagination({ pageSize: 12, page: 1 })

    // Get mechs
    useEffect(() => {
        ;(async () => {
            try {
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
        if (isLoading || !mechs) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <CircularProgress size="2.2rem" sx={{ color: colors.neonBlue }} />
                </Stack>
            )
        }

        if (mechs && mechs.length > 0) {
            return (
                <Stack spacing="2.4rem" sx={{ px: ".5rem", py: "1.5rem", height: 0 }}>
                    {mechs.map((mech) => (
                        <WarMachineHangarItem key={`hangar-mech-${mech.id}`} mech={mech} />
                    ))}
                </Stack>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }} spacing=".5rem">
                <Typography
                    sx={{
                        px: "1.28rem",
                        pt: "1.28rem",
                        mb: ".56rem",
                        color: colors.grey,
                        fontFamily: fonts.nostromoBold,
                        userSelect: "text !important",
                        opacity: 0.8,
                    }}
                >
                    {"You don't own any mechs yet."}
                </Typography>
                <FancyButton
                    href={`${PASSPORT_WEB}stores`}
                    target="_blank"
                    excludeCaret
                    clipThingsProps={{
                        clipSize: "5px",
                        backgroundColor: theme.factionTheme.background,
                        border: { isFancy: true, borderColor: theme.factionTheme.primary },
                        sx: { position: "relative" },
                    }}
                    sx={{ px: "1.8rem", py: ".5rem", color: theme.factionTheme.primary }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: theme.factionTheme.primary,
                            fontFamily: fonts.nostromoBold,
                        }}
                    >
                        GO TO ASSET STORE
                    </Typography>
                </FancyButton>
            </Stack>
        )
    }, [isLoading, mechs, theme.factionTheme])

    return (
        <>
            <Stack sx={{ height: "100%" }}>
                <ClipThing
                    clipSize="10px"
                    border={{
                        isFancy: true,
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".15rem",
                    }}
                    opacity={0.7}
                    backgroundColor={theme.factionTheme.background}
                    sx={{ height: "100%", width: "fit-content", minWidth: "60rem" }}
                >
                    <Stack sx={{ height: "100%" }}>
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
                            <Stack direction="row" alignItems="center">
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setPageSize(12)
                                        changePage(1)
                                    }}
                                >
                                    <Typography variant="caption" sx={{ opacity: pageSize === 12 ? 1 : 0.3 }}>
                                        12
                                    </Typography>
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setPageSize(24)
                                        changePage(1)
                                    }}
                                >
                                    <Typography variant="caption" sx={{ opacity: pageSize === 24 ? 1 : 0.3 }}>
                                        24
                                    </Typography>
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setPageSize(36)
                                        changePage(1)
                                    }}
                                >
                                    <Typography variant="caption" sx={{ opacity: pageSize === 36 ? 1 : 0.3 }}>
                                        36
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

                        {mechs && totalPages > 1 && (
                            <Box sx={{ px: "1rem", py: ".5rem", backgroundColor: "#00000050" }}>
                                <Pagination size="small" count={totalPages} page={page} onChange={(e, p) => changePage(p)} showFirstButton showLastButton />
                            </Box>
                        )}
                    </Stack>
                </ClipThing>
            </Stack>

            {/* <TelegramShortcodeModal code={telegramShortcode} onClose={() => setTelegramShortcode("")} open={!!telegramShortcode} />

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
            )} */}
        </>
    )
}
