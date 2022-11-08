import { Box, FormControlLabel, MenuItem, Pagination, Select, Stack, Typography } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { SvgBin, SvgCrown, SvgDamageCross, SvgSearch, SvgSkull, SvgWrapperProps } from "../../../../../assets"
import { useAuth, useGlobalNotifications } from "../../../../../containers"
import { useTheme } from "../../../../../containers/theme"
import { getMechStatusDeets, getRarityDeets } from "../../../../../helpers"
import { usePagination } from "../../../../../hooks"
import { useGameServerCommands, useGameServerCommandsUser } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { colors, fonts } from "../../../../../theme/theme"
import { BattleMechStats, MechBasicWithQueueStatus, MechDetails, MechStatus } from "../../../../../types"
import { SortDir, SortTypeLabel } from "../../../../../types/marketplace"
import { NiceAccordion } from "../../../../Common/Nice/NiceAccordion"
import { NiceBoxThing } from "../../../../Common/Nice/NiceBoxThing"
import { NiceSwitch } from "../../../../Common/Nice/NiceSwitch"
import { MechBarStats } from "../../Common/MechBarStats"
import { MechRepairBlocks } from "../../Common/MechRepairBlocks"
import { GetMechsRequest, GetMechsResponse } from "../../WarMachinesHangar"
import { InputLabeller, NiceInputBase } from "../MechLoadout/Draggables/WeaponDraggables"
import { PlayerAssetMechEquipRequest } from "../MechLoadout/MechLoadout"
import { MechName } from "../MechName"

export interface MechPickerProps {
    mechDetails: MechDetails
    mechStatus?: MechStatus
    mechStaked: boolean
    onSelect: (mechID: MechDetails) => void
    onUpdate: (newMechDetails: MechDetails) => void
}

const PICKER_BUTTON_HEIGHT = "48px  "

