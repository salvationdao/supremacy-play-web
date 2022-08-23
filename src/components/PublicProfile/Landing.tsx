import { Box, Typography } from "@mui/material"

import RmBorder from "../../assets/landing/RmBorder.svg"
import RmBottom from "../../assets/landing/RmBottom.svg"
import RmBorderBottom from "../../assets/landing/RmBorderBottom.svg"
import RmBack from "../../assets/landing/RmBack.png"

export const Landing = () => {
    return (
        <Box sx={{ height: "100%", width: "100%" }}>
            <Box sx={{ display: "flex", width: "100%", height: "100%", justifyContent: "center" }}>
                <Box
                    sx={{
                        position: "relative",
                        display: "flex",
                        width: "90%",
                        height: "80%",
                        alignItems: "center",
                        flexDirection: "column",
                        border: "2px solid orange",
                    }}
                >
                    {/* left */}
                    <Box sx={{ top: "15rem", position: "absolute", left: 0 }}>
                        <BoxThing />
                    </Box>

                    {/* right */}
                    <Box sx={{ top: "15rem", position: "absolute", right: 0 }}>
                        <BoxThing />
                    </Box>

                    {/* center */}
                    <Box>
                        <BoxThing />
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

const BoxThing = () => {
    return (
        <Box position="relative" width="50rem" height="45rem" margin="1rem">
            <Box sx={{ position: "absolute", top: "35%", left: 0, margin: "1rem" }}>
                <Card />
            </Box>

            <Box sx={{ position: "absolute", top: "35%", right: 0, margin: "1rem" }}>
                <Card />
            </Box>

            <Box sx={{ position: "absolute", top: 0, left: "34%", margin: "1rem" }}>
                <Card />
            </Box>

            <Box sx={{ position: "absolute", bottom: 0, left: "34%", margin: "1rem" }}>
                <Card />
            </Box>
        </Box>
    )
}

const Card = () => {
    const h = "18rem"
    const w = "14rem"
    return (
        <Box position="relative" height={h} width={w}>
            <img style={{ position: "absolute", top: "-6px", zIndex: 4 }} width={"100%"} src={RmBorder} alt="" />
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

            <img style={{ bottom: 0, zIndex: 3, left: "1.3px", position: "absolute" }} width={"97%"} src={RmBorderBottom} alt="" />
            <img style={{ bottom: 0, zIndex: 2, left: "1.3px", position: "absolute" }} width={"97%"} src={RmBottom} alt="" />
            <Typography sx={{ position: "absolute", bottom: ".7rem", zIndex: 3, left: "19%" }} variant="caption">
                Mech name here
            </Typography>
        </Box>
    )
}
