import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import { Box, Button, Fade, Stack, Typography } from "@mui/material"
import { Mask } from "@reactour/mask"
import { Popover } from "@reactour/popover"
import { useRect } from "@reactour/utils"
import { useEffect, useRef, useState } from "react"
import { TRAINING_ASSETS } from "../../constants"
import { useAuth, useTraining } from "../../containers"
import { zoomEffect } from "../../theme/keyframes"
import { fonts } from "../../theme/theme"
import { BribeStage, Map } from "../../types"
import { PlayerAbilityStages } from "../../types/training"
import { TOP_BAR_HEIGHT } from "../BigDisplay/MiniMap/MiniMap"
import { tourStyles } from "../HowToPlay/Tutorial/SetupTutorial"
import { Congratulations } from "./Congratulations"
import { TrainingBribeStageResponse } from "./TrainingBattleAbility"

export const VIDEO_SOURCE_PA = {
    intro: TRAINING_ASSETS + "/player_ability/1.mp4",
    interim: TRAINING_ASSETS + "/player_ability/2.mp4",
    emp: TRAINING_ASSETS + "/player_ability/3.mp4",
}

export const VIDEO_SOURCE_PA_LIST = Object.values(VIDEO_SOURCE_PA)

export const TrainingPlayerAbility = () => {
    const { userID } = useAuth()
    const {
        tutorialRef,
        setTrainingStage,
        trainingStage,
        setMap,
        setWarMachines,
        toggleIsMapOpen,
        setBribeStage,
        setWinner,
        setIsTargeting,
        isStreamBigDisplay,
        smallDisplayRef,
        bigDisplayRef,
        setUpdater,
        updater,
    } = useTraining()
    const [videoSource, setVideoSource] = useState(VIDEO_SOURCE_PA.intro)
    const [stage, setStage] = useState<Context | null>(null)
    const [popoverOpen, setPopoverOpen] = useState(true)
    const [end, setEnd] = useState(false)
    const sizes = useRect(tutorialRef, updater)
    const videoRef = useRef<HTMLVideoElement>(null)
    const ref = useRef<HTMLDivElement>(null)
    const [bribeStageTime, setBribeStageTime] = useState(45)

    useEffect(() => {
        switch (trainingStage) {
            case PlayerAbilityStages.LocationSelectPA: {
                const locationSelectStage = context.find((s) => s.state === trainingStage)
                if (!locationSelectStage) return
                setStage(locationSelectStage)
                setWinner(undefined)
                setBribeStage(undefined)
                setIsTargeting(true)
                toggleIsMapOpen(true)
                break
            }
            case PlayerAbilityStages.ShowPurchasePA: {
                const purchaseStage = context.find((s) => s.state === trainingStage)
                if (!purchaseStage) return
                setStage(purchaseStage)
                break
            }
            case PlayerAbilityStages.ShowAbilityPA: {
                setWinner(undefined)
                setBribeStage(undefined)
                setIsTargeting(false)
                toggleIsMapOpen(false)
                setPopoverOpen(false)
                videoRef.current?.play()
                break
            }
            default:
                break
        }
    }, [trainingStage, setStage, toggleIsMapOpen, setWinner, setBribeStage, setIsTargeting])

    useEffect(() => {
        window.addEventListener("scroll", () => {
            setUpdater([tutorialRef])
        })
        return () => {
            window.removeEventListener("scroll", () => {
                setUpdater([tutorialRef])
            })
        }
    }, [setUpdater, tutorialRef])

    // Initialise
    useEffect(() => {
        setMap(trainingMap)
        setWarMachines(trainingMechs(userID))
    }, [setMap, setWarMachines, userID])

    useEffect(() => {
        const thisElement = ref.current
        const newContainerElement = isStreamBigDisplay ? bigDisplayRef : smallDisplayRef

        if (thisElement && newContainerElement) {
            newContainerElement.appendChild(thisElement)
        }
    }, [isStreamBigDisplay, smallDisplayRef, bigDisplayRef])
    return (
        <Box ref={ref} sx={{ background: "#000", width: "100%", height: "100%" }}>
            {/* Top bar */}
            <Stack
                spacing="1rem"
                direction="row"
                alignItems="center"
                sx={{
                    p: ".6rem 1.6rem",
                    height: `${TOP_BAR_HEIGHT}rem`,
                    background: (theme) => `linear-gradient(${theme.factionTheme.background} 26%, ${theme.factionTheme.background}BB)`,
                }}
            >
                <Typography sx={{ fontFamily: fonts.nostromoHeavy }}>BATTLE TRAINING</Typography>
            </Stack>
            <video
                key={videoSource}
                ref={videoRef}
                onPlay={() => {
                    if (videoSource !== VIDEO_SOURCE_PA.intro && popoverOpen) {
                        videoRef.current?.pause()
                    }
                }}
                onTimeUpdate={(e) => {
                    const { currentTime } = e.currentTarget
                    // BattleAbility
                    const trainingBribeStage: TrainingBribeStageResponse = {
                        phase: BribeStage.Cooldown,
                        time: Math.floor(bribeStageTime - currentTime),
                    }
                    setBribeStage(trainingBribeStage)
                }}
                onEnded={(e) => {
                    const { duration } = e.currentTarget
                    const finalVideo = VIDEO_SOURCE_PA_LIST[VIDEO_SOURCE_PA_LIST.length - 1]
                    if (videoSource === finalVideo) {
                        setStage(null)
                        setEnd(true)
                        return
                    }
                    // Next video
                    const index = VIDEO_SOURCE_PA_LIST.findIndex((v) => v === videoSource)
                    const nextVideo = VIDEO_SOURCE_PA_LIST[index + 1]

                    // Set bribe stage time based on current duration time
                    setBribeStageTime((prev) => Math.floor(prev - duration))

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
            {end && <Congratulations ability="player" />}
            {stage && (
                <Fade in={popoverOpen}>
                    <Box>
                        <Popover sizes={sizes} styles={{ popover: tourStyles?.popover }} position="right">
                            <p>{stage.text}</p>
                            {stage.showNext && (
                                <Button
                                    onClick={() => {
                                        const i = context.findIndex((s) => s === stage)
                                        const nextStage = context[i + 1]
                                        if (nextStage.videoSource !== videoSource) {
                                            videoRef.current?.play()
                                            setPopoverOpen(false)
                                        } else {
                                            setStage(context[i + 1])
                                            setTrainingStage(context[i + 1].state)
                                        }
                                    }}
                                    sx={{
                                        fontFamily: fonts.nostromoBlack,
                                        mt: "1rem",
                                        ml: "auto",
                                        display: "flex",
                                        gap: ".5rem",
                                        animation: `${zoomEffect(1.35)} 2s infinite`,
                                    }}
                                >
                                    Next <ArrowForwardIcon />
                                </Button>
                            )}
                        </Popover>
                        <Mask sizes={sizes} styles={{ maskWrapper: tourStyles?.maskWrapper }} />
                    </Box>
                </Fade>
            )}
        </Box>
    )
}
interface Context {
    videoSource: string
    text: string
    showNext: boolean
    state: PlayerAbilityStages
}

const context: Context[] = [
    {
        text: "This is where you will find your player abilities, they are purchasable from the store window or in your storefront.",
        showNext: true,
        state: PlayerAbilityStages.ExplainPA,
        videoSource: VIDEO_SOURCE_PA.interim,
    },
    {
        text: "Player abilities store refreshes every sale period. You can also claim a free player ability once every sale period.",
        showNext: true,
        state: PlayerAbilityStages.SalePeriodPA,
        videoSource: VIDEO_SOURCE_PA.interim,
    },
    {
        text: "Claim EMP and learn how to deploy a player ability.",
        showNext: false,
        state: PlayerAbilityStages.ClaimPA,
        videoSource: VIDEO_SOURCE_PA.interim,
    },
    {
        text: "You can also purchase one more player ability during the sale period.",
        showNext: true,
        state: PlayerAbilityStages.ShowPurchasePA,
        videoSource: VIDEO_SOURCE_PA.interim,
    },
    {
        text: "Use EMP to stun the enemy mechs.",
        showNext: false,
        state: PlayerAbilityStages.UseAbilityPA,
        videoSource: VIDEO_SOURCE_PA.emp,
    },
    {
        text: "You are able to deploy a Player Ability by selecting a location in the minimap.",
        showNext: true,
        state: PlayerAbilityStages.LocationSelectPA,
        videoSource: VIDEO_SOURCE_PA.emp,
    },
    {
        text: "This shows which ability is being deployed.",
        showNext: true,
        state: PlayerAbilityStages.LocationExplainPA,
        videoSource: VIDEO_SOURCE_PA.emp,
    },
    {
        text: "Select the guided area to deploy EMP.",
        showNext: false,
        state: PlayerAbilityStages.LocationActionPA,
        videoSource: VIDEO_SOURCE_PA.emp,
    },
]

const trainingMap: Map = {
    Name: "RedMountainMine",
    Image_Url: "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/RedMountainMine.jpg",
    Width: 1884,
    Height: 1884,
    Cells_X: 90,
    Cells_Y: 90,
    Pixel_Top: -22592,
    Pixel_Left: -73423,
    Disabled_Cells: [
        0, 801, 891, 981, 1071, 1161, 1251, 1341, 1431, 1521, 1611, 1701, 1791, 1881, 1971, 2061, 2151, 2241, 2331, 2421, 2511, 2601, 2691, 2781, 2871, 2961,
        3051, 3141, 3231, 3321, 3411, 3501, 3591, 3681, 3771, 3861, 3951, 4041, 4131, 4221, 4311, 4401, 4491, 4581, 4671, 4761, 4851, 4941, 5031, 5121, 5211,
        5301, 5391, 5481, 5571, 5661, 5751, 5841, 5931, 6021, 6111, 6201, 6291, 6381, 6471, 6561, 6651, 6741, 6831, 6921, 7011, 7101, 7191, 7281, 802, 892, 982,
        1072, 1162, 1252, 1342, 1432, 1522, 1612, 1702, 1792, 1882, 1972, 2062, 2152, 2242, 2332, 2422, 2512, 2602, 2692, 2782, 2872, 2962, 3052, 3142, 3232,
        3322, 3412, 3502, 3592, 3682, 3772, 3862, 3952, 4042, 4132, 4222, 4312, 4402, 4492, 4582, 4672, 4762, 4852, 4942, 5032, 5122, 5212, 5302, 5392, 5482,
        5572, 5662, 5752, 5842, 5932, 6022, 6112, 6202, 6292, 6382, 6472, 6562, 6652, 6742, 6832, 6922, 7012, 7102, 7192, 7282, 803, 893, 983, 1073, 1163, 1253,
        1343, 1433, 1523, 1613, 1703, 1793, 1883, 1973, 2063, 2153, 2243, 2333, 2423, 2513, 2603, 2693, 2783, 2873, 2963, 3053, 3143, 3233, 3323, 3413, 3503,
        3593, 3683, 3773, 3863, 3953, 4043, 4133, 4223, 4313, 4403, 4493, 4583, 4673, 4763, 4853, 4943, 5033, 5123, 5213, 5303, 5393, 5483, 5573, 5663, 5753,
        5843, 5933, 6023, 6113, 6203, 6293, 6383, 6473, 6563, 6653, 6743, 6833, 6923, 7013, 7103, 7193, 7283, 804, 894, 984, 1074, 1164, 1254, 1344, 1434, 1524,
        1614, 1704, 1794, 1884, 1974, 2064, 2154, 2244, 2334, 2424, 2514, 2604, 2694, 2784, 2874, 2964, 3054, 3144, 3234, 3324, 3414, 3504, 3594, 3684, 3774,
        3864, 3954, 4044, 4134, 4224, 4314, 4404, 4494, 4584, 4674, 4764, 4854, 4944, 5034, 5124, 5214, 5304, 5394, 5484, 5574, 5664, 5754, 5844, 5934, 6024,
        6114, 6204, 6294, 6384, 6474, 6564, 6654, 6744, 6834, 6924, 7014, 7104, 7194, 7284, 805, 895, 985, 1075, 1165, 1255, 1345, 1435, 1525, 1615, 1705, 1795,
        1885, 1975, 2065, 2155, 2245, 2335, 2425, 2515, 2605, 2695, 2785, 2875, 2965, 3055, 3145, 3235, 3325, 3415, 3505, 3595, 3685, 3775, 3865, 3955, 4045,
        4135, 4225, 4315, 4405, 4495, 4585, 4675, 4765, 4855, 4945, 5035, 5125, 5215, 5305, 5395, 5485, 5575, 5665, 5755, 5845, 5935, 6025, 6115, 6205, 6295,
        6385, 6475, 6565, 6655, 6745, 6835, 6925, 7015, 7105, 7195, 7285, 806, 896, 986, 1076, 1166, 1256, 1346, 1436, 1526, 1616, 1706, 1796, 1886, 1976, 2066,
        2156, 2246, 2336, 2426, 2516, 2606, 2696, 2786, 2876, 2966, 3056, 3146, 3236, 3326, 3416, 3506, 3596, 3686, 3776, 3866, 3956, 4046, 4136, 4226, 4316,
        4406, 4496, 4586, 4676, 4766, 4856, 4946, 5036, 5126, 5216, 5306, 5396, 5486, 5576, 5666, 5756, 5846, 5936, 6026, 6116, 6206, 6296, 6386, 6476, 6566,
        6656, 6746, 6836, 6926, 7016, 7106, 7196, 7286, 807, 897, 987, 1077, 1167, 1257, 1347, 1437, 1527, 1617, 1707, 1797, 1887, 1977, 2067, 2157, 2247, 2337,
        2427, 2517, 2607, 2697, 2787, 2877, 2967, 3057, 3147, 3237, 3327, 3417, 3507, 3597, 3687, 3777, 3867, 3957, 4047, 4137, 4227, 4317, 4407, 4497, 4587,
        4677, 4767, 4857, 4947, 5037, 5127, 5217, 5307, 5397, 5487, 5577, 5667, 5757, 5847, 5937, 6027, 6117, 6207, 6297, 6387, 6477, 6567, 6657, 6747, 6837,
        6927, 7017, 7107, 7197, 7287, 808, 898, 988, 1078, 1168, 1258, 1348, 1438, 1528, 1618, 1708, 1798, 1888, 1978, 2068, 2158, 2248, 2338, 2428, 2518, 2608,
        2698, 2788, 2878, 2968, 3058, 3148, 3238, 3328, 3418, 3508, 3598, 3688, 3778, 3868, 3958, 4048, 4138, 4228, 4318, 4408, 4498, 4588, 4678, 4768, 4858,
        4948, 5038, 5128, 5218, 5308, 5398, 5488, 5578, 5668, 5758, 5848, 5938, 6028, 6118, 6208, 6298, 6388, 6478, 6568, 6658, 6748, 6838, 6928, 7018, 7108,
        7198, 7288, 809, 899, 989, 1079, 1169, 1259, 1349, 1439, 1529, 1619, 1709, 1799, 1889, 1979, 2069, 2159, 2249, 2339, 2429, 2519, 2609, 2699, 2789, 2879,
        2969, 3059, 3149, 3239, 3329, 3419, 3509, 3599, 3689, 3779, 3869, 3959, 4049, 4139, 4229, 4319, 4409, 4499, 4589, 4679, 4769, 4859, 4949, 5039, 5129,
        5219, 5309, 5399, 5489, 5579, 5669, 5759, 5849, 5939, 6029, 6119, 6209, 6299, 6389, 6479, 6569, 6659, 6749, 6839, 6929, 7019, 7109, 7199, 7289, 810,
        900, 990, 1080, 1170, 1260, 1350, 1440, 1530, 1620, 1710, 1800, 1890, 1980, 2070, 2160, 2250, 2340, 2430, 2520, 2610, 2700, 2790, 2880, 2970, 3060,
        3150, 3240, 3330, 3420, 3510, 3600, 3690, 3780, 3870, 3960, 4050, 4140, 4230, 4320, 4410, 4500, 4590, 4680, 4770, 4860, 4950, 5040, 5130, 5220, 5310,
        5400, 5490, 5580, 5670, 5760, 5850, 5940, 6030, 6120, 6210, 6300, 6390, 6480, 6570, 6660, 6750, 6840, 6930, 7020, 7110, 7200, 7290, 811, 901, 991, 1081,
        1171, 1261, 1351, 1441, 1531, 1621, 1711, 1801, 1891, 1981, 2071, 2161, 2251, 2341, 2431, 2521, 2611, 2701, 2791, 2881, 2971, 3061, 3151, 3241, 3331,
        3421, 3511, 3601, 3691, 3781, 3871, 3961, 4051, 4141, 4231, 4321, 4411, 4501, 4591, 4681, 4771, 4861, 4951, 5041, 5131, 5221, 5311, 5401, 5491, 5581,
        5671, 5761, 5851, 5941, 6031, 6121, 6211, 6301, 6391, 6481, 6571, 6661, 6751, 6841, 6931, 7021, 7111, 7201, 7291, 812, 902, 992, 1082, 1172, 1262, 1352,
        1442, 1532, 1622, 1712, 1802, 1892, 1982, 2072, 2162, 2252, 2342, 2432, 2522, 2612, 2702, 2792, 2882, 2972, 3062, 3152, 3242, 3332, 3422, 3512, 3602,
        3692, 3782, 3872, 3962, 4052, 4142, 4232, 4322, 4412, 4502, 4592, 4682, 4772, 4862, 4952, 5042, 5132, 5222, 5312, 5402, 5492, 5582, 5672, 5762, 5852,
        5942, 6032, 6122, 6212, 6302, 6392, 6482, 6572, 6662, 6752, 6842, 6932, 7022, 7112, 7202, 7292, 813, 903, 993, 1083, 1173, 1263, 1353, 1443, 1533, 1623,
        1713, 1803, 1893, 1983, 2073, 2163, 2253, 2343, 2433, 2523, 2613, 2703, 2793, 2883, 2973, 3063, 3153, 3243, 3333, 3423, 3513, 3603, 3693, 3783, 3873,
        3963, 4053, 4143, 4233, 4323, 4413, 4503, 4593, 4683, 4773, 4863, 4953, 5043, 5133, 5223, 5313, 5403, 5493, 5583, 5673, 5763, 5853, 5943, 6033, 6123,
        6213, 6303, 6393, 6483, 6573, 6663, 6753, 6843, 6933, 7023, 7113, 7203, 7293, 814, 904, 994, 1084, 1174, 1264, 1354, 1444, 1534, 1624, 1714, 1804, 1894,
        1984, 2074, 2164, 2254, 2344, 2434, 2524, 2614, 2704, 2794, 2884, 2974, 3064, 3154, 3244, 3334, 3424, 3514, 3604, 3694, 3784, 3874, 3964, 4054, 4144,
        4234, 4324, 4414, 4504, 4594, 4684, 4774, 4864, 4954, 5044, 5134, 5224, 5314, 5404, 5494, 5584, 5674, 5764, 5854, 5944, 6034, 6124, 6214, 6304, 6394,
        6484, 6574, 6664, 6754, 6844, 6934, 7024, 7114, 7204, 7294, 815, 905, 995, 1085, 1175, 1265, 1355, 1445, 1535, 1625, 1715, 1805, 1895, 1985, 2075, 2165,
        2255, 2345, 2435, 2525, 2615, 2705, 2795, 2885, 2975, 3065, 3155, 3245, 3335, 3425, 3515, 3605, 3695, 3785, 3875, 3965, 4055, 4145, 4235, 4325, 4415,
        4505, 4595, 4685, 4775, 4865, 4955, 5045, 5135, 5225, 5315, 5405, 5495, 5585, 5675, 5765, 5855, 5945, 6035, 6125, 6215, 6305, 6395, 6485, 6575, 6665,
        6755, 6845, 6935, 7025, 7115, 7205, 7295, 816, 906, 996, 1086, 1176, 1266, 1356, 1446, 1536, 1626, 1716, 1806, 1896, 1986, 2076, 2166, 2256, 2346, 2436,
        2526, 2616, 2706, 2796, 2886, 2976, 3066, 3156, 3246, 3336, 3426, 3516, 3606, 3696, 3786, 3876, 3966, 4056, 4146, 4236, 4326, 4416, 4506, 4596, 4686,
        4776, 4866, 4956, 5046, 5136, 5226, 5316, 5406, 5496, 5586, 5676, 5766, 5856, 5946, 6036, 6126, 6216, 6306, 6396, 6486, 6576, 6666, 6756, 6846, 6936,
        7026, 7116, 7206, 7296, 817, 907, 997, 1087, 1177, 1267, 1357, 1447, 1537, 1627, 1717, 1807, 1897, 1987, 2077, 2167, 2257, 2347, 2437, 2527, 2617, 2707,
        2797, 2887, 2977, 3067, 3157, 3247, 3337, 3427, 3517, 3607, 3697, 3787, 3877, 3967, 4057, 4147, 4237, 4327, 4417, 4507, 4597, 4687, 4777, 4867, 4957,
        5047, 5137, 5227, 5317, 5407, 5497, 5587, 5677, 5767, 5857, 5947, 6037, 6127, 6217, 6307, 6397, 6487, 6577, 6667, 6757, 6847, 6937, 7027, 7117, 7207,
        7297, 818, 908, 998, 1088, 1178, 1268, 1358, 1448, 1538, 1628, 1718, 1808, 1898, 1988, 2078, 2168, 2258, 2348, 2438, 2528, 2618, 2708, 2798, 2888, 2978,
        3068, 3158, 3248, 3338, 3428, 3518, 3608, 3698, 3788, 3878, 3968, 4058, 4148, 4238, 4328, 4418, 4508, 4598, 4688, 4778, 4868, 4958, 5048, 5138, 5228,
        5318, 5408, 5498, 5588, 5678, 5768, 5858, 5948, 6038, 6128, 6218, 6308, 6398, 6488, 6578, 6668, 6758, 6848, 6938, 7028, 7118, 7208, 7298, 1, 2, 3, 4, 5,
        6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44,
        45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82,
        83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116,
        117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146,
        147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176,
        177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206,
        207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240,
        241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270,
        271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300,
        301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330,
        331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360,
        361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390,
        391, 392, 393, 394, 395, 396, 397, 398, 399, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420,
        421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 446, 447, 448, 449, 450,
        451, 452, 453, 454, 455, 456, 457, 458, 459, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480,
        481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510,
        511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540,
        541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565, 566, 567, 568, 569, 570,
        571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600,
        601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630,
        631, 632, 633, 634, 635, 636, 637, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 651, 652, 653, 654, 655, 656, 657, 658, 659, 660,
        661, 662, 663, 664, 665, 666, 667, 668, 669, 670, 671, 672, 673, 674, 675, 676, 677, 678, 679, 680, 681, 682, 683, 684, 685, 686, 687, 688, 689, 690,
        691, 692, 693, 694, 695, 696, 697, 698, 699, 700, 701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712, 713, 714, 715, 716, 717, 718, 719, 720,
        721, 722, 723, 724, 725, 726, 727, 728, 729, 730, 731, 732, 733, 734, 735, 736, 737, 738, 739, 740, 741, 742, 743, 744, 745, 746, 747, 748, 749, 750,
        751, 752, 753, 754, 755, 756, 757, 758, 759, 760, 761, 762, 763, 764, 765, 766, 767, 768, 769, 770, 771, 772, 773, 774, 775, 776, 777, 778, 779, 780,
        781, 782, 783, 784, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 7299, 7300, 7301, 7302, 7303, 7304, 7305, 7306,
        7307, 7308, 7309, 7310, 7311, 7312, 7313, 7314, 7315, 7316, 7317, 7318, 7319, 7320, 7321, 7322, 7323, 7324, 7325, 7326, 7327, 7328, 7329, 7330, 7331,
        7332, 7333, 7334, 7335, 7336, 7337, 7338, 7339, 7340, 7341, 7342, 7343, 7344, 7345, 7346, 7347, 7348, 7349, 7350, 7351, 7352, 7353, 7354, 7355, 7356,
        7357, 7358, 7359, 7360, 7361, 7362, 7363, 7364, 7365, 7366, 7367, 7368, 7369, 7370, 7371, 7372, 7373, 7374, 7375, 7376, 7377, 7378, 7379, 7380, 7381,
        7382, 7383, 7384, 7385, 7386, 7387, 7388, 7389, 7390, 7391, 7392, 7393, 7394, 7395, 7396, 7397, 7398, 7399, 7400, 7401, 7402, 7403, 7404, 7405, 7406,
        7407, 7408, 7409, 7410, 7411, 7412, 7413, 7414, 7415, 7416, 7417, 7418, 7419, 7420, 7421, 7422, 7423, 7424, 7425, 7426, 7427, 7428, 7429, 7430, 7431,
        7432, 7433, 7434, 7435, 7436, 7437, 7438, 7439, 7440, 7441, 7442, 7443, 7444, 7445, 7446, 7447, 7448, 7449, 7450, 7451, 7452, 7453, 7454, 7455, 7456,
        7457, 7458, 7459, 7460, 7461, 7462, 7463, 7464, 7465, 7466, 7467, 7468, 7469, 7470, 7471, 7472, 7473, 7474, 7475, 7476, 7477, 7478, 7479, 7480, 7481,
        7482, 7483, 7484, 7485, 7486, 7487, 7488, 7489, 7490, 7491, 7492, 7493, 7494, 7495, 7496, 7497, 7498, 7499, 7500, 7501, 7502, 7503, 7504, 7505, 7506,
        7507, 7508, 7509, 7510, 7511, 7512, 7513, 7514, 7515, 7516, 7517, 7518, 7519, 7520, 7521, 7522, 7523, 7524, 7525, 7526, 7527, 7528, 7529, 7530, 7531,
        7532, 7533, 7534, 7535, 7536, 7537, 7538, 7539, 7540, 7541, 7542, 7543, 7544, 7545, 7546, 7547, 7548, 7549, 7550, 7551, 7552, 7553, 7554, 7555, 7556,
        7557, 7558, 7559, 7560, 7561, 7562, 7563, 7564, 7565, 7566, 7567, 7568, 7569, 7570, 7571, 7572, 7573, 7574, 7575, 7576, 7577, 7578, 7579, 7580, 7581,
        7582, 7583, 7584, 7585, 7586, 7587, 7588, 7589, 7590, 7591, 7592, 7593, 7594, 7595, 7596, 7597, 7598, 7599, 7600, 7601, 7602, 7603, 7604, 7605, 7606,
        7607, 7608, 7609, 7610, 7611, 7612, 7613, 7614, 7615, 7616, 7617, 7618, 7619, 7620, 7621, 7622, 7623, 7624, 7625, 7626, 7627, 7628, 7629, 7630, 7631,
        7632, 7633, 7634, 7635, 7636, 7637, 7638, 7639, 7640, 7641, 7642, 7643, 7644, 7645, 7646, 7647, 7648, 7649, 7650, 7651, 7652, 7653, 7654, 7655, 7656,
        7657, 7658, 7659, 7660, 7661, 7662, 7663, 7664, 7665, 7666, 7667, 7668, 7669, 7670, 7671, 7672, 7673, 7674, 7675, 7676, 7677, 7678, 7679, 7680, 7681,
        7682, 7683, 7684, 7685, 7686, 7687, 7688, 7689, 7690, 7691, 7692, 7693, 7694, 7695, 7696, 7697, 7698, 7699, 7700, 7701, 7702, 7703, 7704, 7705, 7706,
        7707, 7708, 7709, 7710, 7711, 7712, 7713, 7714, 7715, 7716, 7717, 7718, 7719, 7720, 7721, 7722, 7723, 7724, 7725, 7726, 7727, 7728, 7729, 7730, 7731,
        7732, 7733, 7734, 7735, 7736, 7737, 7738, 7739, 7740, 7741, 7742, 7743, 7744, 7745, 7746, 7747, 7748, 7749, 7750, 7751, 7752, 7753, 7754, 7755, 7756,
        7757, 7758, 7759, 7760, 7761, 7762, 7763, 7764, 7765, 7766, 7767, 7768, 7769, 7770, 7771, 7772, 7773, 7774, 7775, 7776, 7777, 7778, 7779, 7780, 7781,
        7782, 7783, 7784, 7785, 7786, 7787, 7788, 7789, 7790, 7791, 7792, 7793, 7794, 7795, 7796, 7797, 7798, 7799, 7800, 7801, 7802, 7803, 7804, 7805, 7806,
        7807, 7808, 7809, 7810, 7811, 7812, 7813, 7814, 7815, 7816, 7817, 7818, 7819, 7820, 7821, 7822, 7823, 7824, 7825, 7826, 7827, 7828, 7829, 7830, 7831,
        7832, 7833, 7834, 7835, 7836, 7837, 7838, 7839, 7840, 7841, 7842, 7843, 7844, 7845, 7846, 7847, 7848, 7849, 7850, 7851, 7852, 7853, 7854, 7855, 7856,
        7857, 7858, 7859, 7860, 7861, 7862, 7863, 7864, 7865, 7866, 7867, 7868, 7869, 7870, 7871, 7872, 7873, 7874, 7875, 7876, 7877, 7878, 7879, 7880, 7881,
        7882, 7883, 7884, 7885, 7886, 7887, 7888, 7889, 7890, 7891, 7892, 7893, 7894, 7895, 7896, 7897, 7898, 7899, 7900, 7901, 7902, 7903, 7904, 7905, 7906,
        7907, 7908, 7909, 7910, 7911, 7912, 7913, 7914, 7915, 7916, 7917, 7918, 7919, 7920, 7921, 7922, 7923, 7924, 7925, 7926, 7927, 7928, 7929, 7930, 7931,
        7932, 7933, 7934, 7935, 7936, 7937, 7938, 7939, 7940, 7941, 7942, 7943, 7944, 7945, 7946, 7947, 7948, 7949, 7950, 7951, 7952, 7953, 7954, 7955, 7956,
        7957, 7958, 7959, 7960, 7961, 7962, 7963, 7964, 7965, 7966, 7967, 7968, 7969, 7970, 7971, 7972, 7973, 7974, 7975, 7976, 7977, 7978, 7979, 7980, 7981,
        7982, 7983, 7984, 7985, 7986, 7987, 7988, 7989, 7990, 7991, 7992, 7993, 7994, 7995, 7996, 7997, 7998, 7999, 8000, 8001, 8002, 8003, 8004, 8005, 8006,
        8007, 8008, 8009, 8010, 8011, 8012, 8013, 8014, 8015, 8016, 8017, 8018, 8019, 8020, 8021, 8022, 8023, 8024, 8025, 8026, 8027, 8028, 8029, 8030, 8031,
        8032, 8033, 8034, 8035, 8036, 8037, 8038, 8039, 8040, 8041, 8042, 8043, 8044, 8045, 8046, 8047, 8048, 8049, 8050, 8051, 8052, 8053, 8054, 8055, 8056,
        8057, 8058, 8059, 8060, 8061, 8062, 8063, 8064, 8065, 8066, 8067, 8068, 8069, 8070, 8071, 8072, 8073, 8074, 8075, 8076, 8077, 8078, 8079, 8080, 8081,
        8082, 8083, 8084, 8085, 8086, 8087, 8088, 8089, 8090, 8091, 8092, 8093, 8094, 8095, 8096, 8097, 8098, 8099,
    ],
}

enum MechIDs {
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

const trainingMechs = (userID: string) => {
    return [
        {
            ownerUsername: "",
            modelID: "",
            id: MechIDs.RM1,
            hash: "88seem8xNW",
            ownedByID: userID,
            name: "Red mountain 1",
            participantID: 1,
            factionID: "98bf7bb3-1a7c-4f21-8843-458d62884060",
            maxHealth: 4700,
            maxShield: 3000,
            health: 3000,
            model: "BXSD",
            skin: "Beetle",
            speed: 1750,
            tier: "MEGA",
            weaponNames: [],
            image: "https://afiles.ninja-cdn.com/passport/genesis/img/red_mountain_bxsd_pink.png",
            imageAvatar: "https://afiles.ninja-cdn.com/passport/genesis/avatar/red-mountain_olympus-mons-ly07_red-hex_avatar.png",
            position: {
                x: 25403.086956521714,
                y: 35497.82445034584,
            },
            rotation: 95,
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
            participantID: 2,
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
                x: 73760.3003952569,
                y: 103587.00429224306,
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
            participantID: 3,
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
                x: 57641.22924901184,
                y: 90247.08334362647,
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
            id: MechIDs.BC1,
            hash: "JkRNuNlljO",
            ownedByID: "305da475-53dc-4973-8d78-a30d390d3de5",
            name: "Boston Cybernetics 1",
            participantID: 4,
            factionID: "7c6dde21-b067-46cf-9e56-155c88a520e2",
            maxHealth: 3600,
            maxShield: 3000,
            health: 800,
            model: "XFVS",
            skin: "BlueWhite",
            speed: 2750,
            tier: "ELITE_LEGENDARY",
            weaponNames: [],
            image: "https://afiles.ninja-cdn.com/passport/genesis/img/boston-cybernetics_law-enforcer-x-1000_blue-white.png",
            imageAvatar: "https://afiles.ninja-cdn.com/passport/genesis/avatar/boston-cybernetics_law-enforcer-x-1000_blue-white_avatar.png",
            position: {
                x: 22623.936758893266,
                y: 49393.575438488144,
            },
            rotation: 290,
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
            id: MechIDs.BC2,
            hash: "JkRNuNlljO",
            ownedByID: "305da475-53dc-4973-8d78-a30d390d3de5",
            name: "Boston Cybernetics 2",
            participantID: 5,
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
                x: -6835.055335968384,
                y: 78018.82247406125,
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
            hash: "JkRNuNlljO",
            ownedByID: "305da475-53dc-4973-8d78-a30d390d3de5",
            name: "Boston Cybernetics 3",
            participantID: 6,
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
                x: -28512.42687747036,
                y: 75795.50231595848,
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
            participantID: 7,
            factionID: "880db344-e405-428d-84e5-6ebebab1fe6d",
            maxHealth: 3300,
            maxShield: 3000,
            health: 400,
            model: "BXSD",
            skin: "Beetle",
            speed: 1750,
            tier: "MEGA",
            weaponNames: [],
            image: "https://afiles.ninja-cdn.com/passport/genesis/img/zaibatsu_tenshi-mk1_black-digi.png",
            imageAvatar: "https://afiles.ninja-cdn.com/passport/genesis/avatar/zaibatsu_tenshi-mk1_black-digi_avatar.png",
            position: {
                x: 20956.446640316193,
                y: 55507.70587327074,
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
        {
            ownerUsername: "",
            modelID: "",
            id: MechIDs.ZB2,
            hash: "88seem8xNW",
            ownedByID: "305da475-53dc-4973-8d78-a30d390d3de5",
            name: "Zaibatsu 2",
            participantID: 8,
            factionID: "880db344-e405-428d-84e5-6ebebab1fe6d",
            maxHealth: 3300,
            maxShield: 3000,
            health: 0,
            model: "BXSD",
            skin: "Beetle",
            speed: 1750,
            tier: "MEGA",
            weaponNames: [],
            image: "https://afiles.ninja-cdn.com/passport/genesis/img/zaibatsu_tenshi-mk1_black-digi.png",
            imageAvatar: "https://afiles.ninja-cdn.com/passport/genesis/avatar/zaibatsu_tenshi-mk1_black-digi_avatar.png",
            position: {
                x: -35182.38735177866,
                y: 76351.33235548418,
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
            id: MechIDs.ZB3,
            hash: "88seem8xNW",
            ownedByID: "305da475-53dc-4973-8d78-a30d390d3de5",
            name: "Zaibatsu 3",
            participantID: 9,
            factionID: "880db344-e405-428d-84e5-6ebebab1fe6d",
            maxHealth: 3300,
            maxShield: 3000,
            health: 0,
            model: "BXSD",
            skin: "Beetle",
            speed: 1750,
            tier: "MEGA",
            weaponNames: [],
            image: "https://afiles.ninja-cdn.com/passport/genesis/img/zaibatsu_tenshi-mk1_black-digi.png",
            imageAvatar: "https://afiles.ninja-cdn.com/passport/genesis/avatar/zaibatsu_tenshi-mk1_black-digi_avatar.png",
            position: {
                x: -27400.766798418976,
                y: 103587.00429224306,
            },
            rotation: 40,
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
