import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { FactionPassBgPNG, FactionPassSs1PNG, FactionPassSs2PNG, SvgFactionPassArrow } from "../../../assets"
import { FactionIDs } from "../../../constants"
import { useAuth, useSupremacy } from "../../../containers"
import { colors, fonts } from "../../../theme/theme"
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

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
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
                border={{ color: faction.primary_color }}
                background={{ color: [colors.darkNavyBlue, faction.background_color, faction.background_color] }}
                sx={{ position: "relative", m: "2rem", filter: `drop-shadow(0 3px 4px ${faction.primary_color}80)`, zIndex: 2 }}
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
                        backgroundColor: faction.background_color,
                        zIndex: 6,
                        border: `${faction.primary_color} 2px solid`,
                        borderRadius: "50%",
                    }}
                />

                <Stack spacing="4rem" sx={{ position: "relative", p: "4.2rem 5.5rem" }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing="2rem">
                        <Typography variant="h4" sx={{ color: faction.primary_color, fontFamily: fonts.nostromoHeavy }}>
                            {faction.label} FACTION PASS
                        </Typography>
                        <SvgFactionPassArrow size="5.5rem" fill={faction.primary_color} />
                    </Stack>

                    <Stack spacing="5rem" direction="row" alignItems="center">
                        {/* Brief description */}
                        <Box>
                            <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                                The faction pass allows you to:
                            </Typography>
                            <Typography variant="h6" sx={{ mt: "1rem", ml: ".5rem", lineHeight: 2 }}>
                                • Borrow staked mechs from the faction Mech Pool
                                <br />
                                • Earn $SUPS on staked mechs wins
                                <br />
                                • Enable direct repairs from other faction pass holders
                                <br />
                                • Earn multipliers by staking mechs
                                <br />
                                • See comprehensive statistics
                                <br />
                            </Typography>
                        </Box>

                        {/* Screenshots */}
                        <Box sx={{ position: "relative", alignSelf: "stretch", flex: 1, filter: `hue-rotate(${hueRotate}deg)` }}>
                            <Box
                                component="img"
                                src={FactionPassSs1PNG}
                                sx={{
                                    position: "absolute",
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
                        <FactionPassOption faction={faction} days={1} />
                        <FactionPassOption faction={faction} days={DAYS_IN_A_MONTH} />
                        <FactionPassOption faction={faction} days={365} />
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
                    backgroundColor: `${faction.primary_color}10`,
                    zIndex: 1,
                }}
            />
        </Stack>
    )
}
