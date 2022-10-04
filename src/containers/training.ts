import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { trainingMoveCommand } from "../components/Tutorial/TrainingMechAbility"
import { convertCellsToGameLocation } from "../helpers"
import { useToggle } from "../hooks"
import {
    AbilityDetail,
    BattleAbilityStages,
    BattleEndDetail,
    CompletedTraining,
    LocationSelectType,
    Map,
    PlayerAbility,
    Position,
    TrainingLobby,
    TrainingStages,
    WarMachineState,
} from "../types"
import { MechAbilityStages } from "../types/training"
import { TrainingBribeStageResponse, TrainingWinnerResponse } from "./../components/Tutorial/TrainingBattleAbility"
import { MechMoveCommand } from "./../components/Tutorial/WarMachine/WarMachineItem/MoveCommandBT"
import { useAuth } from "./auth"
import { useGlobalNotifications } from "./globalNotifications"

export interface MapSelectionBT {
    // start coords (used for LINE_SELECT and LOCATION_SELECT abilities)
    startCoords?: Position
    // end coords (only used for LINE_SELECT abilities)
    endCoords?: Position
    // mech hash (only used for MECH_SELECT abilities)
    mechHash?: string
}

type TrainingAbilityDetail = AbilityDetail | null

// Game data that needs to be shared between different components
export const TrainingContainer = createContainer(() => {
    // States
    const { userID } = useAuth()
    const [map, setMap] = useState<Map>()
    const [isMapOpen, toggleIsMapOpen] = useToggle(true)
    const [abilityDetails, setAbilityDetails] = useState<TrainingAbilityDetail[]>(TRAINING_ABILITY_DETAIL)
    const [warMachines, setWarMachines] = useState<WarMachineState[] | undefined>([])
    const [bribeStage, setBribeStage] = useState<TrainingBribeStageResponse | undefined>()
    const [battleEndDetail, setBattleEndDetail] = useState<BattleEndDetail>()
    const [forceDisplay100Percentage, setForceDisplay100Percentage] = useState<string>("")
    const { newSnackbarMessage } = useGlobalNotifications()

    // Training
    const [trainingStage, setTrainingStage] = useState<TrainingStages>(TrainingLobby.All)
    const [tutorialRef, setTutorialRef] = useState<React.MutableRefObject<HTMLDivElement | null> | undefined>(undefined)
    const [updater, setUpdater] = useState<unknown[]>([])
    const [completed, setCompleted] = useState({
        [CompletedTraining.BattleAbility]: false,
        [CompletedTraining.MechAbility]: false,
        [CompletedTraining.PlayerAbility]: false,
    })

    // Left Drawer
    // Big display vs left drawer
    const [smallDisplayRef, setSmallDisplayRef] = useState<HTMLDivElement | null>(null)
    const [bigDisplayRef, setBigDisplayRef] = useState<HTMLDivElement | null>(null)
    const [isStreamBigDisplay, setIsStreamBigDisplay] = useState(true)

    // Battle ability
    const [battleAbilityTime, setBattleAbilityTime] = useState<number | null>(null)

    // Mech ability
    const [repairTime, setRepairTime] = useState(0)
    const mechMoveCommand: MechMoveCommand | undefined = useMemo(() => {
        if (trainingStage === MechAbilityStages.MoveMA || trainingStage === MechAbilityStages.MoveActionMA) return trainingMoveCommand(userID)
    }, [userID, trainingStage])

    // Map
    const mapElement = useRef<HTMLDivElement>()
    const gridWidth = useMemo(() => (map ? map.Width / map.Cells_X : 50), [map])
    const gridHeight = useMemo(() => (map ? map.Height / map.Cells_Y : 50), [map])

    // Map triggers
    const [winner, setWinner] = useState<TrainingWinnerResponse>()
    const [playerAbility, setPlayerAbility] = useState<PlayerAbility>()
    const isEnlarged = false
    const [isTargeting, setIsTargeting] = useState(false)

    // Other stuff
    const [highlightedMechParticipantID, setHighlightedMechParticipantID] = useState<number>()
    const [selection, setSelection] = useState<MapSelectionBT>()

    // Toggle expand if user is using player ability or user is chosen to use battle ability
    useEffect(() => {
        if (winner && bribeStage?.phase === "LOCATION_SELECT") {
            if (!playerAbility) return setIsTargeting(true)
            // If battle ability is overriding player ability selection
            setIsTargeting(false)
            setSelection(undefined)
            const t = setTimeout(() => {
                // Then open the map again
                setIsTargeting(true)
            }, 1000)
            return () => clearTimeout(t)
        } else if (playerAbility) {
            setIsTargeting(true)
        }
    }, [winner, bribeStage, playerAbility])
    const resetSelection = useCallback(() => {
        setWinner(undefined)
        setPlayerAbility(undefined)
        setSelection(undefined)
        setIsTargeting(false)
    }, [])

    const onTargetConfirm = useCallback(async () => {
        if (!selection) return
        if (trainingStage in BattleAbilityStages) {
            setIsStreamBigDisplay(true)
            setTrainingStage(BattleAbilityStages.ShowAbilityBA)
        }
        if (playerAbility?.ability.location_select_type === LocationSelectType.MechSelect) {
            setHighlightedMechParticipantID(undefined)
        }
        resetSelection()
        setIsTargeting(false)
        setWinner(undefined)
        setPlayerAbility(undefined)
        newSnackbarMessage("Successfully submitted target location.", "success")
    }, [selection, resetSelection, playerAbility, newSnackbarMessage, trainingStage, setTrainingStage, setIsTargeting])

    const mechMoveAction = useCallback(
        (cellX: number, cellY: number, warMachineID: string, time: number) => {
            return new Promise<void>((resolve) => {
                if (!map || !warMachines) return
                const { x, y } = convertCellsToGameLocation(cellX, cellY, map?.Pixel_Left, map?.Pixel_Top)
                const tInterval = 200
                const rate = (1000 / tInterval) * time
                const group = [...warMachines]
                const i = group.findIndex((w) => w.id === warMachineID)
                const wm = group[i]

                const deltaX = (x - wm?.position?.x) / rate
                const deltaY = (y - wm?.position?.y) / rate

                const moveInterval = setInterval(() => {
                    wm.position.x = wm.position.x + deltaX
                    wm.position.y = wm.position.y + deltaY
                    const diffX = Math.round(x - wm.position.x)
                    const diffY = Math.round(y - wm.position.y)
                    if (diffX === 0 && diffY === 0) {
                        clearInterval(moveInterval)
                        resolve()
                    }
                    group[i] = wm
                    setWarMachines((prevState) => {
                        if (!prevState) return
                        const newGroup = [...prevState]
                        newGroup[i] = wm
                        return newGroup
                    })
                }, tInterval)
            })
        },
        [map, warMachines],
    )

    const mechMove = useCallback(
        (cellX: number, cellY: number, warMachine: WarMachineState, currentTime: number, duration: number) => {
            if (!map || !warMachines) return
            const wm = { ...warMachines.find((w) => w.id === warMachine.id) } as WarMachineState
            if (!wm) return
            const { x, y } = convertCellsToGameLocation(cellX, cellY, map?.Pixel_Left, map?.Pixel_Top)
            const rate = currentTime / duration

            const deltaX = (x - warMachine.position.x) * rate
            const deltaY = (y - warMachine.position.y) * rate
            wm.position.x = warMachine.position.x + deltaX
            wm.position.y = warMachine.position.y + deltaY

            const group = [...warMachines]
            const i = group.findIndex((w) => w.id === wm.id)
            setWarMachines((prevState) => {
                if (!prevState) return
                const newGroup = [...prevState]
                newGroup[i] = wm
                return newGroup
            })
        },
        [map, warMachines],
    )

    const healthChange = useCallback(
        (health: number, warMachine: WarMachineState, currentTime: number, duration: number) => {
            if (!map || !warMachines) return
            const wm = warMachines.find((w) => w.id === warMachine.id)
            if (!wm) return
            const rate = currentTime / duration

            const delta = (health - warMachine.health) * rate
            wm.health = Math.round(warMachine.health + delta)

            const group = [...warMachines]
            const i = group.findIndex((w) => w.id === wm.id)
            setWarMachines((prevState) => {
                if (!prevState) return
                const newGroup = [...prevState]
                newGroup[i] = wm
                return newGroup
            })
        },
        [map, warMachines],
    )

    const shieldChange = useCallback(
        (shield: number, warMachine: WarMachineState, currentTime: number, duration: number) => {
            if (!map || !warMachines) return
            const wm = warMachines.find((w) => w.id === warMachine.id)
            if (!wm) return
            const rate = currentTime / duration

            const delta = (shield - warMachine.shield) * rate
            wm.shield = Math.round(warMachine.shield + delta)

            const group = [...warMachines]
            const i = group.findIndex((w) => w.id === wm.id)
            setWarMachines((prevState) => {
                if (!prevState) return
                const newGroup = [...prevState]
                newGroup[i] = wm
                return newGroup
            })
        },
        [map, warMachines],
    )

    const rotationChange = useCallback(
        (rotation: number, warMachine: WarMachineState, currentTime: number, duration: number) => {
            if (!map || !warMachines) return
            const wm = warMachines.find((w) => w.id === warMachine.id)
            if (!wm) return
            const rate = currentTime / duration

            const delta = (rotation - warMachine.rotation) * rate
            wm.rotation = Math.round(warMachine.rotation + delta)

            const group = [...warMachines]
            const i = group.findIndex((w) => w.id === wm.id)
            setWarMachines((prevState) => {
                if (!prevState) return
                const newGroup = [...prevState]
                newGroup[i] = wm
                return newGroup
            })
        },
        [map, warMachines],
    )

    const empCoords = useMemo(() => {
        const empX = 987.838
        const empY = 750.444

        return { x: empX, y: empY }
    }, [])

    return {
        empCoords,
        bribeStage,
        setBribeStage,
        map,
        setMap,
        abilityDetails,
        setAbilityDetails,
        warMachines,
        setWarMachines,
        battleEndDetail,
        setBattleEndDetail,
        forceDisplay100Percentage,
        setForceDisplay100Percentage,
        setTrainingStage,
        trainingStage,
        tutorialRef,
        setTutorialRef,
        mapElement,
        winner,
        setWinner,
        highlightedMechParticipantID,
        setHighlightedMechParticipantID,
        isTargeting,
        setIsTargeting,
        selection,
        setSelection,
        resetSelection,
        playerAbility,
        setPlayerAbility,
        onTargetConfirm,
        gridWidth,
        gridHeight,
        isEnlarged,
        isMapOpen,
        toggleIsMapOpen,
        completed,
        setCompleted,
        repairTime,
        setRepairTime,
        mechMoveCommand,
        mechMoveAction,
        mechMove,
        healthChange,
        shieldChange,
        battleAbilityTime,
        setBattleAbilityTime,
        smallDisplayRef,
        setSmallDisplayRef,
        bigDisplayRef,
        setBigDisplayRef,
        setIsStreamBigDisplay,
        isStreamBigDisplay,
        updater,
        setUpdater,
        rotationChange,
    }
})

export const TrainingProvider = TrainingContainer.Provider
export const useTraining = TrainingContainer.useContainer

const TRAINING_ABILITY_DETAIL = [
    null,
    {
        radius: 5200,
    },
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    {
        radius: 10000,
    },
    null,
    null,
    null,
    {
        radius: 20000,
    },
    null,
    null,
    null,
]
