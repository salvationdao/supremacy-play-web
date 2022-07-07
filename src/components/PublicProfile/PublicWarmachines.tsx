import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { EmptyWarMachinesPNG, WarMachineIconPNG } from "../../assets"
import { parseString } from "../../helpers"
import { usePagination, useUrlQuery } from "../../hooks"
import { useGameServerCommands } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { MechBasic } from "../../types"
import { ClipThing } from "../Common/ClipThing"
import { PageHeader } from "../Common/PageHeader"
import { PublicWarmachineItem } from "./PublicMechDetails"

interface GetMechsRequest {
    player_id: string
    queue_sort: string
    page: number
    page_size: number
    include_market_listed: boolean
}

interface GetMechsResponse {
    mechs: MechBasic[]
    total: number
}

export const PublicWarmachines = ({ playerID, primaryColour, backgroundColour }: { playerID: string; primaryColour: string; backgroundColour: string }) => {
    const [query, updateQuery] = useUrlQuery()
    const { send } = useGameServerCommands("/public/commander")

    // Items
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [mechs, setMechs] = useState<MechBasic[]>([])

    const { page, changePage, setTotalItems, totalPages, pageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })

    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)

            const sortDir = "asc"
            const resp = await send<GetMechsResponse, GetMechsRequest>(GameServerKeys.PlayerAssetMechListPublic, {
                player_id: playerID,
                queue_sort: sortDir,
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
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [send, page, pageSize, updateQuery, setTotalItems])

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

        if (!mechs || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: primaryColour }} />
                    </Stack>
                </Stack>
            )
        }

        if (mechs && mechs.length > 0) {
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
                        {mechs.map((mech) => (
                            <PublicWarmachineItem
                                key={`marketplace-${mech.id}`}
                                mech={mech}
                                isGridView={true}
                                primaryColour={primaryColour}
                                backgroundColour={backgroundColour}
                            />
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
                        {"There are no war machines found, please try again."}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [loadError, mechs, isLoading, primaryColour])

    return (
        <Stack direction="row" spacing="1rem" sx={{ height: "100%", width: "100%" }}>
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: primaryColour,
                    borderThickness: ".3rem",
                }}
                opacity={0.7}
                backgroundColor={backgroundColour}
                sx={{ height: "100%", flex: 1 }}
            >
                <Stack sx={{ position: "relative", height: "100%" }}>
                    <Stack sx={{ flex: 1 }}>
                        <PageHeader title="WAR MACHINES" description="" primaryColor={primaryColour} imageUrl={WarMachineIconPNG} />

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
                                        background: primaryColour,
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
                                borderTop: `${primaryColour}70 1.5px solid`,
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
                                        color: primaryColour,
                                        backgroundColor: `${primaryColour} !important`,
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
    )
}
