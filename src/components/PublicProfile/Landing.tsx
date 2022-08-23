import { Box, Typography } from "@mui/material"

// rm
import RmBorder from "../../assets/landing/rm/RmBorder.svg"
import RmBottom from "../../assets/landing/rm/RmBottom.svg"
import RmBorderBottom from "../../assets/landing/rm/RmBorderBottom.svg"

// zhi
import ZhiBorder from "../../assets/landing/zhi/ZHIBorder.svg"
import ZhiBottom from "../../assets/landing/zhi/ZHIBottom.svg"
import ZhiBorderBottom from "../../assets/landing/zhi/ZHIBorderBottom.svg"

// bc
import BcBorder from "../../assets/landing/bc/BCBorder.svg"
import BcBottom from "../../assets/landing/bc/BCBottom.svg"
import BcBorderBottom from "../../assets/landing/bc/BCBorderBottom.svg"

export const Landing = () => {
    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",

                backgroundImage: `url(${"https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/factions/zai-wall.png"})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain",
            }}
        >
            <Box sx={{ display: "flex", width: "100%", height: "100%", justifyContent: "center" }}>
                <Box
                    sx={{
                        position: "relative",
                        display: "flex",
                        width: "90%",
                        height: "80%",
                        alignItems: "center",
                        flexDirection: "column",
                    }}
                >
                    {/* left */}
                    <Box sx={{ top: "15rem", position: "absolute", left: 0 }}>
                        <BoxThing faction="bc" />
                    </Box>

                    {/* right */}
                    <Box sx={{ top: "15rem", position: "absolute", right: 0 }}>
                        <BoxThing faction="zhi" />
                    </Box>

                    {/* center */}
                    <Box>
                        <BoxThing faction="rm" />
                    </Box>

                    <Box sx={{ position: "absolute", bottom: 0 }}>
                        <Typography variant="h4">Next Battle</Typography>
                        <Typography variant="h4">Battle name</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

const BoxThing = ({ faction }: { faction: string }) => {
    return (
        <Box position="relative" width="50rem" height="45rem" margin="1rem">
            <Box sx={{ position: "absolute", top: "35%", left: 0, margin: "1rem" }}>
                <Card faction={faction} />
            </Box>

            <Box sx={{ position: "absolute", top: "35%", right: 0, margin: "1rem" }}>
                <Card faction={faction} />
            </Box>

            <Box sx={{ position: "absolute", top: 0, left: "34%", margin: "1rem" }}>
                <Card faction={faction} />
            </Box>

            <Box sx={{ position: "absolute", bottom: 0, left: "34%", margin: "1rem" }}>
                <Card faction={faction} />
            </Box>
        </Box>
    )
}

const getCardInfo = (faction: string) => {
    if (faction === "bc") {
        return {
            border: BcBorder,
            borderBottom: BcBorderBottom,
            bottom: BcBottom,
        }
    }

    if (faction === "zhi") {
        return {
            border: ZhiBorder,
            borderBottom: ZhiBorderBottom,
            bottom: ZhiBottom,
        }
    }

    if (faction === "rm") {
        return {
            border: RmBorder,
            borderBottom: RmBorderBottom,
            bottom: RmBottom,
        }
    }

    return {
        border: RmBorder,
        borderBottom: RmBorderBottom,
        bottom: RmBottom,
    }
}
const Card = ({ faction }: { faction: string }) => {
    const border = getCardInfo(faction)?.border || ""
    const borderBottom = getCardInfo(faction)?.borderBottom || ""
    const bottom = getCardInfo(faction)?.bottom || ""

    const h = "18rem"
    const w = "14rem"
    return (
        <Box position="relative" height={h} width={w}>
            <img style={{ position: "absolute", top: "-6px", zIndex: 4 }} width={"100%"} src={border} alt="" />
            <div
                style={{
                    position: "absolute",
                    top: "-6px",
                    left: "5px",
                    backgroundImage: `url(${"https://afiles.ninja-cdn.com/passport/genesis/avatar/boston-cybernetics_law-enforcer-x-1000_crystal-blue_avatar.png"})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                    height: "80%",
                    width: "92%",
                    zIndex: 3,
                    clipPath: "polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)",
                }}
            />

            <img style={{ bottom: 0, zIndex: 3, left: "1.3px", position: "absolute" }} width={"97%"} src={borderBottom} alt="" />
            <img style={{ bottom: 0, zIndex: 2, left: "1.3px", position: "absolute" }} width={"97%"} src={bottom} alt="" />
            <Typography sx={{ position: "absolute", bottom: ".7rem", zIndex: 3, left: "19%" }} variant="caption">
                Mech name here
            </Typography>
        </Box>
    )
}
