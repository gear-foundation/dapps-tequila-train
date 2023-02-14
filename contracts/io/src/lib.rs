#![no_std]

use gmeta::{In, Metadata};
use gstd::{prelude::*, ActorId};

pub struct ContractMetadata;

impl Metadata for ContractMetadata {
    type Init = In<Vec<ActorId>>;
    type Handle = In<Command>;
    type Others = ();
    type Reply = ();
    type Signal = ();
    type State = GameState;
}

#[derive(Encode, Decode, TypeInfo, Hash, PartialEq, PartialOrd, Eq, Ord, Clone, Debug, Default)]
pub struct State(pub Vec<(ActorId, u128)>);

#[derive(
    Debug,
    Clone,
    Copy,
    Ord,
    PartialOrd,
    Eq,
    PartialEq,
    enum_iterator::Sequence,
    TypeInfo,
    Encode,
    Decode,
)]
pub enum Face {
    Zero,
    One,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Eleven,
    Twelve,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq, TypeInfo, Encode, Decode)]
pub struct Tile {
    first: Face,
    second: Face,
}

impl Tile {
    pub fn new(first: Face, second: Face) -> Self {
        Self { first, second }
    }

    pub fn is_double(&self) -> bool {
        self.first == self.second
    }

    pub fn can_be_stacked(&self, face: Face) -> Option<Face> {
        if self.first == face {
            return Some(self.second);
        }

        (self.second == face).then_some(self.first)
    }
}

pub fn build_tile_collection() -> Vec<Tile> {
    enum_iterator::all::<Face>()
        .enumerate()
        .flat_map(|(i, face_first)| {
            enum_iterator::all::<Face>()
                .skip(i)
                .map(move |face_second| Tile::new(face_first, face_second))
        })
        .collect()
}

#[derive(Encode, Decode, TypeInfo, Hash, PartialEq, PartialOrd, Eq, Ord, Clone, Debug)]
pub struct Players {
    _first: ActorId,
    _second: ActorId,
    _others: Vec<ActorId>,
}

#[derive(Encode, Decode, TypeInfo, Hash, PartialEq, PartialOrd, Eq, Ord, Clone, Copy, Debug)]
pub enum Command {
    Skip,
    Place { tile_id: u32, track_id: u32 },
}

#[derive(Debug, TypeInfo, Encode, Decode)]
pub struct TrackData {
    tiles: Vec<Tile>,
    last_face: Face,
}

impl TrackData {
    pub fn new(last_face: Face) -> Self {
        Self {
            tiles: vec![],
            last_face,
        }
    }

    pub fn put_tile(&mut self, tile: Tile) -> bool {
        match tile.can_be_stacked(self.last_face) {
            None => false,
            Some(new_last_face) => {
                self.last_face = new_last_face;
                self.tiles.push(tile);

                true
            }
        }
    }
}

#[derive(Debug, TypeInfo, Encode, Decode)]
pub struct GameState {
    players: Vec<ActorId>,
    tracks: Vec<(TrackData, bool)>,
    _start_tile: u32,
    current_player: u32,
    tile_to_player: BTreeMap<u32, u32>,
    tiles: Vec<Tile>,
    winner: Option<ActorId>,
}

impl GameState {
    pub fn winner(&self) -> Option<ActorId> {
        self.winner
    }

    pub fn skip_turn(&mut self, player: ActorId) {
        let i = self.current_player as usize;
        if self.players[i] != player {
            unreachable!("it is not your turn");
        }

        self.tracks[i].1 = true;

        self.post_actions();
    }

    fn post_actions(&mut self) {
        let i = self.current_player;
        self.current_player = match i + 1 >= self.players.len() as u32 {
            true => 0,
            false => (i + 1) as u32,
        };

        todo!()
    }

    pub fn make_turn(&mut self, player: ActorId, tile_id: u32, track_id: u32) {
        let i = self.current_player as usize;
        if self.players[i] != player {
            unreachable!("it is not your turn");
        }

        // check player owns the tile
        match self.tile_to_player.get(&tile_id) {
            None => unreachable!("invalid tile id"),
            Some(user_id) if *user_id != self.current_player => unreachable!("wrong tile owner"),
            _ => (),
        }

        // check tile can be put on the track
        if track_id != self.current_player
            && self
                .tracks
                .get(track_id as usize)
                .map_or(false, |(_data, has_train)| *has_train)
        {
            unreachable!("invalid track");
        }

        let tile = self.tiles[tile_id as usize];
        if !self.tracks[i].0.put_tile(tile) {
            unreachable!("invalid tile");
        }

        // remove train
        if track_id == self.current_player {
            self.tracks[i].1 = false;
        }

        // remove tile from player's set
        self.tile_to_player.remove(&tile_id);

        self.post_actions();
    }
}
