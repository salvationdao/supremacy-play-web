import { ClipThing } from "../Common/ClipThing"
import { Stack, TextField, Typography } from "@mui/material"
import { fonts } from "../../theme/theme"
import { useTheme } from "../../containers/theme"
import { useCallback, useEffect, useState } from "react"
import { FancyButton } from "../Common/FancyButton"
import { useGameServerCommandsFaction } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { RewardResponse } from "../../types"
import { useSnackbar } from "../../containers"

interface redemptionProps {
    setRewards: (value: ((prevState: RewardResponse[] | undefined) => RewardResponse[] | undefined) | RewardResponse[] | undefined) => void
}
export const CodeRedemption = ({ setRewards }: redemptionProps) => {
    return <CodeRedemptionInner setRewards={setRewards} />
}

const CodeRedemptionInner = ({ setRewards }: redemptionProps) => {
    const theme = useTheme()
    const [code, setCode] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { newSnackbarMessage } = useSnackbar()

    const onClaim = useCallback(async () => {
        if (!send) return
        setLoading(true)
        try {
            const resp = await send<{ rewards: RewardResponse[] }, { code: string }>(GameServerKeys.CodeRedemption, {
                code: code,
            })
            setRewards(resp.rewards)
        } catch (e) {
            newSnackbarMessage(typeof e === "string" ? e : "Could not redeem code, try again or contact support.", "error")
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [code, send, newSnackbarMessage, setLoading, setRewards])

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
            sx={{ position: "relative", py: "5rem", px: "2rem", width: "auto", maxWidth: "500px" }}
            backgroundColor={theme.factionTheme.background}
            opacity={0.7}
        >
            <Stack sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem", textAlign: "center" }}>
                <Typography variant={"h1"} sx={{ fontSize: "3rem", mb: "2rem" }}>
                    Enter Your Unlock Code
                </Typography>
                <Typography variant={"subtitle1"} sx={{ fontSize: "2rem", mb: "5rem", lineHeight: "1.2" }}>
                    You&apos;ll find this on your Supremacy trading card or wherever you received the code from
                </Typography>
                <Stack sx={{ pb: "5rem" }}>
                    <Typography sx={{ fontFamily: fonts.nostromoBold, pt: "1rem", pb: ".5rem" }}>Enter your 6 digit unlock code</Typography>
                    <ClipThing
                        clipSize="5px"
                        corners={{
                            topRight: true,
                            bottomLeft: true,
                        }}
                        border={{
                            borderColor: theme.factionTheme.primary,
                            borderThickness: ".1rem",
                        }}
                        sx={{ position: "relative", mb: "1rem" }}
                        backgroundColor={theme.factionTheme.background}
                        opacity={0.9}
                    >
                        <CodeEntry code={code} length={6} setCode={setCode} />
                    </ClipThing>
                </Stack>
                <FancyButton
                    disabled={code.length !== 6 || loading}
                    onClick={onClaim}
                    clipThingsProps={{
                        clipSize: "8px",
                        opacity: 0.6,
                        backgroundColor: theme.factionTheme.primary,
                        border: { isFancy: true, borderColor: theme.factionTheme.primary },
                        sx: { mr: "1rem", position: "relative", flexShrink: 0 },
                    }}
                    sx={{ px: "8rem", py: "1rem" }}
                >
                    <Typography sx={{ fontFamily: fonts.nostromoBold, fontSize: "2rem" }}>Claim</Typography>
                </FancyButton>
            </Stack>
        </ClipThing>
    )
}

interface CodeEntryProps {
    length: number
    code: string
    setCode: (value: ((prevState: string) => string) | string) => void
}

const CodeEntry = ({ length, code, setCode }: CodeEntryProps) => {
    const [isFocused, setIsFocused] = useState(false)
    const theme = useTheme()

    useEffect(() => {
        const input = document.getElementById("code_entry_redemption")
        input?.focus()
    }, [])

    return (
        <TextField
            id="code_entry_redemption"
            variant="standard"
            value={code}
            onChange={(e) => {
                setCode(e.target.value)
            }}
            inputProps={{
                style: {
                    margin: "1rem auto",
                    border: "none",
                    padding: 0,
                    width: `${length * 1.6}ch`,
                    background: `repeating-linear-gradient(90deg, dimgrey 0, ${
                        isFocused ? theme.factionTheme.primary : "dimgrey"
                    } 1ch, transparent 0, transparent 1.6ch) 0 100%/ 10ch 2px no-repeat`,
                    font: `5ch ${fonts.shareTechMono}`,
                    letterSpacing: ".6ch",
                },
                maxLength: length,
                spellCheck: false,
            }}
            onFocus={() => {
                setIsFocused(true)
            }}
            onBlur={() => {
                setIsFocused(false)
            }}
            InputProps={{ disableUnderline: true }}
        />
    )
}
