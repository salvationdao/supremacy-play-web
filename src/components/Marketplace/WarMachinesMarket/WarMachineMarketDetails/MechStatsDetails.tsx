import { Box, Stack, Typography } from "@mui/material"
import { ClipThing } from "../../.."
import { SvgStats, SvgIntroAnimation, SvgOutroAnimation, SvgPowerCore, SvgSkin, SvgUtilities, SvgWeapons } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { colors, fonts } from "../../../../theme/theme"
import { MechDetails } from "../../../../types"
import { MechBarStats } from "../../../Hangar/WarMachinesHangar/WarMachineHangarItem/MechBarStats"

export const MechStatsDetails = ({ mechDetails }: { mechDetails?: MechDetails }) => {
    const theme = useTheme()

    if (!mechDetails) return null

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background
    const { weapon_hardpoints, utility_slots, chassis_skin_id, intro_animation_id, outro_animation_id, power_core_id } = mechDetails

    const chassisSkin = mechDetails?.chassis_skin
    const introAnimation = mechDetails?.intro_animation
    const outroAnimation = mechDetails?.outro_animation
    const powerCore = mechDetails?.power_core
    const weapons = mechDetails?.weapons
    const utilities = mechDetails?.utility

    return (
        <Stack spacing="3rem">
            <Stack spacing="1rem">
                <Stack direction="row" spacing=".8rem" alignItems="center">
                    <SvgStats fill={primaryColor} size="1.8rem" />
                    <Typography variant="h5" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                        WAR MACHINE STATS
                    </Typography>
                </Stack>
                <MechBarStats
                    mech={mechDetails}
                    mechDetails={mechDetails}
                    color={primaryColor}
                    fontSize="1.3rem"
                    width="100%"
                    spacing="1.2rem"
                    barHeight=".8rem"
                />
            </Stack>

            <Stack spacing="1rem">
                <Stack direction="row" spacing=".6rem" alignItems="center">
                    <SvgWeapons fill={colors.weapons} size="2.5rem" />
                    <Typography variant="h5" sx={{ color: colors.weapons, fontFamily: fonts.nostromoBlack }}>
                        WEAPONS ({weapons.length}/{weapon_hardpoints})
                    </Typography>
                </Stack>

                {weapons.length > 0 ? (
                    <Stack direction="row" flexWrap="wrap">
                        {weapons.map((w) => {
                            return <Card key={w.id} imageUrl={w.avatar_url} value={w.label} primaryColor={colors.weapons} backgroundColor={backgroundColor} />
                        })}
                    </Stack>
                ) : (
                    <Typography sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>NOT EQUIPPED</Typography>
                )}
            </Stack>

            <Stack spacing="1rem">
                <Stack direction="row" spacing=".6rem" alignItems="center">
                    <SvgPowerCore fill={colors.powerCore} size="2.5rem" />
                    <Typography variant="h5" sx={{ color: colors.powerCore, fontFamily: fonts.nostromoBlack }}>
                        POWER CORE ({power_core_id ? 1 : 0}/1)
                    </Typography>
                </Stack>

                {powerCore ? (
                    <Card imageUrl={powerCore.avatar_url} value={powerCore.label} primaryColor={colors.powerCore} backgroundColor={backgroundColor} />
                ) : (
                    <Typography sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>NOT EQUIPPED</Typography>
                )}
            </Stack>

            <Stack spacing="1rem">
                <Stack direction="row" spacing=".6rem" alignItems="center">
                    <SvgUtilities fill={colors.utilities} size="2.5rem" />
                    <Typography variant="h5" sx={{ color: colors.utilities, fontFamily: fonts.nostromoBlack }}>
                        UTILITIES ({utilities.length}/{utility_slots})
                    </Typography>
                </Stack>

                {utilities.length > 0 ? (
                    <Stack direction="row" flexWrap="wrap">
                        {utilities.map((w) => {
                            return <Card key={w.id} imageUrl={w.avatar_url} value={w.label} primaryColor={colors.utilities} backgroundColor={backgroundColor} />
                        })}
                    </Stack>
                ) : (
                    <Typography sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>NOT EQUIPPED</Typography>
                )}
            </Stack>

            <Stack spacing="1rem">
                <Stack direction="row" spacing=".6rem" alignItems="center">
                    <SvgSkin fill={colors.chassisSkin} size="2.5rem" />
                    <Typography variant="h5" sx={{ color: colors.chassisSkin, fontFamily: fonts.nostromoBlack }}>
                        SUBMODEL ({chassis_skin_id ? 1 : 0}/1)
                    </Typography>
                </Stack>

                {chassisSkin ? (
                    <Card imageUrl={chassisSkin.image_url} value={chassisSkin.label} primaryColor={colors.chassisSkin} backgroundColor={backgroundColor} />
                ) : (
                    <Typography sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>NOT EQUIPPED</Typography>
                )}
            </Stack>

            <Stack spacing="1rem">
                <Stack direction="row" spacing=".6rem" alignItems="center">
                    <SvgIntroAnimation fill={colors.introAnimation} size="2.5rem" />
                    <Typography variant="h5" sx={{ color: colors.introAnimation, fontFamily: fonts.nostromoBlack }}>
                        INTRO ANIMATION ({intro_animation_id ? 1 : 0}/1)
                    </Typography>
                </Stack>

                {introAnimation ? (
                    <Card
                        imageUrl={introAnimation.avatar_url}
                        value={introAnimation.label}
                        primaryColor={colors.introAnimation}
                        backgroundColor={backgroundColor}
                    />
                ) : (
                    <Typography sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>NOT EQUIPPED</Typography>
                )}
            </Stack>

            <Stack spacing="1rem">
                <Stack direction="row" spacing=".6rem" alignItems="center">
                    <SvgOutroAnimation fill={colors.outroAnimation} size="2.5rem" />
                    <Typography variant="h5" sx={{ color: colors.outroAnimation, fontFamily: fonts.nostromoBlack }}>
                        OUTRO ANIMATION ({outro_animation_id ? 1 : 0}/1)
                    </Typography>
                </Stack>

                {outroAnimation ? (
                    <Card
                        imageUrl={outroAnimation.avatar_url}
                        value={outroAnimation.label}
                        primaryColor={colors.outroAnimation}
                        backgroundColor={backgroundColor}
                    />
                ) : (
                    <Typography sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>NOT EQUIPPED</Typography>
                )}
            </Stack>
        </Stack>
    )
}

