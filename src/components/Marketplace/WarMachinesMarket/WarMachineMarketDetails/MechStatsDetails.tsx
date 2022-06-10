import { Box, Stack, Typography } from "@mui/material"
import { ClipThing } from "../../.."
import { colors, fonts } from "../../../../theme/theme"
import { MechDetails } from "../../../../types"
import { MechBarStats } from "../../../Hangar/WarMachinesHangar/WarMachineHangarItem/MechBarStats"

export const MechStatsDetails = ({
    mechDetails,
    primaryColor,
    backgroundColor,
}: {
    mechDetails?: MechDetails
    primaryColor: string
    backgroundColor: string
}) => {
    if (!mechDetails) return null

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
                <Typography variant="h5" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                    WAR MACHINE STATS
                </Typography>
                <MechBarStats
                    mech={mechDetails}
                    mechDetails={mechDetails}
                    color={primaryColor}
                    fontSize="1.3rem"
                    width="100%"
                    spacing=".9rem"
                    barHeight=".8rem"
                />
            </Stack>

            <Stack spacing="1rem">
                <Typography variant="h5" sx={{ color: colors.weapons, fontFamily: fonts.nostromoBlack }}>
                    WEAPONS ({weapons.length}/{weapon_hardpoints})
                </Typography>

                {weapons.length > 0 ? (
                    <Stack direction="row" spacing="1.6rem" flexWrap="wrap">
                        {weapons.map((w) => {
                            return <Card key={w.id} imageUrl={w.image_url} value={w.label} primaryColor={colors.weapons} backgroundColor={backgroundColor} />
                        })}
                    </Stack>
                ) : (
                    <Typography sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>NOT EQUIPPED</Typography>
                )}
            </Stack>

            <Stack spacing="1rem">
                <Typography variant="h5" sx={{ color: colors.powerCore, fontFamily: fonts.nostromoBlack }}>
                    POWER CORE ({power_core_id ? 1 : 0}/1)
                </Typography>

                {powerCore ? (
                    <Card imageUrl={powerCore.image_url} value={powerCore.label} primaryColor={colors.powerCore} backgroundColor={backgroundColor} />
                ) : (
                    <Typography sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>NOT EQUIPPED</Typography>
                )}
            </Stack>

            <Stack spacing="1rem">
                <Typography variant="h5" sx={{ color: colors.utilities, fontFamily: fonts.nostromoBlack }}>
                    UTILITIES ({utilities.length}/{utility_slots})
                </Typography>

                {utilities.length > 0 ? (
                    <Stack direction="row" spacing="1.6rem" flexWrap="wrap">
                        {utilities.map((w) => {
                            return <Card key={w.id} imageUrl={w.image_url} value={w.label} primaryColor={colors.utilities} backgroundColor={backgroundColor} />
                        })}
                    </Stack>
                ) : (
                    <Typography sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>NOT EQUIPPED</Typography>
                )}
            </Stack>

            <Stack spacing="1rem">
                <Typography variant="h5" sx={{ color: colors.chassisSkin, fontFamily: fonts.nostromoBlack }}>
                    CHASSIS SKIN ({chassis_skin_id ? 1 : 0}/1)
                </Typography>

                {chassisSkin ? (
                    <Card imageUrl={chassisSkin.image_url} value={chassisSkin.label} primaryColor={colors.chassisSkin} backgroundColor={backgroundColor} />
                ) : (
                    <Typography sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>NOT EQUIPPED</Typography>
                )}
            </Stack>

            <Stack spacing="1rem">
                <Typography variant="h5" sx={{ color: colors.introAnimation, fontFamily: fonts.nostromoBlack }}>
                    INTRO ANIMATION ({intro_animation_id ? 1 : 0}/1)
                </Typography>

                {introAnimation ? (
                    <Card
                        imageUrl={introAnimation.image_url}
                        value={introAnimation.label}
                        primaryColor={colors.introAnimation}
                        backgroundColor={backgroundColor}
                    />
                ) : (
                    <Typography sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>NOT EQUIPPED</Typography>
                )}
            </Stack>

            <Stack spacing="1rem">
                <Typography variant="h5" sx={{ color: colors.outroAnimation, fontFamily: fonts.nostromoBlack }}>
                    OUTRO ANIMATION ({outro_animation_id ? 1 : 0}/1)
                </Typography>

                {outroAnimation ? (
                    <Card
                        imageUrl={outroAnimation.image_url}
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
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: primaryColor,
                borderThickness: ".2rem",
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
    )
}
