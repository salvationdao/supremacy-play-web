import { Box, Stack } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { MechDetails } from "../../../../types"
import { MarketplaceMechItem } from "../../../../types/marketplace"
import { ClipThing } from "../../../Common/ClipThing"

export const WarMachineMarketDetails = ({ id }: { id: string }) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [marketItem, setMarketItem] = useState<MarketplaceMechItem>()
    const [mechDetails, setMechDetails] = useState<MechDetails>()

    // Get listing details
    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<MarketplaceMechItem>(GameServerKeys.MarketplaceSalesGet, {
                    id,
                })

                if (!resp) return
                setMarketItem(resp)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get listing details."
                setLoadError(message)
                console.error(err)
            }
        })()
    }, [id, send])

    // Get mech details
    useEffect(() => {
        ;(async () => {
            try {
                if (!marketItem || !marketItem.mech?.id) return
                const resp = await send<MechDetails>(GameServerKeys.GetMechDetails, {
                    mech_id: marketItem.item_id,
                })

                if (!resp) return
                setMechDetails(resp)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get war machine details."
                setLoadError(message)
                console.error(err)
            }
        })()
    }, [marketItem, send])

    // const confirmBuyCloseHandler = useCallback(async () => {
    //     try {
    //         await send<{ total: number; records: MarketplaceMechItem[] }>(GameServerKeys.MarketplaceSalesBuy, {
    //             item_id: targetBuyItem.id,
    //         })
    //         setBuyError(null)
    //         listQuery()
    //     } catch (err) {
    //         setBuyError(err as string)
    //     }
    // },[])

    if (!marketItem) return null

    const { buyout, auction, end_at, buyout_price, auction_price, owner, mech } = marketItem

    if (!mech || !owner) return null

    const { username, gid } = owner
    const { name, label, tier, avatar_url } = mech

    const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined
    const imageUrl = skin?.large_image_url

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
            <Stack sx={{ height: "100%" }}>CONTENT</Stack>
        </ClipThing>
    )
}