export const MechPicker = ({ mechDetails, mechStatus, mechStaked, onUpdate }: MechPickerProps) => {
    const theme = useTheme()
    const { userID } = useAuth()
    const { send } = useGameServerCommands("/public/commander")
    const { send: sendUser } = useGameServerCommandsUser("/user_commander")
    const { newSnackbarMessage } = useGlobalNotifications()

    const statusDeets = useMemo(() => getMechStatusDeets(mechStatus), [mechStatus])
    const [inheritWeaponSkins, setInheritWeaponSkins] = useState(mechDetails.inherit_all_weapon_skins)

    const [mechBattleStats, setMechBattleStats] = useState<BattleMechStats>()
    const [statsLoading, setStatsLoading] = useState(false)
    const [statsError, setStatsError] = useState<string>()
    useEffect(() => {
        ;(async () => {
            if (!mechDetails.id) return

            try {
                setStatsLoading(true)
                const resp = await send<BattleMechStats | undefined>(GameServerKeys.BattleMechStats, {
                    mech_id: mechDetails.id,
                })

                if (resp) setMechBattleStats(resp)
                setStatsError(undefined)
            } catch (e) {
                if (typeof e === "string") {
                    setStatsError(e)
                } else if (e instanceof Error) {
                    setStatsError(e.message)
                }
            } finally {
                setStatsLoading(false)
            }
        })()
    }, [send, mechDetails.id])

    // Submit payload to server
    const updateInheritSkin = useCallback(
        async (value: boolean) => {
            try {
                const newMechDetails = await sendUser<MechDetails, PlayerAssetMechEquipRequest>(GameServerKeys.EquipMech, {
                    inherit_all_weapon_skins: value,
                    equip_utility: [],
                    equip_weapons: [],
                    mech_id: mechDetails.id,
                })

                newSnackbarMessage(`Successfully saved loadout.`, "success")
                onUpdate(newMechDetails)
            } catch (e) {
                console.error(e)
            }
        },
        [mechDetails.id, newSnackbarMessage, onUpdate, sendUser],
    )

    const handleInheritWeaponSkin = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setInheritWeaponSkins(event.target.checked)
            updateInheritSkin(event.target.checked)
        },
        [updateInheritSkin],
    )

    const renderBattleStats = useCallback(() => {
        if (statsError) {
            return (
                <Typography
                    sx={{
                        color: colors.red,
                    }}
                >
                    {statsError}
                </Typography>
            )
        }
        if (statsLoading) {
            return <Typography>Loading Battle Stats...</Typography>
        }

        const renderStat = (label: string, Icon: React.VoidFunctionComponent<SvgWrapperProps>, stat?: number) => {
            return (
                <Stack
                    sx={{
                        alignItems: "center",
                    }}
                >
                    <Stack direction="row" alignItems="center">
                        <Icon mr="1rem" fill="white" size="2.6rem" />
                        <Typography>{stat || 0}</Typography>
                    </Stack>
                    <Typography
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            fontSize: "1.2rem",
                        }}
                    >
                        {label}
                    </Typography>
                </Stack>
            )
        }

        return (
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(40px, 1fr))",
                    gap: "1rem",
                }}
            >
                {renderStat("KILLS", SvgDamageCross, mechBattleStats?.total_kills)}
                {renderStat("DEATHS", SvgSkull, mechBattleStats?.total_deaths)}
                {renderStat("WINS", SvgCrown, mechBattleStats?.total_wins)}
                {renderStat("LOSSES", SvgBin, mechBattleStats?.total_losses)}
            </Box>
        )
    }, [mechBattleStats, statsError, statsLoading])

    const rarity = getRarityDeets(mechDetails.chassis_skin?.tier || mechDetails.tier)
    const avatarUrl = mechDetails?.chassis_skin?.avatar_url || mechDetails?.avatar_url
    return (
        <NiceBoxThing
            border={{
                color: theme.factionTheme.primary,
                thickness: "thicc",
            }}
            background={{
                color: [theme.factionTheme.background],
            }}
            sx={{
                flexBasis: 310,
                alignSelf: "start",
                position: "relative",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Mech picker dropdown */}
            <Box
                sx={{
                    zIndex: 11,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                }}
            >
                <MechPickerDropdown />
            </Box>

            {/* Mech Profile */}
            <Stack
                direction="row"
                spacing="1rem"
                sx={{
                    width: "100%",
                    mt: PICKER_BUTTON_HEIGHT,
                    px: "2rem",
                    py: "1rem",
                    background: `linear-gradient(to right, ${colors.black2}, ${theme.factionTheme.background})`,
                }}
            >
                <NiceBoxThing
                    border={{
                        color: rarity ? rarity.color : colors.darkGrey,
                    }}
                    caret={{
                        position: "bottom-right",
                        size: "small",
                    }}
                    sx={{
                        width: 60,
                        height: 60,
                    }}
                >
                    <Box
                        component="img"
                        src={avatarUrl}
                        alt="Mech avatar"
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                </NiceBoxThing>
                <Stack flex={1}>
                    <MechName
                        onRename={(newName) => onUpdate({ ...mechDetails, name: newName })}
                        mech={mechDetails}
                        allowEdit={userID === mechDetails.owner_id}
                    />
                    <Stack direction="row" justifyContent="space-between">
                        <Typography
                            sx={{
                                fontFamily: fonts.shareTech,
                                fontSize: "1.6rem",
                            }}
                        >
                            {mechDetails.label}
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: fonts.shareTech,
                                fontSize: "1.6rem",
                                color: rarity.color,
                            }}
                        >
                            {rarity.label}
                        </Typography>
                    </Stack>
                    {mechStaked && (
                        <Typography
                            sx={{
                                color: colors.red,
                            }}
                        >
                            STAKED
                        </Typography>
                    )}
                </Stack>
            </Stack>

            {/* Mech Status */}
            <Stack
                direction="row"
                spacing="1rem"
                sx={{
                    px: "2rem",
                    py: ".5rem",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: `${statusDeets.color}44`,
                }}
            >
                <Typography>
                    Status:{" "}
                    <Box
                        component="span"
                        sx={{
                            color: statusDeets.color,
                        }}
                    >
                        {statusDeets.label}
                    </Box>
                </Typography>
                <Box height="fit-content">
                    <MechRepairBlocks mechID={mechDetails.id} defaultBlocks={mechDetails.repair_blocks} size={12} />
                </Box>
            </Stack>

            {/* Weapon Skin Inheritance*/}
            <Box
                sx={{
                    px: "2rem",
                    py: "1rem",
                    borderBottom: `1px solid ${theme.factionTheme.primary}44`,
                }}
            >
                <FormControlLabel
                    control={<NiceSwitch onChange={handleInheritWeaponSkin} checked={inheritWeaponSkins} />}
                    label={
                        <Typography
                            sx={{
                                mr: "auto",
                                fontFamily: fonts.nostromoBlack,
                                fontSize: "1.6rem",
                            }}
                        >
                            WEAPON SKIN INHERITANCE
                        </Typography>
                    }
                    labelPlacement="start"
                    sx={{
                        display: "flex",
                        ml: 0,
                        mr: 0,
                    }}
                />
            </Box>

            <Stack
                spacing="2rem"
                sx={{
                    p: "2rem",
                }}
            >
                {/* Mech Battle Stats */}
                {renderBattleStats()}

                {/* Mech Stats */}
                <MechBarStats
                    mech={mechDetails}
                    mechDetails={mechDetails}
                    color={theme.factionTheme.primary}
                    fontSize="1.2rem"
                    width="100%"
                    spacing="1.2rem"
                    barHeight=".9rem"
                />
            </Stack>
        </NiceBoxThing>
    )
}

