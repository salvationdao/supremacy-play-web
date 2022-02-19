import { Box, Modal } from '@mui/material'
import { ClipThing } from '..'
import { colors } from '../../theme/theme'
import { WarMachineDestroyedRecord } from '../../types'

export const WarMachineDestroyedInfo = ({
    open,
    toggleOpen,
    warMachineDestroyedRecord,
}: {
    open: boolean
    toggleOpen: any
    warMachineDestroyedRecord: WarMachineDestroyedRecord
}) => {
    const { destroyedWarMachine, killedByWarMachine, killedBy, damageRecords } = warMachineDestroyedRecord

    return (
        <Modal open={open} onClose={() => toggleOpen(false)}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    border: 'none',
                    outline: 'none',
                    boxShadow: 24,
                    borderRadius: 0.5,
                }}
            >
                <ClipThing
                    border={{
                        isFancy: true,
                        borderThickness: '3px',
                        borderColor: destroyedWarMachine.faction.theme.primary,
                    }}
                    clipSize="6px"
                >
                    <Box
                        sx={{
                            px: 3,
                            py: 2.5,
                            backgroundColor: colors.darkNavy,
                        }}
                    >
                        COMING SOON
                    </Box>
                </ClipThing>
            </Box>
        </Modal>
    )
}
