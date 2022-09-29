import { ConfirmModal } from "../Common/ConfirmModal"
import { Typography } from "@mui/material"

interface BattleLobbyCreateModalProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const BattleLobbyCreateModal = ({ setOpen }: BattleLobbyCreateModalProps) => {
    return (
        <ConfirmModal
            title={`CREATE NEW BATTLE LOBBY`}
            onConfirm={() => setOpen(false)}
            onClose={() => setOpen(false)}
            isLoading={false}
            error={""}
            width="75rem"
        >
            <Typography></Typography>
        </ConfirmModal>
    )
}
