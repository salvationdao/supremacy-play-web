import { Avatar, Box, CircularProgress, Fade, Modal, Stack, Tab, Tabs, Typography } from "@mui/material"
import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from "react"
import { HeadPNG, Hair1PNG, Hair2PNG, Hair3PNG, EmptyWarMachinesPNG } from "../../assets"
import { parseString } from "../../helpers"
import { usePagination, useUrlQuery } from "../../hooks"
import { useGameServerCommandsUser } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { ClipThing } from "../Common/ClipThing"
import { FancyButton } from "../Common/FancyButton"
import { PageHeader } from "../Common/PageHeader"

interface CustomAvatarProps {
    open: boolean
    setOpen: (o: boolean) => void
    primaryColor: string
    backgroundColor: string
    submitting: boolean
}

interface AvatarFeature {
    id: string
    image_url: string
}

export const CustomAvatar = ({ open, setOpen, primaryColor, backgroundColor, submitting }: CustomAvatarProps) => {
    const [currentValue, setCurrentValue] = useState<AVATAR_FEATURE_TABS>(AVATAR_FEATURE_TABS.Faces)

    // selected features
    const [hair, setHair] = useState<AvatarFeature>()

    const handleChange = useCallback(
        (event: SyntheticEvent, newValue: AVATAR_FEATURE_TABS) => {
            setCurrentValue(newValue)
        },
        [history, location.hash],
    )
    return (
        <Modal onClose={() => setOpen(false)} open={open} sx={{ zIndex: siteZIndex.Modal, margin: "auto", height: "60vh", width: "60vw" }}>
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
                            <PageHeader title="Custom avatar" description="Customize your own avatar" primaryColor={primaryColor} />

                            <Stack sx={{ px: "1rem", py: "1rem", flex: 1 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "space-between",
                                        color: "white",
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
                                    {/* Preview */}
                                    <Box width="500px" height="500px" mr="1rem" sx={{ position: "relative" }}>
                                        <img src={HeadPNG} alt="" height="500px" />
                                        <img style={{ position: "absolute", top: "0", left: "0" }} src={hair?.image_url} alt="" height="500px" />
                                    </Box>

                                    <Box width="50%">
                                        <Tabs
                                            value={currentValue}
                                            onChange={handleChange}
                                            variant="scrollable"
                                            scrollButtons="auto"
                                            sx={{
                                                flexShrink: 0,
                                                color: primaryColor,
                                                minHeight: 0,
                                                ".MuiTab-root": { minHeight: 0, fontSize: "1.3rem", height: "6rem", width: "10rem" },
                                                ".Mui-selected": {
                                                    color: `${primaryColor} !important`,
                                                },
                                                ".MuiTabs-indicator": { display: "none" },
                                                ".MuiTabScrollButton-root": { display: "none" },
                                            }}
                                        >
                                            <Tab label="FACE SHAPE " value={AVATAR_FEATURE_TABS.Faces} />

                                            <Tab label="HAIR" value={AVATAR_FEATURE_TABS.Hair} />
                                        </Tabs>

                                        <TabPanel currentValue={currentValue} value={AVATAR_FEATURE_TABS.Faces}>
                                            <h1 style={{ color: "white" }}>FACES</h1>
                                        </TabPanel>

                                        <TabPanel currentValue={currentValue} value={AVATAR_FEATURE_TABS.Hair}>
                                            <HairList setHair={setHair} />
                                        </TabPanel>
                                    </Box>
                                </Box>
                            </Stack>
                        </Stack>

                        <FancyButton
                            disabled={submitting}
                            onClick={() => {
                                setOpen(false)
                            }}
                        >
                            CLOSE
                        </FancyButton>
                    </Stack>
                </ClipThing>
            </Stack>
        </Modal>
    )
}

export enum AVATAR_FEATURE_TABS {
    Faces = "faces",
    Hair = "hair",
    FACIAL_HAIR = "facial-hair",
}
interface TabPanelProps {
    children?: React.ReactNode
    value: AVATAR_FEATURE_TABS
    currentValue: AVATAR_FEATURE_TABS
}

const TabPanel = (props: TabPanelProps) => {
    const { children, currentValue, value } = props

    if (currentValue === value) {
        return (
            <Fade in>
                <Box id={`marketplace-tabpanel-${value}`} sx={{ flex: 1 }}>
                    {children}
                </Box>
            </Fade>
        )
    }

    return null
}

interface Hair {
    id: string
    image_url: string
}

interface GetHairResponse {
    hairs: Hair[]
    total: number
}

interface ListRequest {
    queue_sort: string
    page: number
    page_size: number
}

interface HairListProps {
    setHair: (h: Hair) => void
}
export const HairList = ({ setHair }: HairListProps) => {
    const [query] = useUrlQuery()
    const { send } = useGameServerCommandsUser("/user_commander")

    const [modalOpen, setModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [avatars, setAvatars] = useState<Hair[]>([])
    const [submitting, setSubmitting] = useState(false)

    const [customAvatarModalOpen, setCustomAvatarModalOpen] = useState(false)

    const { page, changePage, setTotalItems, totalPages, pageSize, totalItems, changePageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })

    // const updatehHandler = useCallback(
    //     async (avatarID) => {
    //         try {
    //             setSubmitting(true)
    //             // await updateAvatar(avatarID)
    //         } finally {
    //             setSubmitting(false)
    //             setModalOpen(false)
    //         }
    //     },
    //     [updateAvatar],
    // )

    // get list of avatars
    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)
            const sortDir = "asc"
            const resp = await send<GetHairResponse, ListRequest>(GameServerKeys.PlayerProfileHairList, {
                queue_sort: sortDir,
                page,
                page_size: pageSize,
            })
            console.log("this is resp", resp)

            if (!resp) return

            setLoadError(undefined)
            setAvatars(resp.hairs)
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
                        <CircularProgress size="3rem" sx={{ color: "black" }} />
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
                                    // if (a.id === "custom") {
                                    //     console.log("create new avatar ... ")
                                    //     setCustomAvatarModalOpen(true)
                                    //     setModalOpen(false)
                                    //     return
                                    // }
                                    // updatehHandler(a.id)
                                    setHair(a)
                                }}
                            >
                                <Avatar
                                    src={a.image_url}
                                    alt="Avatar"
                                    sx={{
                                        mr: "1rem",
                                        height: "21rem",
                                        width: "21rem",
                                        borderRadius: 1,
                                        border: `white 2px solid`,
                                        backgroundColor: "transparent",
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
    }, [loadError, avatars, isLoading])

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
            {content}
            {/* avatar select modal */}
        </Stack>
    )
}
