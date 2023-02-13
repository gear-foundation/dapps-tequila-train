#![no_std]

use gmeta::{InOut, Metadata};
use gstd::{prelude::*, ActorId};

#[derive(Encode, Decode, TypeInfo, Hash, PartialEq, PartialOrd, Eq, Ord, Clone, Copy, Debug)]
pub enum PingPong {
    Ping,
    Pong,
}

pub struct ContractMetadata;

impl Metadata for ContractMetadata {
    type Init = ();
    type Handle = InOut<PingPong, PingPong>;
    type Others = ();
    type Reply = ();
    type Signal = ();
    type State = State;
}

#[derive(Encode, Decode, TypeInfo, Hash, PartialEq, PartialOrd, Eq, Ord, Clone, Debug, Default)]
pub struct State(pub Vec<(ActorId, u128)>);

#[doc(hidden)]
impl State {
    pub fn pingers(self) -> Vec<ActorId> {
        self.0.into_iter().map(|pingers| pingers.0).collect()
    }

    pub fn ping_count(self, actor: ActorId) -> u128 {
        self.0
            .into_iter()
            .find_map(|(pinger, ping_count)| (pinger == actor).then_some(ping_count))
            .unwrap_or_default()
    }
}

#[derive(Encode, Decode, TypeInfo, Hash, PartialEq, PartialOrd, Eq, Ord, Clone, Copy, Debug)]
pub enum StateQuery {
    AllState,
    Pingers,
    PingCount(ActorId),
}

#[derive(Encode, Decode, TypeInfo, Hash, PartialEq, PartialOrd, Eq, Ord, Clone, Debug)]
pub enum StateQueryReply {
    AllState(<ContractMetadata as Metadata>::State),
    Pingers(Vec<ActorId>),
    PingCount(u128),
}

#[derive(Debug, Clone, Copy, Ord, PartialOrd, Eq, PartialEq, enum_iterator::Sequence)]
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

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct Tile {
    first: Face,
    second: Face,
}

impl Tile {
    pub fn new(first: Face, second: Face) -> Self {
        Self {
            first,
            second,
        }
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
        .map(|(i, face_first)| {
            enum_iterator::all::<Face>()
                .skip(i)
                .map(move |face_second| {
                    Tile::new(face_first, face_second)
                })
        })
        .flatten()
        .collect()
}
