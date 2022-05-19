import { Box, CircularProgress, Stack } from "@mui/material"
import { ClipThing } from "../../.."
import { useTheme } from "../../../../containers/theme"
import { MechBasic, MechDetails } from "../../../../types"

const ITEM_WIDTH = 7.5 //rem

export const MechLoadout = ({ mech, mechDetails }: { mech: MechBasic; mechDetails?: MechDetails }) => {
    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary
    const skin = mechDetails ? mechDetails.chassis_skin : undefined

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
                <LoadoutItem imageUrl="" primaryColor={primaryColor} />
                <LoadoutItem imageUrl="" primaryColor={primaryColor} />
                <LoadoutItem imageUrl="" primaryColor={primaryColor} />
                <LoadoutItem imageUrl="" primaryColor={primaryColor} />
                <LoadoutItem imageUrl="" primaryColor={primaryColor} />
                <LoadoutItem imageUrl="" primaryColor={primaryColor} />
            </Stack>
        </Box>
    )
}

const LoadoutItem = ({ imageUrl, primaryColor }: { imageUrl: string; primaryColor: string }) => {
    const hasItem = false

    return (
        <Box sx={{ flex: "0 0 50%", width: `${ITEM_WIDTH}rem`, p: ".3rem" }}>
            <ClipThing
                clipSize="10px"
                border={{
                    isFancy: true,
                    borderColor: primaryColor,
                    borderThickness: hasItem ? "0" : ".15rem",
                }}
                opacity={0.15}
                backgroundColor={primaryColor}
                sx={{ height: "100%" }}
            >
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
                    {!hasItem && (
                        <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                            <CircularProgress size="2.2rem" sx={{ color: primaryColor }} />
                        </Stack>
                    )}
                </Box>
            </ClipThing>
        </Box>
    )
}
