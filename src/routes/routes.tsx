import { BattleArenaPNG, GenericPNG, HangarPNG, MechsPNG, TutorialPNG } from "../assets"
import { DangerZone } from "../components/Admin/Dangerzone/DangerZone"
import { AdminLookup } from "../components/Admin/Lookup/AdminLookup"
import { AdminLookupResultPage } from "../components/Admin/Lookup/AdminLookupResultPage"
import { BattleArena } from "../components/BattleArena/BattleArena"
import { BillingHistory } from "../components/BillingHistory/BillingHistory"
import { BillingHistorySingle } from "../components/BillingHistory/BillingHistorySingle"
import { Claims } from "../components/Claims/Claims"
import { FactionPassBuy } from "../components/FactionPass/FactionPassBuy/FactionPassBuy"
import { FactionPassDashboard } from "../components/FactionPass/FactionPassDashboard/FactionPassDashboard"
import { FactionPassMechPool } from "../components/FactionPass/FactionPassMechPool/FactionPassMechPool"
import { FleetCrates } from "../components/FleetCrates/FleetCrates"
import { FleetKeycards } from "../components/FleetKeycards.tsx/FleetKeycards"
import { FleetMechs } from "../components/FleetMechs/FleetMechs"
import { FleetPlayerAbility } from "../components/FleetPlayerAbility/FleetPlayerAbility"
import { FleetWeapons } from "../components/FleetWeapons/FleetWeapons"
import { SubmodelsHangar } from "../components/Hangar/SubmodelHangar/SubmodelsHangar"
import { MechPage } from "../components/Hangar/WarMachinesHangar/WarMachineDetails/MechPage"
import { WeaponHangarDetails } from "../components/Hangar/WeaponsHangar/WeaponDetails/WeaponHangarDetails"
import { GlobalStats } from "../components/Leaderboard/GlobalStats/GlobalStats"
import { Lobbies } from "../components/Lobbies/Lobbies"
import { HistoryMarket } from "../components/Marketplace/HistoryMarket/HistoryMarket"
import { KeycardMarketDetails } from "../components/Marketplace/KeycardsMarket/KeycardMarketDetails/KeycardMarketDetails"
import { KeycardsMarket } from "../components/Marketplace/KeycardsMarket/KeycardsMarket"
import { MysteryCrateMarketDetails } from "../components/Marketplace/MysteryCratesMarket/MysteryCrateMarketDetails/MysteryCrateMarketDetails"
import { MysteryCratesMarket } from "../components/Marketplace/MysteryCratesMarket/MysteryCratesMarket"
import { MarketplaceSellPage } from "../components/Marketplace/SellItem/MarketplaceSellPage"
import { WarMachineMarketDetails } from "../components/Marketplace/WarMachinesMarket/WarMachineMarketDetails/WarMachineMarketDetails"
import { WarMachinesMarket } from "../components/Marketplace/WarMachinesMarket/WarMachinesMarket"
import { WeaponMarketDetails } from "../components/Marketplace/WeaponsMarket/WeaponMarketDetails/WeaponMarketDetails"
import { WeaponsMarket } from "../components/Marketplace/WeaponsMarket/WeaponsMarket"
import { NotFoundPage } from "../components/NotFoundPage/NotFoundPage"
import { PublicProfile } from "../components/PublicProfile/PublicProfile"
import { BattlesReplays } from "../components/Replays/BattlesReplays/BattlesReplays"
import { ReplayItemPage } from "../components/Replays/ReplayDetails/ReplayItemPage"
import { MysteryCratesStore } from "../components/Storefront/MysteryCratesStore/MysteryCratesStore"
import { PackagesStore } from "../components/Storefront/PackagesStore/PackagesStore"
import { PlayerAbilitiesStore } from "../components/Storefront/PlayerAbilitiesStore/PlayerAbilitiesStore"
import { StorefrontShoppingCartPage } from "../components/Storefront/StorefrontShoppingCartPage"
import { TutorialPage } from "../components/Tutorial/TutorialPage"
import { DEV_ONLY, HANGAR_PAGE, IS_TESTING_MODE } from "../constants"

