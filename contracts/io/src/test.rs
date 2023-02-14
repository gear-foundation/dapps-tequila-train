use super::*;

#[test]
fn test_tiles_per_person() {
    assert_eq!(tiles_per_person(2), 8);
    assert_eq!(tiles_per_person(3), 8);
    assert_eq!(tiles_per_person(4), 8);
    assert_eq!(tiles_per_person(5), 7);
    assert_eq!(tiles_per_person(6), 6);
    assert_eq!(tiles_per_person(7), 5);
    assert_eq!(tiles_per_person(8), 4);
}

#[test]
fn test_is_double_tile_bigger() {
    let tiles = vec![
        Tile::new(Face::One, Face::Two),
        Tile::new(Face::Three, Face::Three),
        Tile::new(Face::Five, Face::Five),
        Tile::new(Face::Ten, Face::Eleven),
    ];

    assert_eq!(is_double_tile_bigger(1, Some((2, 0)), &tiles), false);

    assert_eq!(is_double_tile_bigger(3, Some((2, 0)), &tiles), false);

    assert_eq!(is_double_tile_bigger(1, None, &tiles), true);
}

#[test]
fn test_swap_tile() {
    let tile = Tile::new(Face::One, Face::Two);
    let swapped_tile = tile.swap();
    assert_eq!(swapped_tile.left, Face::Two);
    assert_eq!(swapped_tile.right, Face::One);
}

#[test]
fn test_is_double() {
    let tile = Tile::new(Face::One, Face::Two);
    assert_eq!(tile.is_double(), false);

    let double_tile = Tile::new(Face::Two, Face::Two);
    assert_eq!(double_tile.is_double(), true);
}

#[test]
fn test_can_adjoin() {
    let tile = Tile::new(Face::One, Face::Two);
    let other_tile = Tile::new(Face::Two, Face::Three);
    assert_eq!(tile.can_adjoin(&other_tile), true);

    let non_adjoining_tile = Tile::new(Face::Three, Face::Four);
    assert_eq!(tile.can_adjoin(&non_adjoining_tile), false);
}

#[test]
fn test_build_tile_collection() {
    let tiles = build_tile_collection();
    assert_eq!(tiles.len(), 91);

    let mut set = BTreeSet::new();
    for tile in tiles {
        assert!(set.insert(tile));
    }
}

#[test]
fn test_give_tiles_until_double() {
    let players_amount = 3;
    let mut remaining_tiles = BTreeSet::new();

    let tiles = vec![
        Tile::new(Face::Zero, Face::One),
        Tile::new(Face::Two, Face::Two),
        Tile::new(Face::Three, Face::Zero),
        Tile::new(Face::Two, Face::Three),
        Tile::new(Face::One, Face::Four),
        Tile::new(Face::Five, Face::Six),
        Tile::new(Face::Seven, Face::Seven),
    ];

    for i in 0..tiles.len() {
        remaining_tiles.insert(i as u32);
    }

    let mut tile_to_player = BTreeMap::new();

    let matching_tile_id = give_tiles_until_double(
        &mut remaining_tiles,
        &tiles,
        &mut tile_to_player,
        &players,
    );

    // Verify that everyone has one tile
    assert_eq!(tile_to_player.len(), players.len());
    for player_id in 0..players.len() {
        assert!(tile_to_player.values().any(|&id| id == (player_id as u32)));
    }

    if let Some((tile_id, _)) = matching_tile_id {
        // If matching tile was found, verify that it is indeed a double tile
        let matching_tile = &tiles[tile_id as usize];
        assert!(matching_tile.is_double());
    } else {
        // If no matching tile was found, verify that all tiles were dealt
        assert_eq!(remaining_tiles.len(), 0);
    }
}