const Card = ({ imageUrl, value, primaryColor, backgroundColor }: { imageUrl?: string; value: string; primaryColor: string; backgroundColor: string }) => {
    return (
        <Box sx={{ p: ".8rem" }}>
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: primaryColor,
                    borderThickness: ".3rem",
                }}
                opacity={0.6}
                backgroundColor={backgroundColor}
                sx={{ width: "16rem" }}
            >
                <Stack alignItems="center" sx={{ px: "1rem", py: "1rem", textAlign: "center" }}>
                    <Box
                        sx={{
                            mb: "1rem",
                            height: "8rem",
                            width: "100%",
                            p: ".5rem",
                            borderRadius: 1,
                            boxShadow: "inset 0 0 12px 6px #00000040",
                            background: `radial-gradient(${backgroundColor}05 10px, ${backgroundColor})`,
                            border: `${primaryColor}06 2px solid`,
                        }}
                    >
                        <Box
                            component="img"
                            src={imageUrl}
                            alt={value}
                            sx={{
                                height: "100%",
                                width: "100%",
                                objectFit: "contain",
                                objectPosition: "center",
                            }}
                        />
                    </Box>

                    <Typography variant="body2" sx={{ color: primaryColor, fontFamily: fonts.nostromoBold }}>
                        {value}
                    </Typography>
                </Stack>
            </ClipThing>
        </Box>
    )
}
