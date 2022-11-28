import { Box, Stack, Typography } from "@mui/material"
import { useMemo, useRef, useState } from "react"
import { Controller, ControllerRenderProps, UseFormReturn } from "react-hook-form"
import { useArena } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"
import { AllGameMapsCombined } from "../../Common/AllGameMapsCombined"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"
import { NiceButtonGroup } from "../../Common/Nice/NiceButtonGroup"
import { NiceDatePicker } from "../../Common/Nice/NiceDatePicker"
import { NicePopover } from "../../Common/Nice/NicePopover"
import { NiceTextField } from "../../Common/Nice/NiceTextField"
import { NiceTimePicker } from "../../Common/Nice/NiceTimePicker"
import { Accessibility, CreateLobbyFormFields, Scheduling } from "./CreateLobbyFormModal"
import { FormField } from "./FormField"

export const RoomSettings = ({ formMethods }: { formMethods: UseFormReturn<CreateLobbyFormFields, unknown> }) => {
    const theme = useTheme()
    const [rerender, setRerender] = useState(new Date())

    return (
        <Stack spacing="2rem">
            {/* Access */}
            <FormField label="Lobby Access">
                <Controller
                    name="accessibility"
                    control={formMethods.control}
                    rules={{
                        required: { value: true, message: "Access field is required." },
                    }}
                    render={({ field }) => {
                        return (
                            <NiceButtonGroup
                                primaryColor={theme.factionTheme.primary}
                                secondaryColor={theme.factionTheme.text}
                                options={[
                                    { label: "Public", value: Accessibility.Public },
                                    { label: "Private", value: Accessibility.Private },
                                ]}
                                selected={field.value}
                                onSelected={(value) => field.onChange(value)}
                            />
                        )
                    }}
                />
            </FormField>

            {/* Name */}
            <FormField label="Lobby Name">
                <Controller
                    name="name"
                    control={formMethods.control}
                    rules={{
                        required: { value: true, message: "Lobby name is required." },
                        maxLength: { value: 20, message: "Lobby name is too long." },
                    }}
                    render={({ field }) => {
                        const errorMessage = formMethods.formState.errors.name?.message
                        return (
                            <NiceTextField
                                primaryColor={theme.factionTheme.primary}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Enter lobby name..."
                                type="text"
                                error={!!errorMessage}
                                helperText={errorMessage}
                            />
                        )
                    }}
                />
            </FormField>

            {/* Game map */}
            <FormField label="Map">
                <Controller
                    name="game_map_id"
                    control={formMethods.control}
                    render={({ field }) => {
                        return <GameMapSelector field={field} />
                    }}
                />
            </FormField>

            {/* Max deploys */}
            <FormField label="Max mech deploys per player">
                <Controller
                    name="max_deploy_number"
                    control={formMethods.control}
                    rules={{
                        required: { value: true, message: "Max mech deploy field is required." },
                    }}
                    render={({ field }) => {
                        return (
                            <NiceButtonGroup
                                primaryColor={theme.factionTheme.primary}
                                secondaryColor={theme.factionTheme.text}
                                options={[
                                    { label: "1", value: 1 },
                                    { label: "2", value: 2 },
                                    { label: "3", value: 3 },
                                ]}
                                selected={field.value}
                                onSelected={(value) => field.onChange(value)}
                            />
                        )
                    }}
                />
            </FormField>

            {/* Start time */}
            <FormField label="Battle start time">
                <Controller
                    name="scheduling_type"
                    control={formMethods.control}
                    rules={{
                        required: { value: true, message: "Schedule field is required." },
                    }}
                    render={({ field }) => {
                        return (
                            <NiceButtonGroup
                                primaryColor={theme.factionTheme.primary}
                                secondaryColor={theme.factionTheme.text}
                                options={[
                                    { label: "When lobby is full", value: Scheduling.OnReady },
                                    { label: "Custom date & time", value: Scheduling.SetTime },
                                ]}
                                selected={field.value}
                                onSelected={(value) => {
                                    field.onChange(value)
                                    setRerender(new Date())
                                }}
                                sx={{ ".MuiButtonBase-root": { flex: 1 } }}
                            />
                        )
                    }}
                />

                {/* Custom start time */}
                {formMethods.watch("scheduling_type") === Scheduling.SetTime && (
                    <Stack direction="row" alignItems="center" spacing=".8rem" pt=".8rem">
                        <Controller
                            name="wont_start_until_date"
                            control={formMethods.control}
                            rules={{
                                required: { value: true, message: "Start date field is required." },
                            }}
                            render={({ field }) => {
                                return <NiceDatePicker value={field.value} onChange={(value) => field.onChange(value)} />
                            }}
                        />

                        <Controller
                            name="wont_start_until_time"
                            control={formMethods.control}
                            rules={{
                                required: { value: true, message: "Start time field is required." },
                            }}
                            render={({ field }) => {
                                return <NiceTimePicker value={field.value} onChange={(value) => field.onChange(value)} />
                            }}
                        />
                    </Stack>
                )}
            </FormField>
        </Stack>
    )
}

