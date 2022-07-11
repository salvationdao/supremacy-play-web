import { Box, Stack } from "@mui/material"
import { ClipThing, StyledImageText, StyledNormalText } from "../.."
import { FallbackUser } from "../../../containers"
import { colors } from "../../../theme/theme"
import { Faction, User } from "../../../types"

export enum MechCommandAction {
    MechCommandFired = "MECH_COMMAND_FIRED",
    MechCommandCancel = "MECH_COMMAND_CANCEL",
    MechCommandComplete = "MECH_COMMAND_COMPLETE",
}

export interface WarMachineCommandAlertProps {
    mech_id: string
    mech_label: string
    avatar_url?: string
    faction_id: string
    action: MechCommandAction
    fired_by_user?: User
}

export const WarMachineCommandAlert = ({ data, getFaction }: { data: WarMachineCommandAlertProps; getFaction: (factionID: string) => Faction }) => {
    const { action, fired_by_user } = data
    const { username, gid, faction_id } = fired_by_user || FallbackUser

    const faction = getFaction(faction_id)
    const mainColor = faction.primary_color

    const Content = () => {
        if (action === MechCommandAction.MechCommandCancel) {
            return (
                <Box>
                    <StyledNormalText text="War machine move command has been cancelled by " />
                    <StyledImageText
                        text={
                            <>
                                {`${username}`}
                                <span style={{ marginLeft: ".2rem", opacity: 0.7 }}>{`#${gid}`}</span>
                            </>
                        }
                        color={mainColor}
                        imageUrl={faction.logo_url}
                        imageMb={-0.2}
                    />
                </Box>
            )
        }

        if (action === MechCommandAction.MechCommandFired) {
            return (
                <Box>
                    <StyledImageText
                        text={
                            <>
                                {`${username}`}
                                <span style={{ marginLeft: ".2rem", opacity: 0.7 }}>{`#${gid}`}</span>
                            </>
                        }
                        color={mainColor}
                        imageUrl={faction.logo_url}
                        imageMb={-0.2}
                    />
                    <StyledNormalText text=" has triggered the war machine move command." />
                </Box>
            )
        }

        return null
    }

    if (action === MechCommandAction.MechCommandComplete) return null

    return (
        <ClipThing
            clipSize="3px"
            border={{
                borderColor: mainColor || colors.grey,
                isFancy: true,
                borderThickness: ".2rem",
            }}
            opacity={0.8}
            backgroundColor={colors.darkNavy}
        >
            <Stack
                spacing=".5rem"
                sx={{
                    px: "1.44rem",
                    pt: "1.2rem",
                    pb: ".8rem",
                }}
            >
                <Content />
            </Stack>
        </ClipThing>
    )
}
