import { useCallback, useEffect, useRef, useState } from "react"
import { TRAINING_ASSETS } from "../../constants"
import { useAuth, useTraining } from "../../containers"
import { BribeStage, Context, Map, MechAbilityStages, TrainingAbility, WarMachineState } from "../../types"
import { TrainingBribeStageResponse } from "./TrainingBattleAbility"
import { TutorialContainer } from "./TutorialContainer"

export const VIDEO_SOURCE_MA = {
    intro: TRAINING_ASSETS + "/mech_ability/1.mp4",
    heal: TRAINING_ASSETS + "/mech_ability/2.mp4",
    move: TRAINING_ASSETS + "/mech_ability/3.mp4",
    overcharge: TRAINING_ASSETS + "/mech_ability/4.mp4",
}

export const VIDEO_SOURCE_MA_LIST = Object.values(VIDEO_SOURCE_MA)

export const TrainingMechAbility = () => {
    const { userID } = useAuth()
    const {
        setTrainingStage,
        trainingStage,
        setMap,
        setWarMachines,
        toggleIsMapOpen,
        mechMove,
        healthChange,
        shieldChange,
        warMachines,
        setBribeStage,
        setWinner,
        setIsTargeting,
        setPlayerAbility,
        setHighlightedMechParticipantID,
        rotationChange,
    } = useTraining()
    const [videoSource, setVideoSource] = useState(VIDEO_SOURCE_MA.intro)
    const [stage, setStage] = useState<Context | null>(null)
    const [popoverOpen, setPopoverOpen] = useState(true)
    const [end, setEnd] = useState(false)

    // Tutorial mech state
    const tutorialMechs = useRef<{ [key: string]: WarMachineState | undefined }>({
        bc1: trainingMechs(userID).find((w) => w.id === MechIDs.BC1),
        zb1: trainingMechs(userID).find((w) => w.id === MechIDs.ZB1),
        zb2: trainingMechs(userID).find((w) => w.id === MechIDs.ZB2),
        zb3: trainingMechs(userID).find((w) => w.id === MechIDs.ZB3),
        rm3: trainingMechs(userID).find((w) => w.id === MechIDs.RM3),
    })

    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        switch (trainingStage) {
            case MechAbilityStages.ExpandMA: {
                const expandStage = context.find((s) => s.state === trainingStage)
                if (expandStage) setStage(expandStage)
                break
            }
            case MechAbilityStages.RepairMA: {
                const repairStage = context.find((s) => s.state === trainingStage)
                if (repairStage) setStage(repairStage)
                setPopoverOpen(false)
                videoRef.current?.play()
                break
            }
            case MechAbilityStages.MapMA:
                setWinner(undefined)
                setIsTargeting(false)
                toggleIsMapOpen(true)
                break
            case MechAbilityStages.MoveMA: {
                const moveStage = context.find((s) => s.state === trainingStage)
                if (moveStage) setStage(moveStage)
                break
            }
            case MechAbilityStages.MoveActionMA: {
                const moveActionStage = context.find((s) => s.state === trainingStage)
                if (moveActionStage) setStage(moveActionStage)
                setPopoverOpen(false)
                videoRef.current?.play()
                break
            }
            case MechAbilityStages.OverchargeMA: {
                const overchargeStage = context.find((s) => s.state === trainingStage)
                if (overchargeStage) setStage(overchargeStage)
                videoRef.current?.pause()
                setPopoverOpen(true)
                break
            }
            case MechAbilityStages.OverchargeActionMA: {
                setPopoverOpen(false)
                videoRef.current?.play()
                toggleIsMapOpen(false)
                break
            }
            default:
                break
        }
    }, [trainingStage, setStage, toggleIsMapOpen, setWinner, setIsTargeting])

    // Initialise
    useEffect(() => {
        setMap(trainingMap)
        setWarMachines(trainingMechs(userID))
        const trainingBribeStage: TrainingBribeStageResponse = {
            phase: BribeStage.Cooldown,
            time: 30,
        }
        setBribeStage(trainingBribeStage)
    }, [setBribeStage, setMap, setWarMachines, userID])

    const updateTutorialMechs = useCallback(() => {
        // Update tutorial mechs
        if (!warMachines) return

        // Cant copy object but need to copy value
        const wmBC1 = warMachines?.find((w) => w.id === MechIDs.BC1)
        const wmZB1 = warMachines?.find((w) => w.id === MechIDs.ZB1)
        const wmZB2 = warMachines?.find((w) => w.id === MechIDs.ZB2)
        const wmZB3 = warMachines?.find((w) => w.id === MechIDs.ZB3)
        const wmRM3 = warMachines?.find((w) => w.id === MechIDs.RM3)
        if (!wmBC1 || !wmZB1 || !wmZB2 || !wmZB3 || !wmRM3) return

        tutorialMechs.current = {
            bc1: {
                ...wmBC1,
                position: { ...wmBC1.position },
            },
            zb1: {
                ...wmZB1,
                position: { ...wmZB1.position },
            },
            zb2: {
                ...wmZB2,
                position: { ...wmZB2.position },
            },
            zb3: {
                ...wmZB3,
                position: { ...wmZB3.position },
            },
            rm3: {
                ...wmRM3,
                position: { ...wmRM3.position },
            },
        }
    }, [warMachines])
    return (
        <TutorialContainer
            stage={stage}
            currentAbility={TrainingAbility.Mech}
            context={context}
            videoSource={videoSource}
            setStage={setStage}
            end={end}
            videoRef={videoRef}
            popoverOpen={popoverOpen}
            setPopoverOpen={setPopoverOpen}
        >
            <video
                key={videoSource}
                ref={videoRef}
                onPlay={() => {
                    if (videoSource !== VIDEO_SOURCE_MA.intro && popoverOpen) {
                        videoRef.current?.pause()
                    }
                }}
                onTimeUpdate={(e) => {
                    const { currentTime, duration } = e.currentTarget
                    const { bc1, zb1, zb2, zb3, rm3 } = tutorialMechs.current
                    if (!bc1 || !zb1 || !zb2 || !zb3 || !rm3) return

                    // INTRO BATTLE
                    if (videoSource === VIDEO_SOURCE_MA.intro) {
                        rotationChange(175, bc1, currentTime, duration)
                        rotationChange(350, zb1, currentTime, duration)
                        rotationChange(150, zb2, currentTime, duration)
                        rotationChange(120, zb3, currentTime, duration)
                        rotationChange(300, rm3, currentTime, duration)

                        mechMove(38.4, 20.42, bc1, currentTime, duration)
                        mechMove(19.82, 12.27, zb2, currentTime, duration)
                        mechMove(17.21, 12.67, zb3, currentTime, duration)
                        mechMove(15.92, 14.5, rm3, currentTime, duration)

                        healthChange(1000, zb1, currentTime, duration)
                        healthChange(1500, zb2, currentTime, duration)
                        healthChange(1500, zb3, currentTime, duration)
                        healthChange(900, rm3, currentTime, duration)

                        shieldChange(700, bc1, currentTime, duration)
                        shieldChange(700, zb2, currentTime, duration)
                        shieldChange(600, zb3, currentTime, duration)
                        return
                    }

                    // REPAIR
                    if (trainingStage === MechAbilityStages.RepairMA) {
                        mechMove(36.15, 19.92, bc1, currentTime, duration)
                        mechMove(37.2, 19.85, zb1, currentTime, duration)
                        mechMove(17.82, 13.27, zb2, currentTime, duration)
                        mechMove(16.82, 14.88, zb3, currentTime, duration)
                        mechMove(15.69, 15.67, rm3, currentTime, duration)

                        rotationChange(290, bc1, currentTime, duration)
                        rotationChange(450, zb1, currentTime, duration)
                        rotationChange(140, zb3, currentTime, duration)

                        // ZB1 dead
                        healthChange(0, zb1, currentTime, duration - 0.5)
                        healthChange(1200, zb2, currentTime, duration)
                        healthChange(1100, zb3, currentTime, duration)
                        healthChange(500, rm3, currentTime, duration)

                        // Shield
                        shieldChange(500, bc1, currentTime, duration)
                        shieldChange(600, zb2, currentTime, duration)
                        shieldChange(500, zb3, currentTime, duration)

                        // BC1 repair
                        if (currentTime >= 1.5) healthChange(2000, bc1, currentTime, duration)
                        else healthChange(600, bc1, currentTime, duration)
                        return
                    }

                    // MECH MOVE
                    if (videoSource === VIDEO_SOURCE_MA.move) {
                        const rmDead = duration / 3
                        if (currentTime <= 2) {
                            rotationChange(185, bc1, currentTime, 2)
                        }
                        if (currentTime <= 8 && currentTime >= rmDead - 1) {
                            rotationChange(45, zb2, currentTime, 8)
                            rotationChange(15, zb3, currentTime, 8)
                        } else if (currentTime <= 8) {
                            rotationChange(110, zb2, currentTime, rmDead - 1)
                            rotationChange(125, zb3, currentTime, rmDead - 1)
                        }

                        // Get current health
                        healthChange(800, zb2, currentTime, duration)
                        healthChange(700, zb3, currentTime, duration)
                        healthChange(0, rm3, currentTime, rmDead)

                        // Shield change
                        shieldChange(400, bc1, currentTime, duration)
                        shieldChange(400, zb2, currentTime, duration)
                        shieldChange(400, zb3, currentTime, duration)

                        const moveCommand = trainingMoveCommand(userID)
                        if (currentTime <= 8 || currentTime >= 9) {
                            mechMove(moveCommand.cell_x, moveCommand.cell_y, bc1, currentTime, duration)
                        }
                        if (currentTime >= 10) {
                            shieldChange(200, bc1, currentTime, duration)
                        }
                        if (currentTime >= duration - 2) {
                            rotationChange(270, bc1, currentTime, duration)
                        }
                    }

                    // Overcharge
                    if (videoSource === VIDEO_SOURCE_MA.overcharge) {
                        // Get current health
                        shieldChange(100, bc1, currentTime, 8)
                        if (currentTime >= 7.5 && currentTime <= 8.4) {
                            healthChange(0, zb2, currentTime, 8)
                            healthChange(0, zb3, currentTime, 8)
                            shieldChange(0, zb2, currentTime, 8)
                            shieldChange(0, zb3, currentTime, 8)
                        }
                    }
                }}
                onEnded={() => {
                    const finalVideo = VIDEO_SOURCE_MA_LIST[VIDEO_SOURCE_MA_LIST.length - 1]
                    if (videoSource === finalVideo) {
                        setStage(null)
                        setEnd(true)
                        setPlayerAbility(undefined)
                        setHighlightedMechParticipantID(undefined)
                        return
                    }

                    // Next video
                    updateTutorialMechs()
                    const index = VIDEO_SOURCE_MA_LIST.findIndex((v) => v === videoSource)
                    const nextVideo = VIDEO_SOURCE_MA_LIST[index + 1]

                    const currentStage = context.find((s) => {
                        // Automatically goes next stage
                        if (nextVideo === s.videoSource && stage !== s) return true
                    })
                    if (currentStage) {
                        setStage(currentStage)
                        setPopoverOpen(true)
                        if (currentStage.state !== trainingStage) setTrainingStage(currentStage.state)
                    }
                    setVideoSource(nextVideo)
                }}
                controlsList="nofullscreen nodownload"
                disablePictureInPicture
                autoPlay
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            >
                <source src={videoSource} />
            </video>
        </TutorialContainer>
    )
}

