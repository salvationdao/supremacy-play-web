import { fonts } from "../../../theme/theme"
import { Box, Stack, Typography } from "@mui/material"
import React, { useState } from "react"
import { ConfirmModal } from "../../Common/ConfirmModal"
import { BattleLobby } from "../../../types/battle_queue"
import { BattleLobbyItem } from "./BattleLobbyItem"
import { InputField } from "../Common/InputField"
import { useTheme } from "../../../containers/theme"

const lobbyPlaceholder: BattleLobby = {
    id: "",
    name: "PRIVATE LOBBY",
    host_by_id: "",
    number: 0,
    entry_fee: "0",
    first_faction_cut: "0.75",
    second_faction_cut: "0.25",
    third_faction_cut: "0",
    each_faction_mech_amount: 3,
    generated_by_system: true,
    created_at: new Date(),
    ready_at: new Date(),

    host_by: {
        id: "",
        username: "",
        faction_id: "",
        gid: 0,
        rank: "NEW_RECRUIT",
        features: [],
    },
    is_private: true,
    battle_lobbies_mechs: [],
    opted_in_bc_supporters: [],
    opted_in_rm_supporters: [],
    opted_in_zai_supporters: [],
    selected_bc_supporters: [],
    selected_rm_supporters: [],
    selected_zai_supporters: [],
}

interface BattleLobbyPrivateAccessModalProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export const BattleLobbyPrivateAccessModal = ({ setOpen }: BattleLobbyPrivateAccessModalProps) => {
    const { factionTheme } = useTheme()
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [accessCode, setAccessCode] = useState("")

    return (
        <ConfirmModal title={`ACCESS PRIVATE LOBBY`} omitButtons onClose={() => setOpen(false)} isLoading={isLoading} error={error} width="150rem" omitCancel>
            <Stack direction="column">
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                        ml: "2rem",
                        my: "1rem",
                        height: "4rem",
                    }}
                >
                    <InputField
                        placeholder="ACCESS CODE"
                        border={`${factionTheme.primary} 2px solid`}
                        borderRadius={0}
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            backgroundColor: factionTheme.primary,
                            px: "1rem",
                            cursor: "pointer",
                        }}
                        onClick={() => console.log(accessCode)}
                    >
                        <Typography variant="body2" fontFamily={fonts.nostromoBlack}>
                            submit
                        </Typography>
                    </Box>
                </Stack>
                <BattleLobbyItem battleLobby={lobbyPlaceholder} omitClip disabled />
            </Stack>
        </ConfirmModal>
    )
}
