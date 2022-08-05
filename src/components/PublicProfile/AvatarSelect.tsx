import { Avatar, Box, Button, CircularProgress, Modal, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { EmptyWarMachinesPNG, SvgClose, SvgEdit } from "../../assets"
import { parseString } from "../../helpers"
import { usePagination, useUrlQuery } from "../../hooks"
import { useGameServerCommandsUser } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { FactionName } from "../../types"
import { ClipThing } from "../Common/ClipThing"
import { ConfirmModal } from "../Common/ConfirmModal"
import { FancyButton } from "../Common/FancyButton"
import { PageHeader } from "../Common/PageHeader"
import { ChipFilter, ChipFilterSection } from "../Common/SortAndFilters/ChipFilterSection"
import { TotalAndPageSizeOptions } from "../Common/TotalAndPageSizeOptions"
import { CustomAvatar, CustomAvatarItem } from "./CustomAvatar"

interface GetAvatarsRequest {
    queue_sort: string
    page: number
    page_size: number
}
interface GetAvatarsResponse {
    avatars: ProfileAvatar[]
    total: number
}
interface GetCustomAvatarsResponse {
    ids: string[]
    total: number
}
interface ProfileAvatar {
    id: string
    avatar_url: string
    tier: string
    is_custom: boolean
}
interface ProfileAvatarProps {
    playerID: string
    avatarID: string
    isCustom: boolean
    isOwner: boolean
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    avatarURL: string
    factionName?: string
    updateAvatar: (avatarID: string, isCustom: boolean) => Promise<void>
    deleteCustomAvatar: (avatarID: string) => Promise<void>
}

export enum AvatarListFilter {
    Custom = "CUSTOM",
    Default = "DEFAULT",
}

export const ProfileAvatar = ({
    isOwner,
    primaryColor,
    backgroundColor,
    avatarURL,
    updateAvatar,
    deleteCustomAvatar,
    factionName,
    playerID,
    avatarID,
    isCustom,
    secondaryColor,
}: ProfileAvatarProps) => {
    const [query] = useUrlQuery()
    const { send } = useGameServerCommandsUser("/user_commander")

    const [modalOpen, setModalOpen] = useState(false)

    // default avatars
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [avatars, setAvatars] = useState<ProfileAvatar[]>([])
    const [submitting, setSubmitting] = useState(false)

    // custom avatars
    const [showCustom, setShowCustom] = useState(false)
    const [customAvatarModalOpen, setCustomAvatarModalOpen] = useState(false)
    const [customAvatarDeleteModalOpen, setCustomAvatarDeleteModalOpen] = useState(false)
    const [selectedCustomAvatarID, setSelectedCustomAvatarID] = useState<string>()

    const [customAvatarIDs, setCustomAvatarIDs] = useState<string[]>([])

    const { page, changePage, setTotalItems, totalPages, pageSize, totalItems, changePageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })

    // Filters
    const statusFilterSection = useRef<ChipFilter>({
        label: "Filter",
        options: [{ value: AvatarListFilter.Custom, label: AvatarListFilter.Custom, color: colors.purple }],
        initialSelected: [],
        initialExpanded: true,
        onSetSelected: (value: string[]) => {
            setShowCustom(value[0] === AvatarListFilter.Custom)
            changePage(1)
        },
    })

    // update
    const updateHandler = useCallback(
        async (avatarID: string, isCustom: boolean) => {
            try {
                setSubmitting(true)
                await updateAvatar(avatarID, isCustom)
            } finally {
                closeHandler()
            }
        },
        [updateAvatar],
    )

    const closeHandler = () => {
        setSubmitting(false)
        setShowCustom(false)
        setModalOpen(false)
    }

    // get list of avatars
    const getItems = useCallback(async () => {
        if (showCustom) return
        try {
            setIsLoading(true)
            const sortDir = "asc"
            const resp = await send<GetAvatarsResponse, GetAvatarsRequest>(GameServerKeys.PlayerProfileAvatarList, {
                queue_sort: sortDir,
                page,
                page_size: pageSize,
            })

            if (!resp) return
            setLoadError(undefined)
            if (page === 1) {
                setAvatars([
                    { is_custom: false, avatar_url: "", id: "custom", tier: "MEGA" },
                    { is_custom: false, avatar_url: "", id: "", tier: "MEGA" },
                    ...resp.avatars,
                ])
            } else {
                setAvatars(resp.avatars)
            }
            setTotalItems(resp.total)
        } catch (e) {
            setLoadError(typeof e === "string" ? e : "Failed to get avatars.")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [send, page, pageSize, setTotalItems, showCustom])

    // get list of custom avatars
    const getCustomAvatars = useCallback(async () => {
        if (!showCustom) return
        try {
            setIsLoading(true)
            const sortDir = "asc"
            const resp = await send<GetCustomAvatarsResponse, GetAvatarsRequest>(GameServerKeys.PlayerProfileCustomAvatarList, {
                queue_sort: sortDir,
                page,
                page_size: pageSize,
            })
            console.log(resp)

            if (!resp || !resp.ids) return
            setLoadError(undefined)
            if (page === 1) {
                setCustomAvatarIDs(["custom", ...resp.ids])
            } else {
                setCustomAvatarIDs(resp.ids)
            }
            setTotalItems(resp.total)
        } catch (e) {
            setLoadError(typeof e === "string" ? e : "Failed to get custom avatars.")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [send, page, pageSize, setTotalItems, showCustom])

    useEffect(() => {
        getItems()
        getCustomAvatars()
    }, [getItems, getCustomAvatars])

    const contentDefault = useMemo(() => {
        if (showCustom) return null
        if (loadError) {
            return (
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
            )
        }

        if (!avatars || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                    </Stack>
                </Stack>
            )
        }

        if (avatars && avatars.length > 0) {
            return (
                <Box sx={{ direction: "ltr", height: 0, width: "100%" }}>
                    <Box
                        sx={{
                            width: "100%",
                            py: "1rem",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(21rem, 1fr))",
                            gap: "1.3rem",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "visible",
                        }}
                    >
                        {avatars.map((a, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    ":hover": {
                                        opacity: ".7",
                                    },
                                }}
                                onClick={() => {
                                    if (a.id === "custom") {
                                        setCustomAvatarModalOpen(true)
                                        setModalOpen(false)
                                        return
                                    }
                                    updateHandler(a.id, false)
                                }}
                            >
                                {a.id === "custom" ? (
                                    <Box
                                        sx={{
                                            borderRadius: 1,
                                            border: `${primaryColor} 2px solid`,
                                            backgroundColor: factionName == FactionName.ZaibatsuHeavyIndustries ? "black" : primaryColor,
                                            cursor: "pointer",
                                        }}
                                        display={"flex"}
                                        height="21rem"
                                        width="21rem"
                                        justifyContent={"center"}
                                        alignItems="center"
                                    >
                                        <SvgEdit title="Create custom avatar" size="6rem" />
                                    </Box>
                                ) : (
                                    <Avatar
                                        src={a.avatar_url}
                                        alt="Avatar"
                                        sx={{
                                            mr: "1rem",
                                            height: "21rem",
                                            width: "21rem",
                                            borderRadius: 1,
                                            border: `${primaryColor} 2px solid`,
                                            backgroundColor: factionName == FactionName.ZaibatsuHeavyIndustries ? "black" : primaryColor,
                                            cursor: "pointer",
                                        }}
                                        variant="square"
                                    />
                                )}
                            </Box>
                        ))}
                    </Box>
                </Box>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "40rem" }}>
                    <Box
                        sx={{
                            width: "80%",
                            height: "16rem",
                            opacity: 0.7,
                            filter: "grayscale(100%)",
                            // TODO repace with empty avatar image
                            background: `url(${EmptyWarMachinesPNG})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "bottom center",
                            backgroundSize: "contain",
                        }}
                    />
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
                        {"There are no avatars found, please try again."}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [loadError, avatars, isLoading, primaryColor, updateHandler, factionName, showCustom])

    const contentCustom = useMemo(() => {
        if (!showCustom) return null
        if (loadError) {
            return (
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
            )
        }

        if (isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                    </Stack>
                </Stack>
            )
        }

        if (customAvatarIDs && customAvatarIDs.length > 0) {
            return (
                <Box sx={{ direction: "ltr", height: 0, width: "100%" }}>
                    <Box
                        sx={{
                            width: "100%",
                            py: "1rem",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(21rem, 1fr))",
                            gap: "1.3rem",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "visible",
                        }}
                    >
                        {customAvatarIDs.map((a, idx) =>
                            a === "custom" ? (
                                <Box
                                    onClick={() => {
                                        setCustomAvatarModalOpen(true)
                                        setModalOpen(false)
                                    }}
                                    sx={{
                                        borderRadius: 1,
                                        border: `${primaryColor} 2px solid`,
                                        backgroundColor: factionName == FactionName.ZaibatsuHeavyIndustries ? "black" : primaryColor,
                                        cursor: "pointer",
                                    }}
                                    display={"flex"}
                                    height="21rem"
                                    width="21rem"
                                    justifyContent={"center"}
                                    alignItems="center"
                                >
                                    <SvgEdit title="Create custom avatar" size="6rem" />
                                </Box>
                            ) : (
                                <Box
                                    key={idx}
                                    onClick={() => {
                                        updateHandler(a, true)
                                    }}
                                    sx={{
                                        position: "relative",
                                        width: "200px",
                                        height: "200px",
                                        ":hover": {
                                            opacity: ".7",
                                            cursor: "pointer",
                                        },
                                    }}
                                >
                                    <Button
                                        sx={{ position: "absolute", top: 0, right: -2 }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedCustomAvatarID(a)
                                            setCustomAvatarDeleteModalOpen(true)
                                        }}
                                    >
                                        <SvgClose color={colors.red} size="2.6rem" />
                                    </Button>
                                    <CustomAvatarItem avatarID={a} />
                                </Box>
                            ),
                        )}
                    </Box>
                </Box>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "40rem" }}>
                    <Box
                        sx={{
                            width: "80%",
                            height: "16rem",
                            opacity: 0.7,
                            filter: "grayscale(100%)",
                            // TODO repace with empty avatar image
                            background: `url(${EmptyWarMachinesPNG})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "bottom center",
                            backgroundSize: "contain",
                        }}
                    />
                    <Typography
                        sx={{
                            px: "1.28rem",
                            pt: "1.28rem",
                            color: colors.grey,
                            fontFamily: fonts.nostromoBold,
                            textAlign: "center",
                        }}
                    >
                        {"There are no avatars found, please try again."}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [loadError, isLoading, primaryColor, updateHandler, factionName, customAvatarIDs, showCustom])

    return (
        <Stack
            direction="column"
            justifyContent={"center"}
            alignItems="center"
            sx={{
                height: "100%",
                "@media (max-width:1300px)": {
                    overflowY: "auto",
                },
            }}
        >
            <FancyButton
                onClick={() => {
                    if (!isOwner) return
                    setModalOpen(true)
                }}
            >
                {isOwner && (
                    <Box
                        sx={{
                            position: "absolute",
                            height: "21rem",
                            width: "21rem",
                            zIndex: 5,
                            backgroundColor: "black",
                            opacity: "0",
                            ":hover": {
                                opacity: "0.5",
                            },
                        }}
                    >
                        <SvgEdit size="4.2rem" sx={{ mt: "2rem" }} />
                    </Box>
                )}
                {/* preview */}
                {isCustom && avatarID ? (
                    <Box sx={{ border: "3px solid white" }}>
                        <CustomAvatarItem key={"custom-avatar-" + avatarID} avatarID={avatarID} />
                        <Box id="abc" sx={{ zIndex: -7, opacity: 0.5, position: "absolute", background: "black", top: 9, width: 200, height: 200 }} />
                    </Box>
                ) : (
                    <Avatar
                        src={avatarURL}
                        alt="Avatar"
                        sx={{
                            mr: "1rem",
                            height: "21rem",
                            width: "21rem",
                            borderRadius: 1,
                            border: `${primaryColor} 2px solid`,
                            backgroundColor: factionName === FactionName.ZaibatsuHeavyIndustries ? "black" : primaryColor,
                            cursor: "pointer",
                        }}
                        variant="square"
                    />
                )}
            </FancyButton>

            {/* avatar select modal */}
            <Modal
                onClose={() => {
                    setShowCustom(false)
                    setModalOpen(false)
                }}
                open={modalOpen}
                sx={{
                    zIndex: siteZIndex.Modal,
                    margin: "auto",
                    height: "60vh",
                    width: "50vw",
                    "@media (max-width:2400px)": {
                        width: "80vw",
                    },
                    "@media (max-width:1500px)": {
                        width: "90vw",
                        height: "75vh",
                    },
                }}
            >
                <Stack direction="row" spacing="1rem" sx={{ height: "100%", width: "100%" }}>
                    <ClipThing
                        clipSize="10px"
                        border={{
                            borderColor: primaryColor,
                            borderThickness: ".3rem",
                        }}
                        corners={{
                            topRight: true,
                            bottomLeft: true,
                            bottomRight: true,
                        }}
                        opacity={0.7}
                        backgroundColor={backgroundColor}
                        sx={{ height: "100%", width: "38rem" }}
                    >
                        <ChipFilterSection filter={statusFilterSection.current} primaryColor={primaryColor} secondaryColor={""} />
                    </ClipThing>

                    <ClipThing
                        clipSize="10px"
                        border={{
                            borderColor: primaryColor,
                            borderThickness: ".3rem",
                        }}
                        opacity={0.95}
                        backgroundColor={backgroundColor}
                        sx={{ height: "100%", flex: 1 }}
                    >
                        <Stack sx={{ position: "relative", height: "100%" }}>
                            <Stack sx={{ flex: 1 }}>
                                <PageHeader
                                    title="Select Avatar"
                                    description="Avatar options are based off your faction and owned war machines"
                                    primaryColor={primaryColor}
                                />

                                <TotalAndPageSizeOptions
                                    countItems={showCustom ? customAvatarIDs.length : avatars?.length}
                                    totalItems={totalItems + 1}
                                    pageSize={pageSize}
                                    changePageSize={changePageSize}
                                    pageSizeOptions={[10, 20, 30]}
                                    changePage={changePage}
                                    manualRefresh={showCustom ? getCustomAvatars : getItems}
                                />

                                <Stack sx={{ px: "1rem", py: "1rem", flex: 1 }}>
                                    <Box
                                        sx={{
                                            ml: "1.9rem",
                                            mr: ".5rem",
                                            pr: "1.4rem",
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
                                                background: primaryColor,
                                                borderRadius: 3,
                                            },
                                        }}
                                    >
                                        {showCustom ? contentCustom : contentDefault}
                                    </Box>
                                </Stack>
                            </Stack>

                            <FancyButton
                                disabled={submitting}
                                onClick={() => {
                                    setModalOpen(false)
                                    setShowCustom(false)
                                }}
                            >
                                CLOSE
                            </FancyButton>
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
                    </ClipThing>
                </Stack>
            </Modal>

            {/* custom avatar modal */}
            <CustomAvatar
                onClose={closeHandler}
                playerID={playerID}
                open={customAvatarModalOpen}
                setOpen={setCustomAvatarModalOpen}
                primaryColor={primaryColor}
                backgroundColor={backgroundColor}
                submitting={false}
            />

            {/* confirm delete modal */}
            {customAvatarDeleteModalOpen && selectedCustomAvatarID && (
                <ConfirmModal
                    cancelBackground={colors.offWhite}
                    confirmBackground={colors.red}
                    cancelColor={"#000"}
                    confirmLabel="DELETE"
                    title="CONFIRMATION"
                    onConfirm={async () => {
                        await deleteCustomAvatar(selectedCustomAvatarID)
                        await getCustomAvatars()
                        setCustomAvatarDeleteModalOpen(false)
                    }}
                    onClose={() => {
                        setCustomAvatarDeleteModalOpen(false)
                    }}
                    isLoading={isLoading}
                >
                    <Typography variant="h6">Are you sure you want to delete this custom avatar?</Typography>
                </ConfirmModal>
            )}
        </Stack>
    )
}
