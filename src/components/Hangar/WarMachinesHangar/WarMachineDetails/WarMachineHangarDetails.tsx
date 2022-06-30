import { Stack } from "@mui/material"
import { ClipThing } from "../../.."
import { useTheme } from "../../../../containers/theme"

export const WarMachineHangarDetails = ({ mechHash }: { mechHash: string }) => {
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    return (
        <Stack direction="row" spacing="1rem" sx={{ height: "100%" }}>
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: primaryColor,
                    borderThickness: ".3rem",
                }}
                corners={{
                    topRight: true,
                    bottomLeft: true,
                    bottomRight: true,
                }}
                opacity={0.7}
                backgroundColor={backgroundColor}
                sx={{ height: "100%" }}
            >
                <Stack sx={{ height: "100%" }}>ttt</Stack>
            </ClipThing>
            aaa
        </Stack>
    )
}
