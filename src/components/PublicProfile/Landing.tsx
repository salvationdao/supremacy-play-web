import { Box, Typography } from "@mui/material"

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
                    <Box sx={{ top: "10rem", position: "absolute", left: 0 }}>
                        <BoxThing />
                    </Box>

                    {/* right */}
                    <Box sx={{ top: "10rem", position: "absolute", right: 0 }}>
                        <BoxThing />
                    </Box>

                    {/* center */}
                    <Box>
                        <BoxThing />
                    </Box>

                    <Box sx={{ justifySelf: "flex-end" }}>
                        <Typography variant="h4">Next Battle</Typography>
                        <Typography variant="h4">Battle name</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

const BoxThing = () => {
    const h = "18rem"
    const w = "14rem"
    return (
        <Box position="relative" border="1px solid white" width="50rem" height="45rem" margin="1rem">
            <Box position="absolute" height={h} width={w} sx={{ top: "35%", left: 0, margin: "1rem", background: "blue" }}>
                <img
                    height={"80%"}
                    width={"100%"}
                    src="https://afiles.ninja-cdn.com/passport/genesis/avatar/boston-cybernetics_law-enforcer-x-1000_biohazard_avatar.png"
                    alt=""
                />
                <Typography variant="h4">left middle</Typography>
            </Box>
            <Box position="absolute" height={h} width={w} sx={{ top: "35%", right: 0, margin: "1rem", background: "blue" }}>
                <img
                    height={"80%"}
                    width={"100%"}
                    src="https://afiles.ninja-cdn.com/passport/genesis/avatar/boston-cybernetics_law-enforcer-x-1000_crystal-blue_avatar.png"
                    alt=""
                />
                <Typography variant="h4"> right middle</Typography>
            </Box>

            <Box position="absolute" height={h} width={w} sx={{ top: 0, left: "34%", margin: "1rem", background: "red" }}>
                <img
                    height={"80%"}
                    width={"100%"}
                    src="https://afiles.ninja-cdn.com/passport/genesis/avatar/red-mountain_olympus-mons-ly07_evo_avatar.png"
                    alt=""
                />
                <Typography variant="h4">top</Typography>
            </Box>

            <Box position="absolute" height={h} width={w} sx={{ bottom: 0, left: "34%", margin: "1rem", background: "red" }}>
                <img
                    height={"80%"}
                    width={"100%"}
                    src="https://afiles.ninja-cdn.com/passport/genesis/avatar/red-mountain_olympus-mons-ly07_red-blue_avatar.png"
                    alt=""
                />
                <Typography variant="h4">bottom</Typography>
            </Box>
        </Box>
    )
}
