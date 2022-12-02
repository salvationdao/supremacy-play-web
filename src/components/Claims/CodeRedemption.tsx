import { Stack, TextField, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useTheme } from "../../containers/theme"
import { useGameServerCommandsFaction } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { RewardResponse } from "../../types"
import { NiceBoxThing } from "../Common/Nice/NiceBoxThing"
import { NiceButton } from "../Common/Nice/NiceButton"

interface redemptionProps {
    setRewards: (value: ((prevState: RewardResponse[] | undefined) => RewardResponse[] | undefined) | RewardResponse[] | undefined) => void
}

export const CodeRedemption = ({ setRewards }: redemptionProps) => {
    const theme = useTheme()
    const [code, setCode] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [error, setError] = useState<string>()

    const onClaim = useCallback(async () => {
        if (!send) return
        setLoading(true)
        setError(undefined)
        try {
            const resp = await send<{ rewards: RewardResponse[] }, { code: string }>(GameServerKeys.CodeRedemption, {
                code: code,
            })
            setRewards(resp.rewards)
        } catch (e) {
            const message = typeof e === "string" ? e : "Could not redeem code, try again or contact support."
            setError(message)
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [code, send, setLoading, setRewards])

    return (
        <NiceBoxThing
            border={{ color: `${theme.factionTheme.primary}50` }}
            background={{ colors: [theme.factionTheme.background], opacity: 0.9 }}
            sx={{ position: "relative", m: "4rem", maxWidth: "70rem" }}
        >
            <Stack alignItems="center" sx={{ py: "5rem", px: "5.5rem", textAlign: "center" }}>
                <Typography variant={"h1"} sx={{ fontSize: "3rem", fontFamily: fonts.nostromoBlack, mb: "2rem" }}>
                    Enter Your Unlock Code
                </Typography>

                <Typography variant={"subtitle1"} sx={{ fontSize: "2rem", mb: "3rem" }}>
                    You&apos;ll find this on your Supremacy trading card or wherever you received the code from
                </Typography>

                <Stack>
                    <Typography sx={{ mb: "1.6rem", fontFamily: fonts.nostromoBold }}>Enter your 6 digit unlock code</Typography>

                    <NiceBoxThing
                        border={{ color: theme.factionTheme.primary }}
                        background={{ colors: [theme.factionTheme.background] }}
                        sx={{ position: "relative", mb: "2.8rem" }}
                    >
                        <CodeEntry code={code} length={6} setCode={setCode} />
                    </NiceBoxThing>

                    {error && (
                        <Typography
                            sx={{
                                mb: "1rem",
                                color: colors.red,
                                textAlign: "center",
                            }}
                        >
                            {error}
                        </Typography>
                    )}

                    <NiceButton
                        corners
                        buttonColor={theme.factionTheme.primary}
                        loading={loading}
                        disabled={code.length !== 6 || loading}
                        onClick={onClaim}
                        sx={{ py: "1rem" }}
                    >
                        Claim
                    </NiceButton>
                </Stack>
            </Stack>
        </NiceBoxThing>
    )
}

interface CodeEntryProps {
    length: number
    code: string
    setCode: (value: ((prevState: string) => string) | string) => void
}

const CodeEntry = ({ length, code, setCode }: CodeEntryProps) => {
    const theme = useTheme()
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
        const input = document.getElementById("code_entry_redemption")
        input?.focus()
    }, [])

    return (
        <TextField
            id="code_entry_redemption"
            variant="standard"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
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
