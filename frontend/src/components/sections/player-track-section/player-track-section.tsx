import { Icon } from '../../ui/icon';
import clsx from 'clsx';
import { getBgColors, isPartialSubset } from 'app/utils';
import { DominoItem } from '../../common/domino-item';
import { DominoZone } from '../../common/domino-zone';
import { DominoTileType } from 'app/types/game';
import { useEffect, useState } from 'react';
import { useGame } from '../../../app/context';

const players = ['Rojo', 'Oscuro', 'Naranja', 'Amarillo', 'Gris', 'Verde', 'Azul', 'Morado'];

type Props = {
  index: number;
  train?: boolean;
  isUserTrain?: boolean;
  active?: boolean;
  tiles?: DominoTileType[];
};
export const PlayerTrackSection = ({ index, train, isUserTrain, active, tiles }: Props) => {
  const { gameWasm: wasm, playerChoice } = useGame();
  const [isDisabled, setIsDisabled] = useState(false);

  const checkIsActiveDominoReverse = () => {
    if (playerChoice?.tile && tiles && wasm) {
      const lastTile = tiles.length > 0 ? tiles : wasm.startTile;

      return lastTile[1] === playerChoice.tile[0] ? false : lastTile[1] === playerChoice.tile[1];
    } else return false;
  };

  useEffect(() => {
    if (playerChoice?.tile && tiles && wasm) {
      setIsDisabled(!isPartialSubset(tiles.length > 0 ? tiles : wasm.startTile, playerChoice.tile));
    } else {
      setIsDisabled(false);
    }
  }, [playerChoice, wasm]);

  return (
    <div
      className={clsx(
        'relative grid grid-cols-[170px_1fr] grid-rows-[36px] gap-10 py-3 px-3.5 rounded-lg overflow-hidden',
        'before:absolute before:inset-0',
        active
          ? 'before:bg-gradient-to-r before:from-[white_-3%] before:to-[transparent_24.7%] before:opacity-50'
          : 'before:bg-[#EBF1EE] before:bg-opacity-90',
        getBgColors(index).backdrop,
      )}>
      <div className="relative grid grid-cols-[44px_1fr] items-center gap-3">
        {(isUserTrain || train) && (
          <Icon
            name="train"
            width={43}
            height={35}
            className={clsx('w-full h-auto', train ? 'text-[#FFCE4A]' : getBgColors(index).train)}
          />
        )}
        <span
          className={clsx(
            'uppercase leading-4 font-semibold tracking-[0.03em] w-min',
            active && !getBgColors(index).isLight && 'text-white',
          )}>
          {train ? 'Tequila Train' : `Señor ${players[index]}`}
        </span>
      </div>
      <div className="relative flex items-center gap-0.5">
        {tiles && tiles.map((tile, i) => <DominoItem row tile={tile} key={i} reverse />)}

        {(active || isUserTrain) && (
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
