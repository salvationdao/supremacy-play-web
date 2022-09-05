import { Box, Stack, Typography } from "@mui/material"
import { ClipThing } from "../../../Common/ClipThing"
import { colors, fonts } from "../../../../theme/theme"
import { shadeColor } from "../../../../helpers"
import { ConnectButton } from "../../../Bar/ProfileCard/ConnectButton"
import { useMemo } from "react"

export const UnauthPrompt = () => {
    const backgroundColor = useMemo(() => {
        return shadeColor(colors.neonBlue, -75)
    }, [])

    return (
        <Box sx={{ py: "1rem" }}>
            <ClipThing
                sx={{ p: ".8rem 1.1rem" }}
                clipSize="6px"
                border={{
                    borderColor: `${colors.darkNeonBlue}`,
                    borderThickness: ".3rem",
                }}
                backgroundColor={backgroundColor}
                // opacity={0.7}
            >
                <Stack
                    spacing="1.2rem"
                    alignItems="center"
                    sx={{
                        flex: 1,
                        minWidth: "32.5rem",
                        p: "1rem",
                    }}
                >
                    <Typography fontFamily={fonts.nostromoBold} variant="body2" textAlign={"center"}>
                        log in for full access to the battle arena- claim and use abilities, visit the marketplace and deploy mechs
                    </Typography>
                    <ConnectButton />
                </Stack>
            </ClipThing>
        </Box>
    )
}
