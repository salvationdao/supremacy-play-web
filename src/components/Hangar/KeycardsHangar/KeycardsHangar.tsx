import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { ClipThing, FancyButton } from "../.."
import { KeycardPNG } from "../../../assets"
import { PASSPORT_WEB } from "../../../constants"
import { useAuth } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { parseString } from "../../../helpers"
import { usePagination, useUrlQuery } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { Keycard } from "../../../types"
import { PageHeader } from "../../Common/PageHeader"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { KeycardHangarItem } from "./KeycardHangarItem"

interface GetPlayerKeycardsRequest {
    page: number
    page_size: number
    include_market_listed: boolean
}

interface GetAssetsResponse {
    keycards: Keycard[]
    total: number
}

export const KeycardsHangar = () => {
    const location = useLocation()
    const [query, updateQuery] = useUrlQuery()
    const { user } = useAuth()
    const { send } = useGameServerCommandsUser("/user_commander")
    const theme = useTheme()
    const [keycards, setKeycards] = useState<Keycard[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()

    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })

    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)
            const resp = await send<GetAssetsResponse, GetPlayerKeycardsRequest>(GameServerKeys.GetPlayerKeycards, {
                page,
                page_size: pageSize,
                include_market_listed: true,
            })

            updateQuery({
                page: page.toString(),
                pageSize: pageSize.toString(),
            })

            if (!resp) return
            setLoadError(undefined)
            setKeycards(resp.keycards)
            setTotalItems(resp.total)
        } catch (e) {
            const message = typeof e === "string" ? e : "Failed to get keycards."
            setLoadError(message)
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

        if (keycards && keycards.length > 0) {
            return (
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Box
                        sx={{
                            width: "100%",
                            pt: ".5rem",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(32rem, 1fr))",
                            gap: "2.4rem",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "visible",
                        }}
                    >
                        {keycards.map((keycard, index) => (
                            <KeycardHangarItem key={`storefront-keycard-${keycard.id}-${index}`} keycard={keycard} />
                        ))}
                    </Box>
                </Box>
            )
        }

        if (isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: theme.factionTheme.primary }} />
                    </Stack>
                </Stack>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "43rem" }}>
                    <Box
                        sx={{
                            width: "10rem",
                            height: "10rem",
                            opacity: 0.6,
                            filter: "grayscale(100%)",
                            background: `url(${KeycardPNG})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "top center",
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
                        {"You don't have any keycards."}
                    </Typography>

                    <FancyButton
                        to={`/marketplace/keycards${location.hash}`}
                        clipThingsProps={{
                            clipSize: "9px",
                            backgroundColor: theme.factionTheme.primary,
                            border: { isFancy: true, borderColor: theme.factionTheme.primary },
                            sx: { position: "relative", mt: "2rem" },
                        }}
                        sx={{ px: "1.8rem", py: ".8rem", color: theme.factionTheme.secondary }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                textAlign: "center",
                                color: theme.factionTheme.secondary,
                                fontFamily: fonts.nostromoBold,
                            }}
                        >
                            GO TO MARKETPLACE
                        </Typography>
                    </FancyButton>
                </Stack>
            </Stack>
        )
    }, [loadError, keycards, isLoading, theme.factionTheme.primary, theme.factionTheme.secondary, location.hash])

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            opacity={0.7}
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%" }}
        >
            <Stack sx={{ position: "relative", height: "100%" }}>
                <Stack sx={{ flex: 1 }}>
                    <PageHeader
                        title="KEY CARDS"
                        description={
                            <Typography sx={{ fontSize: "1.85rem" }}>
                                The keycards that you have on Supremacy are shown here. If you don&apos;t see your keycards here, you may need to transfer them
                                from{" "}
                                <a rel="noreferrer" target="_blank" href={`${PASSPORT_WEB}profile/${user.username}/achievements`}>
                                    XSYN
                                </a>{" "}
                                to Supremacy.
                            </Typography>
                        }
                        imageUrl={KeycardPNG}
                    ></PageHeader>

                    <TotalAndPageSizeOptions
                        countItems={keycards?.length}
                        totalItems={totalItems}
                        pageSize={pageSize}
                        changePageSize={changePageSize}
                        changePage={changePage}
                        manualRefresh={getItems}
                    />

                    <Stack sx={{ px: "2rem", py: "1rem", flex: 1 }}>
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
                                    background: theme.factionTheme.primary,
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
                            borderTop: (theme) => `${theme.factionTheme.primary}70 1px solid`,
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
    )
}
