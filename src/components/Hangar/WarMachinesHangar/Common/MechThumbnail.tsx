import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { ClipThing } from "../../.."
import { useTheme } from "../../../../containers/theme"
import { getRarityDeets } from "../../../../helpers"
import { fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"

export const MechThumbnail = ({ mech, mechDetails, smallSize }: { mech: MechBasic; mechDetails?: MechDetails; smallSize?: boolean }) => {
    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary
    const rarityDeets = useMemo(() => getRarityDeets(mech.tier || mechDetails?.tier || ""), [mech, mechDetails])
    const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined
    const imageUrl = skin?.avatar_url || skin?.image_url || mech.avatar_url || mech.image_url

    return (
        <ClipThing
            clipSize={smallSize ? "6px" : "8px"}
            border={{
                borderColor: primaryColor,
                borderThickness: imageUrl && !smallSize ? "0" : ".18rem",
            }}
            backgroundColor={theme.factionTheme.background}
            sx={{ flex: 1, position: "relative" }}
        >
            {!smallSize && (
                <Typography
                    variant="body1"
                    sx={{
                        position: "absolute",
                        bottom: "1px",
                        left: "2px",
                        lineHeight: 1,
                        fontFamily: fonts.nostromoHeavy,
                        color: rarityDeets.color,
                    }}
                >
                    <span
                        style={{
                            padding: ".1rem .6rem",
                            lineHeight: 1.5,
                            backgroundColor: `${theme.factionTheme.background}DD`,
                        }}
                    >
                        {rarityDeets.label}
                    </span>
                </Typography>
            )}

            <Box
                sx={{
                    height: "100%",
                    width: smallSize ? "8rem" : "16.8rem",
                    overflow: "hidden",
                    background: `url(${imageUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "top",
                    backgroundSize: "cover",
                }}
            >
                {!imageUrl && (
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                        <CircularProgress size="2.2rem" sx={{ color: primaryColor }} />
                    </Stack>
                )}
            </Box>
        </ClipThing>
    )
}
