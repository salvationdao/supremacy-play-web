import { Box, Divider, Stack } from "@mui/material"
import { BarExpandable, BuySupsButton } from "../.."
import { SvgSupToken, SvgWallet } from "../../../assets"
import { useAuth } from "../../../containers"
import { colors } from "../../../theme/theme"
import { WalletInfo } from "./WalletInfo/WalletInfo"

export const WalletDetails = () => {
    const { userID } = useAuth()
    const barName = "wallet"

    return (
        <BarExpandable
            noDivider
            barName={barName}
            iconComponent={
                <Box sx={{ p: ".32rem", backgroundColor: colors.gold, borderRadius: 1 }}>
                    <SvgSupToken size="2.2rem" fill="#000000" sx={{ pb: 0 }} />
                </Box>
            }
        >
            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    mx: "1.2rem",
                    height: "100%",
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing="1.6rem"
                    sx={{
                        position: "relative",
                        height: "100%",
                        overflowX: "auto",
                        overflowY: "hidden",

                        "::-webkit-scrollbar": {
                            height: ".3rem",
                        },
                        "::-webkit-scrollbar-track": {
                            background: "#FFFFFF15",
                            borderRadius: 3,
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: "#FFFFFF50",
                            borderRadius: 3,
                        },
                    }}
                >
                    <Stack direction="row" alignItems="center">
                        <SvgWallet size="2.3rem" sx={{ mr: ".8rem" }} />
                        <WalletInfo />
                    </Stack>

                    {userID && <BuySupsButton />}
                </Stack>

                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                        height: "2.3rem",
                        my: "auto !important",
                        ml: "2.4rem",
                        borderColor: "#494949",
                        borderRightWidth: 1.6,
                    }}
                />
            </Stack>
        </BarExpandable>
    )
}
