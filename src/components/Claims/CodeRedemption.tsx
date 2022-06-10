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
            clipSize="10px"
            corners={{
                topRight: true,
                bottomLeft: true,
            }}
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            sx={{ position: "relative", m: "4rem", maxWidth: "70rem" }}
            backgroundColor={theme.factionTheme.background}
            opacity={0.9}
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

                    <ClipThing
                        clipSize="8px"
                        border={{
                            borderColor: theme.factionTheme.primary,
                            borderThickness: ".2rem",
                        }}
                        sx={{ position: "relative", mb: "2.8rem" }}
                        backgroundColor={theme.factionTheme.background}
                    >
                        <CodeEntry code={code} length={6} setCode={setCode} />
                    </ClipThing>

                    <FancyButton
                        excludeCaret
                        disabled={code.length !== 6 || loading}
                        loading={loading}
                        clipThingsProps={{
                            clipSize: "9px",
                            backgroundColor: theme.factionTheme.primary,
                            opacity: 1,
                            border: { isFancy: true, borderColor: theme.factionTheme.primary, borderThickness: "2px" },
                            sx: { position: "relative" },
                        }}
                        sx={{ width: "100%", py: "1.1rem", color: theme.factionTheme.secondary }}
                        onClick={onClaim}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                color: theme.factionTheme.secondary,
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            Claim
                        </Typography>
                    </FancyButton>
                </Stack>
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
            onChange={(e) => setCode(e.target.value)}
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
