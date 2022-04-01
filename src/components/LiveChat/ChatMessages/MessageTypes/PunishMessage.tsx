import { PunishMessageData } from "../../../../types/chat"

export const PunishMessage = ({ data, sentAt, fontSize }: { data: PunishMessageData; sentAt: Date; fontSize: number }) => {
    const { issued_by_player_username, reported_player_username, is_passed, total_player_number, agreed_player_number, disagreed_player_number } = data

    return <>BAN PROPOSAL</>
}
