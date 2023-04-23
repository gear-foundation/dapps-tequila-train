import { Input } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { hexRequired } from '../../../app/utils';
import { HexString } from '@polkadot/util/types';

const registerUser = {
  name: '' as HexString,
};

const validate: Record<string, typeof hexRequired> = {
  name: hexRequired,
};

export function RegistrationForm() {
  const form = useForm({
    initialValues: registerUser,
    validate: validate,
    validateInputOnChange: true,
  });
  const { getInputProps, errors } = form;
  const handleSubmit = form.onSubmit((values) => {
    console.log('submit');
    // setLesson({ step: +values.currentStep, programId: values.programId })
  });

  return (
    <form className="grid gap-6 lg:gap-0 lg:flex lg:space-x-6" onSubmit={handleSubmit}>
      <div className="text-sm grow">
        <Input
          label="Enter your name"
          placeholder="Señor Amarillo"
          className="[&_label]:text-sm [&_label]:font-normal"
          {...getInputProps('name')}
        />
      </div>
      <div className="">
        <button
          type="submit"
          className="btn btn--primary gap-2 tracking-[0.08em]"
          disabled={Object.keys(errors).length > 0}>
          Register
        </button>
      </div>
    </form>
  );
}
