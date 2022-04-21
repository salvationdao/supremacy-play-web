import { Box, Divider, Stack } from "@mui/material"
import { BarExpandable, BuySupsButton } from "../.."
import { SvgSupToken, SvgWallet } from "../../../assets"
import { usePassportServerAuth } from "../../../containers"
import { colors } from "../../../theme/theme"
import { MultipliersInfo } from "./MultipliersInfo/MultipliersInfo"
import { WalletInfo } from "./WalletInfo/WalletInfo"

export const WalletDetails = () => {
    const { user } = usePassportServerAuth()
    const barName = "wallet"

    return (
        <Box id="tutorial-wallet">
            <BarExpandable
                noDivider
                barName={barName}
                iconComponent={
                    <Box id="tutorial-wallet-icon" sx={{ p: ".32rem", backgroundColor: colors.grey, borderRadius: 1 }}>
                        <SvgSupToken size="2rem" />
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
                            scrollbarWidth: "none",
                            "::-webkit-scrollbar": {
                                height: ".4rem",
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#FFFFFF15",
                                borderRadius: 3,
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: colors.darkNeonBlue,
                                borderRadius: 3,
                            },
                        }}
                    >
                        <Stack id="tutorial-sups" direction="row" alignItems="center">
                            <SvgWallet size="2.3rem" sx={{ mr: ".8rem" }} />
                            <WalletInfo />
                            <MultipliersInfo />
                        </Stack>

                        {user && <BuySupsButton user={user} />}
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
        </Box>
    )
}
