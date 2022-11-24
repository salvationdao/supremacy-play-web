import { Stack, Typography } from "@mui/material"
import { MutableRefObject, useCallback, useState } from "react"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NicePopover } from "../../Common/Nice/NicePopover"
import { NiceTextField } from "../../Common/Nice/NiceTextField"
import { PrivateLobbySingleModal } from "./PrivateLobbySingleModal"

interface AccessCodePopoverProps {
    open: boolean
    onClose: () => void
    popoverRef: MutableRefObject<null>
}

export const AccessCodePopover = (props: AccessCodePopoverProps) => {
    const [accessCode, setAccessCode] = useState<string>()
    const [battleLobby, setBattleLobby] = useState<BattleLobby>()

    return (
        <>
            {props.open && <AccessCodePopoverInner {...props} accessCode={accessCode} setAccessCode={setAccessCode} setBattleLobby={setBattleLobby} />}

            {battleLobby && accessCode && (
                <PrivateLobbySingleModal battleLobby={battleLobby} accessCode={accessCode} onClose={() => setBattleLobby(undefined)} />
            )}
        </>
    )
}

interface AccessCodePopoverInnerProps extends AccessCodePopoverProps {
    accessCode?: string
    setAccessCode: React.Dispatch<React.SetStateAction<string | undefined>>
    setBattleLobby: React.Dispatch<React.SetStateAction<BattleLobby | undefined>>
}

const AccessCodePopoverInner = ({ open, onClose, popoverRef, accessCode, setAccessCode, setBattleLobby }: AccessCodePopoverInnerProps) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>()

    const onConfirm = useCallback(
        async (_access_code: string) => {
            try {
                setError(undefined)
                setIsLoading(true)
                const _battleLobby = await send<BattleLobby>(GameServerKeys.GetPrivateBattleLobby, { access_code: _access_code })
                console.log(_battleLobby)
                setBattleLobby(_battleLobby)
                onClose()
            } catch (err) {
                console.log(err)
                setError(typeof err === "string" ? err : "Incorrect access code.")
            } finally {
                setIsLoading(false)
            }
        },
        [onClose, send, setBattleLobby],
    )

    return (
        <NicePopover
            open={open}
            anchorEl={popoverRef.current}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
        >
            <Stack direction="column" sx={{ p: "1rem 1.3rem", width: "35rem" }}>
                <Typography variant="h6" fontFamily={fonts.nostromoBlack} mb=".4rem">
                    Private lobby
                </Typography>

                <Typography variant="body1" sx={{ mb: "1rem" }}>
                    Enter the access code to join a private lobby battle.
                </Typography>

                {error && (
                    <Typography variant="body2" sx={{ mb: ".4rem", color: colors.red }}>
                        {error}
                    </Typography>
                )}

                <Stack direction="row" alignItems="center" spacing="1rem">
                    <NiceTextField
                        primaryColor={theme.factionTheme.primary}
                        value={accessCode}
                        onChange={(value) => {
                            setAccessCode(value)
                        }}
                        placeholder="Enter access code..."
                        disabled={isLoading}
                    />

                    <NiceButton
                        sheen={{ autoSheen: true }}
                        loading={isLoading}
                        disabled={!accessCode}
                        buttonColor={theme.factionTheme.primary}
                        corners
                        onClick={() => accessCode && onConfirm(accessCode)}
                    >
                        <Typography variant="subtitle1" fontFamily={fonts.nostromoBold}>
                            Confirm
                        </Typography>
                    </NiceButton>
                </Stack>
            </Stack>
        </NicePopover>
    )
}
