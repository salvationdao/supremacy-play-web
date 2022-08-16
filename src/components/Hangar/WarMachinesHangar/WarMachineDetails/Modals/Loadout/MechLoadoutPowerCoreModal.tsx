import { Box, Divider, IconButton, Modal, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { FancyButton } from "../../../../.."
import { SvgClose } from "../../../../../../assets"
import { useTheme } from "../../../../../../containers/theme"
import { usePagination } from "../../../../../../hooks"
import { useGameServerCommandsUser, useGameServerSubscriptionFaction } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { colors, fonts, siteZIndex } from "../../../../../../theme/theme"
import { PowerCore } from "../../../../../../types"
import { ClipThing } from "../../../../../Common/ClipThing"

interface GetPowerCoresRequest {
    search: string
    sort_by: string
    sort_dir: string
    page_size: number
    page: number
    display_xsyn_locked?: boolean
    exclude_market_locked?: boolean
    include_market_listed?: boolean
    rarities: string[]
    sizes: string[]
    equipped_statuses: string[]
    stat_capacity?: GetPowerCoreStatFilter
    stat_max_draw_rate?: GetPowerCoreStatFilter
    stat_recharge_rate?: GetPowerCoreStatFilter
    stat_armour?: GetPowerCoreStatFilter
    stat_max_hitpoints?: GetPowerCoreStatFilter
}

interface GetPowerCoreStatFilter {
    min?: number
    max?: number
}

interface GetPowerCoresResponse {
    power_cores: PowerCore[]
    total: number
}

interface MechLoadoutPowerCoreModalProps {
    onClose: () => void
}

export const MechLoadoutPowerCoreModal = ({ onClose }: MechLoadoutPowerCoreModalProps) => {
    const { send } = useGameServerCommandsUser("/user_commander")
    const { page, changePage, totalPages, pageSize, setTotalItems } = usePagination({
        pageSize: 4,
        page: 1,
    })
    const [powerCores, setPowerCores] = useState<PowerCore[]>([])

    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    const getPowerCores = useCallback(async () => {
        const resp = await send<GetPowerCoresResponse, GetPowerCoresRequest>(GameServerKeys.GetPowerCores, {
            search: "",
            sort_by: "",
            sort_dir: "",
            page,
            page_size: pageSize,
            equipped_statuses: [],
            rarities: [],
            sizes: [],
        })
        setPowerCores(resp.power_cores)
        setTotalItems(resp.total)
    }, [page, pageSize, send, setTotalItems])

    useEffect(() => {
        getPowerCores()
    }, [getPowerCores])

    return (
        <Modal open onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80rem",
                    maxWidth: "90vw",
                    boxShadow: 6,
                    outline: "none",
                }}
            >
                <ClipThing
                    clipSize="10px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".3rem",
                    }}
                    backgroundColor={theme.factionTheme.background}
                    sx={{
                        position: "relative",
                        height: "50rem",
                        maxHeight: "90vh",
                    }}
                >
                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="3rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                    <Stack
                        sx={{
                            height: "100%",
                            padding: "2rem 3rem",
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                mb: "2rem",
                                fontWeight: "fontWeightBold",
                            }}
                        >
                            SELECT POWER CORE
                        </Typography>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                gap: "1rem",
                            }}
                        >
                            {powerCores.map((p) => (
                                <PowerCoreItem key={p.id} id={p.id} />
                            ))}
                        </Box>
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
                </ClipThing>
            </Box>
        </Modal>
    )
}

interface PowerCoreItemProps {
    id: string
}

const PowerCoreItem = ({ id }: PowerCoreItemProps) => {
    const [powerCoreDetails, setPowerCoreDetails] = useState<PowerCore>()
    const theme = useTheme()

    useGameServerSubscriptionFaction<PowerCore>(
        {
            URI: `/power_core/${id}/details`,
            key: GameServerKeys.GetPowerCoreDetails,
        },
        (payload) => {
            if (!payload) return
            setPowerCoreDetails(payload)
        },
    )

    return (
        <FancyButton
            clipThingsProps={{
                border: {
                    borderColor: theme.factionTheme.primary,
                },
                backgroundColor: theme.factionTheme.background,
            }}
            sx={{
                padding: "1rem",
            }}
        >
            <Stack direction="row">
                <Box sx={{ width: "10rem" }}>
                    <Box
                        sx={{
                            position: "relative",
                            height: "9rem",
                            width: "100%",
                        }}
                    >
                        <Box
                            component="img"
                            src={powerCoreDetails?.image_url}
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                            }}
                        />
                    </Box>

                    <Typography
                        variant="body2"
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        {powerCoreDetails?.label}
                    </Typography>
                </Box>
                <Divider orientation="vertical" />
                <Stack>
                    <Typography
                        variant="caption"
                        sx={{
                            color: colors.lightGrey,
                            fontSize: "1rem",
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        MAX DRAW RATE
                    </Typography>
                </Stack>
            </Stack>
        </FancyButton>
    )
}
