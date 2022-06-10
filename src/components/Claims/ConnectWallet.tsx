import { Stack, Typography } from "@mui/material"
import { colors, fonts } from "../../theme/theme"
import { ClipThing } from "../Common/ClipThing"
import { useTheme } from "../../containers/theme"
import { ConnectButton } from "../Bar/ProfileCard/ConnectButton"

export const ConnectWallet = () => {
    return <ConnectWalletInner />
}

const ConnectWalletInner = () => {
    const theme = useTheme()
    return (
        <ClipThing
            clipSize="10px"
            corners={{
                topRight: true,
                bottomLeft: true,
            }}
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            sx={{ position: "relative", m: "4rem", maxWidth: "110rem" }}
            backgroundColor={colors.darkerNavy}
            opacity={0.9}
        >
            <Stack sx={{ alignItems: "center", py: "5rem", px: "6rem", textAlign: "center" }}>
                <Typography variant="h1" sx={{ mb: "2rem", fontSize: "4.2rem", fontFamily: fonts.nostromoBlack }}>
                    Connect Your Wallet to Claim Your Rewards
                </Typography>
                <Typography variant="h5" sx={{ mb: "4rem" }}>
                    You will receive assets that are of Supremacy&apos;s next generation collection: Supremacy Nexus, which will allow you to equip your war
                    machines to defeat your enemies in the battle arena.
                </Typography>

                <ConnectButton
                    width={"width: 200px"}
                    label={"Connect Wallet"}
                    loadingLabel={"Connecting Wallet..."}
                    sx={{ px: "4rem", py: "1rem" }}
                    typeSx={{ fontSize: "2rem" }}
                />
            </Stack>
        </ClipThing>
    )
}
