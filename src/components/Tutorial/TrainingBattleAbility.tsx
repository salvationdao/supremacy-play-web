import { useEffect, useRef, useState } from "react"
import { TRAINING_ASSETS } from "../../constants"
import { useAuth, useTraining } from "../../containers"
import { BattleAbilityStages, BribeStage, Context, GameAbility, LocationSelectType, Map, TrainingAbility, WarMachineState } from "../../types"
import { TutorialContainer } from "./TutorialContainer"
import { trainingAirStrike } from "./VotingSystem/BattleAbility/BattleAbilityItemBT"

export const VIDEO_SOURCE_BA = {
    intro: TRAINING_ASSETS + "/battle_ability/1.mp4",
    explain: TRAINING_ASSETS + "/battle_ability/2.mp4",
    opt_in: TRAINING_ASSETS + "/battle_ability/3.mp4",
    airstrike: TRAINING_ASSETS + "/battle_ability/4.mp4",
}

export const VIDEO_SOURCE_BA_LIST = Object.values(VIDEO_SOURCE_BA)

export interface TrainingBribeStageResponse {
    phase: BribeStage
    time: number // in seconds
}

export interface TrainingWinnerResponse {
    game_ability: GameAbility
    time: number
}

export const TrainingBattleAbility = () => {
    const { userID } = useAuth()
    const { setTrainingStage, trainingStage, setBribeStage, setMap, setWarMachines, setIsTargeting, setWinner, toggleIsMapOpen } = useTraining()
    const [videoSource, setVideoSource] = useState(VIDEO_SOURCE_BA.intro)
    const [stage, setStage] = useState<Context | null>(null)
    const [popoverOpen, setPopoverOpen] = useState(true)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [end, setEnd] = useState(false)

    useEffect(() => {
        if (trainingStage === BattleAbilityStages.OptedIn) {
            setPopoverOpen(false)
            videoRef.current?.play()
        } else if (trainingStage === BattleAbilityStages.LocationSelectBA) {
            const locationStage = context.find((s) => s.state === trainingStage)
            if (!locationStage) return
            toggleIsMapOpen(true)
            setStage(locationStage)
            setPopoverOpen(true)
            setIsTargeting(true)
        } else if (trainingStage === BattleAbilityStages.ShowAbilityBA) {
            setPopoverOpen(false)
            videoRef.current?.play()
        }
    }, [setIsTargeting, setPopoverOpen, trainingStage, toggleIsMapOpen])

    // Initialise
    useEffect(() => {
        setMap(trainingMap)
        setWarMachines(trainingMechs())
    }, [setMap, setWarMachines, userID])

    return (
        <TutorialContainer
            stage={stage}
            currentAbility={TrainingAbility.Battle}
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
                onPlay={(e) => {
                    const { duration } = e.currentTarget
                    const time = Math.floor(duration)
                    const explainVideoDuration = 4
                    if (videoSource !== VIDEO_SOURCE_BA.intro && popoverOpen) {
                        videoRef.current?.pause()
                    }

                    switch (videoSource) {
                        case VIDEO_SOURCE_BA.intro: {
                            const trainingBribeStage: TrainingBribeStageResponse = {
                                phase: BribeStage.Cooldown,
                                time: time + explainVideoDuration,
                            }
                            setBribeStage(trainingBribeStage)
                            setWinner(undefined)
                            break
                        }
                        case VIDEO_SOURCE_BA.explain: {
                            const trainingBribeStage: TrainingBribeStageResponse = {
                                phase: BribeStage.Cooldown,
                                time,
                            }
                            setBribeStage(trainingBribeStage)
                            break
                        }
                        case VIDEO_SOURCE_BA.opt_in: {
                            const trainingBribeStage: TrainingBribeStageResponse = {
                                phase: BribeStage.OptIn,
                                time,
                            }
                            setBribeStage(trainingBribeStage)
                            break
                        }
                        case VIDEO_SOURCE_BA.airstrike: {
                            const duration = 10 // 10 seconds to choose airstrike
                            const trainingBribeStage: TrainingBribeStageResponse = {
                                phase: BribeStage.LocationSelect,
                                time: duration,
                            }
                            const gameAbility = {
                                ...trainingAirStrike,

                                game_client_ability_id: 0,
                                identity: "",
                                location_select_type: LocationSelectType.LineSelect,
                                sups_cost: "0",
                                current_sups: "0",
                            }
                            const trainingResponse: TrainingWinnerResponse = {
                                game_ability: gameAbility,
                                time: duration,
                            }
                            setWinner(trainingResponse)
                            setBribeStage(trainingBribeStage)
                            break
                        }
                    }
                }}
                onTimeUpdate={(e) => {
                    const { currentTime, duration } = e.currentTarget
                    const timeRemaining = Math.floor(duration - currentTime)
                    const explainVideoDuration = 4
                    switch (videoSource) {
                        case VIDEO_SOURCE_BA.intro: {
                            const trainingBribeStage: TrainingBribeStageResponse = {
                                phase: BribeStage.Cooldown,
                                time: timeRemaining + explainVideoDuration,
                            }
                            setBribeStage(trainingBribeStage)
                            break
                        }
                        case VIDEO_SOURCE_BA.explain: {
                            const trainingBribeStage: TrainingBribeStageResponse = {
                                phase: BribeStage.Cooldown,
                                time: timeRemaining,
                            }
                            setBribeStage(trainingBribeStage)
                            break
                        }
                        case VIDEO_SOURCE_BA.opt_in: {
                            const trainingBribeStage: TrainingBribeStageResponse = {
                                phase: BribeStage.OptIn,
                                time: timeRemaining,
                            }
                            setBribeStage(trainingBribeStage)
                            break
                        }
                        case VIDEO_SOURCE_BA.airstrike: {
                            const trainingBribeStage: TrainingBribeStageResponse = {
                                phase: BribeStage.LocationSelect,
                                time: timeRemaining,
                            }
                            setBribeStage(trainingBribeStage)
                            break
                        }
                    }
                }}
                onEnded={() => {
                    const finalVideo = VIDEO_SOURCE_BA_LIST[VIDEO_SOURCE_BA_LIST.length - 1]
                    if (videoSource === finalVideo) {
                        setStage(null)
                        setEnd(true)
                        setWinner(undefined)
                        return
                    }
                    // Next video
                    const index = VIDEO_SOURCE_BA_LIST.findIndex((v) => v === videoSource)
                    const nextVideo = VIDEO_SOURCE_BA_LIST[index + 1]

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
        text: "Battle Ability is where you you can influence the success of your Faction by opting in to deploy an airstrike, nuke or repair crate.",
        showNext: true,
        state: BattleAbilityStages.ExplainBA,
        videoSource: VIDEO_SOURCE_BA.explain,
    },
    {
        text: "Click the button to opt in and wait for your Faction AI to select a player.",
        showNext: false,
        state: BattleAbilityStages.OptIn,
        videoSource: VIDEO_SOURCE_BA.opt_in,
    },
    {
        text: "You have been selected by the Overseer to deploy a battle ability. A minimap is shown to choose a location to deploy the battle ability real-time and help your faction win.",
        showNext: true,
        state: BattleAbilityStages.LocationSelectBA,
        videoSource: VIDEO_SOURCE_BA.airstrike,
    },
    {
        text: "This explains the type of ability to be deployed and the countdown before the Overseer offers it another citizen.",
        showNext: true,
        state: BattleAbilityStages.LocationExplainBA,
        videoSource: VIDEO_SOURCE_BA.airstrike,
    },
    {
        text: "Defeat the opposition and destroy Red Mountain Offworld Corporation! Click the guided points (1 and 2) by order, to deploy the battle ability!",
        showNext: false,
        state: BattleAbilityStages.LocationActionBA,
        videoSource: VIDEO_SOURCE_BA.airstrike,
    },
]

const trainingMap: Map = {
    Name: "CityBlockArena",
    Image_Url: "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/CityBlockArena.jpg",
    Width: 1900,
    Height: 1700,
    Cells_X: 38,
    Cells_Y: 34,
    Pixel_Top: -28200,
    Pixel_Left: -38100,
    Disabled_Cells: [
        1254, 1255, 1256, 1257, 1258, 1259, 1260, 1261, 1262, 1263, 1264, 1265, 1266, 1267, 1268, 1269, 1270, 1271, 1272, 1275, 1276, 1277, 1278, 1279, 1280,
        1281, 1282, 1283, 1284, 1285, 1286, 1287, 1288, 1289, 1290, 1291, 1273, 1274, 1253, 1252, 1251, 1249, 1248, 1247, 1246, 1245, 1244, 1243, 1242, 1241,
        1240, 1239, 1238, 1237, 1236, 1250, 1235, 1234, 1233, 1232, 1231, 1230, 1229, 1228, 1227, 1226, 1225, 1224, 1223, 1222, 1221, 1220, 1219, 1218, 1217,
        1216, 1179, 1141, 1103, 1065, 1027, 989, 951, 913, 875, 837, 799, 761, 723, 685, 647, 609, 571, 533, 495, 457, 419, 381, 343, 305, 266, 228, 190, 152,
        114, 76, 38, 1, 39, 77, 115, 153, 191, 229, 267, 0, 304, 342, 380, 418, 456, 494, 532, 570, 608, 646, 684, 722, 760, 798, 836, 1102, 1140, 1178, 1064,
        1026, 988, 950, 912, 874, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 64, 65, 66, 67, 68, 69, 70, 71,
        72, 73, 74, 75, 63, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 22, 23, 24, 25, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3,
        2, 112, 150, 188, 226, 264, 302, 340, 378, 416, 454, 492, 530, 568, 606, 644, 682, 720, 758, 796, 834, 872, 910, 948, 986, 1024, 1062, 1100, 1138, 1176,
        1214, 1215, 1177, 1139, 1101, 1063, 1025, 987, 949, 911, 873, 835, 797, 759, 721, 683, 645, 607, 569, 531, 493, 455, 417, 379, 341, 113, 151, 303, 265,
        227, 189, 1192, 1191, 1190, 1189, 1188, 1187, 1186, 1185, 1184, 1183, 1182, 1181, 1180, 1142, 1104, 1066, 1028, 990, 991, 11, 43, 1029, 1067, 1105, 992,
        1030, 1068, 1106, 1144, 1145, 1107, 1069, 1031, 993, 995, 1033, 1071, 1109, 1147, 1146, 1108, 1070, 1032, 994, 996, 1034, 1072, 1110, 1148, 997, 1035,
        1073, 1111, 1149, 998, 1036, 1074, 1112, 1150, 1151, 1113, 1075, 1037, 999, 1076, 1114, 1152, 1153, 1115, 961, 960, 959, 958, 957, 956, 955, 954, 953,
        952, 914, 915, 916, 917, 918, 919, 920, 921, 922, 884, 883, 882, 881, 880, 879, 878, 877, 876, 845, 844, 843, 842, 841, 840, 839, 838, 807, 806, 805,
        804, 801, 800, 802, 803, 769, 768, 767, 765, 764, 762, 766, 763, 731, 730, 729, 728, 727, 725, 724, 726, 693, 692, 691, 690, 689, 688, 687, 686, 652,
        651, 650, 649, 648, 610, 611, 612, 613, 575, 574, 573, 572, 536, 535, 534, 496, 497, 459, 458, 420, 382, 192, 1, 54, 116, 78, 117, 79, 80, 155, 109,
        110, 111, 148, 186, 225, 187, 149, 415, 453, 491, 529, 567, 605, 643, 681, 719, 757, 795, 833, 871, 909, 947, 985, 1023, 1061, 1099, 1137, 1213, 1175,
        1201, 1126, 1164, 1202, 1089, 1127, 1165, 1203, 976, 1014, 1052, 1090, 1128, 1166, 1204, 901, 939, 977, 1015, 1053, 1091, 1129, 1167, 1205, 864, 902,
        940, 978, 1016, 1054, 1092, 1130, 1168, 1206, 750, 788, 826, 751, 752, 753, 754, 755, 756, 715, 716, 717, 718, 789, 827, 865, 903, 941, 979, 1017, 1055,
        1093, 1131, 1169, 1207, 790, 828, 866, 942, 980, 1018, 1056, 1095, 1133, 1171, 1209, 1208, 1170, 1132, 1094, 904, 791, 792, 793, 794, 830, 829, 831,
        869, 907, 906, 944, 982, 1020, 1058, 1096, 1134, 1172, 1057, 1019, 981, 943, 905, 867, 983, 945, 1, 17, 1135, 1173, 1210, 1097, 1211, 1174, 1136, 1098,
        1060, 1022, 984, 946, 908, 870, 832, 1212, 1059, 868, 678, 679, 680, 677, 640, 641, 642, 603, 604, 565, 566, 528, 132, 94, 95, 133, 93, 96,
    ],
}

const trainingMechs = (): WarMachineState[] => {
    return [
        {
            id: "088132f5-ee2f-47f7-bd18-9b7dfb466ff5",
            hash: "JkRNuNlljO",
            ownedByID: "sds",
            ownerUsername: "",
            modelID: "",
            name: "Thumbgeode Killer",
            participantID: 1,
            factionID: "880db344-e405-428d-84e5-6ebebab1fe6d",
            maxHealth: 3600,
            maxShield: 3000,
            health: 1200,
            model: "XFVS",
            skin: "BlueWhite",
            speed: 2750,
            tier: "MEGA",
            weaponNames: [],
            image: "https://afiles.ninja-cdn.com/passport/genesis/img/boston_cybernetics_xfvs_blue_white.png",
            imageAvatar: "https://afiles.ninja-cdn.com/passport/genesis/avatar/boston-cybernetics_law-enforcer-x-1000_dune_avatar.png",
            position: {
                x: 15000,
                y: 18000,
            },
            rotation: 240,
            isHidden: false,
            shield: 200,
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
            id: "088132f5-ee2f-47f7-bd18-9b7dfb466ff5",
            hash: "JkRNuNlljO",
            ownedByID: "sds",
            name: "Thumbgeode Killer",
            participantID: 2,
            factionID: "880db344-e405-428d-84e5-6ebebab1fe6d",
            maxHealth: 3600,
            maxShield: 3000,
            health: 1200,
            model: "XFVS",
            skin: "BlueWhite",
            speed: 2750,
            tier: "MEGA",
            weaponNames: [],
            image: "https://afiles.ninja-cdn.com/passport/genesis/img/boston_cybernetics_xfvs_blue_white.png",
            imageAvatar: "https://afiles.ninja-cdn.com/passport/genesis/avatar/boston-cybernetics_law-enforcer-x-1000_dune_avatar.png",
            position: {
                x: 3525.499377120999,
                y: 6691.322613561308,
            },
            rotation: 40,
            isHidden: false,
            shield: 200,
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
            id: "c638ee34-81ef-410a-8f5d-e10e4a973966",
            hash: "88seem8xNW",
            ownedByID: "305da475-53dc-4973-8d78-a30d390d3de5",
            name: "Bootriver Stallion",
            participantID: 3,
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
                x: 11500,
                y: 11000,
            },
            rotation: 70,
            isHidden: false,
            shield: 300,
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
