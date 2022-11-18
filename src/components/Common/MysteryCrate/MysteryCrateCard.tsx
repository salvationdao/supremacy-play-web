import { Stack, Typography } from "@mui/material"
import React, { useCallback, useMemo, useState } from "react"
import { SafePNG } from "../../../assets"
import { useAuth, useGlobalNotifications, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { truncateTextLines } from "../../../helpers"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { fonts } from "../../../theme/theme"
import { MysteryCrate, MysteryCrateType, OpenCrateResponse } from "../../../types"
import { OpeningCrate } from "../../FleetCrates/FleetCrates"
import { MediaPreview } from "../MediaPreview/MediaPreview"
import { NiceBoxThing } from "../Nice/NiceBoxThing"
import { NiceButton } from "../Nice/NiceButton"

interface MysteryCrateCardProps {
    crate: MysteryCrate
    setOpeningCrate: React.Dispatch<React.SetStateAction<OpeningCrate | undefined>>
    setOpenedRewards: React.Dispatch<React.SetStateAction<OpenCrateResponse | undefined>>
}

export const MysteryCrateCard = React.memo(function MysteryCrateCard({ crate, setOpeningCrate, setOpenedRewards }: MysteryCrateCardProps) {
    const theme = useTheme()
    const { factionID } = useAuth()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [isLoading, setIsLoading] = useState(false)
    const { getFaction } = useSupremacy()

    const ownerFaction = useMemo(() => getFaction(factionID), [getFaction, factionID])

    const openCrate = useCallback(async () => {
        try {
            setIsLoading(true)

            setOpeningCrate({
                factionID: crate.faction_id,
                crateType: crate.label.toLowerCase().includes("weapon") ? MysteryCrateType.Weapon : MysteryCrateType.Mech,
            })

            const resp = await send<OpenCrateResponse>(GameServerKeys.OpenCrate, {
                id: crate.id,
            })

            if (!resp) return
            setOpenedRewards({ ...resp })
        } catch (e) {
            const message = typeof e === "string" ? e : "Failed to open mystery crate."
            newSnackbarMessage(message, "error")
            console.error(message)
        } finally {
            setIsLoading(false)
        }
    }, [setOpeningCrate, crate.faction_id, crate.label, crate.id, send, setOpenedRewards, newSnackbarMessage])

    return (
        <NiceBoxThing
            border={{
                color: "#FFFFFF20",
                thickness: "very-lean",
            }}
            background={{ colors: ["#FFFFFF", "#FFFFFF"], opacity: 0.06 }}
            sx={{ p: "1rem 1.5rem" }}
        >
            <Stack spacing="1.2rem">
                {/* Crate name */}
                <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{crate.label}</Typography>

                {/* Mech image */}
                <NiceBoxThing
                    border={{ color: `#FFFFFF20`, thickness: "very-lean" }}
                    background={{ colors: [ownerFaction.background_color] }}
                    sx={{ boxShadow: 0.4 }}
                >
                    <MediaPreview
                        imageUrl={crate.large_image_url || crate.image_url || crate.avatar_url || SafePNG}
                        videoUrls={[crate.animation_url, crate.card_animation_url]}
                        objectFit="cover"
                        sx={{ height: "20rem" }}
                    />
                </NiceBoxThing>

                {/* Crate description */}
                {crate.description && <Typography sx={{ ...truncateTextLines(2) }}>{crate.description}</Typography>}

                {/* Open button */}
                <NiceButton buttonColor={theme.factionTheme.primary} corners disabled={new Date() < crate.locked_until} loading={isLoading} onClick={openCrate}>
                    Open
                </NiceButton>
            </Stack>
        </NiceBoxThing>
    )
})
