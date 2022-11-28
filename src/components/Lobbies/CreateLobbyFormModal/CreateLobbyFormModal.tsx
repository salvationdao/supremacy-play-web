import { Stack } from "@mui/material"
import React from "react"
import { NiceModal } from "../../Common/Nice/NiceModal"

export const CreateLobbyFormModal = React.memo(function CreateLobbyFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    return (
        <NiceModal open={true} onClose={onClose} sx={{ p: "1.8rem 2.5rem", maxHeight: "calc(100vh - 20rem)" }}>
            <Stack sx={{ width: "55rem" }}></Stack>
        </NiceModal>
    )
})
