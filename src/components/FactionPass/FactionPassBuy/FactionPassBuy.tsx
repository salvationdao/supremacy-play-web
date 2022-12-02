import { Box, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { FactionPassBgPNG, FactionPassSs1PNG, FactionPassSs2PNG, SvgFactionPassArrow } from "../../../assets"
import { FactionIDs } from "../../../constants"
import { useAuth, useSupremacy } from "../../../containers"
import { useGameServerSubscriptionSecured } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { FactionPass } from "../../../types/faction_passes"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"
import { FactionPassOption } from "./FactionPassOption"

export const DAYS_IN_A_MONTH = 28

export const FactionPassBuy = () => {
    const { factionID } = useAuth()
    const { getFaction } = useSupremacy()

    const { faction, hueRotate } = useMemo(() => {
        const faction = getFaction(factionID)
        let hueRotate = 0

        switch (faction.id) {
            case FactionIDs.BC:
                hueRotate = -154
                break
            case FactionIDs.ZHI:
                hueRotate = -93
                break
        }

        return {
            faction,
            hueRotate,
        }
    }, [factionID, getFaction])

    const [factionPasses, setFactionPasses] = useState<FactionPass[]>([])
    useGameServerSubscriptionSecured<FactionPass[]>(
        {
            URI: "/faction_pass_list",
            key: GameServerKeys.SubFactionPassList,
        },
        (payload) => {
            if (!payload) return
            setFactionPasses(payload)
        },
    )

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
                padding: "2rem",
                position: "relative",
                height: "100%",
                backgroundColor: "#000000",
                background: `url(${FactionPassBgPNG})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <NiceBoxThing
                border={{ color: faction.palette.primary }}
                background={{ colors: [colors.darkNavyBlue, faction.palette.background, faction.palette.background] }}
                sx={{ position: "relative", filter: `drop-shadow(0 3px 4px ${faction.palette.primary}80)`, zIndex: 2, maxWidth: "89rem" }}
            >
                {/* Centered faction logo */}
                <Box
                    sx={{
                        position: "absolute",
                        left: "50%",
                        top: 0,
                        width: "7.4rem",
                        height: "7.4rem",
                        transform: "translate(-50%, -50%)",
                        background: `url(${faction.logo_url})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundColor: faction.palette.background,
                        zIndex: 6,
                        border: `${faction.palette.primary} 2px solid`,
                        borderRadius: "50%",
                    }}
                />

                <Stack spacing="4rem" sx={{ position: "relative", p: "4.2rem 5.5rem" }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing="2rem">
                        <Typography variant="h4" sx={{ color: faction.palette.primary, fontFamily: fonts.nostromoHeavy }}>
                            {faction.label} FACTION PASS
                        </Typography>
                        <SvgFactionPassArrow size="5.5rem" fill={faction.palette.primary} />
                    </Stack>

                    <Stack spacing="5rem" direction="row" alignItems="center">
                        {/* Brief description */}
                        <Box>
                            <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                                The faction pass allows you to:
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    mt: "1rem",
                                    ml: ".5rem",
                                    color: colors.gold,
                                    span: {
                                        opacity: 0.8,
                                        color: colors.grey,
                                        span: {
                                            color: colors.neonBlue,
                                        },
                                    },
                                }}
                            >
                                • Borrow staked mechs from the faction Mech Pool
                                <br />
                                • Earn $SUPS on staked mechs wins
                                <br />
                                <span>
                                    • Enable direct repairs from other faction pass holders <span>(coming soon)</span>
                                </span>
                                <br />
                                <span>
                                    • Earn multipliers by staking mechs <span>(coming soon)</span>
                                </span>
                                <br />
                                <span>
                                    • See comprehensive statistics <span>(coming soon)</span>
                                </span>
                                <br />
                            </Typography>
                        </Box>

                        {/* Screenshots */}
                        <Box sx={{ position: "relative", alignSelf: "stretch", flex: 1, filter: `hue-rotate(${hueRotate}deg)`, minWidth: "30rem" }}>
                            <Box
                                component="img"
                                src={FactionPassSs1PNG}
                                sx={{
                                    position: "absolute",
                                    maxHeight: "28rem",
                                    height: "auto",
                                    width: "100%",
                                    objectFit: "contain",
                                    objectPosition: "center",
                                    transform: "translate(-1.6rem, -1rem)",
                                    transition: "all .2s",
                                    zIndex: 1,
                                    ":hover": {
                                        zIndex: 3,
                                        transform: "scale(1.05) translate(-1.6rem, -1rem)",
                                    },
                                }}
                            />
                            <Box
                                component="img"
                                src={FactionPassSs2PNG}
                                sx={{
                                    position: "absolute",
                                    maxHeight: "28rem",
                                    height: "auto",
                                    width: "100%",
                                    objectFit: "contain",
                                    objectPosition: "center",
                                    transform: "translate(1.6rem, 3rem)",
                                    transition: "all .2s",
                                    zIndex: 2,
                                    ":hover": {
                                        zIndex: 3,
                                        transform: "scale(1.05) translate(1.6rem, 3rem)",
                                    },
                                }}
                            />
                        </Box>
                    </Stack>

                    {/* Buy options */}
                    <Stack direction="row" alignItems="center">
                        {factionPasses.map((fp) => (
                            <FactionPassOption key={fp.id} factionPass={fp} faction={faction} />
                        ))}
                    </Stack>
                </Stack>
            </NiceBoxThing>

            {/* Faded background underlay */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: `${faction.palette.primary}10`,
                    zIndex: 1,
                }}
            />
        </Stack>
    )
}