export enum RouteSingleID {
    Home = "HOME",
    Tutorial = "TUTORIAL",
    Lobbies = "LOBBIES",
    Leaderboard = "LEADERBOARD",
    Mech = "MECH",
    Weapon = "WEAPON",
    FleetMechs = "FLEET",
    FleetCrates = "FLEET_CRATES",
    FleetKeycards = "FLEET_KEYCARDS",
    FleetAbilities = "FLEET_ABILITIES",
    FleetWeapons = "FLEET_WEAPONS",
    FleetSubmodels = "FLEET_SUBMODELS",
    StoreFrontShoppingCart = "STORE_FRONT_SHOPPING_CART",
    StoreFrontCrates = "STORE_FRONT_CRATES",
    StoreFrontAbilities = "STORE_FRONT_ABILITIES",
    StoreFrontPackages = "STORE_FRONT_PACKAGES",
    MarketplaceSell = "MARKETPLACE_SELL",
    MarketplaceItemMechs = "MARKETPLACE_ITEM_MECHS",
    MarketplaceItemWeapons = "MARKETPLACE_ITEM_WEAPONS",
    MarketplaceItemKeycards = "MARKETPLACE_ITEM_KEYCARDS",
    MarketplaceItemCrates = "MARKETPLACE_ITEM_CRATES",
    MarketplaceHistory = "MARKETPLACE_HISTORY",
    MarketplaceMechs = "MARKETPLACE_MECHS",
    MarketplaceWeapons = "MARKETPLACE_WEAPONS",
    MarketplaceKeycards = "MARKETPLACE_KEYCARDS",
    MarketplaceCrates = "MARKETPLACE_CRATES",
    Profile = "PROFILE",
    BillingHistory = "BILLING_HISTORY",
    BillingHistoryItem = "BILLING_HISTORY_ITEM",
    ReplayItem = "REPLAY_ITEM",
    Replays = "REPLAYS",
    AdminLookup = "ADMIN_LOOKUP",
    AdminDangerZone = "ADMIN_DANGER_ZONE",
    AdminPlayerLookup = "ADMIN_PLAYER_LOOKUP",
    Claim = "CLAIM",
    NotFound = "NOT_FOUND",
    FactionPassBuy = "FACTION_PASS_BUY",
    FactionPassMechPool = "FACTION_PASS_MECH_POOL",
    FactionPassDashboard = "FACTION_PASS_DASHBOARD",
}

export enum RouteGroupID {
    BattleArena = "BATTLE_ARENA",
    Armoury = "ARMOURY",
    Inventory = "INVENTORY",
    Store = "STORE",
    Marketplace = "MARKETPLACE",
    FactionHQ = "FACTION_HQ",
}

export interface MainMenuStruct {
    groupID: RouteGroupID
    label: string
    image: string
    path: string
    target?: string
}

export interface RouteSingle {
    id: RouteSingleID
    path: string
    exact: boolean
    Component?: () => JSX.Element | null
    restrictions?: {
        requireAuth: boolean
        requireFaction: boolean
        requireModerator: boolean
        authTitle?: string // If omitted, it'll have a default title
        authDescription?: string // If omitted, it'll have a default description
    }
    showInMainMenu?: MainMenuStruct
    enable: boolean
    tabTitle: string // Sets the tab title etc. with react helmet
}

export interface RouteGroup {
    id: RouteGroupID
    label: string
}

export const RouteGroups: RouteGroup[] = [
    {
        id: RouteGroupID.BattleArena,
        label: "Battle Arena",
    },
    {
        id: RouteGroupID.Armoury,
        label: "Armoury",
    },
    {
        id: RouteGroupID.Inventory,
        label: "Inventory",
    },
    {
        id: RouteGroupID.Store,
        label: "Store",
    },
    {
        id: RouteGroupID.Marketplace,
        label: "Marketplace",
    },
    {
        id: RouteGroupID.FactionHQ,
        label: "Faction HQ",
    },
]

