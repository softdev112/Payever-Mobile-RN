/**
 * Created by Elf on 30.01.2017.
 */
import CheckBoxPref from './CheckBoxPref';
import SwitchableSliderPref from './SwitchableSliderPref';
import SwitchableTimePeriodPref from './SwitchableTimePeriodPref';

export default function prefsFactory(prefInfo, settings) {
  /* eslint-disable default-case */
  switch (prefInfo.type) {
    case 'checkbox': {
      return (
        <CheckBoxPref
          key={prefInfo.prefName}
          {...prefInfo}
          settings={settings}
        />
      );
    }

    case 'switchable-slider': {
      return (
        <SwitchableSliderPref
          key={prefInfo.checkBox.prefName}
          checkBox={prefInfo.checkBox}
          slider={prefInfo.slider}
          settings={settings}
        />
      );
    }

    case 'switchable-time-period': {
      return (
        <SwitchableTimePeriodPref
          key={prefInfo.checkBox.prefName}
          checkBox={prefInfo.checkBox}
          timePeriod={prefInfo.timePeriod}
          settings={settings}
        />
      );
    }

    default: {
      return null;
    }
  }
}