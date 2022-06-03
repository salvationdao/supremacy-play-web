import { Box, Stack } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { ClipThing } from "../.."
import { useTheme } from "../../../containers/theme"
import { getRarityDeets } from "../../../helpers"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { MechDetails } from "../../../types"
import { MarketplaceMechItem } from "../../../types/marketplace"

interface WarMachineMarketItemProps {
    item: MarketplaceMechItem
}

export const WarMachineMarketItem = ({ item }: WarMachineMarketItemProps) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [mechDetails, setMechDetails] = useState<MechDetails>()

    const rarityDeets = useMemo(() => getRarityDeets(item.mech?.tier || ""), [item.mech?.tier])

    useEffect(() => {
        ;(async () => {
            try {
                if (!item.mech) return
                const resp = await send<MechDetails>(GameServerKeys.GetMechDetails, {
                    mech_id: item.mech.id,
                })

                if (!resp) return
                setMechDetails(resp)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [item.mech?.id, send])

    const { end_at, buyout_price, owner, mech } = item

    if (!mech || !owner) return null

    const { username, public_address } = owner
    const { name, label, tier, avatar_url } = mech

    // tier
    tier
    rarityDeets.label
    rarityDeets.color

    // mech
    name || label

    // owner
    username
    public_address

    // item
    end_at
    buyout_price

    return (
        <Box sx={{ position: "relative", overflow: "visible" }}>
            <ClipThing
                clipSize="8px"
                border={{
                    isFancy: true,
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".2rem",
                }}
                opacity={0.7}
                backgroundColor={theme.factionTheme.background}
            >
                <Stack spacing="1.2rem" direction="row" sx={{ height: "100%", px: "1rem", py: "1rem" }}>
                    <Box
                        sx={{
                            flexShrink: 0,
                            width: "7rem",
                            height: "5.2rem",
                            background: `url(${avatar_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                    />
                </Stack>
            </ClipThing>
        </Box>
    )
}

export const WarMachineMarketItemLoadingSkeleton = () => {
    return <Stack>Loading...</Stack>
}
