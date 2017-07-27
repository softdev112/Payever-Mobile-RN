export default {
  fromNullSettings: {
    silentPeriodStart: null,
    silentPeriodStop: {
      hour: 20,
      minute: 40,
    },
    testHour: 11,
    testMinute: 30,
    notificationSound: true,
    notificationVolume: 50,
  },

  toNullSettings: {
    silentPeriodStart: {
      hour: 20,
      minute: 40,
    },
    silentPeriodStop: null,
    testHour: 11,
    testMinute: 30,
    notificationSound: true,
    notificationVolume: 50,
  },

  soundOffSettings: {
    silentPeriodStart: {
      hour: 20,
      minute: 40,
    },
    silentPeriodStop: {
      hour: 20,
      minute: 40,
    },
    testHour: 11,
    testMinute: 30,
    notificationSound: false,
    notificationVolume: 50,
  },

  soundVolumeUndefSettings: {
    silentPeriodStart: {
      hour: 20,
      minute: 40,
    },
    silentPeriodStop: {
      hour: 20,
      minute: 40,
    },
    testHour: 11,
    testMinute: 30,
    notificationSound: true,
  },

  // Should be in silent period
  settingsObject1: {
    silentPeriodStart: {
      hour: 10,
      minute: 50,
    },
    silentPeriodStop: {
      hour: 20,
      minute: 40,
    },
    testHour: 11,
    testMinute: 30,
    notificationSound: true,
    notificationVolume: 50,
  },

  // Should be in silent period
  settingsObject2: {
    silentPeriodStart: {
      hour: 10,
      minute: 50,
    },
    silentPeriodStop: {
      hour: 20,
      minute: 40,
    },
    testHour: 10,
    testMinute: 55,
    notificationSound: true,
    notificationVolume: 50,
  },

  // Should be in silent period
  settingsObject3: {
    silentPeriodStart: {
      hour: 10,
      minute: 50,
    },
    silentPeriodStop: {
      hour: 20,
      minute: 40,
    },
    testHour: 20,
    testMinute: 30,
    notificationSound: true,
    notificationVolume: 50,
  },

  // Should be in silent period
  settingsObject4: {
    silentPeriodStart: {
      hour: 22,
      minute: 0,
    },
    silentPeriodStop: {
      hour: 2,
      minute: 40,
    },
    testHour: 23,
    testMinute: 30,
    notificationSound: true,
    notificationVolume: 50,
  },

  // Should be in silent period
  settingsObject5: {
    silentPeriodStart: {
      hour: 23,
      minute: 0,
    },
    silentPeriodStop: {
      hour: 0,
      minute: 0,
    },
    testHour: 23,
    testMinute: 30,
    notificationSound: true,
    notificationVolume: 50,
  },

  // Should be in silent period
  settingsObject6: {
    silentPeriodStart: {
      hour: 23,
      minute: 0,
    },
    silentPeriodStop: {
      hour: 2,
      minute: 40,
    },
    testHour: 1,
    testMinute: 50,
    notificationSound: true,
    notificationVolume: 50,
  },

  // Should be in silent period
  settingsObject7: {
    silentPeriodStart: {
      hour: 23,
      minute: 0,
    },
    silentPeriodStop: {
      hour: 1,
      minute: 40,
    },
    testHour: 1,
    testMinute: 50,
    notificationSound: true,
    notificationVolume: 50,
  },

  // Should be in silent period
  settingsObject8: {
    silentPeriodStart: {
      hour: 23,
      minute: 0,
    },
    silentPeriodStop: {
      hour: 0,
      minute: 40,
    },
    testHour: 0,
    testMinute: 0,
    notificationSound: true,
    notificationVolume: 50,
  },

  // Should be in silent period
  settingsObject9: {
    silentPeriodStart: {
      hour: 0,
      minute: 0,
    },
    silentPeriodStop: {
      hour: 0,
      minute: 40,
    },
    testHour: 0,
    testMinute: 2,
    notificationSound: true,
    notificationVolume: 50,
  },

  // Should NOT be in silent period
  settingsObject10: {
    silentPeriodStart: {
      hour: 11,
      minute: 0,
    },
    silentPeriodStop: {
      hour: 15,
      minute: 40,
    },
    testHour: 10,
    testMinute: 50,
    notificationSound: true,
    notificationVolume: 50,
  },

  // Should NOT be in silent period
  settingsObject11: {
    silentPeriodStart: {
      hour: 11,
      minute: 0,
    },
    silentPeriodStop: {
      hour: 15,
      minute: 40,
    },
    testHour: 16,
    testMinute: 50,
    notificationSound: true,
    notificationVolume: 50,
  },

  // Should NOT be in silent period
  settingsObject12: {
    silentPeriodStart: {
      hour: 11,
      minute: 20,
    },
    silentPeriodStop: {
      hour: 15,
      minute: 10,
    },
    testHour: 11,
    testMinute: 10,
    notificationSound: true,
    notificationVolume: 50,
  },

  // Should NOT be in silent period
  settingsObject13: {
    silentPeriodStart: {
      hour: 11,
      minute: 20,
    },
    silentPeriodStop: {
      hour: 15,
      minute: 10,
    },
    testHour: 15,
    testMinute: 50,
    notificationSound: true,
    notificationVolume: 50,
  },

  // Should NOT be in silent period
  settingsObject14: {
    silentPeriodStart: {
      hour: 0,
      minute: 5,
    },
    silentPeriodStop: {
      hour: 0,
      minute: 10,
    },
    testHour: 0,
    testMinute: 50,
    notificationSound: true,
    notificationVolume: 50,
  },
};