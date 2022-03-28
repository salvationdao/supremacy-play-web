import { Box, Button } from "@mui/material"
import { SvgFastRepair } from "../../../assets"
import { usePassportServerAuth } from "../../../containers"
import { colors } from "../../../theme/theme"

export const AdditionalOptionsButton = () => {
    const { user } = usePassportServerAuth()

    if (!user) return null

    return (
        <Button
            sx={{
                backgroundColor: colors.darkerNavy,
                height: "2rem",
                width: "100%",
                borderRadius: 0,
                "*": {
                    opacity: 0.6,
                },
                ":hover": {
                    backgroundColor: colors.darkerNavy,
                    "*": {
                        opacity: 0.9,
                    },
                },
            }}
        >
            <SvgFastRepair size="1.05rem" />
        </Button>
    )
}