const context: Context[] = [
    {
        text: "When your mech is in battle, you are able to deploy mech abilities. Click the skills button to view the abilities.",
        showNext: false,
        state: MechAbilityStages.ExplainMA,
        videoSource: VIDEO_SOURCE_MA.heal,
    },
    {
        text: "Give your mech an advantage and use repair to help bring its health back up.",
        showNext: false,
        state: MechAbilityStages.ExpandMA,
        videoSource: VIDEO_SOURCE_MA.heal,
    },
    {
        text: 'You can also use mech abilities through the minimap. Lets try commanding your mech to move closer to the enemy. Use "MOVE COMMAND" to move closer to your enemies.',
        showNext: false,
        state: MechAbilityStages.MapMA,
        videoSource: VIDEO_SOURCE_MA.move,
    },
    {
        text: "Aim mech command to get closer to the two enemy mechs. There is no limit to how many times you use mech command.",
        showNext: false,
        state: MechAbilityStages.MoveMA,
        videoSource: VIDEO_SOURCE_MA.move,
    },
    {
        text: "Your mech is in range to use Overcharge. Use Overcharge and defeat the enemy!",
        showNext: false,
        state: MechAbilityStages.OverchargeMA,
        videoSource: VIDEO_SOURCE_MA.overcharge,
    },
]

