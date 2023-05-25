import { RegisterOptions } from 'react-hook-form';

import { Buildable, WrappedInput, Field } from '@daohaus/ui';

export const TagsInput = (props: Buildable<Field>) => {
  const newRules: RegisterOptions = {
    ...props.rules,
    setValueAs: (val) => val.split(', '),
  };
  return <WrappedInput {...props} rules={newRules} />;
};
