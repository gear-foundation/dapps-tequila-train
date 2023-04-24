import { RegistrationForm } from './registration-form';
import { useGame } from '../../../app/context';

export function RegistrationSection() {
  const { gameWasm } = useGame();

  return (
    <div className="container mt-15 pt-32 pb-15">
      <div className="flex space-x-8 justify-between bg-register-section pr-20 pl-11 py-19 min-h-[330px] rounded-[32px] text-white font-kanit">
        <div className="relative basis-[220px] lg:basis-[365px] grow-0 shrink-0">
          <div className="absolute -inset-y-10 lg:-top-52 lg:-bottom-21.5 inset-x-0">
            <img
              width={733}
              height={955}
              className="h-full w-full object-contain"
              src="/images/register.webp"
              alt="image"
              loading="lazy"
            />
          </div>
        </div>
        <div className="basis-[540px] grow lg:grow-0">
          <h2 className="text-[52px] leading-none font-semibold tracking-[0.08em]">Registration...</h2>
          <p className="mt-3 text-white/60 tracking-[0.08em]">
            Players ({gameWasm?.players.length || 0}/4). Waiting for other players...{' '}
          </p>

          <div className="mt-6">
            <RegistrationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
