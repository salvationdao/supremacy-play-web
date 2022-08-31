import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { ClipThing, TooltipHelper } from "../.."
import { SvgGlobal, SvgLine, SvgMicrochip, SvgQuestionMark, SvgTarget } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"
import { LocationSelectType, PlayerAbility } from "../../../types"
import { MediaPreview } from "../../Common/MediaPreview/MediaPreview"

export interface PlayerAbilityHangarItemProps {
    playerAbility: PlayerAbility
}

export const PlayerAbilityHangarItem = ({ playerAbility }: PlayerAbilityHangarItemProps) => {
    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    const [abilityTypeIcon, abilityTypeDescription] = useMemo(() => {
        switch (playerAbility.ability.location_select_type) {
            case LocationSelectType.Global:
                return [<SvgGlobal key={LocationSelectType.Global} />, "This ability will affect all units on the map."]
            case LocationSelectType.LocationSelect:
                return [<SvgTarget key={LocationSelectType.LocationSelect} />, "This ability will target a specific location on the map."]
            case LocationSelectType.MechSelect:
                return [<SvgMicrochip key={LocationSelectType.MechSelect} />, "This ability will target a specific mech on the map."]
            case LocationSelectType.MechSelectAllied:
                return [<SvgMicrochip key={LocationSelectType.MechSelectAllied} />, "This ability will target a specific allied mech on the map."]
            case LocationSelectType.MechSelectOpponent:
                return [<SvgMicrochip key={LocationSelectType.MechSelectOpponent} />, "This ability will target a specific opponent mech on the map."]
            case LocationSelectType.LineSelect:
                return [<SvgLine key={LocationSelectType.LineSelect} />, "This ability will target a straight line on the map."]
        }

        return [<SvgQuestionMark key="MISCELLANEOUS" />, "Miscellaneous ability type."]
    }, [playerAbility])

    return (
        <ClipThing
            clipSize="12px"
            border={{
                borderColor: primaryColor,
                borderThickness: ".2rem",
            }}
            opacity={0.9}
            backgroundColor={backgroundColor}
            sx={{
                transition: "all .15s",
                ":hover": {
                    transform: "translateY(-.4rem)",
                },
            }}
        >
            <Stack spacing={"1.5rem"} justifyContent="center" sx={{ height: "100%", p: "1.5rem" }}>
                {/* Image */}
                <Box sx={{ position: "relative", height: "20rem" }}>
                    <MediaPreview imageUrl={playerAbility.ability.image_url} objectFit="cover" />

                    <Typography
                        variant="body2"
                        sx={{ position: "absolute", top: ".3rem", left: ".3rem", p: "0 .4rem", fontFamily: fonts.nostromoBold, backgroundColor: "#000000CC" }}
                    >
                        {playerAbility.count} in inventory
                    </Typography>

                    <TooltipHelper text={abilityTypeDescription} placement="bottom-start">
                        <Stack
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                position: "absolute",
                                right: 0,
                                bottom: 0,
                                height: "3rem",
                                width: "3rem",
                                "& div": {
                                    p: 0,
                                },
                            }}
                        >
                            {abilityTypeIcon}
                        </Stack>
                    </TooltipHelper>
                </Box>

                <Stack spacing="1rem" sx={{ flex: 1, px: ".4rem", py: ".3rem" }}>
                    <Typography variant="h6" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                        {playerAbility.ability.label}
                    </Typography>

                    <Typography variant="h6" sx={{}}>
                        {playerAbility.ability.description}
                    </Typography>
                </Stack>
            </Stack>

            {/* <Stack sx={{ height: "100%", px: "1.5rem", pt: "1.2rem", pb: ".6rem" }}>
                <Stack direction="row" spacing="1.2rem" mb="1rem">
                    <ClipThing
                        corners={{
                            topLeft: true,
                        }}
                        sx={{
                            position: "relative",
                            width: "10rem",
                            height: "10rem",
                        }}
                    >
                        <Box
                            component="img"
                            src={playerAbility.ability.image_url}
                            alt={`Thumbnail image for ${playerAbility.ability.label}`}
                            sx={{
                                height: "100%",
                                width: "100%",
                            }}
                        />
                        <TooltipHelper text={abilityTypeDescription} placement="bottom-start">
                            <Stack
                                justifyContent="center"
                                alignItems="center"
                                sx={{
                                    position: "absolute",
                                    right: 0,
                                    bottom: 0,
                                    height: "3rem",
                                    width: "3rem",
                                    "& div": {
                                        p: 0,
                                    },
                                }}
                            >
                                {abilityTypeIcon}
                            </Stack>
                        </TooltipHelper>
                    </ClipThing>

                    <Stack sx={{ flex: 1 }}>
                        <Typography gutterBottom variant="h6" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                            {playerAbility.ability.label}
                        </Typography>

                        <Typography>{playerAbility.ability.description}</Typography>
                    </Stack>
                </Stack>

                <Box sx={{ mt: "auto" }}>
                    <Typography variant="caption" sx={{ textAlign: "end", color: colors.neonBlue, fontFamily: fonts.nostromoBlack }}>
                        {playerAbility.count} in inventory
                    </Typography>
                </Box>
            </Stack> */}
        </ClipThing>
    )
}
