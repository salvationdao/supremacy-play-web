import { useState } from "react"
import { useGameServerSubscriptionSecured } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { secondsToWords } from "../../../helpers"
import { AmountItem } from "../../Hangar/WarMachinesHangar/WarMachineDetails/Modals/AmountItem"

export const BattleETA = () => {
    const [battleETASeconds, setBattleETASeconds] = useState<number>(300)
    useGameServerSubscriptionSecured<number>(
        {
            URI: "/battle_eta",
            key: GameServerKeys.SunBattleETA,
        },
        (payload) => {
            if (!payload) return
            setBattleETASeconds(payload)
        },
    )

    return (
        <AmountItem
            key={`${battleETASeconds}-queue_time`}
            title={"BATTLE ETA: "}
            color={colors.offWhite}
            value={secondsToWords(battleETASeconds)}
            tooltip="The average duration of a battle."
            disableIcon
        />
    )
}