export const GameMapSelector = ({ field }: { field: ControllerRenderProps<CreateLobbyFormFields, "game_map_id"> }) => {
    const { factionTheme } = useTheme()
    const { gameMaps } = useArena()

    // Popover
    const popoverRef = useRef(null)
    const [openMapSelector, setOpenMapSelector] = useState(false)

    const selectedGameMap = useMemo(() => gameMaps.find((gm) => gm.id === field.value), [gameMaps, field.value])

    const randomOption = useMemo(
        () => (
            <Stack alignItems="center" justifyContent="center" sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
                <AllGameMapsCombined sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, opacity: 0.5 }} />
                <Typography variant="h4" fontFamily={fonts.nostromoBold}>
                    <i>RANDOM</i>
                </Typography>
            </Stack>
        ),
        [],
    )

    return (
        <>
            <NiceBoxThing
                ref={popoverRef}
                border={{ color: "#FFFFFF30", thickness: "very-lean" }}
                sx={{
                    position: "relative",
                    height: "8rem",
                    cursor: "pointer",
                    backgroundColor: factionTheme.background,
                    backgroundImage: selectedGameMap ? `url(${selectedGameMap.background_url})` : undefined,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
                onClick={() => setOpenMapSelector(true)}
            >
                {!selectedGameMap ? (
                    randomOption
                ) : (
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            width: "calc(100% - 4rem)",
                            height: "calc(100% - 2rem)",
                            transform: `translate(-50%, -50%)`,
                            backgroundImage: `url(${selectedGameMap.logo_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "bottom center",
                            backgroundSize: "contain",
                        }}
                    />
                )}
            </NiceBoxThing>

            {openMapSelector && (
                <NicePopover
                    open={openMapSelector}
                    anchorEl={popoverRef.current}
                    onClose={() => setOpenMapSelector(false)}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                    }}
                >
                    <Stack direction="row" flexWrap="wrap" sx={{ width: "60rem" }}>
                        {gameMaps.map((gm) => {
                            const isSelected = selectedGameMap?.id === gm.id
                            return (
                                <Box
                                    key={gm.id}
                                    sx={{
                                        position: "relative",
                                        width: "50%",
                                        height: "6rem",
                                        cursor: "pointer",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                        backgroundImage: `url(${gm.background_url})`,
                                        border: isSelected ? `#FFFFFF 2px solid` : "none",
                                        opacity: isSelected ? 1 : 0.3,
                                        boxShadow: isSelected ? 6 : 0,

                                        "&:hover": {
                                            opacity: 1,
                                        },
                                    }}
                                    onClick={() => {
                                        field.onChange(gm.id)
                                        setOpenMapSelector(false)
                                    }}
                                >
                                    {/* Logo */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            width: "calc(100% - 4rem)",
                                            height: "calc(100% - 2rem)",
                                            transform: `translate(-50%, -50%)`,
                                            backgroundImage: `url(${gm.logo_url})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "bottom center",
                                            backgroundSize: "contain",
                                        }}
                                    />
                                </Box>
                            )
                        })}

                        <Box
                            sx={{
                                position: "relative",
                                width: "100%",
                                height: "6rem",
                                cursor: "pointer",
                                border: !selectedGameMap ? `#FFFFFF 2px solid` : "none",
                                opacity: !selectedGameMap ? 1 : 0.3,
                                boxShadow: !selectedGameMap ? 6 : 0,

                                "&:hover": {
                                    opacity: 1,
                                },
                            }}
                            onClick={() => {
                                field.onChange("")
                                setOpenMapSelector(false)
                            }}
                        >
                            {randomOption}
                        </Box>
                    </Stack>
                </NicePopover>
            )}
        </>
    )
}
