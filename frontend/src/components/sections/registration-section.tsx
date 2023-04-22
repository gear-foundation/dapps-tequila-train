import { Input } from '@gear-js/ui';

type RegistrationSectionProps = BaseComponentProps & {};

export function RegistrationSection({}: RegistrationSectionProps) {
  return (
    <div className="container mt-15 pt-32 pb-15">
      <div className="flex space-x-8 justify-between bg-register-section pr-20 pl-11 pt-19 pb-25 rounded-[32px] text-white font-kanit">
        <div className="relative basis-[220px] lg:basis-[365px] grow-0 shrink-0">
          <div className="absolute -inset-y-10 lg:-top-52 lg:-bottom-27.5 inset-x-0">
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
          <p className="mt-3 text-white/60 tracking-[0.08em]">Players (2/4). Waiting for other players... </p>

          <div className="mt-6">
            <form className="grid gap-6 lg:gap-0 lg:flex lg:space-x-6">
              <div className="text-sm grow">
                <Input
                  label="Enter your name"
                  placeholder="Señor Amarillo"
                  className="[&_label]:text-sm [&_label]:font-normal"
                />
              </div>
              <div className="">
                <button type="submit" className="btn btn--primary gap-2 tracking-[0.08em]">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
