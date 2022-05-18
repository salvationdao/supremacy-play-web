import { useCallback, useEffect, useRef, useState } from "react"
import { Howl, Howler } from "howler"
import { FactionIDs } from "../../constants"
import { useGame, useStream } from "../../containers"
import { GameServerKeys } from "../../keys"
import { WarMachineLiveState, WarMachineState } from "../../types"
import { useGameServerSubscription } from "../../hooks/useGameServer"
import { useToggle } from "../../hooks"

enum Sounds {
    generalIntro = "generalIntro",
    generalMain = "generalMain",
    bcMain = "bcMain",
    bcVictory = "bcVictory",
    zhiMain = "zhiMain",
    zhiVictory = "zhiVictory",
    rmMain = "rmMain",
    rmVictory = "rmVictory",
}

export const Music = () => {
    const { musicVolume, isMusicMute } = useStream()
    const { warMachines, battleEndDetail } = useGame()
    const sounds = useRef<{ [name: string]: Howl }>({})
    const currentPlaying = useRef<Sounds>()

    const [rmDeathCount, setRmDeathCount] = useState(0)
    const [zhiDeathCount, setZhiDeathCount] = useState(0)
    const [bcDeathCount, setBcDeathCount] = useState(0)

    // Load up the sound tracks
    useEffect(() => {
        sounds.current[Sounds.generalIntro] = new Howl({
            src: ["https://afiles.ninja-cdn.com/supremacy-stream-site/audio/general-intro.mp3"],
        })
        sounds.current[Sounds.generalMain] = new Howl({
            src: ["https://afiles.ninja-cdn.com/supremacy-stream-site/audio/general-main.mp3"],
            loop: true,
        })
        sounds.current[Sounds.bcMain] = new Howl({
            src: ["https://afiles.ninja-cdn.com/supremacy-stream-site/audio/bc-main.mp3"],
            loop: true,
        })
        sounds.current[Sounds.bcVictory] = new Howl({
            src: ["https://afiles.ninja-cdn.com/supremacy-stream-site/audio/bc-victory.mp3"],
            loop: true,
        })
        sounds.current[Sounds.zhiMain] = new Howl({
            src: ["https://afiles.ninja-cdn.com/supremacy-stream-site/audio/zai-main.mp3"],
            loop: true,
        })
        sounds.current[Sounds.zhiVictory] = new Howl({
            src: ["https://afiles.ninja-cdn.com/supremacy-stream-site/audio/zai-victory.mp3"],
            loop: true,
        })
        sounds.current[Sounds.rmMain] = new Howl({
            src: ["https://afiles.ninja-cdn.com/supremacy-stream-site/audio/rm-main.mp3"],
            loop: true,
        })
        sounds.current[Sounds.rmVictory] = new Howl({
            src: ["https://afiles.ninja-cdn.com/supremacy-stream-site/audio/rm-victory.mp3"],
            loop: true,
        })

        return () => {
            Howler.stop()
        }
    }, [])

    // Nicely transitions to play the new sound with fade
    const playNewSound = useCallback((newSound: Sounds, onEndSound?: Sounds) => {
        if (currentPlaying.current && currentPlaying.current != newSound) {
            sounds.current[currentPlaying.current].fade(1, 0, 800)
            sounds.current[currentPlaying.current].off()
            sounds.current[newSound].stop()
            sounds.current[newSound].play()
            sounds.current[newSound].fade(0, 1, 800)
        } else if (!currentPlaying.current) {
            sounds.current[newSound].stop()
            sounds.current[newSound].play()
        }

        if (onEndSound) {
            sounds.current[newSound].once("end", () => {
                playNewSound(onEndSound)
            })
        }

        currentPlaying.current = newSound
    }, [])

    useEffect(() => {
        Howler.volume(musicVolume)
    }, [musicVolume])

    useEffect(() => {
        Howler.mute(isMusicMute)
    }, [isMusicMute])

    // Play the faction's victory track when battle ends
    useEffect(() => {
        switch (battleEndDetail?.winning_faction.id) {
            case FactionIDs.BC:
                playNewSound(Sounds.bcVictory)
                break
            case FactionIDs.ZHI:
                playNewSound(Sounds.zhiVictory)
                break
            case FactionIDs.RM:
                playNewSound(Sounds.rmVictory)
                break
        }
    }, [battleEndDetail, playNewSound])

    // Play intro and main theme at beginning
    useEffect(() => {
        setRmDeathCount(0)
        setZhiDeathCount(0)
        setBcDeathCount(0)
        playNewSound(Sounds.generalIntro, Sounds.generalMain)
    }, [playNewSound, warMachines])

    // Play faction theme depending on who's winning
    useEffect(() => {
        if (rmDeathCount < zhiDeathCount && rmDeathCount < bcDeathCount) {
            playNewSound(Sounds.rmMain)
        } else if (zhiDeathCount < rmDeathCount && zhiDeathCount < bcDeathCount) {
            playNewSound(Sounds.zhiMain)
        } else if (bcDeathCount < zhiDeathCount && bcDeathCount < rmDeathCount) {
            playNewSound(Sounds.bcMain)
        }
    }, [rmDeathCount, zhiDeathCount, bcDeathCount, playNewSound])

    return (
        <>
            {warMachines &&
                warMachines.map((wm) => {
                    let setDeathCount
                    switch (wm.factionID) {
                        case FactionIDs.ZHI:
                            setDeathCount = setZhiDeathCount
                            break
                        case FactionIDs.BC:
                            setDeathCount = setBcDeathCount
                            break
                        case FactionIDs.RM:
                            setDeathCount = setRmDeathCount
                            break
                    }

                    return <Mech key={wm.hash} warMachine={wm} setDeathCount={setDeathCount} />
                })}
        </>
    )
}

interface MechProps {
    warMachine: WarMachineState
    setDeathCount?: React.Dispatch<React.SetStateAction<number>>
}

const Mech = ({ warMachine, setDeathCount }: MechProps) => {
    const { participantID } = warMachine
    const [isDead, toggleIsDead] = useToggle()

    // Listen on current war machine changes
    useGameServerSubscription<WarMachineLiveState | undefined>(
        {
            URI: `/battle/mech/${participantID}`,
            key: GameServerKeys.SubMechLiveStats,
        },
        (payload) => {
            if (payload?.health !== undefined) {
                if (payload.health <= 0) toggleIsDead(true)
            }
        },
    )

    useEffect(() => {
        if (isDead && setDeathCount) setDeathCount((prev) => prev + 1)
    }, [isDead, setDeathCount])

    return null
}
