import { Stack } from "@mui/material"
import { useChat } from "../../containers"

export const BanProposal = () => {
    const { banProposal } = useChat()

    if (!banProposal) return null

    return <Stack>Hello</Stack>
}
