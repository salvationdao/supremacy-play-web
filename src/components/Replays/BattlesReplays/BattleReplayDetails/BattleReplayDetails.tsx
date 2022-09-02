import { Stack } from "@mui/material"
import { useTheme } from "../../../../containers/theme"
import { ClipThing } from "../../../Common/ClipThing"
import { BattleReplayPlayer } from "./BattleReplayPlayer"

export const BattleReplayDetails = ({ gid, battleNumber }: { gid: number; battleNumber: number }) => {
    const theme = useTheme()

    // // Get listing details
    // useEffect(() => {
    //     ;(async () => {
    //         try {
    //             const resp = await send<MarketplaceBuyAuctionItem>(GameServerKeys.MarketplaceSalesGet, {
    //                 id,
    //             })

    //             if (!resp) return
    //             setMarketItem(resp)
    //         } catch (err) {
    //             const message = typeof err === "string" ? err : "Failed to get listing details."
    //             setLoadError(message)
    //             console.error(err)
    //         }
    //     })()
    // }, [id, send])

    // const content = useMemo(() => {
    //     const validStruct = !marketItem || (marketItem.mech && marketItem.owner)

    //     if (loadError || !validStruct) {
    //         return (
    //             <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
    //                 <Stack
    //                     alignItems="center"
    //                     justifyContent="center"
    //                     sx={{ height: "100%", maxWidth: "100%", width: "75rem", px: "3rem", pt: "1.28rem" }}
    //                     spacing="1.5rem"
    //                 >
    //                     <Typography
    //                         sx={{
    //                             color: colors.red,
    //                             fontFamily: fonts.nostromoBold,
    //                             textAlign: "center",
    //                         }}
    //                     >
    //                         {loadError ? loadError : "Failed to load listing details."}
    //                     </Typography>
    //                 </Stack>
    //             </Stack>
    //         )
    //     }

    //     if (!marketItem) {
    //         return (
    //             <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
    //                 <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
    //                     <CircularProgress size="3rem" sx={{ color: primaryColor }} />
    //                 </Stack>
    //             </Stack>
    //         )
    //     }

    //     return <BattleReplayPlayer battleNumber={battleNumber} gid={gid} />
    // }, [loadError, marketItem, mechDetails, primaryColor])

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
            <Stack sx={{ height: "100%" }}>
                <BattleReplayPlayer battleNumber={battleNumber} gid={gid} />
            </Stack>
        </ClipThing>
    )
}
