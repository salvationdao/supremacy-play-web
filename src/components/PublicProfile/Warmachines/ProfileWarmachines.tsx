import { Box, CircularProgress, Modal, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { EmptyWarMachinesPNG, WarMachineBCPNG, WarMachineIconPNG, WarMachineRMPNG, WarMachineZAIPNG } from "../../../assets"
import { parseString } from "../../../helpers"
import { usePagination, useUrlQuery } from "../../../hooks"
import { useGameServerCommands } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { FactionName, MechBasic } from "../../../types"
import { SortDir } from "../../../types/marketplace"
import { ClipThing } from "../../Common/Deprecated/ClipThing"
import { PageHeader } from "../../Common/Deprecated/PageHeader"
import { TotalAndPageSizeOptions } from "../../Common/Deprecated/TotalAndPageSizeOptions"
import { ProfileWarmachineItem } from "../ProfileMechDetails"
import { WarmachineDetails } from "./WarmachineDetails"

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

interface ProfileWarmachinesProps {
    playerID: string
    primaryColour: string
    secondaryColor: string
    backgroundColour: string
    factionName: string
}

const getIcon = (factionName: FactionName): string => {
    // zhi
    if (factionName === FactionName.ZaibatsuHeavyIndustries) {
        return WarMachineZAIPNG
    }
    // rm
    if (factionName === FactionName.RedMountainOffworldMiningCorporation) {
        return WarMachineRMPNG
    }
    // bc
    if (factionName === FactionName.BostonCybernetics) {
        return WarMachineBCPNG
    }

    return WarMachineIconPNG
}

export const ProfileWarmachines = ({ playerID, primaryColour, backgroundColour, factionName }: ProfileWarmachinesProps) => {
    const [query] = useUrlQuery()
    const { send } = useGameServerCommands("/public/commander")

    // Items
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [mechs, setMechs] = useState<MechBasic[]>([])

    // mech details preview modal
    const [viewMechID, setViewMechID] = useState<string>()

    const { page, changePage, setTotalItems, totalItems, totalPages, changePageSize, pageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })

    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)

            const sortDir = SortDir.Asc
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
    }, [send, page, pageSize, setTotalItems, playerID])

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
                        <CircularProgress />
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
                            gridTemplateColumns: "repeat(auto-fill, minmax(30rem, 1fr))",
                            gap: "1.5rem",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "visible",
                        }}
                    >
                        {mechs.map((mech) => (
                            <ProfileWarmachineItem
                                onClick={() => {
                                    setViewMechID(mech.id)
                                }}
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
                            textAlign: "center",
                        }}
                    >
                        {"There are no war machines found, please check your filters and try again."}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [loadError, mechs, isLoading, primaryColour, backgroundColour])

    return (
        <>
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
                            <PageHeader title="WAR MACHINES" description="" primaryColor={primaryColour} imageUrl={getIcon(factionName as FactionName)} />

                            <TotalAndPageSizeOptions
                                primaryColor={primaryColour}
                                countItems={mechs?.length}
                                totalItems={totalItems}
                                pageSize={pageSize}
                                changePageSize={changePageSize}
                                pageSizeOptions={[10, 20, 30]}
                                changePage={changePage}
                                manualRefresh={getItems}
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
                                <Pagination count={totalPages} page={page} onChange={(e, p) => changePage(p)} />
                            </Box>
                        )}
                    </Stack>
                </ClipThing>
            </Stack>

            {/* details modal */}
            {viewMechID && (
                <Modal
                    open={!!viewMechID}
                    onClose={() => setViewMechID(undefined)}
                    sx={{
                        zIndex: siteZIndex.Modal,
                        height: "70vh",
                        width: "70vw",
                        margin: "auto",

                        "@media (max-width:1440px)": {
                            height: "85vh",
                            width: "85vw",
                        },
                    }}
                >
                    <WarmachineDetails mechID={viewMechID} primaryColor={primaryColour} backgroundColor={backgroundColour} />
                </Modal>
            )}
        </>
    )
}
