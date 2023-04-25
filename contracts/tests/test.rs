use gstd::ActorId;
use gtest::{Program, System};
use tequila_io::*;

#[test]
fn test() {
    let system = System::new();

    system.init_logger();

    let program = Program::current(&system);

    let result = program.send(2, 0);
    assert!(!result.main_failed());

    let result = program.send(
        2,
        Command::Register {
            player: ActorId::zero(),
            name: "A".to_owned(),
        },
    );
    assert!(!result.main_failed());

    let result = program.send(
        2,
        Command::Register {
            player: ActorId::zero(),
            name: "B".to_owned(),
        },
    );
    assert!(!result.main_failed());

    let result = program.send(2, Command::StartGame);
    assert!(!result.main_failed());

    let state: GameLauncher = program
        .read_state()
        .expect("Unexpected invalid game state.");
    assert_eq!(
        state
            .game_state
            .expect("Invalid game state. Game is not initialized.")
            .players,
        vec![
            (ActorId::zero(), "A".to_owned()),
            (ActorId::zero(), "B".to_owned())
        ]
    );

    let result = program.send(2, Command::RestartGame(None));
    assert!(!result.main_failed());

    let result = program.send(
        2,
        Command::Register {
            player: ActorId::zero(),
            name: "C".to_owned(),
        },
    );
    assert!(!result.main_failed());

    let result = program.send(
        2,
        Command::Register {
            player: ActorId::zero(),
            name: "D".to_owned(),
        },
    );
    assert!(!result.main_failed());

    let result = program.send(2, Command::StartGame);
    assert!(!result.main_failed());

    let state: GameLauncher = program
        .read_state()
        .expect("Unexpected invalid game state.");
    assert_eq!(
        state
            .game_state
            .expect("Invalid game state. Game is not initialized.")
            .players,
        vec![
            (ActorId::zero(), "C".to_owned()),
            (ActorId::zero(), "D".to_owned())
        ]
    );
}
