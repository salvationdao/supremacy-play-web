import { useState, useCallback, useEffect, useMemo } from "react"
import { useSnackbar } from "../../../containers"
import { parseString } from "../../../helpers"
import { usePagination, useUrlQuery } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { useTheme } from "../../../containers/theme"
import { colors, fonts } from "../../../theme/theme"
import { StorefrontPackage } from "../../../types"
import { Stack, Typography } from "@mui/material"
import { PackageStoreItemLoadingSkeleton } from "./PackageStoreItem/PackageStoreItem"
import { ClipThing } from "../../Common/ClipThing"
import { PageHeader } from "../../Common/PageHeader"
import { SafePNG } from "../../../assets"

export const PackagesStore = () => {
    const { newSnackbarMessage } = useSnackbar()
    const [query, updateQuery] = useUrlQuery()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const theme = useTheme()

    const [packages, setPackages] = useState<StorefrontPackage[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const { page, changePage, changePageSize, totalPages, pageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })

    const enlargedView = packages ? packages.length <= 2 : false

    // Get packages
    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)

            const resp = await send<StorefrontPackage[]>(GameServerKeys.GetPackages, {
                page,
                page_size: pageSize,
            })

            updateQuery({
                page: page.toString(),
                pageSize: pageSize.toString(),
            })

            if (!resp) return
            setLoadError(undefined)
            setPackages(resp)
        } catch (e) {
            const message = typeof e === "string" ? e : "Failed to get packages."
            setLoadError(message)
            newSnackbarMessage(message, "error")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [updateQuery, page, pageSize, send, newSnackbarMessage])

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

        if (!packages || isLoading) {
            return (
                <Stack direction="row" flexWrap="wrap" sx={{ height: 0 }}>
                    {new Array(10).fill(0).map((_, index) => (
                        <PackageStoreItemLoadingSkeleton key={index} />
                    ))}
                </Stack>
            )
        }

        return <div>literally testing rn</div>
    }, [packages, enlargedView, isLoading, loadError])

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
                        title={
                            <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                                PACKAGES <span style={{ color: colors.lightNeonBlue, fontFamily: "inherit", fontSize: "inherit" }}>(LIMITED SUPPLY)</span>
                            </Typography>
                        }
                        description={
                            <Typography sx={{ fontSize: "1.85rem" }}>Gear up for the battle arena with a variety of War Machines and Weapons.</Typography>
                        }
                        imageUrl={SafePNG}
                    ></PageHeader>
                </Stack>
            </Stack>
        </ClipThing>
    )
}
