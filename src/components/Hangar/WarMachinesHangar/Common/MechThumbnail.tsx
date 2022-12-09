import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { ClipThing } from "../../.."
import { useSupremacy } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { getRarityDeets } from "../../../../helpers"
import { fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"

export const MechThumbnail = ({
    avatarUrl,
    tier,
    factionID,
    mech,
    mechDetails,
    smallSize,
    tiny,
    omitClip,
}: {
    avatarUrl?: string
    tier?: string
    factionID?: string
    mech?: MechBasic
    mechDetails?: MechDetails
    smallSize?: boolean
    tiny?: boolean
    omitClip?: boolean
}) => {
    const theme = useTheme()
    const { getFaction } = useSupremacy()
    const primaryColor = useMemo(() => {
        if (factionID) {
            const faction = getFaction(factionID)
            if (faction) {
                return faction.palette.primary
            }
        }
        return theme.factionTheme.primary
    }, [theme, getFaction, factionID])

    const rarityDeets = useMemo(() => getRarityDeets(tier || mech?.tier || mechDetails?.tier || ""), [mech?.tier, mechDetails?.tier, tier])
    const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined
    const imageUrl =
        avatarUrl || skin?.avatar_url || skin?.image_url || mechDetails?.avatar_url || mechDetails?.image_url || mech?.avatar_url || mech?.image_url

    return (
        <ClipThing
            clipSize={omitClip ? "0" : tiny ? "2px" : smallSize ? "6px" : "8px"}
            border={
                omitClip
                    ? undefined
                    : {
                          borderColor: primaryColor,
                          borderThickness: imageUrl && !smallSize && !tiny ? "0" : ".18rem",
                      }
            }
            backgroundColor={theme.factionTheme.u800}
            sx={{ flex: 1, position: "relative" }}
        >
            {!smallSize && !tiny && (
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
                            backgroundColor: `${theme.factionTheme.u800}DD`,
                        }}
                    >
                        {rarityDeets.label}
                    </span>
                </Typography>
            )}

            <Box
                sx={{
                    height: "100%",
                    width: tiny ? "4.5rem" : smallSize ? "8rem" : "16.8rem",
                    overflow: "hidden",
                    background: `url(${imageUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "top",
                    backgroundSize: "cover",
                }}
            >
                {!imageUrl && (
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                        <CircularProgress size="2.2rem" />
                    </Stack>
                )}
            </Box>
        </ClipThing>
    )
}
