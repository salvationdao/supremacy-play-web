import { Tune } from "@mui/icons-material"
import { Avatar, Box, CircularProgress, Modal, Pagination, Stack, Typography, Zoom } from "@mui/material"
import { send } from "process"
import { useCallback, useEffect, useMemo, useState } from "react"
import { EmptyWarMachinesPNG } from "../../assets"
import { parseString } from "../../helpers"
import { usePagination, useUrlQuery } from "../../hooks"
import { useGameServerCommandsUser } from "../../hooks/useGameServer"
import { colors, fonts, siteZIndex, theme } from "../../theme/theme"
import { ClipThing } from "../Common/ClipThing"
import { FancyButton } from "../Common/FancyButton"
import { PageHeader } from "../Common/PageHeader"

interface GetAvatarsRequest {
    queue_sort: string
    page: number
    page_size: number
}

interface GetAvatarsResponse {
    avatars: ProfileAvatar[]
    total: number
}

interface ProfileAvatar {
    id: string
    avatar_url: string
    tier: string
}

const HubKeyPlayerAvatarList = "PLAYER:AVATAR:LIST"

interface ProfileAvatarProps {
    primaryColor: string
    backgroundColor: string
    avatarURL: string
    updateAvatar: (avatarID: string) => Promise<void>
}

export const ProfileAvatar = ({ primaryColor, backgroundColor, avatarURL, updateAvatar }: ProfileAvatarProps) => {
    const [query] = useUrlQuery()
    const { send } = useGameServerCommandsUser("/user_commander")

    const [modalOpen, setModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [avatars, setAvatars] = useState<ProfileAvatar[]>([])
    const [submitting, setSubmitting] = useState(false)

    const { page, changePage, setTotalItems, totalPages, pageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })

    const updatehHandler = useCallback(
        async (avatarID) => {
            try {
                setSubmitting(true)
                await updateAvatar(avatarID)
            } finally {
                setSubmitting(false)
                setModalOpen(false)
            }
        },
        [updateAvatar],
    )

    // get list of avatars
    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)

            const sortDir = "asc"
            const resp = await send<GetAvatarsResponse, GetAvatarsRequest>(HubKeyPlayerAvatarList, {
                queue_sort: sortDir,
                page,
                page_size: pageSize,
            })
            if (!resp) return
            setLoadError(undefined)
            setAvatars(resp.avatars)
            setTotalItems(resp.total)
        } catch (e) {
            setLoadError(typeof e === "string" ? e : "Failed to get avatars.")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [send, page, pageSize, setTotalItems])

    useEffect(() => {
        getItems()
    }, [getItems])

    const content = useMemo(() => {
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
                            gridTemplateColumns: "repeat(auto-fill, minmax(29rem, 1fr))",
                            gap: "1.3rem",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "visible",
                        }}
                    >
                        {avatars.map((a, idx) => (
                            <Box
                                key={idx}
                                onClick={() => {
                                    updatehHandler(a.id)
                                }}
                            >
                                <Avatar
                                    src={a.avatar_url}
                                    alt="Avatar"
                                    sx={{
                                        mr: "1rem",
                                        height: "9rem",
                                        width: "9rem",
                                        borderRadius: 1,
                                        border: `${primaryColor} 2px solid`,
                                        backgroundColor: primaryColor,
                                        cursor: "pointer",
                                    }}
                                    variant="square"
                                />
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
                            // TODO repace with empty war machine
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
    }, [loadError, avatars, isLoading, primaryColor, backgroundColor])

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
                    setModalOpen(true)
                }}
            >
                <Avatar
                    src={avatarURL}
                    alt="Avatar"
                    sx={{
                        mr: "1rem",
                        height: "9rem",
                        width: "9rem",
                        borderRadius: 1,
                        border: `${primaryColor} 2px solid`,
                        backgroundColor: primaryColor,
                        cursor: "pointer",
                    }}
                    variant="square"
                />
            </FancyButton>

            <Modal onClose={() => setModalOpen(false)} open={modalOpen} sx={{ zIndex: siteZIndex.Modal, margin: "auto", height: "70vh", width: "70vw" }}>
                <Stack direction="row" spacing="1rem" sx={{ height: "100%", width: "100%" }}>
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
                                <PageHeader title="Select avatar" description="" primaryColor={primaryColor} />

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
                                        {content}
                                    </Box>
                                </Stack>
                            </Stack>

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
                                                color: primaryColor,
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
        </Stack>
    )
}
