import { Icon } from '../../ui/icon';
import clsx from 'clsx';
import { getBgColors } from 'app/utils';
import { useGame } from '../../../app/context';

type Props = {
  index: number;
};

export const PlayerCardSection = ({ index }: Props) => {
  const { gameWasm: wasm } = useGame();
  return (
    <div className="flex flex-col h-full max-w-[160px]">
      <div className="grow flex rounded-t-2xl bg-[#D6FE51] py-3.5 px-2.5 font-medium text-center">
        <span className="line-clamp-2 w-full">{wasm?.players[index][1]}</span>
      </div>
      <div
        className={clsx(
          'grow-0 flex items-center py-3.5 px-2.5',
          getBgColors(index).backdrop,
          getBgColors(index).isLight ? 'text-dark-500' : 'text-white',
        )}>
        <div className="flex flex-wrap gap-1 items-center justify-center">
          <div
            className={clsx(
              'inline-flex items-center justify-center w-6 h-6 rounded-full',
              getBgColors(index).isLight ? 'bg-black/10' : 'bg-white/15',
            )}>
            <Icon name="on-hands" className="m-auto w-3 h-3" />
          </div>
          <span className="font-bold text-lg">{wasm?.playersTiles[index].length}</span>
          <span className="basis-full text-center whitespace-nowrap text-[8px] leading-3">On hands</span>
        </div>
        <div className="flex flex-wrap gap-1 items-center justify-center">
          <div
            className={clsx(
              'inline-flex items-center justify-center w-6 h-6 rounded-full',
              getBgColors(index).isLight ? 'bg-black/10' : 'bg-white/15',
            )}>
            <Icon name="shots" className="m-auto w-4 h-4" />
          </div>
          <span className="font-bold text-lg">{wasm?.shotCounters[index]}</span>
          <span className="basis-full text-center whitespace-nowrap text-[8px] leading-3">Number of shots</span>
        </div>
      </div>
    </div>
  );
};
