import FmlxIcon from './FmlxIcon';

const defaultConfig = {
  title: 'Components/FmlxIcon',
  component: FmlxIcon,
  argTypes: {
    name: { control: false },
    type: {
      options: Object.values(FmlxIcon.Type),
      control: { type: 'select' },
    },
    variant: {
      options: Object.values(FmlxIcon.Variant),
      control: { type: 'select' },
    },
    customColor: { control: { type: 'text' } },
  },
};

const defaultArgs = {
  name: '',
  type: FmlxIcon.Type.DEFAULT,
  variant: FmlxIcon.Variant.SECONDARY,
  customColor: '',
};

export { defaultConfig, defaultArgs };
