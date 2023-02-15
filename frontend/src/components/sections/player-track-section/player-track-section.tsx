import { Icon } from '../../ui/icon';
import clsx from 'clsx';
import { getBgColors, isPartialSubset } from 'app/utils';
import { DominoItem } from '../../common/domino-item';
import { DominoZone } from '../../common/domino-zone';
import { DominoTileType } from 'app/types/game';
import { useEffect, useState } from 'react';
import { useApp, useGame } from '../../../app/context';
import { PlayerTrain } from '../../common/player-train';
import { useAccount } from '@gear-js/react-hooks';

const players = ['Rojo', 'Oscuro', 'Naranja', 'Amarillo', 'Gris', 'Verde', 'Azul', 'Morado'];

type Props = {
  index: number;
  train?: boolean;
  isUserTrain?: boolean;
  active?: boolean;
  tiles?: DominoTileType[];
};
export const PlayerTrackSection = ({ index, train, isUserTrain, active, tiles }: Props) => {
  const { account } = useAccount();
  const { isAllowed } = useApp();
  const { gameWasm: wasm, playerChoice } = useGame();
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (wasm?.players[index] === account?.decodedAddress) {
      console.log({ isDisabled, user: wasm?.players[index] === account?.decodedAddress });
    }
  }, [account?.decodedAddress, isDisabled, wasm?.players]);

  const checkIsActiveDominoReverse = () => {
    if (playerChoice?.tile && tiles && wasm) {
      const lastTile = tiles.length > 0 ? tiles[tiles.length - 1] : wasm.startTile;

      return lastTile[1] === playerChoice.tile[0] ? false : lastTile[1] === playerChoice.tile[1];
    } else return false;
  };

  const checkIsRowDominoReverse = (tile: DominoTileType, i: number, tiles: DominoTileType[]) => {
    if (wasm) {
      const lastTile = tiles.length > 0 ? (i > 0 ? tiles[i - 1] : false) : wasm.startTile;
      // console.log({ tile, lastTile });
      return lastTile ? (lastTile[1] === tile[0] ? false : lastTile[1] === tile[1]) : false;
    } else return false;
  };

  useEffect(() => {
    if (playerChoice?.tile && tiles && wasm && !train && (active || isUserTrain)) {
      setIsDisabled(
        !isPartialSubset([tiles.length > 0 ? tiles[tiles.length - 1][1] : wasm.startTile[1]], playerChoice.tile),
      );
    } else {
      setIsDisabled(false);
    }
  }, [active, isUserTrain, playerChoice, tiles, train, wasm]);

  return (
    <div
      className={clsx(
        'relative grid grid-cols-[170px_1fr] grid-rows-[36px] gap-10 py-3 px-3.5 rounded-lg',
        'before:absolute before:inset-0 before:rounded-lg',
        active
          ? 'before:bg-gradient-to-r before:from-[white_-3%] before:to-[transparent_24.7%] before:opacity-50'
          : 'before:bg-[#EBF1EE] before:bg-opacity-90',
        getBgColors(index).backdrop,
      )}>
      <div className="relative grid grid-cols-[44px_1fr] items-center gap-3">
        {train && (
          <Icon
            name="train"
            width={43}
            height={35}
            className={clsx('w-full h-auto', train ? 'text-[#FFCE4A]' : getBgColors(index).train)}
          />
        )}
        {isUserTrain &&
          (account?.decodedAddress === wasm?.players[index] && !isDisabled && playerChoice?.tile_id !== undefined ? (
            <PlayerTrain index={index} />
          ) : (
            <Icon
              name="train"
              width={43}
              height={35}
              className={clsx('w-full h-auto', train ? 'text-[#FFCE4A]' : getBgColors(index).train)}
            />
          ))}
        <span
          className={clsx(
            'uppercase leading-4 font-semibold tracking-[0.03em] w-min',
            active && !getBgColors(index).isLight && 'text-white',
          )}>
          {train ? 'Tequila Train' : `Señor ${players[index]}`}
        </span>
      </div>
      <div className="relative flex items-center gap-0.5">
        {tiles &&
          tiles.map((tile, i) => (
            <DominoItem row tile={tile} key={i} reverse={checkIsRowDominoReverse(tile, i, tiles)} />
          ))}

        {(active || isUserTrain) && isAllowed && (
          <DominoZone
            id={index}
            light={active && !getBgColors(index).isLight}
            disabled={isDisabled}
            reverse={checkIsActiveDominoReverse()}
          />
        )}
      </div>
    </div>
  );
};
