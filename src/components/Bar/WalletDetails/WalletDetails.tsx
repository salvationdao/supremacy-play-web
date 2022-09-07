import { Divider, Stack } from "@mui/material"
import { SvgWallet } from "../../../assets"
import { WalletInfo } from "./WalletInfo/WalletInfo"

export const WalletDetails = () => {
    return (
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
                        height: ".6rem",
                    },
                    "::-webkit-scrollbar-track": {
                        background: "#FFFFFF15",
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: "#FFFFFF50",
                    },
                }}
            >
                <Stack direction="row" alignItems="center">
                    <SvgWallet size="2.3rem" sx={{ mr: ".8rem" }} />
                    <WalletInfo />
                </Stack>
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
    )
}
