import { Box, Stack } from "@mui/material"
import { ReactNode } from "react"
import { FancyButton, TooltipHelper } from "../../.."
import { SvgIntroAnimation, SvgOutroAnimation, SvgPlus, SvgPowerCore, SvgSkin, SvgUtilities, SvgWeapons } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { colors } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"

const ITEM_WIDTH = 7.5 //rem

export const MechLoadout = ({ mech, mechDetails }: { mech: MechBasic; mechDetails?: MechDetails }) => {
    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary

    const { chassis_skin_id, intro_animation_id, outro_animation_id, power_core_id } = mech

    const chassisSkin = mechDetails?.chassis_skin
    const introAnimation = mechDetails?.intro_animation
    const outroAnimation = mechDetails?.outro_animation
    const powerCore = mechDetails?.power_core
    const weapons = mechDetails?.weapons
    const utilities = mechDetails?.utility

    return (
        <Box
            sx={{
                flex: 1,
                height: "100%",
                minWidth: `${3 * ITEM_WIDTH}rem`,
                pb: ".6rem",
                overflowY: "hidden",
                overflowX: "auto",
                direction: "ltr",

                "::-webkit-scrollbar": {
                    height: ".4rem",
                },
                "::-webkit-scrollbar-track": {
                    background: "#FFFFFF15",
                    borderRadius: 3,
                },
                "::-webkit-scrollbar-thumb": {
                    background: (theme) => theme.factionTheme.primary,
                    borderRadius: 3,
                },
            }}
        >
            <Stack sx={{ flexWrap: "wrap", height: "100%", width: "fit-content" }}>
                {power_core_id && (
                    <LoadoutItem
                        imageUrl={powerCore?.avatar_url}
                        Icon={<SvgPowerCore fill={colors.powerCore} size="1.3rem" />}
                        primaryColor={primaryColor}
                        tooltipText={powerCore?.label}
                    />
                )}

                {chassis_skin_id && (
                    <LoadoutItem
                        imageUrl={chassisSkin?.image_url}
                        Icon={<SvgSkin fill={colors.chassisSkin} size="1.3rem" />}
                        primaryColor={primaryColor}
                        tooltipText={chassisSkin?.label}
                    />
                )}

                {intro_animation_id && (
                    <LoadoutItem
                        imageUrl={introAnimation?.avatar_url}
                        Icon={<SvgIntroAnimation fill={colors.introAnimation} size="1.3rem" />}
                        primaryColor={primaryColor}
                        tooltipText={introAnimation?.label}
                    />
                )}

                {outro_animation_id && (
                    <LoadoutItem
                        imageUrl={outroAnimation?.avatar_url}
                        Icon={<SvgOutroAnimation fill={colors.outroAnimation} size="1.3rem" />}
                        primaryColor={primaryColor}
                        tooltipText={outroAnimation?.label}
                    />
                )}

                {weapons?.map((w) => (
                    <LoadoutItem
                        key={`mech-loadout-weapon-${w.id}`}
                        imageUrl={w?.avatar_url}
                        Icon={<SvgWeapons fill={colors.weapons} size="1.3rem" />}
                        primaryColor={primaryColor}
                        tooltipText={w.label}
                    />
                ))}

                {utilities?.map((u) => (
                    <LoadoutItem
                        key={`mech-loadout-utility-${u.id}`}
                        imageUrl={u?.avatar_url}
                        Icon={<SvgUtilities fill={colors.utilities} size="1.3rem" />}
                        primaryColor={primaryColor}
                        tooltipText={u.label}
                    />
                ))}

                {/* <AddLoadoutItem primaryColor={primaryColor} /> */}
            </Stack>
        </Box>
    )
}

const LoadoutItem = ({ imageUrl, primaryColor, tooltipText, Icon }: { imageUrl?: string; primaryColor: string; tooltipText?: string; Icon: ReactNode }) => {
    return (
        <Box sx={{ position: "relative", flexBasis: "50%", width: `${ITEM_WIDTH}rem`, p: ".3rem" }}>
            <FancyButton
                clipThingsProps={{
                    clipSize: "10px",
                    backgroundColor: primaryColor,
                    opacity: 0.1,
                    border: {
                        isFancy: true,
                        borderColor: primaryColor,
                        borderThickness: ".15rem",
                    },
                    sx: { height: "100%" },
                }}
                sx={{ height: "100%", color: primaryColor, p: ".8rem", minWidth: 0 }}
                innerSx={{ p: 0 }}
                // onClick={() => alert("TODO: open loadout menu modal.")}
            >
                <TooltipHelper placement="bottom" text={tooltipText}>
                    <Box
                        sx={{
                            height: "100%",
                            width: "100%",
                            overflow: "hidden",
                            background: `url(${imageUrl})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            borderRadius: 1,
                        }}
                    />
                </TooltipHelper>
            </FancyButton>

            <Box
                sx={{
                    position: "absolute",
                    right: ".4rem",
                    bottom: ".2rem",
                    pl: ".3rem",
                    pt: ".3rem",
                    opacity: 0.82,
                    borderTopLeftRadius: "50%",
                    backgroundColor: "#000000DD",
                }}
            >
                {Icon}
            </Box>
        </Box>
    )
}

export const AddLoadoutItem = ({ primaryColor }: { primaryColor: string }) => {
    return (
        <Box sx={{ flexBasis: "50%", width: `${ITEM_WIDTH}rem`, p: ".2rem" }}>
            <FancyButton
                clipThingsProps={{
                    clipSize: "10px",
                    backgroundColor: primaryColor,
                    opacity: 0.15,
                    border: {
                        isFancy: true,
                        borderColor: primaryColor,
                        borderThickness: ".15rem",
                    },
                    sx: { height: "100%" },
                }}
                sx={{ height: "100%", color: primaryColor }}
                innerSx={{ p: 0 }}
                // onClick={() => alert("TODO: open loadout menu modal.")}
            >
                <Stack justifyContent="center" sx={{ height: "100%" }}>
                    <SvgPlus sx={{ opacity: 0.15 }} />
                </Stack>
            </FancyButton>
        </Box>
    )
}
