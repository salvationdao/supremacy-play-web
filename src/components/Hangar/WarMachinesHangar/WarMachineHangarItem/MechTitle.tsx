import { Box, Link, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { SvgExternalLink } from "../../../../assets"
import { PASSPORT_WEB } from "../../../../constants"
import { useAuth } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { colors, fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"

export const MechTitle = ({
    mech,
    mechDetails,
    isSelected,
    renameMech,
}: {
    renameMech: (name: string) => Promise<void>
    mech: MechBasic
    mechDetails?: MechDetails
    isSelected: boolean
}) => {
    const { userID, user } = useAuth()
    const theme = useTheme()
    const label = mechDetails?.label
    const name = mechDetails?.name
    const hash = mech.hash || mechDetails?.hash

    // Rename
    const renamingRef = useRef<HTMLInputElement>()
    const [editing, setEditing] = useState(false)
    const [newMechName, setNewMechName] = useState<string>(name || "")

    const nameColour = !name ? "grey" : theme.factionTheme.secondary

    const renameMechHandler = async () => {
        await renameMech(newMechName)
        setEditing(false)
    }

    useEffect(() => {
        if (!editing) return
        setEditing(isSelected)
    }, [isSelected, editing])

    return (
        <Box
            display="flex"
            flexDirection="column"
            sx={{
                top: 0,
                left: "1rem",
                overflow: "visible",
                zIndex: 9,
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    left: "1rem",
                    px: "1rem",
                    py: ".5rem",
                    maxWidth: "70%",
                    background: isSelected
                        ? `linear-gradient(${theme.factionTheme.primary}FF 26%, ${theme.factionTheme.primary}BB)`
                        : theme.factionTheme.background,
                    border: isSelected ? `${theme.factionTheme.primary} .3rem solid` : `${theme.factionTheme.primary}90 .2rem solid`,
                    zIndex: 9,
                }}
            >
                <Stack sx={{ position: "relative" }}>
                    <Box display="flex">
                        <Typography
                            sx={{
                                color: isSelected ? theme.factionTheme.secondary : "#FFFFFF",
                                fontFamily: fonts.nostromoBlack,
                                display: "-webkit-box",
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {label}
                        </Typography>

                        {userID && hash && (
                            <Box mt="2px">
                                <span>
                                    <Link
                                        href={`${PASSPORT_WEB}profile/${user.username}/asset/${hash}`}
                                        target="_blank"
                                        sx={{ display: "inline", ml: ".7rem" }}
                                    >
                                        <SvgExternalLink
                                            size="1.2rem"
                                            sx={{ display: "inline", opacity: 0.7, ":hover": { opacity: 1 } }}
                                            fill={isSelected ? theme.factionTheme.secondary : "#FFFFFF"}
                                        />
                                    </Link>
                                </span>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ zIndex: 10, position: "absolute", left: "5px", bottom: "-25px", transition: "all .2s" }}>
                        <Box
                            sx={{
                                p: "0.5rem",
                                width: "auto",
                                display: "inline-block",
                                flexGrow: 0,
                                zIndex: 10,

                                background: isSelected
                                    ? `linear-gradient(${theme.factionTheme.primary}FF 26%, ${theme.factionTheme.primary}BB)`
                                    : theme.factionTheme.background,
                                border: isSelected ? `${theme.factionTheme.primary} .3rem solid` : `${theme.factionTheme.primary}90 .2rem solid`,
                            }}
                        >
                            <Box onClick={() => setEditing(true)} sx={{ display: "flex", justifyContent: "flex-start", cursor: "pointer" }}>
                                <TextField
                                    inputRef={renamingRef}
                                    variant={"standard"}
                                    sx={{
                                        transition: "all 0.2s",
                                        width: editing ? "150px" : "0px",
                                        position: "relative",
                                        flex: 1,
                                        m: 0,
                                        "& .MuiInput-root": {
                                            p: 0,
                                            fontSize: 10,
                                            color: isSelected ? "#000" : "#fff",
                                        },
                                        "& .MuiInputBase-input": {
                                            p: 0,
                                            display: "inline",
                                            fontFamily: fonts.nostromoBlack,
                                            wordBreak: "break-word",
                                        },
                                        ".MuiInputBase-input:focus": {
                                            px: ".7rem",
                                            py: ".1rem",
                                            borderRadius: 0.5,
                                            cursor: "auto !important",
                                            color: "#000",
                                            border: `1.5px dashed ${colors.lightGrey}`,
                                            backgroundColor: "#FFFFFF09",
                                        },
                                    }}
                                    spellCheck={false}
                                    InputProps={{
                                        disableUnderline: true,
                                    }}
                                    value={newMechName}
                                    onChange={(e) => setNewMechName(e.target.value)}
                                    onFocus={() => {
                                        renamingRef.current?.setSelectionRange(newMechName.length, newMechName.length)
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault()
                                            renameMechHandler()
                                            renamingRef.current?.blur()
                                        }
                                    }}
                                />
                                {!editing && (
                                    <Typography
                                        sx={{
                                            color: isSelected ? nameColour : "#FFFFFF",
                                            opacity: !name ? 0.4 : 1,
                                            fontFamily: fonts.nostromoBlack,
                                            display: "-webkit-box",
                                            overflow: "hidden",
                                            overflowWrap: "anywhere",
                                            textOverflow: "ellipsis",
                                            WebkitLineClamp: 1,
                                            WebkitBoxOrient: "vertical",
                                            fontSize: "9px",
                                        }}
                                    >
                                        {name || "unnamed"}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Stack>
            </Stack>
        </Box>
    )
}
