import clsx from 'clsx';
import { useGame } from 'app/context';
import { DominoItem } from '../domino-item';

type Props = {
  light?: boolean;
  id: number;
};

export const DominoZone = ({ light, id }: Props) => {
  const { selectedDomino, setPlayerChoice, playerChoice } = useGame();

  const onClick = () => {
    if (playerChoice) {
      playerChoice.track_id !== id
        ? setPlayerChoice({ ...playerChoice, track_id: id, remove_train: false })
        : setPlayerChoice({
            ...playerChoice,
            track_id: undefined,
            remove_train: false,
          });
    } else {
      setPlayerChoice({ track_id: id, remove_train: false });
    }
  };

  return (
    <button
      className={clsx(
        'inline-flex justify-center items-center w-18 h-9 -m-mx border border-dashed rounded-lg transition-colors',
        playerChoice?.track_id === id
          ? 'hover:bg-primary/30 hover:border-primary'
          : 'hover:bg-primary/15 hover:border-primary',
        playerChoice?.track_id === id
          ? 'bg-primary/15 border-primary'
          : light
          ? 'bg-white/15 border-white'
          : 'bg-black/15 border-black',
      )}
      onClick={onClick}>
      {selectedDomino && playerChoice?.track_id === id && <DominoItem row tile={selectedDomino[1]} />}
    </button>
  );
};
