import { Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { SvgGlobal, SvgLine, SvgMicrochip, SvgQuestionMark, SvgTarget } from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"
import { truncateTextLines } from "../../../helpers"
import { fonts } from "../../../theme/theme"
import { LocationSelectType, PlayerAbility } from "../../../types"
import { MediaPreview } from "../MediaPreview/MediaPreview"
import { NiceBoxThing } from "../Nice/NiceBoxThing"
import { NiceTooltip } from "../Nice/NiceTooltip"

interface PlayerAbilityPlayerAbilityCardProps {
    playerAbility: PlayerAbility
}

export const PlayerAbilityCard = React.memo(function PlayerAbilityCard({ playerAbility }: PlayerAbilityPlayerAbilityCardProps) {
    const { factionID } = useAuth()
    const { getFaction } = useSupremacy()

    const ownerFaction = useMemo(() => getFaction(factionID), [getFaction, factionID])

    const [icon, iconTooltip] = useMemo(() => {
        switch (playerAbility.ability.location_select_type) {
            case LocationSelectType.Global:
                return [<SvgGlobal inline size="2.2rem" key={LocationSelectType.Global} />, "This ability will affect all units on the map."]
            case LocationSelectType.LocationSelect:
                return [<SvgTarget inline size="2.2rem" key={LocationSelectType.LocationSelect} />, "This ability will target a specific location on the map."]
            case LocationSelectType.MechSelect:
                return [<SvgMicrochip inline size="2.2rem" key={LocationSelectType.MechSelect} />, "This ability will target a specific mech on the map."]
            case LocationSelectType.MechSelectAllied:
                return [
                    <SvgMicrochip inline size="2.2rem" key={LocationSelectType.MechSelectAllied} />,
                    "This ability will target a specific allied mech on the map.",
                ]
            case LocationSelectType.MechSelectOpponent:
                return [
                    <SvgMicrochip inline size="2.2rem" key={LocationSelectType.MechSelectOpponent} />,
                    "This ability will target a specific opponent mech on the map.",
                ]
            case LocationSelectType.LineSelect:
                return [<SvgLine inline size="2.2rem" key={LocationSelectType.LineSelect} />, "This ability will target a straight line on the map."]
        }

        return [<SvgQuestionMark key="MISCELLANEOUS" />, "Miscellaneous ability type."]
    }, [playerAbility])

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
                {/* Keycard name and count */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing="1rem">
                    {/* Keycard name */}
                    <Typography sx={{ fontFamily: fonts.nostromoBlack }}>
                        <NiceTooltip text={iconTooltip} placement="right-start">
                            {icon}
                        </NiceTooltip>{" "}
                        {playerAbility.ability.label}
                    </Typography>

                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {playerAbility.count}x
                    </Typography>
                </Stack>

                {/* Keycard image */}
                <NiceBoxThing
                    border={{ color: `#FFFFFF20`, thickness: "very-lean" }}
                    background={{ colors: [ownerFaction.background_color] }}
                    sx={{ position: "relative", boxShadow: 0.4 }}
                >
                    <MediaPreview imageUrl={playerAbility.ability.image_url} objectFit="cover" sx={{ height: "20rem" }} />
                </NiceBoxThing>

                {/* Keycard description */}
                <Typography sx={{ ...truncateTextLines(2) }}>{playerAbility.ability.description}</Typography>
            </Stack>
        </NiceBoxThing>
    )
})
