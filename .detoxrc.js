module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/jest.config.js',
  skipLegacyWorkersInjection: true,
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/AppBase.app',
      build: 'xcodebuild -workspace ios/AppBase.xcworkspace -scheme AppBase -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/AppBase.app',
      build: 'xcodebuild -workspace ios/AppBase.xcworkspace -scheme AppBase -configuration Release -sdk iphonesimulator -derivedDataPath ios/build'
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
      reversePorts: [8081]
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build: 'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release'
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 14'
      }
    },
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*'
      }
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_3a_API_30_x86'
      }
    }
  },
  configurations: {
    'ios.sim.debug': {
      app: 'ios.debug',
      device: 'simulator'
    },
    'ios.sim.release': {
      app: 'ios.release',
      device: 'simulator'
    },
    'android.att.debug': {
      app: 'android.debug',
      device: 'attached'
    },
    'android.att.release': {
      app: 'android.release',
      device: 'attached'
    },
    'android.emu.debug': {
      app: 'android.debug',
      device: 'emulator'
    },
    'android.emu.release': {
      app: 'android.release',
      device: 'emulator'
    }
  }
}; 