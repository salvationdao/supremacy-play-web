import { Stack, Typography } from "@mui/material"
import { useState } from "react"
import { colors, fonts } from "../../../../theme/theme"
import { RepairStatus } from "../../../../types/jobs"
import { NiceBoxThing } from "../../Nice/NiceBoxThing"
import { NiceButton } from "../../Nice/NiceButton"
import { DoRepairModal } from "../RepairJobs/DoRepairModal"

export const SelfRepairCard = ({
    defaultOpenSelfRepair,
    repairStatus,
    remainDamagedBlocks,
}: {
    defaultOpenSelfRepair?: boolean
    repairStatus?: RepairStatus
    remainDamagedBlocks: number
}) => {
    const [doRepairModalOpen, setDoRepairModalOpen] = useState(defaultOpenSelfRepair)

    return (
        <>
            <NiceBoxThing border={{ color: `${colors.orange}50`, thickness: "very-lean" }} background={{ colors: ["#FFFFFF"], opacity: 0.06 }}>
                <Stack spacing="1rem" sx={{ p: "2rem", pt: "1.6rem" }}>
                    <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack, color: colors.orange }}>
                        SELF REPAIR
                    </Typography>

                    <Typography variant="h6">Get your hands dirty and do the repair work yourself.</Typography>

                    <NiceButton corners disabled={remainDamagedBlocks <= 0} buttonColor={colors.orange} onClick={() => setDoRepairModalOpen(true)}>
                        REPAIR
                    </NiceButton>
                </Stack>
            </NiceBoxThing>

            {doRepairModalOpen && <DoRepairModal repairStatus={repairStatus} onClose={() => setDoRepairModalOpen(false)} />}
        </>
    )
}
