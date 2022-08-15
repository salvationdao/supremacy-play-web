import { useCallback, useEffect, useMemo, useState } from "react"
import { createContainer } from "unstated-next"
import { GameAbility, LocationSelectType, PlayerAbility, WarMachineState } from "../types"
import { useMiniMap } from "./minimap"
import { GameServerKeys } from "../keys"
import { useGame } from "./game"
import { useGameServerCommandsFaction } from "../hooks/useGameServer"
import { useAuth } from "./auth"
import { MechMoveCommand } from "../components/WarMachine/WarMachineItem/MoveCommand"
import { colors } from "../theme/theme"
import { useSnackbar } from "./snackbar"

export const MechMoveCommandAbility: PlayerAbility = {
    id: "mech_move_command",
    blueprint_id: "mech_move_command",
    count: 1,
    last_purchased_at: new Date(),
    cooldown_expires_on: new Date(),
    ability: {
        id: "",
        game_client_ability_id: 8,
        label: "MOVE COMMAND",
        image_url: "",
        description: "Command the war machine to move to a specific location.",
        text_colour: "#000000",
        colour: colors.gold,
        location_select_type: LocationSelectType.MECH_COMMAND,
        created_at: new Date(),
        inventory_limit: 10,
        cooldown_seconds: 5,
    },
}
//todo: Player Abilities hotkeys and custom hotkey maps

export const HotkeyContainer = createContainer(() => {
    const { setHighlightedMechParticipantID, setPlayerAbility, highlightedMechParticipantID } = useMiniMap()
    const { warMachines } = useGame()
    const { factionID, user } = useAuth()
    const { newSnackbarMessage } = useSnackbar()

    //ability hot keys
    const [highlightedMechGameAbilities, setHighlightedMechGameAbilities] = useState<GameAbility[]>([])
    const [shownPlayerAbilities, setShownPlayerAbilities] = useState<PlayerAbility[]>([])
    const [mechMoveCommand, setMechMoveCommand] = useState<MechMoveCommand>()

    //keys reserved for mech abilities
    const mechAbilityKey = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]

    const { send } = useGameServerCommandsFaction("/faction_commander")

    const factionWarMachines = useMemo(
        () => (warMachines as WarMachineState[])?.filter((w) => w.factionID === factionID).sort((a, b) => a.participantID - b.participantID),
        [warMachines, factionID],
    )

    //ability triggers ------------------------------------
    const onGameAbilityTrigger = useCallback(
        async (warMachineHash: string, gameAbilityID: string) => {
            try {
                await send<boolean, { mech_hash: string; game_ability_id: string }>(GameServerKeys.TriggerWarMachineAbility, {
                    mech_hash: warMachineHash,
                    game_ability_id: gameAbilityID,
                })
            } catch (e) {
                console.error(e)
            }
        },
        [send],
    )

    // mech move
    const handleMechMove = useCallback(
        async (warMachine: WarMachineState) => {
            if (warMachine.health <= 0 || !mechMoveCommand) return

            if (
                !mechMoveCommand?.reached_at &&
                !mechMoveCommand?.cancelled_at &&
                mechMoveCommand.remain_cooldown_seconds !== 0 &&
                !!mechMoveCommand.cancelled_at
            ) {
                try {
                    await send(GameServerKeys.MechMoveCommandCancel, {
                        move_command_id: mechMoveCommand.id,
                        hash: warMachine.hash,
                    })
                } catch (err) {
                    const message = typeof err === "string" ? err : "Failed cancel mech move command."
                    newSnackbarMessage(message, "error")
                    console.error(err)
                }
            } else {
                setPlayerAbility({
                    ...MechMoveCommandAbility,
                    mechHash: warMachine.hash,
                })
            }
        },
        [send, mechMoveCommand, newSnackbarMessage, setPlayerAbility],
    )
    //end ability triggers ------------------------------------

    const handleHotKey = useCallback(
        (e: KeyboardEvent) => {
            if (!factionWarMachines) return
            e.preventDefault()

            //int = highlight faction mech
            const key = parseInt(e.key)
            if (key) {
                if (key > factionWarMachines.length) return
                setHighlightedMechParticipantID(factionWarMachines[key - 1]?.participantID)
            }

            //mech commander functions
            if (highlightedMechParticipantID) {
                const w = factionWarMachines.find((w) => w.ownedByID === user.id && w.participantID === highlightedMechParticipantID)
                if (!w || e.ctrlKey) return

                //trigger mech specific ability
                const qwertyIndex = mechAbilityKey.indexOf(e.key)
                if (qwertyIndex > -1) {
                    onGameAbilityTrigger(w.hash, highlightedMechGameAbilities[qwertyIndex].id)
                }

                //trigger mech move
                if (e.key === "a") {
                    handleMechMove(w)
                }
            }
        },
        [
            onGameAbilityTrigger,
            handleMechMove,
            factionWarMachines,
            user,
            highlightedMechGameAbilities,
            highlightedMechParticipantID,
            setHighlightedMechParticipantID,
        ],
    )
    useEffect(() => {
        document.addEventListener("keydown", handleHotKey)
        return () => document.removeEventListener("keydown", handleHotKey)
    }, [handleHotKey])

    return {
        shownPlayerAbilities,
        setShownPlayerAbilities,
        setHighlightedMechGameAbilities,
        onGameAbilityTrigger,
        mechMoveCommand,
        setMechMoveCommand,
        MechMoveCommandAbility,
        handleMechMove,
    }
})

export const HotkeyProvider = HotkeyContainer.Provider
export const useHotkey = HotkeyContainer.useContainer
