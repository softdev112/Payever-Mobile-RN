/**
 * Created by Elf on 30.01.2017.
 */
import CheckBoxPref from './CheckBoxPref';

export default function prefsFactory(prefInfo, targetObject) {
  console.log(targetObject);
  /* eslint-disable default-case */
  switch (prefInfo.type) {
    case 'checkbox': {
      return (
        <CheckBoxPref
          key={prefInfo.prefName}
          {...prefInfo}
        />
      );
    }

    default: {
      return null;
    }
  }
}