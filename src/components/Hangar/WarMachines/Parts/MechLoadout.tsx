import { Box, CircularProgress, Stack } from "@mui/material"
import { ClipThing, TooltipHelper } from "../../.."
import { useTheme } from "../../../../containers/theme"
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
                {power_core_id && <LoadoutItem imageUrl={powerCore?.image_url} primaryColor={primaryColor} tooltipText={powerCore?.label} />}
                {chassis_skin_id && <LoadoutItem imageUrl={chassisSkin?.image_url} primaryColor={primaryColor} tooltipText={chassisSkin?.label} />}
                {intro_animation_id && <LoadoutItem imageUrl={introAnimation?.image_url} primaryColor={primaryColor} tooltipText={introAnimation?.label} />}
                {outro_animation_id && <LoadoutItem imageUrl={outroAnimation?.image_url} primaryColor={primaryColor} tooltipText={outroAnimation?.label} />}
                {weapons?.map((w) => (
                    <LoadoutItem key={`mech-loadout-weapon-${w.id}`} imageUrl={w?.image_url} primaryColor={primaryColor} tooltipText={w.label} />
                ))}
                {utilities?.map((u) => (
                    <LoadoutItem key={`mech-loadout-utility-${u.id}`} imageUrl={u?.image_url} primaryColor={primaryColor} tooltipText={u.label} />
                ))}
            </Stack>
        </Box>
    )
}

const LoadoutItem = ({ imageUrl, primaryColor, tooltipText }: { imageUrl?: string; primaryColor: string; tooltipText?: string }) => {
    return (
        <Box sx={{ flexBasis: "50%", width: `${ITEM_WIDTH}rem`, p: ".3rem" }}>
            <ClipThing
                clipSize="10px"
                border={{
                    isFancy: true,
                    borderColor: primaryColor,
                    borderThickness: imageUrl ? "0" : ".15rem",
                }}
                opacity={0.15}
                backgroundColor={primaryColor}
                sx={{ height: "100%", p: ".5rem" }}
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
                        {!imageUrl && (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                <CircularProgress size="2.2rem" sx={{ color: primaryColor }} />
                            </Stack>
                        )}
                    </Box>
                </TooltipHelper>
            </ClipThing>
        </Box>
    )
}
