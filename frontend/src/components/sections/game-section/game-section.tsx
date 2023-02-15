import { PlayerTrackSection } from '../player-track-section';
import { PlayerCardSection } from '../player-card-section';
import { PlayerConsSection } from '../player-cons-section';
import { useApp, useGame } from 'app/context';
import { SelectDominoPopup } from '../../popups/select-domino-popup/select-domino-popup';

export const GameSection = () => {
  const { isAllowed, openEmptyPopup, setOpenEmptyPopup } = useApp();
  const { gameWasm: state, players } = useGame();

  return (
    <div className="container-xl flex flex-col grow">
      <ul className="space-y-px">
        <li>
          <PlayerTrackSection index={-1} train isUserTrain={false} tiles={state ? [state?.startTile] : undefined} />
        </li>
        {state?.tracks.map((p, i) => (
          <li key={i}>
            <PlayerTrackSection
              index={i}
              isUserTrain={p.hasTrain}
              active={state?.currentPlayer === i}
              tiles={p.tiles}
            />
          </li>
        ))}
      </ul>
      <div className="grid gap-4 mt-auto">
        {isAllowed && <PlayerConsSection />}

        <ul className="flex gap-4 justify-center">
          {players.map((p, i) => (
            <li key={i}>
              <PlayerCardSection index={i} />
            </li>
          ))}
        </ul>
      </div>

      <SelectDominoPopup isOpen={openEmptyPopup} setIsOpen={setOpenEmptyPopup} />
    </div>
  );
};