export const Routes: RouteSingle[] = [
    // ********************
    // *** Battle Arena ***
    // ********************
    {
        id: RouteSingleID.Home,
        path: "/",
        exact: true,
        Component: BattleArena,
        restrictions: {
            requireAuth: false,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.BattleArena,
            label: "Battle Arena",
            image: BattleArenaPNG,
            path: "/",
        },
        enable: true,
        tabTitle: "Battle Arena",
    },
    {
        id: RouteSingleID.Lobbies,
        path: "/lobbies",
        exact: true,
        Component: Lobbies,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.BattleArena,
            label: "Lobbies",
            image: GenericPNG,
            path: "/lobbies",
        },
        enable: true,
        tabTitle: "Lobbies",
    },
    {
        id: RouteSingleID.Tutorial,
        path: "/tutorial",
        exact: true,
        Component: TutorialPage,
        restrictions: {
            requireAuth: false,
            requireFaction: false,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.BattleArena,
            label: "Tutorial",
            image: TutorialPNG,
            path: "/tutorial",
        },
        enable: true,
        tabTitle: "Tutorial",
    },

    // *******************
    // *** Leaderboard ***
    // *******************
    {
        id: RouteSingleID.Leaderboard,
        path: "/leaderboard",
        exact: true,
        Component: GlobalStats,
        restrictions: {
            requireAuth: false,
            requireFaction: false,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.BattleArena,
            label: "Leaderboard",
            image: GenericPNG,
            path: "/leaderboard",
        },
        enable: true,
        tabTitle: "Leaderboard",
    },

    // ********************
    // *** Public Asset ***
    // ********************
    {
        id: RouteSingleID.Mech,
        path: "/mech/:mechID?",
        exact: true,
        Component: MechPage,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        enable: true,
        tabTitle: "Mech",
    },
    {
        id: RouteSingleID.Weapon,
        path: "/weapon/:weaponID?",
        exact: true,
        Component: WeaponHangarDetails,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        enable: true,
        tabTitle: "Weapon",
    },
    {
        id: RouteSingleID.Profile,
        path: "/profile/:playerGID",
        exact: true,
        Component: PublicProfile,
        restrictions: {
            requireAuth: false,
            requireFaction: false,
            requireModerator: false,
        },
        enable: true,
        tabTitle: "Player Profile",
    },

    // *************
    // *** Fleet ***
    // *************
    {
        id: RouteSingleID.FleetMechs,
        path: "/fleet/mechs",
        exact: true,
        Component: FleetMechs,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.Inventory,
            label: "Mechs",
            image: MechsPNG,
            path: "/fleet/mechs",
        },
        enable: true,
        tabTitle: "Fleet - Mechs",
    },
    {
        id: RouteSingleID.FleetWeapons,
        path: "/fleet/weapons",
        exact: true,
        Component: FleetWeapons,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.Inventory,
            label: "Weapons",
            image: GenericPNG,
            path: "/fleet/weapons",
        },
        enable: true,
        tabTitle: "Fleet - Weapons",
    },
    {
        id: RouteSingleID.FleetSubmodels,
        path: "/fleet/submodels",
        exact: true,
        Component: SubmodelsHangar,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.Inventory,
            label: "Submodels",
            image: GenericPNG,
            path: "/fleet/submodels",
        },
        enable: DEV_ONLY,
        tabTitle: "Fleet - Submodels",
    },
    {
        id: RouteSingleID.FleetCrates,
        path: "/fleet/mystery-crates",
        exact: true,
        Component: FleetCrates,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.Inventory,
            label: "Crates",
            image: GenericPNG,
            path: "/fleet/mystery-crates",
        },
        enable: true,
        tabTitle: "Fleet - Mystery Crates",
    },
    {
        id: RouteSingleID.FleetAbilities,
        path: "/fleet/abilities",
        exact: true,
        Component: FleetPlayerAbility,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.Inventory,
            label: "Abilities",
            image: GenericPNG,
            path: "/fleet/abilities",
        },
        enable: true,
        tabTitle: "Fleet - Abilities",
    },
    {
        id: RouteSingleID.FleetKeycards,
        path: "/fleet/keycards",
        exact: true,
        Component: FleetKeycards,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.Inventory,
            label: "Keycards",
            image: GenericPNG,
            path: "/fleet/keycards",
        },
        enable: true,
        tabTitle: "Fleet - Keycards",
    },

    // ******************
    // *** Storefront ***
    // ******************
    {
        id: RouteSingleID.StoreFrontShoppingCart,
        path: "/storefront/shopping-cart",
        exact: true,
        Component: StorefrontShoppingCartPage,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        enable: !IS_TESTING_MODE,
        tabTitle: "Shopping Cart",
    },
    {
        id: RouteSingleID.StoreFrontCrates,
        path: "/storefront/mystery-crates",
        exact: true,
        Component: MysteryCratesStore,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.Store,
            label: "Mystery Crates",
            image: GenericPNG,
            path: "/storefront/mystery-crates",
        },
        enable: true,
        tabTitle: "Storefront - Mystery Crates",
    },
    {
        id: RouteSingleID.StoreFrontAbilities,
        path: "/storefront/abilities",
        exact: true,
        Component: PlayerAbilitiesStore,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.Store,
            label: "Abilities",
            image: GenericPNG,
            path: "/storefront/abilities",
        },
        enable: true,
        tabTitle: "Storefront - Abilities",
    },
    {
        id: RouteSingleID.StoreFrontPackages,
        path: "/storefront/packages",
        exact: true,
        Component: PackagesStore,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.Store,
            label: "Packages",
            image: GenericPNG,
            path: "/storefront/packages",
        },
        enable: true,
        tabTitle: "Storefront - Packages",
    },

    // *******************
    // *** Marketplace ***
    // *******************
    {
        id: RouteSingleID.MarketplaceSell,
        path: "/marketplace/sell",
        exact: true,
        Component: MarketplaceSellPage,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        enable: !IS_TESTING_MODE,
        tabTitle: "Sell Item",
    },
    {
        id: RouteSingleID.MarketplaceItemMechs,
        path: "/marketplace/mechs/:id",
        exact: true,
        Component: WarMachineMarketDetails,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        enable: !IS_TESTING_MODE,
        tabTitle: "Marketplace Mech Item",
    },
    {
        id: RouteSingleID.MarketplaceItemWeapons,
        path: "/marketplace/weapons/:id",
        exact: true,
        Component: WeaponMarketDetails,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        enable: !IS_TESTING_MODE,
        tabTitle: "Marketplace Weapon Item",
    },
    {
        id: RouteSingleID.MarketplaceItemKeycards,
        path: "/marketplace/keycards/:id",
        exact: true,
        Component: KeycardMarketDetails,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        enable: !IS_TESTING_MODE,
        tabTitle: "Marketplace Keycard Item",
    },
    {
        id: RouteSingleID.MarketplaceItemCrates,
        path: "/marketplace/mystery-crates/:id",
        exact: true,
        Component: MysteryCrateMarketDetails,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        enable: !IS_TESTING_MODE,
        tabTitle: "Marketplace Mystery Crate Item",
    },
    {
        id: RouteSingleID.MarketplaceHistory,
        path: "/marketplace/history",
        exact: true,
        Component: HistoryMarket,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.Marketplace,
            label: "History",
            image: GenericPNG,
            path: "/marketplace/history",
        },
        enable: !IS_TESTING_MODE,
        tabTitle: "Marketplace - History",
    },
    {
        id: RouteSingleID.MarketplaceMechs,
        path: "/marketplace/mechs",
        exact: true,
        Component: WarMachinesMarket,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.Marketplace,
            label: "Mechs",
            image: GenericPNG,
            path: "/marketplace/mechs",
        },
        enable: !IS_TESTING_MODE,
        tabTitle: "Marketplace - Mechs",
    },
    {
        id: RouteSingleID.MarketplaceWeapons,
        path: "/marketplace/weapons",
        exact: true,
        Component: WeaponsMarket,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.Marketplace,
            label: "Weapons",
            image: GenericPNG,
            path: "/marketplace/weapons",
        },
        enable: !IS_TESTING_MODE,
        tabTitle: "Marketplace - Weapons",
    },
    {
        id: RouteSingleID.MarketplaceKeycards,
        path: "/marketplace/keycards",
        exact: true,
        Component: KeycardsMarket,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.Marketplace,
            label: "Keycards",
            image: GenericPNG,
            path: "/marketplace/keycards",
        },
        enable: !IS_TESTING_MODE,
        tabTitle: "Marketplace - Keycards",
    },
    {
        id: RouteSingleID.MarketplaceCrates,
        path: "/marketplace/mystery-crates",
        exact: true,
        Component: MysteryCratesMarket,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.Marketplace,
            label: "Mystery Crates",
            image: GenericPNG,
            path: "/marketplace/mystery-crates",
        },
        enable: !IS_TESTING_MODE,
        tabTitle: "Marketplace - Mystery Crates",
    },

    // ****************
    // *** Billings ***
    // ****************
    {
        id: RouteSingleID.BillingHistoryItem,
        path: "/billing-history/:id",
        exact: true,
        Component: BillingHistorySingle,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        enable: true,
        tabTitle: "Billing History Item",
    },
    {
        id: RouteSingleID.BillingHistory,
        path: "/billing-history",
        exact: true,
        Component: BillingHistory,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        enable: true,
        tabTitle: "Billing History",
    },

    // ***************
    // *** Replays ***
    // ***************
    {
        id: RouteSingleID.ReplayItem,
        path: "/replay",
        exact: true,
        Component: ReplayItemPage,
        restrictions: {
            requireAuth: false,
            requireFaction: false,
            requireModerator: false,
        },
        enable: true,
        tabTitle: "Replay Item",
    },
    {
        id: RouteSingleID.Replays,
        path: "/replays",
        exact: true,
        Component: BattlesReplays,
        restrictions: {
            requireAuth: false,
            requireFaction: false,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.BattleArena,
            label: "Replays",
            image: GenericPNG,
            path: "/replays",
        },
        enable: true,
        tabTitle: "Replays",
    },

    // *************
    // *** Admin ***
    // *************
    {
        id: RouteSingleID.AdminPlayerLookup,
        path: "/admin/lookup/:playerGID",
        exact: true,
        Component: AdminLookupResultPage,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: true,
        },
        enable: true,
        tabTitle: "Admin - Player",
    },
    {
        id: RouteSingleID.AdminLookup,
        path: "/admin/lookup",
        exact: true,
        Component: AdminLookup,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: true,
        },
        enable: true,
        tabTitle: "Admin - Lookup",
    },
    {
        id: RouteSingleID.AdminDangerZone,
        path: "/admin/dangerzone",
        exact: true,
        Component: DangerZone,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: true,
        },
        enable: true,
        tabTitle: "Admin - Danger Zone",
    },

    // *************
    // *** Claim ***
    // *************
    {
        id: RouteSingleID.Claim,
        path: "/claim",
        exact: true,
        Component: Claims,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
            authTitle: "Connect to XSYN to Claim Your Rewards",
            authDescription:
                "You will receive assets that are of Supremacy's next generation collection: Supremacy Nexus, which will allow you to equip your war machines to defeat your enemies in the battle arena.",
        },
        showInMainMenu: {
            groupID: RouteGroupID.Store,
            label: "Claims",
            image: GenericPNG,
            path: "/claim",
        },
        enable: true,
        tabTitle: "Claim Rewards",
    },

    // ********************
    // *** Faction Pass ***
    // ********************
    {
        id: RouteSingleID.FactionPassBuy,
        path: "/faction-pass/buy",
        exact: true,
        Component: FactionPassBuy,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        enable: DEV_ONLY,
        tabTitle: "Buy Faction Pass",
    },
    {
        id: RouteSingleID.FactionPassDashboard,
        path: "/faction-pass/dashboard",
        exact: true,
        Component: FactionPassDashboard,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.FactionHQ,
            label: "Dashboard",
            image: GenericPNG,
            path: "/faction-pass/dashboard",
        },
        enable: DEV_ONLY,
        tabTitle: "Faction Dashboard",
    },
    {
        id: RouteSingleID.FactionPassMechPool,
        path: "/faction-pass/mech-pool",
        exact: true,
        Component: FactionPassMechPool,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.FactionHQ,
            label: "Mech Pool",
            image: GenericPNG,
            path: "/faction-pass/mech-pool",
        },
        enable: DEV_ONLY,
        tabTitle: "Faction Mech Pool",
    },

    // ***********
    // *** 404 ***
    // ***********
    {
        id: RouteSingleID.NotFound,
        path: "/404",
        exact: false,
        Component: NotFoundPage,
        restrictions: {
            requireAuth: false,
            requireFaction: false,
            requireModerator: false,
        },
        enable: true,
        tabTitle: "404",
    },
]

export const MainMenuExternalLinks: MainMenuStruct[] = [
    {
        groupID: RouteGroupID.Armoury,
        label: "Hangar",
        image: HangarPNG,
        path: HANGAR_PAGE,
        target: "_blank",
    },
]
