import { Box, CircularProgress, Stack } from "@mui/material"
import { ReactNode } from "react"
import { FancyButton, TooltipHelper } from "../../.."
import { SvgPlus, SvgPowerCore, SvgSkin, SvgIntroAnimation, SvgOutroAnimation, SvgWeapons, SvgUtilities } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { MechBasic, MechDetails } from "../../../../types"

const ITEM_WIDTH = 7.5 //rem

export const MechLoadout = ({ loading, mech, mechDetails }: { loading: boolean, mech: MechBasic; mechDetails?: MechDetails }) => {
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
                scrollbarWidth: "none",
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
                        loading={loading}
                        imageUrl={powerCore?.image_url}
                        Icon={<SvgPowerCore size="1.1rem" />}
                        primaryColor={primaryColor}
                        tooltipText={powerCore?.label}
                    />
                )}
                {chassis_skin_id && (
                    <LoadoutItem
                        loading={loading}
                        imageUrl={chassisSkin?.image_url}
                        Icon={<SvgSkin size="1.1rem" />}
                        primaryColor={primaryColor}
                        tooltipText={chassisSkin?.label}
                    />
                )}
                {intro_animation_id && (
                    <LoadoutItem
                        loading={loading}
                        imageUrl={introAnimation?.image_url}
                        Icon={<SvgIntroAnimation size="1.1rem" />}
                        primaryColor={primaryColor}
                        tooltipText={introAnimation?.label}
                    />
                )}
                {outro_animation_id && (
                    <LoadoutItem
                        loading={loading}
                        imageUrl={outroAnimation?.image_url}
                        Icon={<SvgOutroAnimation size="1.1rem" />}
                        primaryColor={primaryColor}
                        tooltipText={outroAnimation?.label}
                    />
                )}
                {weapons?.map((w) => (
                    <LoadoutItem
                        loading={loading}
                        key={`mech-loadout-weapon-${w.id}`}
                        imageUrl={w?.image_url}
                        Icon={<SvgWeapons size="1.1rem" />}
                        primaryColor={primaryColor}
                        tooltipText={w.label}
                    />
                ))}
                {utilities?.map((u) => (
                    <LoadoutItem
                        loading={loading}
                        key={`mech-loadout-utility-${u.id}`}
                        imageUrl={u?.image_url}
                        Icon={<SvgUtilities size="1.1rem" />}
                        primaryColor={primaryColor}
                        tooltipText={u.label}
                    />
                ))}
                <AddLoadoutItem primaryColor={primaryColor} />
            </Stack>
        </Box>
    )
}

const LoadoutItem = ({ loading, imageUrl, primaryColor, tooltipText, Icon }: { loading: boolean, imageUrl?: string; primaryColor: string; tooltipText?: string; Icon: ReactNode }) => {
    return (
        <Box sx={{ position: "relative", flexBasis: "50%", width: `${ITEM_WIDTH}rem`, p: ".2rem" }}>
            <FancyButton
                excludeCaret
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
                onClick={() => alert("TODO: open loadout menu modal.")}
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
                        }}
                    >
                        {!imageUrl && loading && (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                <CircularProgress size="2.2rem" sx={{ color: primaryColor }} />
                            </Stack>
                        )}
                    </Box>
                </TooltipHelper>
            </FancyButton>

            <Box
                sx={{
                    position: "absolute",
                    right: ".4rem",
                    bottom: ".2rem",
                    pl: ".4rem",
                    pt: ".2rem",
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

const AddLoadoutItem = ({ primaryColor }: { primaryColor: string }) => {
    return (
        <Box sx={{ flexBasis: "50%", width: `${ITEM_WIDTH}rem`, p: ".2rem" }}>
            <FancyButton
                excludeCaret
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
                onClick={() => alert("TODO: open loadout menu modal.")}
            >
                <Stack justifyContent="center" sx={{ height: "100%" }}>
                    <SvgPlus sx={{ opacity: 0.15 }} />
                </Stack>
            </FancyButton>
        </Box>
    )
}
