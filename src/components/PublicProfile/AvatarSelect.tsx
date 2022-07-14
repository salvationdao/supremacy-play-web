import { Tune } from "@mui/icons-material"
import { Box, Modal, Stack, Typography, Zoom } from "@mui/material"
import { send } from "process"
import { useCallback, useEffect, useState } from "react"
import { parseString } from "../../helpers"
import { usePagination, useUrlQuery } from "../../hooks"
import { useGameServerCommandsUser } from "../../hooks/useGameServer"
import { colors, fonts, siteZIndex, theme } from "../../theme/theme"
import { ClipThing } from "../Common/ClipThing"
import { FancyButton } from "../Common/FancyButton"

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

export const ProfileAvatar = () => {
    const [query] = useUrlQuery()
    const { send } = useGameServerCommandsUser("/user_commander")

    const [modalOpen, setModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [mechs, setMechs] = useState<ProfileAvatar[]>([])
    const { page, changePage, setTotalItems, totalPages, pageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })

    // if (loading) {
    //     return (
    //         <Stack alignItems="center" justifyContent={"center"} sx={{ width: "100%", height: "100%" }}>
    //             <CircularProgress size="3rem" sx={{ color: primaryColor }} />
    //             <Typography sx={{ fontFamily: fonts.nostromoBlack, mr: "1rem", mt: "3rem" }}>Loading Profile</Typography>
    //         </Stack>
    //     )
    // }
    // if ((!loading && profileError) || !profile) {
    //     return (
    //         <Stack sx={{ flex: 1, px: "1rem" }}>
    //             <Typography sx={{ color: colors.red, textTransform: "uppercase" }}>{profileError}</Typography>
    //         </Stack>
    //     )
    // }

    // if (!hasFeature) {
    //     history.push("/404")
    //     return <></>
    // }

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

            console.log("this is resp", resp)

            setLoadError(undefined)
            setMechs(resp.avatars)
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
        <Stack
            direction="column"
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
                open
            </FancyButton>

            <Modal open={modalOpen} sx={{ zIndex: siteZIndex.Modal }}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "60rem",
                        boxShadow: 6,
                        outline: "none",
                    }}
                >
                    <Zoom in>
                        <Box>
                            <ClipThing
                                clipSize="8px"
                                border={{
                                    borderColor: theme.factionTheme.primary,
                                    borderThickness: ".2rem",
                                }}
                                sx={{ position: "relative" }}
                                backgroundColor={theme.factionTheme.background}
                            >
                                <Stack
                                    spacing="1.2rem"
                                    sx={{
                                        position: "relative",
                                        px: "2.5rem",
                                        py: "2.4rem",
                                        span: {
                                            color: colors.neonBlue,
                                            fontWeight: "fontWeightBold",
                                        },
                                    }}
                                >
                                    <Typography variant="h5" sx={{ lineHeight: 1, fontFamily: fonts.nostromoBlack }}>
                                        Choose Avatar
                                    </Typography>
                                    Avatar list here
                                    <FancyButton
                                        onClick={() => {
                                            setModalOpen(false)
                                        }}
                                    >
                                        Close
                                    </FancyButton>
                                </Stack>
                            </ClipThing>
                        </Box>
                    </Zoom>
                </Box>
            </Modal>
        </Stack>
    )
}