const trainingMap: Map = {
    Name: "TheHive",
    Image_Url: "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/the_hive.png",
    Background_Url: "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/the_hive.png",
    Width: 2150,
    Height: 2000,
    Cells_X: 43,
    Cells_Y: 40,
    Pixel_Top: -59700,
    Pixel_Left: -23000,
    Disabled_Cells: [
        0, 126, 169, 212, 255, 298, 341, 384, 427, 470, 513, 556, 599, 642, 685, 728, 771, 814, 857, 900, 943, 986, 1029, 1072, 1115, 1158, 1201, 1244, 1287,
        1330, 1373, 1416, 1459, 1502, 1545, 1588, 127, 170, 213, 256, 299, 342, 385, 428, 471, 514, 557, 600, 643, 686, 729, 772, 815, 858, 901, 944, 987, 1030,
        1073, 1116, 1159, 1202, 1245, 1288, 1331, 1374, 1417, 1460, 1503, 1546, 1589, 128, 171, 214, 257, 300, 343, 386, 429, 472, 515, 558, 601, 644, 687, 730,
        773, 816, 859, 902, 945, 988, 1031, 1074, 1117, 1160, 1203, 1246, 1289, 1332, 1375, 1418, 1461, 1504, 1547, 1590, 129, 172, 215, 258, 301, 344, 387,
        430, 473, 516, 559, 602, 645, 688, 731, 774, 817, 860, 903, 946, 989, 1032, 1075, 1118, 1161, 1204, 1247, 1290, 1333, 1376, 1419, 1462, 1505, 1548,
        1591, 130, 173, 216, 259, 302, 345, 388, 431, 474, 517, 560, 603, 646, 689, 732, 775, 818, 861, 904, 947, 990, 1033, 1076, 1119, 1162, 1205, 1248, 1291,
        1334, 1377, 1420, 1463, 1506, 1549, 1592, 131, 174, 217, 260, 303, 346, 389, 432, 475, 518, 561, 604, 647, 690, 733, 776, 819, 862, 905, 948, 991, 1034,
        1077, 1120, 1163, 1206, 1249, 1292, 1335, 1378, 1421, 1464, 1507, 1550, 1593, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
        22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
        60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97,
        98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 1594, 1595,
        1596, 1597, 1598, 1599, 1600, 1601, 1602, 1603, 1604, 1605, 1606, 1607, 1608, 1609, 1610, 1611, 1612, 1613, 1614, 1615, 1616, 1617, 1618, 1619, 1620,
        1621, 1622, 1623, 1624, 1625, 1626, 1627, 1628, 1629, 1630, 1631, 1632, 1633, 1634, 1635, 1636, 1637, 1638, 1639, 1640, 1641, 1642, 1643, 1644, 1645,
        1646, 1647, 1648, 1649, 1650, 1651, 1652, 1653, 1654, 1655, 1656, 1657, 1658, 1659, 1660, 1661, 1662, 1663, 1664, 1665, 1666, 1667, 1668, 1669, 1670,
        1671, 1672, 1673, 1674, 1675, 1676, 1677, 1678, 1679, 1680, 1681, 1682, 1683, 1684, 1685, 1686, 1687, 1688, 1689, 1690, 1691, 1692, 1693, 1694, 1695,
        1696, 1697, 1698, 1699, 1700, 1701, 1702, 1703, 1704, 1705, 1706, 1707, 1708, 1709, 1710, 1711, 1712, 1713, 1714, 1715, 1716, 1717, 1718, 1719,
    ],
}