const MechPickerDropdown = React.memo(function MechPickerDropdown() {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")

    const [expandPicker, setExpandPicker] = useState(false)

    const [mechs, setMechs] = useState<MechBasicWithQueueStatus[]>([])
    const [isMechsLoading, setIsMechsLoading] = useState(true)
    const [mechsError, setMechsError] = useState<string>()
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState<string>(SortTypeLabel.MechQueueAsc)
    const { page, changePage, setTotalItems, totalPages, pageSize } = usePagination({
        pageSize: 6,
        page: 1,
    })
    const getMechs = useCallback(async () => {
        setIsMechsLoading(true)
        try {
            let sortDir = SortDir.Asc
            let sortBy = ""
            if (sort === SortTypeLabel.MechQueueDesc || sort === SortTypeLabel.AlphabeticalReverse || sort === SortTypeLabel.RarestDesc) sortDir = SortDir.Desc

            switch (sort) {
                case SortTypeLabel.Alphabetical:
                case SortTypeLabel.AlphabeticalReverse:
                    sortBy = "alphabetical"
                    break
                case SortTypeLabel.RarestAsc:
                case SortTypeLabel.RarestDesc:
                    sortBy = "rarity"
            }

            const isQueueSort = sort === SortTypeLabel.MechQueueAsc || sort === SortTypeLabel.MechQueueDesc

            const resp = await send<GetMechsResponse, GetMechsRequest>(GameServerKeys.GetMechs, {
                queue_sort: isQueueSort ? sortDir : undefined,
                sort_by: isQueueSort ? undefined : sortBy,
                sort_dir: isQueueSort ? undefined : sortDir,
                search,
                rarities: [],
                statuses: [],
                page,
                page_size: pageSize,
                include_market_listed: true,
            })

            if (!resp) return
            setMechsError(undefined)
            setMechs(resp.mechs)
            setTotalItems(resp.total)
        } catch (e) {
            setMechsError(typeof e === "string" ? e : "Failed to get mechs.")
            console.error(e)
        } finally {
            setIsMechsLoading(false)
        }
    }, [page, pageSize, search, send, setTotalItems, sort])
    useEffect(() => {
        getMechs()
    }, [getMechs])

    const mechsContent = useMemo(() => {
        if (isMechsLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" flex={1}>
                    <Typography>Loading mechs...</Typography>
                </Stack>
            )
        }
        if (mechsError) {
            return (
                <Stack alignItems="center" justifyContent="center" flex={1}>
                    <Typography>{mechsError}</Typography>
                </Stack>
            )
        }
        if (mechs.length === 0) {
            return (
                <Stack alignItems="center" justifyContent="center" flex={1}>
                    <Typography
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            color: `${theme.factionTheme.primary}aa`,
                            textTransform: "uppercase",
                        }}
                    >
                        No Mechs
                    </Typography>
                </Stack>
            )
        }

        return (
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "1rem",
                }}
            >
                {mechs.map((m, index) => (
                    <NiceBoxThing
                        key={index}
                        border={{
                            thickness: "very-lean",
                            color: `${colors.lightGrey}66`,
                        }}
                        background={{
                            color: [`${colors.lightGrey}33`],
                        }}
                        sx={{
                            display: "flex",
                            p: "1rem",
                        }}
                    >
                        <NiceBoxThing
                            border={{
                                color: getRarityDeets(m.tier).color,
                                thickness: "lean",
                            }}
                            caret={{
                                position: "bottom-right",
                            }}
                            sx={{
                                width: 60,
                                height: 60,
                            }}
                        >
                            <Box
                                component="img"
                                src={m.avatar_url || m.image_url}
                                alt={`${m.label} mech avatar`}
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </NiceBoxThing>
                        <Stack ml=".5rem">
                            <Typography
                                sx={{
                                    fontFamily: fonts.nostromoBold,
                                    color: m.name ? "white" : colors.grey,
                                }}
                            >
                                {m.name || "UNNAMED"}
                            </Typography>
                            <Typography>{m.label}</Typography>
                        </Stack>
                    </NiceBoxThing>
                ))}
            </Box>
        )
    }, [isMechsLoading, mechs, mechsError, theme.factionTheme.primary])

    return (
        <NiceAccordion.Base
            sx={(theme) => ({
                border: "none",
                outline: expandPicker ? `3px solid ${theme.factionTheme.primary}` : `0px solid transparent`,
                transition: "outline .2s ease-out",
            })}
            expanded={expandPicker}
            onChange={() => setExpandPicker((prev) => !prev)}
        >
            <NiceAccordion.Summary
                sx={{
                    height: PICKER_BUTTON_HEIGHT,
                }}
            >
                Select Mech
            </NiceAccordion.Summary>
            <NiceAccordion.Details>
                <Stack spacing="2rem" minHeight={600}>
                    <Stack spacing="1rem">
                        <NiceInputBase
                            placeholder="Search mechs..."
                            endAdornment={<SvgSearch fill={"rgba(255, 255, 255, 0.4)"} />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <InputLabeller flex={1} label="Sort:" name="sort">
                            <Select
                                name="sort"
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                input={<NiceInputBase />}
                                sx={{
                                    flex: 1,
                                }}
                            >
                                <MenuItem value={SortTypeLabel.MechQueueAsc}>{SortTypeLabel.MechQueueAsc}</MenuItem>
                                <MenuItem value={SortTypeLabel.MechQueueDesc}>{SortTypeLabel.MechQueueDesc}</MenuItem>
                                <MenuItem value={SortTypeLabel.Alphabetical}>{SortTypeLabel.Alphabetical}</MenuItem>
                                <MenuItem value={SortTypeLabel.AlphabeticalReverse}>{SortTypeLabel.AlphabeticalReverse}</MenuItem>
                                <MenuItem value={SortTypeLabel.RarestAsc}>{SortTypeLabel.RarestAsc}</MenuItem>
                                <MenuItem value={SortTypeLabel.RarestDesc}>{SortTypeLabel.RarestDesc}</MenuItem>
                            </Select>
                        </InputLabeller>
                    </Stack>

                    {/* Content */}
                    {mechsContent}
                    <Box flex={1} />

                    {/* Pagination */}
                    <Pagination count={totalPages} page={page} onChange={(_, p) => changePage(p)} />
                </Stack>
            </NiceAccordion.Details>
        </NiceAccordion.Base>
    )
})
