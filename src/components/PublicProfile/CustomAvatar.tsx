import { Avatar, Box, CircularProgress, Fade, Modal, Stack, Tab, Tabs, Typography, useMediaQuery } from "@mui/material"
import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from "react"
import { EmptyWarMachinesPNG } from "../../assets"
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

interface Layer {
    id: string
    image_url: string
}

export const CustomAvatar = ({ open, setOpen, primaryColor, backgroundColor, submitting }: CustomAvatarProps) => {
    const [currentValue, setCurrentValue] = useState<AVATAR_FEATURE_TABS>(AVATAR_FEATURE_TABS.Face)

    const [imageSize, setImageSize] = useState(600)

    // const below650 = useMediaQuery("(max-width:650px)")
    // const below750 = useMediaQuery("(max-width:750px)")
    // const below980 = useMediaQuery("(max-width:980px)")
    // const below1550 = useMediaQuery("(max-width:1550px)")
    // const below1750 = useMediaQuery("(max-width:1750px)")

    const below2500 = useMediaQuery("(max-width:2500px)")
    const below2200 = useMediaQuery("(max-width:2200px)")

    useEffect(() => {
        if (below2200) {
            setImageSize(420)
            return
        }

        if (below2500) {
            setImageSize(500)
            return
        }

        setImageSize(500)
    }, [below2500, below2200])

    // selected features
    const [hair, setHair] = useState<Layer>()
    const [face, setFace] = useState<Layer>()
    const [body, setBody] = useState<Layer>()
    const [accessory, setAccessory] = useState<Layer>()

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
                                <Stack
                                    direction="row"
                                    sx={{
                                        display: "flex",
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
                                    <Box width="500px" ml="3rem" mr="3rem" sx={{ height: imageSize, position: "relative", alignSelf: "flex-end" }}>
                                        <img
                                            style={{ height: imageSize, zIndex: 3, position: "absolute", top: "0", left: "0" }}
                                            src={accessory?.image_url}
                                            alt=""
                                        />
                                        <img style={{ height: imageSize, zIndex: 3, position: "absolute", top: "0", left: "0" }} src={hair?.image_url} alt="" />
                                        <img style={{ height: imageSize, zIndex: 2 }} src={face?.image_url} alt="" />
                                        <img
                                            style={{ height: imageSize, zIndex: -1, position: "absolute", top: "0", left: "0" }}
                                            src={body?.image_url}
                                            alt=""
                                        />
                                    </Box>

                                    <Box width="50%" sx={{ justifySelf: "flex-start", alignSelf: "flex-start" }}>
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
                                            <Tab label="FACE" value={AVATAR_FEATURE_TABS.Face} />

                                            <Tab label="HAIR" value={AVATAR_FEATURE_TABS.Hair} />

                                            <Tab label="BODY" value={AVATAR_FEATURE_TABS.Body} />

                                            <Tab label="ACCESSORY" value={AVATAR_FEATURE_TABS.Accessory} />
                                        </Tabs>

                                        {/* Face Layer */}
                                        <TabPanel currentValue={currentValue} value={AVATAR_FEATURE_TABS.Face}>
                                            <LayerList layerType="FACE" setLayer={setFace} />
                                        </TabPanel>

                                        {/* Hair Layer */}
                                        <TabPanel currentValue={currentValue} value={AVATAR_FEATURE_TABS.Hair}>
                                            <LayerList layerType="HAIR" setLayer={setHair} />
                                        </TabPanel>

                                        {/* Body Layer */}
                                        <TabPanel currentValue={currentValue} value={AVATAR_FEATURE_TABS.Body}>
                                            <LayerList layerType="BODY" setLayer={setBody} />
                                        </TabPanel>

                                        {/* Accessories layer */}
                                        <TabPanel currentValue={currentValue} value={AVATAR_FEATURE_TABS.Accessory}>
                                            <LayerList layerType={AVATAR_FEATURE_TABS.Accessory} setLayer={setAccessory} />
                                        </TabPanel>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </ClipThing>
            </Stack>
        </Modal>
    )
}

export enum AVATAR_FEATURE_TABS {
    Face = "FACE",
    Hair = "HAIR",
    Body = "BODY",
    Accessory = "ACCESSORY",
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

interface Layer {
    id: string
    image_url: string
    type: string
}

interface GetLayersResponse {
    layers: Layer[]
    total: number
}

interface ListRequest {
    queue_sort: string
    page: number
    page_size: number
    layer_type: string
}

interface LayerListProps {
    layerType: string
    setLayer: (h: Layer) => void
}
export const LayerList = ({ setLayer, layerType }: LayerListProps) => {
    const [query] = useUrlQuery()
    const { send } = useGameServerCommandsUser("/user_commander")

    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [avatars, setAvatars] = useState<Layer[]>([])

    const { page, changePage, setTotalItems, totalPages, pageSize, totalItems, changePageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })

    // get list of avatars
    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)
            const sortDir = "asc"
            const resp = await send<GetLayersResponse, ListRequest>(GameServerKeys.PlayerProfileLayerList, {
                queue_sort: sortDir,
                page,
                page_size: pageSize,
                layer_type: layerType,
            })
            if (!resp) return

            setLoadError(undefined)
            setAvatars(resp.layers)
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
                                    setLayer(a)
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
