export enum CompletedTraining {
    BattleAbility = "battleAbility",
    MechAbility = "mechAbility",
    PlayerAbility = "playerAbility",
}
export enum TrainingLobby {
    All = "All",
    BattleAbility = "BattleAbility",
    MechAbility = "MechAbility",
    PlayerAbility = "PlayerAbility",
    Intro = "Intro",
    FactionIntro = "FactionIntro",
    FactionEnlist = "FactionEnlist",
    Signup = "Signup",
}

export enum BattleAbilityStages {
    NullBA = "NullBA",
    ExplainBA = "ExplainBA",
    OptIn = "OptIn",
    OptedIn = "OptedIn",
    LocationSelectBA = "LocationSelectBA",
    LocationExplainBA = "LocationExplainBA",
    LocationActionBA = "LocationActionBA",
    ShowAbilityBA = "ShowAbilityBA",
}

export enum BattleAbilityHighlight {
    ExplainBA = BattleAbilityStages.ExplainBA,
    OptIn = BattleAbilityStages.OptIn,
}

export enum MechAbilityStages {
    NullMA = "NullMA",
    ExplainMA = "ExplainMA", // Explain Mech Avatar
    ExpandMA = "ExpandMA", // Explain skills
    RepairMA = "RepairMA",
    MapMA = "MapMA",
    MoveMA = "MoveMA",
    MoveActionMA = "MoveActionMA",
    OverchargeMA = "OverchargeMA",
    OverchargeActionMA = "OverchargeActionMA",
}

export enum MechAbilitiesHighlight {
    MapMA = MechAbilityStages.MapMA,
    OverchargeMA = MechAbilityStages.OverchargeMA,
}

export enum PlayerAbilityStages {
    NullPA = "NullPA",
    ExplainPA = "ExplainPA", // Overview of player ability store popup
    SalePeriodPA = "SalePeriodPA", // Explain sale period
    ClaimPA = "ClaimPA",
    ShowPurchasePA = "ShowPurchasePA",
    UseAbilityPA = "UseAbilityPA",
    LocationSelectPA = "LocationSelectPA",
    LocationExplainPA = "LocationExplainPA",
    LocationActionPA = "LocationActionPA",
    ShowAbilityPA = "ShowAbilityPA",
}

export enum PlayerAbilityPrePurchase {
    NullPA = PlayerAbilityStages.NullPA,
    ExplainPA = PlayerAbilityStages.ExplainPA, // Overview of player ability store popup
    SalePeriodPA = PlayerAbilityStages.SalePeriodPA, // Explain sale period
    ClaimPA = PlayerAbilityStages.ClaimPA,
    PlayerAbility = TrainingLobby.PlayerAbility,
}

export enum TrainingLocationSelects {
    LocationSelectBA = BattleAbilityStages.LocationSelectBA,
    LocationExplainBA = BattleAbilityStages.LocationExplainBA,
    LocationActionBA = BattleAbilityStages.LocationActionBA,
    LocationSelectPA = PlayerAbilityStages.LocationSelectPA,
    LocationExplainPA = PlayerAbilityStages.LocationExplainPA,
    LocationActionPA = PlayerAbilityStages.LocationActionPA,
    MapMA = MechAbilityStages.MapMA,
    MoveMA = MechAbilityStages.MoveMA,
    MoveActionMA = MechAbilityStages.MoveActionMA,
    OverchargeMA = MechAbilityStages.OverchargeMA,
}

export enum TrainingVotingSystem {
    ExplainBA = BattleAbilityStages.ExplainBA,
    OptIn = BattleAbilityStages.OptIn,
    OptedIn = BattleAbilityStages.OptedIn,
    UseAbilityPA = PlayerAbilityStages.UseAbilityPA,
    ExplainPA = PlayerAbilityStages.ExplainPA,
    PlayerAbility = TrainingLobby.PlayerAbility,
}

export type TrainingStages = TrainingLobby | BattleAbilityStages | TrainingLocationSelects | MechAbilityStages | PlayerAbilityStages

export interface Context {
    videoSource: string
    text: string
    showNext: boolean
    state: PlayerAbilityStages | MechAbilityStages | BattleAbilityStages
}

export enum TrainingAbility {
    Battle = "battle",
    Player = "player",
    Mech = "mech",
}
