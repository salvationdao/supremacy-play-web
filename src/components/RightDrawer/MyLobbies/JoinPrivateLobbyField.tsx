import { Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { useGlobalNotifications } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { fonts } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceTextField } from "../../Common/Nice/NiceTextField"
import { PrivateLobbySingleModal } from "../../Lobbies/JoinPrivateLobby/PrivateLobbySingleModal"

export const JoinPrivateLobbyField = () => {
    const [accessCode, setAccessCode] = useState<string>()
    const [battleLobby, setBattleLobby] = useState<BattleLobby>()

    return (
        <>
            <JoinPrivateLobbyFieldInner key={`aaa-${battleLobby?.id}`} accessCode={accessCode} setAccessCode={setAccessCode} setBattleLobby={setBattleLobby} />

            {battleLobby && accessCode && (
                <PrivateLobbySingleModal
                    battleLobby={battleLobby}
                    accessCode={accessCode}
                    onClose={() => {
                        setAccessCode(undefined)
                        setBattleLobby(undefined)
                    }}
                />
            )}
        </>
    )
}

interface JoinPrivateLobbyFieldInnerProps {
    accessCode?: string
    setAccessCode: React.Dispatch<React.SetStateAction<string | undefined>>
    setBattleLobby: React.Dispatch<React.SetStateAction<BattleLobby | undefined>>
}

const JoinPrivateLobbyFieldInner = ({ accessCode, setAccessCode, setBattleLobby }: JoinPrivateLobbyFieldInnerProps) => {
    const theme = useTheme()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [isLoading, setIsLoading] = useState(false)

    const onConfirm = useCallback(
        async (_access_code: string) => {
            try {
                setIsLoading(true)
                const _battleLobby = await send<BattleLobby>(GameServerKeys.GetPrivateBattleLobby, { access_code: _access_code })
                setBattleLobby(_battleLobby)
                setAccessCode(undefined)
            } catch (err) {
                console.log(err)
                newSnackbarMessage(typeof err === "string" ? err : "Incorrect access code.")
            } finally {
                setIsLoading(false)
            }
        },
        [newSnackbarMessage, send, setAccessCode, setBattleLobby],
    )

    return (
        <Stack direction="row" alignItems="center" spacing="1rem" sx={{ p: ".5rem" }}>
            <NiceTextField
                primaryColor={theme.factionTheme.contrast_primary}
                value={accessCode}
                onChange={(value) => {
                    setAccessCode(value)
                }}
                placeholder="Join private room..."
                disabled={isLoading}
                sx={{ flex: 1 }}
            />

            <NiceButton
                sheen={{ autoSheen: true }}
                loading={isLoading}
                disabled={!accessCode}
                buttonColor={theme.factionTheme.contrast_primary}
                corners
                onClick={() => accessCode && onConfirm(accessCode)}
                sx={{ py: "1rem" }}
            >
                <Typography variant="subtitle1" fontFamily={fonts.nostromoBold}>
                    Confirm
                </Typography>
            </NiceButton>
        </Stack>
    )
}