export enum MechIDs {
    BC1 = "BC1",
    BC2 = "BC2",
    BC3 = "BC3",
    ZB1 = "ZB1",
    ZB2 = "ZB2",
    ZB3 = "ZB3",
    RM1 = "RM1",
    RM2 = "RM2",
    RM3 = "RM3",
}

export const trainingMoveCommand = (userID: string) => {
    return {
        id: "test",
        mech_id: MechIDs.BC1,
        triggered_by_id: userID,
        cell_x: 18.24,
        cell_y: 14.51,
        cancelled_at: "",
        reached_at: "",
        remain_cooldown_seconds: 5,
    }
}

const trainingMechs = (userID: string) => {
    return [
        {
            ownerUsername: "",
            modelID: "",
            id: MechIDs.BC1,
            hash: "JkRNuNlljO",
            ownedByID: userID,
            name: "Boston Cybernetics 1",
            participantID: 1,
            factionID: "7c6dde21-b067-46cf-9e56-155c88a520e2",
            maxHealth: 3600,
            maxShield: 3000,
            health: 1000,
            model: "XFVS",
            skin: "BlueWhite",
            speed: 2750,
            tier: "ELITE_LEGENDARY",
            weaponNames: [],
            image: "https://afiles.ninja-cdn.com/passport/genesis/img/boston-cybernetics_law-enforcer-x-1000_blue-white.png",
            imageAvatar: "https://afiles.ninja-cdn.com/passport/genesis/avatar/boston-cybernetics_law-enforcer-x-1000_blue-white_avatar.png",
            position: {
                x: 49748.57142857142,
                y: -21745.513392857145,
            },
            rotation: 90,
            isHidden: false,
            shield: 1600,
            shieldRechargeRate: 240,
            description: "",
            externalUrl: "",
            durability: 0,
            powerGrid: 0,
            cpu: 0,
            weaponHardpoint: 0,
            turretHardpoint: 0,
            utilitySlots: 0,
        },
        {
            ownerUsername: "",
            modelID: "",
            id: MechIDs.BC2,
            hash: "JkRNuNldsdsdljO",
            ownedByID: "test",
            name: "Boston Cybernetics 2",
            participantID: 2,
            factionID: "7c6dde21-b067-46cf-9e56-155c88a520e2",
            maxHealth: 3600,
            maxShield: 3000,
            health: 0,
            model: "XFVS",
            skin: "BioHazard",
            speed: 2750,
            tier: "MEGA",
            weaponNames: [],
            image: "https://afiles.ninja-cdn.com/passport/genesis/img/boston-cybernetics_law-enforcer-x-1000_biohazard.png",
            imageAvatar: "https://afiles.ninja-cdn.com/passport/genesis/avatar/boston-cybernetics_law-enforcer-x-1000_biohazard_avatar.png",
            position: {
                x: 29108.571428571428,
                y: -4248.370535714283,
            },
            rotation: 240,
            isHidden: false,
            shield: 0,
            shieldRechargeRate: 240,
            description: "",
            externalUrl: "",
            durability: 0,
            powerGrid: 0,
            cpu: 0,
            weaponHardpoint: 0,
            turretHardpoint: 0,
            utilitySlots: 0,
        },
        {
            ownerUsername: "",
            modelID: "",
            id: MechIDs.BC3,
            hash: "JkRNuNllsdsdjO",
            ownedByID: "test",
            name: "Boston Cybernetics 3",
            participantID: 3,
            factionID: "7c6dde21-b067-46cf-9e56-155c88a520e2",
            maxHealth: 3600,
            maxShield: 3000,
            health: 0,
            model: "XFVS",
            skin: "BlueWhite",
            speed: 2750,
            tier: "MEGA",
            weaponNames: [],
            image: "https://afiles.ninja-cdn.com/passport/genesis/img/boston_cybernetics_xfvs_blue_white.png",
            imageAvatar: "https://afiles.ninja-cdn.com/passport/genesis/avatar/boston-cybernetics_law-enforcer-x-1000_dune_avatar.png",
            position: {
                x: 22842.857142857145,
                y: -43194.08482142857,
            },
            rotation: 240,
            isHidden: false,
            shield: 0,
            shieldRechargeRate: 240,
            description: "",
            externalUrl: "",
            durability: 0,
            powerGrid: 0,
            cpu: 0,
            weaponHardpoint: 0,
            turretHardpoint: 0,
            utilitySlots: 0,
        },
        {
            ownerUsername: "",
            modelID: "",
            id: MechIDs.ZB1,
            hash: "88seem8xNW",
            ownedByID: "305da475-53dc-4973-8d78-a30d390d3de5",
            name: "Zaibatsu 1",
            participantID: 4,
            factionID: "880db344-e405-428d-84e5-6ebebab1fe6d",
            maxHealth: 3300,
            maxShield: 3000,
            health: 2100,
            model: "BXSD",
            skin: "Beetle",
            speed: 1750,
            tier: "MEGA",
            weaponNames: [],
            image: "https://afiles.ninja-cdn.com/passport/genesis/img/zaibatsu_tenshi-mk1_black-digi.png",
            imageAvatar: "https://afiles.ninja-cdn.com/passport/genesis/avatar/zaibatsu_tenshi-mk1_black-digi_avatar.png",
            position: {
                x: 50731.428571428565,
                y: -17588.37053571429,
            },
            rotation: 270,
            isHidden: false,
            shield: 0,
            shieldRechargeRate: 240,
            description: "",
            externalUrl: "",
            durability: 0,
            powerGrid: 0,
            cpu: 0,
            weaponHardpoint: 0,
            turretHardpoint: 0,
            utilitySlots: 0,
        },
        {
            ownerUsername: "",
            modelID: "",
            id: MechIDs.ZB2,
            hash: "88seem8xNW",
            ownedByID: "305da475-53dc-4973-8d78-a30d390d3de5",
            name: "Zaibatsu 2",
            participantID: 5,
            factionID: "880db344-e405-428d-84e5-6ebebab1fe6d",
            maxHealth: 3300,
            maxShield: 3000,
            health: 2200,
            model: "BXSD",
            skin: "Beetle",
            speed: 1750,
            tier: "MEGA",
            weaponNames: [],
            image: "https://afiles.ninja-cdn.com/passport/genesis/img/zaibatsu_tenshi-mk1_black-digi.png",
            imageAvatar: "https://afiles.ninja-cdn.com/passport/genesis/avatar/zaibatsu_tenshi-mk1_black-digi_avatar.png",
            position: {
                x: 18320.123604320113,
                y: -35506.425248746666,
            },
            rotation: 120,
            isHidden: false,
            shield: 1000,
            shieldRechargeRate: 240,
            description: "",
            externalUrl: "",
            durability: 0,
            powerGrid: 0,
            cpu: 0,
            weaponHardpoint: 0,
            turretHardpoint: 0,
            utilitySlots: 0,
        },
        {
            ownerUsername: "",
            modelID: "",
            id: MechIDs.ZB3,
            hash: "88seem8xNW",
            ownedByID: "305da475-53dc-4973-8d78-a30d390d3de5",
            name: "Zaibatsu 3",
            participantID: 6,
            factionID: "880db344-e405-428d-84e5-6ebebab1fe6d",
            maxHealth: 3300,
            maxShield: 3000,
            health: 2100,
            model: "BXSD",
            skin: "Beetle",
            speed: 1750,
            tier: "MEGA",
            weaponNames: [],
            image: "https://afiles.ninja-cdn.com/passport/genesis/img/zaibatsu_tenshi-mk1_black-digi.png",
            imageAvatar: "https://afiles.ninja-cdn.com/passport/genesis/avatar/zaibatsu_tenshi-mk1_black-digi_avatar.png",
            position: {
                x: 11499.166899701719,
                y: -35941.50348751515,
            },
            rotation: 105,
            isHidden: false,
            shield: 1200,
            shieldRechargeRate: 240,
            description: "",
            externalUrl: "",
            durability: 0,
            powerGrid: 0,
            cpu: 0,
            weaponHardpoint: 0,
            turretHardpoint: 0,
            utilitySlots: 0,
        },
        {
            ownerUsername: "",
            modelID: "",
            id: MechIDs.RM1,
            hash: "88seem8xNW",
            ownedByID: "305da475-53dc-4973-8d78-a30d390d3de5",
            name: "Red mountain 1",
            participantID: 7,
            factionID: "98bf7bb3-1a7c-4f21-8843-458d62884060",
            maxHealth: 4700,
            maxShield: 3000,
            health: 0,
            model: "BXSD",
            skin: "Beetle",
            speed: 1750,
            tier: "MEGA",
            weaponNames: [],
            image: "https://afiles.ninja-cdn.com/passport/genesis/img/red_mountain_bxsd_pink.png",
            imageAvatar: "https://afiles.ninja-cdn.com/passport/genesis/avatar/red-mountain_olympus-mons-ly07_red-hex_avatar.png",
            position: {
                x: 43237.142857142855,
                y: -6459.799107142862,
            },
            rotation: 70,
            isHidden: false,
            shield: 0,
            shieldRechargeRate: 240,
            description: "",
            externalUrl: "",
            durability: 0,
            powerGrid: 0,
            cpu: 0,
            weaponHardpoint: 0,
            turretHardpoint: 0,
            utilitySlots: 0,
        },
        {
            ownerUsername: "",
            modelID: "",
            id: MechIDs.RM2,
            hash: "88seem8xNW",
            ownedByID: "305da475-53dc-4973-8d78-a30d390d3de5",
            name: "Red mountain 2",
            participantID: 8,
            factionID: "98bf7bb3-1a7c-4f21-8843-458d62884060",
            maxHealth: 4700,
            maxShield: 3000,
            health: 0,
            model: "BXSD",
            skin: "Beetle",
            speed: 1750,
            tier: "MEGA",
            weaponNames: [],
            image: "https://afiles.ninja-cdn.com/passport/genesis/img/red_mountain_bxsd_pink.png",
            imageAvatar: "https://afiles.ninja-cdn.com/passport/genesis/avatar/red-mountain_olympus-mons-ly07_red-hex_avatar.png",
            position: {
                x: 237.14285714285506,
                y: -3879.799107142855,
            },
            rotation: 70,
            isHidden: false,
            shield: 0,
            shieldRechargeRate: 240,
            description: "",
            externalUrl: "",
            durability: 0,
            powerGrid: 0,
            cpu: 0,
            weaponHardpoint: 0,
            turretHardpoint: 0,
            utilitySlots: 0,
        },
        {
            ownerUsername: "",
            modelID: "",
            id: MechIDs.RM3,
            hash: "88seem8xNW",
            ownedByID: "305da475-53dc-4973-8d78-a30d390d3de5",
            name: "Red mountain 3",
            participantID: 9,
            factionID: "98bf7bb3-1a7c-4f21-8843-458d62884060",
            maxHealth: 4700,
            maxShield: 3000,
            health: 1400,
            model: "BXSD",
            skin: "Beetle",
            speed: 1750,
            tier: "MEGA",
            weaponNames: [],
            image: "https://afiles.ninja-cdn.com/passport/genesis/img/red_mountain_bxsd_pink.png",
            imageAvatar: "https://afiles.ninja-cdn.com/passport/genesis/avatar/red-mountain_olympus-mons-ly07_red-hex_avatar.png",
            position: {
                x: 11105.113636363632,
                y: -32995.05504261363,
            },
            rotation: 280,
            isHidden: false,
            shield: 0,
            shieldRechargeRate: 240,
            description: "",
            externalUrl: "",
            durability: 0,
            powerGrid: 0,
            cpu: 0,
            weaponHardpoint: 0,
            turretHardpoint: 0,
            utilitySlots: 0,
        },
    ]
}
