import { Stack } from "@mui/material"

export const ProfileAvatar = () => {
    // if (loading) {
    //     return (
    //         <Stack alignItems="center" justifyContent={"center"} sx={{ width: "100%", height: "100%" }}>
    //             <CircularProgress size="3rem" sx={{ color: primaryColor }} />
    //             <Typography sx={{ fontFamily: fonts.nostromoBlack, mr: "1rem", mt: "3rem" }}>Loading Profile</Typography>
    //         </Stack>
    //     )
    // }
    // if ((!loading && profileError) || !profile) {
    //     return (
    //         <Stack sx={{ flex: 1, px: "1rem" }}>
    //             <Typography sx={{ color: colors.red, textTransform: "uppercase" }}>{profileError}</Typography>
    //         </Stack>
    //     )
    // }

    // if (!hasFeature) {
    //     history.push("/404")
    //     return <></>
    // }

    // get list of avatars

    return (
        <Stack
            direction="column"
            sx={{
                height: "100%",
                "@media (max-width:1300px)": {
                    overflowY: "auto",
                },
            }}
        ></Stack>
    )
}
