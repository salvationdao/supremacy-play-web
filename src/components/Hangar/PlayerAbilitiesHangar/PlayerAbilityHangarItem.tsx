import { Box, Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { ClipThing, TooltipHelper } from "../.."
import { SvgGlobal, SvgLine, SvgMicrochip, SvgQuestionMark, SvgTarget } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"
import { LocationSelectType, PlayerAbility } from "../../../types"

export interface PlayerAbilityHangarItemProps {
    playerAbility: PlayerAbility
}

export const PlayerAbilityHangarItem = ({ playerAbility }: PlayerAbilityHangarItemProps) => {
    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    const [abilityTypeIcon, abilityTypeDescription] = useMemo(() => {
        switch (playerAbility.ability.location_select_type) {
            case LocationSelectType.GLOBAL:
                return [<SvgGlobal key={LocationSelectType.GLOBAL} />, "This ability will affect all units on the map."]
            case LocationSelectType.LOCATION_SELECT:
                return [<SvgTarget key={LocationSelectType.LOCATION_SELECT} />, "This ability will target a specific location on the map."]
            case LocationSelectType.MECH_SELECT:
                return [<SvgMicrochip key={LocationSelectType.MECH_SELECT} />, "This ability will target a specific mech on the map."]
            case LocationSelectType.LINE_SELECT:
                return [<SvgLine key={LocationSelectType.LINE_SELECT} />, "This ability will target a straight line on the map."]
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
            <Stack
                sx={{
                    height: "100%",
                    p: "1.5rem",
                }}
            >
                <Stack direction="row" spacing="1.5rem" mb="1rem">
                    <ClipThing
                        corners={{
                            topLeft: true,
                        }}
                        sx={{
                            position: "relative",
                            width: "100px",
                            height: "100px",
                        }}
                    >
                        <Box
                            component="img"
                            src={playerAbility.ability.image_url}
                            alt={`Thumbnail image for ${playerAbility.ability.label}`}
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                            }}
                        />
                        <TooltipHelper text={abilityTypeDescription}>
                            <Box
                                sx={{
                                    position: "absolute",
                                    right: 0,
                                    bottom: 0,
                                    display: "flex",
                                    height: "3rem",
                                    width: "3rem",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                                    "& div": {
                                        padding: 0,
                                    },
                                }}
                            >
                                {abilityTypeIcon}
                            </Box>
                        </TooltipHelper>
                    </ClipThing>
                    <Stack
                        sx={{
                            flex: 1,
                            px: ".4rem",
                            py: ".3rem",
                        }}
                    >
                        <Typography gutterBottom variant="h4" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                            {playerAbility.ability.label}
                        </Typography>
                        <TooltipHelper text={playerAbility.ability.description}>
                            <Typography
                                sx={{
                                    overflowY: "hidden",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    fontSize: "2.1rem",
                                }}
                            >
                                {playerAbility.ability.description}
                            </Typography>
                        </TooltipHelper>
                    </Stack>
                </Stack>
                <Stack direction="row" justifyContent="space-between" mt="auto">
                    <Typography
                        variant="h6"
                        sx={{
                            color: theme.palette.warning.light,
                        }}
                    >
                        {playerAbility.count} in inventory
                    </Typography>
                </Stack>
            </Stack>
        </ClipThing>
    )
}
