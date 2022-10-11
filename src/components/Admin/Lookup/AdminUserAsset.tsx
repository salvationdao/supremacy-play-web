import { Box, Stack, Typography } from "@mui/material"
import { Faction } from "../../../types"
import { AdminGetUserAsset } from "../../../types/admin"
import { MechCommonArea } from "../../Hangar/WarMachinesHangar/WarMachineHangarItem"

export const AdminUserAsset = ({ userAsset, faction }: { userAsset: AdminGetUserAsset; faction: Faction }) => {
    return (
        <Box>
            <Box sx={{ p: "2rem" }}>
                <Stack>
                    <Typography variant={"h5"}>Owned Mechs</Typography>
                    {userAsset.mechs ? (
                        <Box
                            sx={{
                                width: "100%",
                                display: "grid",
                                gridTemplateColumns: "repeat(4, minmax(26rem, 1fr))",
                                gap: "2rem",
                                alignItems: "start",
                                justifyContent: "start",
                                overflow: "visible",
                            }}
                        >
                            {userAsset.mechs.map((mechDetails) => {
                                return (
                                    <MechCommonArea
                                        key={mechDetails.id}
                                        isGridView={true}
                                        mech={mechDetails}
                                        mechDetails={mechDetails}
                                        primaryColor={faction.primary_color}
                                        secondaryColor={faction.secondary_color}
                                        hideRepairBlocks
                                    />
                                )
                            })}
                        </Box>
                    ) : (
                        <Typography>User Has No Mechs</Typography>
                    )}
                </Stack>
            </Box>
        </Box>
    )
}
