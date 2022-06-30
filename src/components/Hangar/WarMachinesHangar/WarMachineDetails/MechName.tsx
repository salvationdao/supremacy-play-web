import { CircularProgress, IconButton, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useRef, useState } from "react"
import { SvgEdit, SvgSave } from "../../../../assets"
import { useAuth } from "../../../../containers"
import { colors } from "../../../../theme/theme"
import { MechDetails } from "../../../../types"

export const MechName = ({ mechDetails, renameMech }: { renameMech: (name: string) => Promise<void>; mechDetails: MechDetails }) => {
    const { userID } = useAuth()

    const name = mechDetails.name
    const isOwner = userID === mechDetails.owner_id

    // Rename
    const renamingRef = useRef<HTMLInputElement>()
    const [editing, setEditing] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [newMechName, setNewMechName] = useState<string>(name || "")

    const renameMechHandler = useCallback(async () => {
        try {
            setSubmitting(true)
            renamingRef.current?.blur()
            await renameMech(newMechName)
        } finally {
            setSubmitting(false)
            setEditing(false)
        }
    }, [newMechName, renameMech])

    return (
        <Stack direction="row" alignItems="center">
            <Stack direction="row" alignItems="center" sx={{ cursor: "text" }}>
                <TextField
                    inputRef={renamingRef}
                    variant="standard"
                    sx={{
                        flex: 1,
                        m: 0,
                        py: ".2rem",
                        opacity: editing ? "unset" : 0,
                        height: editing ? "unset" : 0,
                        width: editing ? "unset" : 0,
                        position: "relative",
                        "& .MuiInput-root": {
                            p: 0,
                            fontSize: "1.8rem",
                            color: "#FFFFFF",
                        },
                        "& .MuiInputBase-input": {
                            p: 0,
                            display: "inline",
                            px: "1.4rem",
                            py: ".4rem",
                            wordBreak: "break-word",
                            border: `#FFFFFF99 1.5px dashed`,
                            borderRadius: 0.5,
                            backgroundColor: "#FFFFFF12",
                        },
                    }}
                    spellCheck={false}
                    InputProps={{
                        disableUnderline: true,
                    }}
                    value={newMechName}
                    placeholder="Enter a name..."
                    onChange={(e) => setNewMechName(e.target.value)}
                    onFocus={() => renamingRef.current?.setSelectionRange(0, newMechName.length)}
                    onBlur={() => (newMechName === name ? setEditing(false) : undefined)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            renameMechHandler()
                        }
                    }}
                />

                {editing && (
                    <>
                        {!submitting && newMechName !== name && (
                            <IconButton size="small" sx={{ ml: ".5rem" }} onClick={renameMechHandler}>
                                <SvgSave size="1.4rem" />
                            </IconButton>
                        )}

                        {submitting && <CircularProgress size="1.4rem" sx={{ ml: "1rem", color: "#FFFFFF" }} />}
                    </>
                )}

                {!editing && (
                    <Typography
                        sx={{
                            fontSize: "1.8rem",
                            color: !name ? colors.grey : "#FFFFFF",
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {name || "Unnamed"}
                    </Typography>
                )}

                {!editing && isOwner && (
                    <IconButton
                        size="small"
                        sx={{ ml: ".5rem", opacity: 0.6, ":hover": { opacity: 1 } }}
                        onClick={() => {
                            setEditing(true)
                            renamingRef.current?.focus()
                        }}
                    >
                        <SvgEdit size="1.2rem" />
                    </IconButton>
                )}
            </Stack>
        </Stack>
    )
}
