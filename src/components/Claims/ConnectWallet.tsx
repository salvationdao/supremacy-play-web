import { Stack, Typography } from "@mui/material"
import { colors } from "../../theme/theme"
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
            clipSize="8px"
            corners={{
                topRight: true,
                bottomLeft: true,
            }}
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".2rem",
            }}
            sx={{ position: "relative", py: "5rem", px: "5rem", width: "auto", maxWidth: "1000px" }}
            backgroundColor={colors.darkerNavy}
            opacity={0.7}
        >
            <Stack sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem", textAlign: "center" }}>
                <Typography variant={"h1"} sx={{ fontSize: "3rem", mb: "2rem" }}>
                    Connect Your Wallet to Claim Your Rewards
                </Typography>
                <Typography variant={"subtitle1"} sx={{ fontSize: "2rem", mb: "5rem", lineHeight: "1.2" }}>
                    You will receive assets that are of Supremacy&apos;s next generation collection: Supremacy Nexus, which will allow you to equip your war
                    machines to defeat your enemies in battle.
                </Typography>

                <ConnectButton
                    width={"width: 200px"}
                    label={"Connect Wallet"}
                    loadingLabel={"Connecting Wallet..."}
                    sx={{ px: "4rem", py: "1rem" }}
                    typeSx={{ fontSize: "2rem", color: colors.offWhite }}
                    clipBorderColor={colors.neonBlue}
                    clipBackgroundColor={colors.darkerNavy}
                />
            </Stack>
        </ClipThing>
    )
}
