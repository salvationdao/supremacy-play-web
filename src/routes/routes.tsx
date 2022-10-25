import { DangerZone } from "../components/Admin/Dangerzone/DangerZone"
import { AdminLookup } from "../components/Admin/Lookup/AdminLookup"
import { AdminLookupResultPage } from "../components/Admin/Lookup/AdminLookupResultPage"
import { BillingHistorySingle } from "../components/BillingHistory/BillingHistorySingle"
import { BillingHistory } from "../components/BillingHistory/BillingHistory"
import { Claims } from "../components/Claims/Claims"
import { KeycardsHangar } from "../components/Hangar/KeycardsHangar/KeycardsHangar"
import { MysteryCratesHangar } from "../components/Hangar/MysteryCratesHangar/MysteryCratesHangar"
import { PlayerAbilitiesHangar } from "../components/Hangar/PlayerAbilitiesHangar/PlayerAbilitiesHangar"
import { SubmodelsHangar } from "../components/Hangar/SubmodelHangar/SubmodelsHangar"
import { WarMachinesHangar } from "../components/Hangar/WarMachinesHangar/WarMachinesHangar"
import { WeaponsHangar } from "../components/Hangar/WeaponsHangar/WeaponsHangar"
import { GlobalStats } from "../components/Leaderboard/GlobalStats/GlobalStats"
import { HistoryMarket } from "../components/Marketplace/HistoryMarket/HistoryMarket"
import { KeycardMarketDetails } from "../components/Marketplace/KeycardsMarket/KeycardMarketDetails/KeycardMarketDetails"
import { KeycardsMarket } from "../components/Marketplace/KeycardsMarket/KeycardsMarket"
import { MysteryCrateMarketDetails } from "../components/Marketplace/MysteryCratesMarket/MysteryCrateMarketDetails/MysteryCrateMarketDetails"
import { MysteryCratesMarket } from "../components/Marketplace/MysteryCratesMarket/MysteryCratesMarket"
import { WarMachineMarketDetails } from "../components/Marketplace/WarMachinesMarket/WarMachineMarketDetails/WarMachineMarketDetails"
import { WarMachinesMarket } from "../components/Marketplace/WarMachinesMarket/WarMachinesMarket"
import { WeaponMarketDetails } from "../components/Marketplace/WeaponsMarket/WeaponMarketDetails/WeaponMarketDetails"
import { WeaponsMarket } from "../components/Marketplace/WeaponsMarket/WeaponsMarket"
import { PlayerProfilePage } from "../components/PublicProfile/PlayerProfile"
import { BattlesReplays } from "../components/Replays/BattlesReplays/BattlesReplays"
import { MysteryCratesStore } from "../components/Storefront/MysteryCratesStore/MysteryCratesStore"
import { PackagesStore } from "../components/Storefront/PackagesStore/PackagesStore"
import { PlayerAbilitiesStore } from "../components/Storefront/PlayerAbilitiesStore/PlayerAbilitiesStore"
import { DEV_ONLY, IS_TESTING_MODE } from "../constants"
import { MarketplaceSellPage } from "../components/Marketplace/SellItem/MarketplaceSellPage"
import { MechPage } from "../components/Hangar/WarMachinesHangar/WarMachineDetails/MechPage"
import { ReplayItemPage } from "../components/Replays/ReplayDetails/ReplayItemPage"
import { StorefrontShoppingCartPage } from "../components/Storefront/StorefrontShoppingCartPage"
import { BattleArena } from "../components/BattleArena/BattleArena"
import { NotFoundPage } from "../components/NotFoundPage/NotFoundPage"
import { TutorialPage } from "../components/Tutorial/TutorialPage"
import { WeaponHangarDetails } from "../components/Hangar/WeaponsHangar/WeaponDetails/WeaponHangarDetails"

export enum RouteSingleID {
    Home = "HOME",
    Tutorial = "TUTORIAL",
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
}

export enum RouteGroupID {
    BattleArena = "BATTLE_ARENA",
    Armoury = "ARMOURY",
    Inventory = "INVENTORY",
    Store = "STORE",
    Marketplace = "MARKETPLACE",
    FactionHQ = "FACTION_HQ",
}

interface RouteSingle {
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
    showInMainMenu?: {
        groupID: RouteGroupID
        label: string
    }
    enable: boolean
    tabTitle: string // Sets the tab title etc. with react helmet
}

interface RouteGroup {
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
        },
        enable: true,
        tabTitle: "Battle Arena",
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
        Component: PlayerProfilePage,
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
        Component: WarMachinesHangar,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.Inventory,
            label: "Mechs",
        },
        enable: true,
        tabTitle: "Fleet - Mechs",
    },
    {
        id: RouteSingleID.FleetWeapons,
        path: "/fleet/weapons",
        exact: true,
        Component: WeaponsHangar,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.Inventory,
            label: "Weapons",
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
        },
        enable: DEV_ONLY,
        tabTitle: "Fleet - Submodels",
    },
    {
        id: RouteSingleID.FleetCrates,
        path: "/fleet/mystery-crates",
        exact: true,
        Component: MysteryCratesHangar,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.Inventory,
            label: "Mystery Crates",
        },
        enable: true,
        tabTitle: "Fleet - Mystery Crates",
    },
    {
        id: RouteSingleID.FleetAbilities,
        path: "/fleet/abilities",
        exact: true,
        Component: PlayerAbilitiesHangar,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.Inventory,
            label: "Abilities",
        },
        enable: true,
        tabTitle: "Fleet - Abilities",
    },
    {
        id: RouteSingleID.FleetKeycards,
        path: "/fleet/keycards",
        exact: true,
        Component: KeycardsHangar,
        restrictions: {
            requireAuth: true,
            requireFaction: true,
            requireModerator: false,
        },
        showInMainMenu: {
            groupID: RouteGroupID.Inventory,
            label: "Keycards",
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
        },
        enable: !IS_TESTING_MODE,
        tabTitle: "Marketplace - Mystery Crates",
    },

    // ***************
    // *** Replays ***
    // ***************
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
            groupID: RouteGroupID.Inventory,
            label: "Claims",
        },
        enable: true,
        tabTitle: "Claim Rewards",
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
