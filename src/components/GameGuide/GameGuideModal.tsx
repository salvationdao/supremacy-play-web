import { Box, Button, Link, Modal, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useState } from "react"
import { getMultiplierGuide } from "../../helpers"
import { colors } from "../../theme/theme"
import { MultiplierGuide } from "../../types"
import MultiplierGuideComponent from "./MultiplierGuideComponent"

interface GameGuideModalProps {
    toggleClosed: any
    closed: boolean
}

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

const multiplierKeys: string[] = [
    "Supporter",
    "Contributor",
    "Super contributor",
    "A fool and his money",
    "Air support",
    "Air marshal",
    "Now i am become death",
    "Destroyer of worlds",
    "Grease monkey",
    "Field mechanic",
    "Combo breaker",
    "C-c-c-c-combo breaker",
    "Mech commander",
    "Admiral",
    "Won battle",
    "Won last three battles",
]

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props

    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} {...other}>
            {value === index && <Box>{children}</Box>}
        </div>
    )
}

export const GameGuideModal = ({ toggleClosed, closed }: GameGuideModalProps) => {
    const [value, setValue] = useState<number>(0)
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    return (
        <Box>
            <Modal open={!closed} onClose={() => toggleClosed(true)}>
                <Stack
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        maxWidth: "86rem",
                        height: "70vh",
                        pb: 3,
                        backgroundColor: `${colors.darkNavyBlue}`,
                        outline: "1px solid #FFFFFF",
                        borderRadius: 1,
                        boxShadow: 24,
                    }}
                >
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            sx={{
                                ".MuiTab-root.Mui-selected": { color: colors.neonBlue, opacity: 1 },
                                ".MuiTabs-indicator": { backgroundColor: colors.neonBlue },
                                ".MuiTab-root": { fontSize: "1.8rem", opacity: 0.7, fontFamily: "Share Tech" },
                            }}
                        >
                            <Tab label="Intro" />
                            <Tab label="Gameplay" />
                            <Tab label="Multipliers" />
                            <Tab label="Mech NFTs" />
                        </Tabs>
                    </Box>

                    <Box
                        sx={{
                            overflowY: "scroll",
                            height: "100%",
                            scrollbarWidth: "none",
                            scrollBehavior: "smooth",
                            display: "flex",
                            flexDirection: "column",
                            mr: 1,
                            mt: 1,
                            mb: 2,
                            px: 3,
                            py: 1,
                            "::-webkit-scrollbar": {
                                width: 4,
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#FFFFFF15",
                                borderRadius: 3,
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: `${colors.neonBlue}`,
                                borderRadius: 3,
                            },
                            "& p": { fontSize: "1.8rem" },
                        }}
                    >
                        <TabPanel value={value} index={0}>
                            <Stack spacing={2}>
                                <Typography variant="h4" sx={{ fontFamily: "Nostromo Regular Bold" }}>
                                    Welcome to the Battle Arena
                                </Typography>

                                <Typography>
                                    Where Syndicates fight for Supremacy.
                                    <br />
                                    <br />
                                    The Battle Arena is a live stream of player-owned NFT Mechs controlled by AI’s
                                    fighting to win fast-paced battles. Players (Citizens) can earn rewards by unlocking
                                    Multipliers for different in-game achievements.
                                    <br />
                                    <br />
                                    As a Citizen you can enlist in a Syndicate, you’ll stay with your Syndicate for a
                                    while so choose wisely. You can learn more about the Syndicates by journeying
                                    through their stories{" "}
                                    <Link
                                        href="https://supremacy.game/simulation"
                                        sx={{ color: colors.neonBlue }}
                                        target="_blank"
                                    >
                                        here
                                    </Link>
                                </Typography>
                            </Stack>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Stack spacing={2}>
                                <Typography variant="h4" sx={{ fontFamily: "Nostromo Regular Bold" }}>
                                    Gameplay
                                </Typography>
                                <Typography>
                                    Now your mission is to support your Syndicate in the Battle
                                    <br />
                                    <br />
                                    You can influence the Battle by spending your game tokens ($SUPS) on in-game actions
                                    such as the Battle Abilities (Nukes, Airstrikes, Repairs) which are deployed by the
                                    Citizen whose vote secures the Ability for their Syndicate. Or by working with your
                                    Syndicate to purchase the Syndicate Special Abilities (Boston Cybernetics Robot
                                    Dogs, Zaibatsu’s Overcharge and Red Mountains reinforcements).
                                    <br />
                                    <br />
                                    Utilising these abilities with your fellow Citizens, you can influence the tide of
                                    the Battle in your Syndicate’s favour and secure victory.
                                    <br />
                                    <br />
                                    By spending your game tokens, SUPS, you can unlock multipliers that earn you a share
                                    of the Spoils of War. The Spoils of War is funded by all Citizens spending on
                                    abilities.
                                    <br />
                                    <br />
                                    All SUPS spent on Battle Arena abilities are pooled into the ‘Spoils of War’. These
                                    SUPS are calculated at the end of each battle and become available for earning on
                                    the next round. Your multipliers work similarly, and game actions resulting in
                                    multipliers become available on the next round also. Your multipliers directly
                                    impact your earnings from the Spoils of War - so your strategy is key.
                                    <br />
                                    <br />
                                    Your share in the Spoils of War is dispersed passively every ~5 seconds, calculated
                                    for release over 300 passive ticks. If the Battle ends, before the 300 passive ticks
                                    deplete the spoils, then the remaining amount is dispersed in a lump sum - but only
                                    for those that stay to the end, so it is worth sticking around.
                                    <br />
                                    <br />
                                    The Spoils of War is a self-sustainable play-to-ean economic flow fuelled by player
                                    participation, as players participate in-game voting they build the Spoils of War.
                                </Typography>
                            </Stack>
                        </TabPanel>

                        <TabPanel value={value} index={2}>
                            <Stack spacing={2}>
                                <Typography variant="h4" sx={{ fontFamily: "Nostromo Regular Bold" }}>
                                    Multipliers
                                </Typography>
                                <Typography>
                                    To achieve Multipliers to earn rewards from the Spoils of War, you must first unlock
                                    the “CITIZEN” multiplier. This is achieved by being in the top 80% of contributors
                                    to the Spoils of War in that round with the Multiplier of “Citizen” being allocated
                                    after the conclusion of that Battle. This specific multiplier lasts for the next 2
                                    Battles.
                                    <br />
                                    <br />
                                    After achieving CITIZEN, for the duration you have that CITIZEN multiplier, you can
                                    unlock the following multipliers and stack them to earn your share of the Spoils of
                                    War.
                                    <br />
                                    <br />
                                    You Must achieve CITIZEN first before you can achieve any of the following
                                    Multipliers:
                                </Typography>

                                <Stack spacing="1.5rem">
                                    {multiplierKeys.map((key, i) => {
                                        const mul: MultiplierGuide = getMultiplierGuide(key)
                                        return (
                                            <MultiplierGuideComponent
                                                key={i}
                                                multiplierType={key}
                                                title={mul.title}
                                                description={mul.description}
                                            />
                                        )
                                    })}
                                </Stack>
                            </Stack>
                        </TabPanel>

                        <TabPanel value={value} index={3}>
                            <Stack spacing={2}>
                                <Typography variant="h4" sx={{ fontFamily: "Nostromo Regular Bold" }}>
                                    Mech NFTs
                                </Typography>

                                <Typography>
                                    Players can purchase Mech NFTs in-game from the shop{" "}
                                    <Link
                                        href="https://passport.xsyn.io"
                                        sx={{ color: colors.neonBlue }}
                                        target="_blank"
                                    >
                                        Passport SYN
                                    </Link>{" "}
                                    or through the Black Market (
                                    <Link
                                        href="https://opensea.io/collection/supremacy-genesis"
                                        sx={{ color: colors.neonBlue }}
                                        target="_blank"
                                    >
                                        OpenSea
                                    </Link>
                                    ). Mechs from the Black Market (
                                    <Link
                                        href="https://opensea.io/collection/supremacy-genesis"
                                        sx={{ color: colors.neonBlue }}
                                        target="_blank"
                                    >
                                        OpenSea
                                    </Link>
                                    ) will need to be transitioned “On-World” through Passport to be used in-game.
                                    <br />
                                    <br />
                                    In the Battle Arena, on-world Mechs can be queued into Battle to fight for the
                                    player’s Syndicate. To Deploy a Mech, navigate to the right-hand side Menu and open
                                    “War Machines”. Clicking the Deploy button will open a Pop-up with the fee and
                                    contract reward information. Read carefully and hover on the tooltip icons on the
                                    right-hand side to learn about Contract Rewards, Fees, and Insurance. Insurance is
                                    free at the moment and assists in the “Repair” cooldown time before you can queue
                                    again. The queue fee is related to the queue length with each consecutive queue
                                    position costing 0.25 SUPS. To queue in the 1st queue place costs 0.25 SUPS, but if
                                    there are 99 Mechs already in the queue the 100th spot costs 25 SUPS.
                                    <br />
                                    <br />
                                    When a player deploys their Mech it is added to the queue which is reduced as mechs
                                    battle. When a queued Mech reaches the Battle, it will be added to the Live Stream
                                    Battle Arena where all players can see that Mech fight. Each Battle contains 9 mechs
                                    total, 3 from each syndicate. If your Syndicate wins the Battle AND your mech
                                    survives, the Contract Reward is paid out whether you are online or not. By being
                                    online you can support your Syndicate and Mech to achieve victory by influencing the
                                    battle. If you are online and have the CITIZEN Multiplier, furthermore there are 2
                                    Spoils of War Multipliers you can achieve: Mech Commander if your winning Mech
                                    survives and Admiral if you have Mechs in 3 Battles in a row and survive
                                    victoriously.
                                    <br />
                                    <br />
                                    This concludes the basics of How to Play the Battle Arena. More details will be
                                    added and updated as the game evolves. The evolution of the game is a constant
                                    effort as economic balancing of prices, rewards, and new features are implemented.
                                    This is the start of a grand game economy powered by $SUPS, where gameplay appeals
                                    to a range of players in unique ways to fight for Supremacy.
                                    <br />
                                    <br />
                                    Enlist in your Syndicate, join the War Room game chat, talk with other players and
                                    learn the key strategies of the game through your Syndicate’s chat group in the War
                                    Room. Watch along until you are ready to enter the Battle and contribute to the
                                    glorious victory of your Syndicate.
                                </Typography>
                            </Stack>
                        </TabPanel>
                    </Box>

                    <Button
                        variant="outlined"
                        onClick={() => toggleClosed(true)}
                        sx={{
                            justifySelf: "flex-end",
                            ml: 3,
                            py: 0.8,
                            width: "100%",
                            maxWidth: "5em",
                            color: colors.neonBlue,
                            backgroundColor: colors.darkNavy,
                            borderRadius: 0.7,
                            fontFamily: "Nostromo Regular Bold",
                            border: `${colors.neonBlue} 1px solid`,
                            ":hover": {
                                opacity: 0.8,
                                border: `${colors.neonBlue} 1px solid`,
                            },
                        }}
                    >
                        Close
                    </Button>
                </Stack>
            </Modal>
        </Box>
    )
}
