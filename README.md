# AppBase - React Native/Expo Application

A modern, feature-rich React Native application built with Expo, TypeScript, and Redux Toolkit. This app includes authentication, offline sync, push notifications, biometric authentication, analytics, and comprehensive testing.

## 🚀 Features

- **Authentication System** - Login/Signup with secure storage
- **Offline Sync** - Queue and sync data when connection is restored
- **Push Notifications** - Real-time notifications with Expo
- **Biometric Authentication** - Touch ID/Face ID support
- **Analytics Integration** - Sentry for crash reporting and analytics
- **Deep Linking** - Handle custom URL schemes
- **Reanimated Components** - Smooth animations and gestures
- **Enterprise Features** - Scalable architecture for business use
- **Comprehensive Testing** - Unit tests with Jest and React Native Testing Library
- **TypeScript** - Full type safety throughout the application

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **Expo CLI** - Install globally: `npm install -g @expo/cli`

### Development Environment
- **Android Studio** (for Android development) - [Download here](https://developer.android.com/studio)
- **Xcode** (for iOS development, macOS only) - [Download from App Store](https://apps.apple.com/us/app/xcode/id497799835)
- **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

### Mobile Testing
- **Expo Go** app on your mobile device
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd appBase
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Expo CLI (if not already installed)
```bash
npm install -g @expo/cli
```

### 4. Verify Installation
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Expo CLI version
expo --version
```

## ⚙️ Configuration

### 1. Environment Setup
Create a `.env` file in the root directory:
```env
# API Configuration
API_BASE_URL=https://your-api-url.com
SENTRY_DSN=your-sentry-dsn-here

# App Configuration
APP_NAME=AppBase
APP_VERSION=1.0.0
```

### 2. Update Constants
Edit `src/utils/constants.ts` to match your app's needs:
```typescript
export const API_BASE_URL = process.env.API_BASE_URL || 'https://your-api.com';
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  // ... other colors
};
```

### 3. Configure App Metadata
Update `app.json` with your app's information:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "version": "1.0.0",
    "description": "Your app description"
  }
}
```

## 🏃‍♂️ Running the Application

### Development Mode

#### Start the Development Server
```bash
npm start
```
This will start the Expo development server and show a QR code.

#### Run on Different Platforms
```bash
# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run on Web
npm run web
```

#### Using Expo Go (Recommended for Testing)
1. Install Expo Go on your mobile device
2. Run `npm start` in your project directory
3. Scan the QR code with your device camera (iOS) or Expo Go app (Android)

### Production Mode

#### Build for Production
```bash
# Build for Android
npm run build:android

# Build for iOS
npm run build:ios
```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### End-to-End Testing
```bash
# Build for e2e testing
npm run test:e2e:build

# Run e2e tests
npm run test:e2e
```

### Code Quality
```bash
# Run TypeScript type checking
npm run type-check

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📁 Project Structure

```
appBase/
├── __tests__/                 # Test files
│   └── components/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Common components (Button, Input, etc.)
│   │   └── forms/           # Form-specific components
│   ├── features/            # Feature-based modules
│   │   ├── auth/           # Authentication feature
│   │   ├── notifications/  # Notifications feature
│   │   └── websocket/      # WebSocket feature
│   ├── hooks/              # Custom React hooks
│   ├── navigation/         # Navigation configuration
│   ├── services/           # API and external services
│   ├── store/             # Redux store configuration
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions and constants
├── assets/                # Static assets (images, icons, etc.)
├── app.json              # Expo configuration
├── babel.config.js       # Babel configuration
├── jest.config.js        # Jest testing configuration
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the Expo development server |
| `npm run android` | Run on Android device/emulator |
| `npm run ios` | Run on iOS device/simulator |
| `npm run web` | Run on web browser |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:e2e:build` | Build for e2e testing |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run type-check` | Run TypeScript type checking |
| `npm run build:android` | Build for Android production |
| `npm run build:ios` | Build for iOS production |

## 🛠️ Technologies Used

### Core Technologies
- **React Native** (0.79.5) - Mobile app framework
- **Expo** (53.0.0) - Development platform
- **TypeScript** (5.8.3) - Type-safe JavaScript
- **React** (19.0.0) - UI library

### State Management
- **Redux Toolkit** (2.0.1) - State management
- **React Redux** (9.1.0) - React bindings for Redux
- **Redux Persist** (6.0.0) - Persist Redux state

### Navigation
- **React Navigation** (6.x) - Navigation library
- **React Navigation Native Stack** - Native stack navigator
- **React Navigation Bottom Tabs** - Tab navigation
- **React Navigation Drawer** - Drawer navigation

### UI & Animations
- **React Native Reanimated** (3.16.1) - Animations
- **React Native Gesture Handler** (2.20.2) - Gesture handling
- **React Native Vector Icons** (10.0.3) - Icon library
- **Lottie React Native** (6.4.1) - Lottie animations

### Forms & Validation
- **React Hook Form** (7.48.0) - Form handling
- **Yup** (1.4.0) - Schema validation
- **Hookform Resolvers** (3.3.0) - Form validation resolvers

### Storage & Networking
- **AsyncStorage** (1.21.0) - Local storage
- **React Native MMKV** (2.11.0) - Fast key-value storage
- **Axios** (1.4.0) - HTTP client
- **NetInfo** (11.3.0) - Network information

### Security & Authentication
- **React Native Keychain** (8.2.0) - Secure storage
- **Expo Local Authentication** (14.0.1) - Biometric auth
- **Expo Secure Store** (13.0.2) - Secure storage
- **Expo Crypto** (13.0.2) - Cryptographic functions

### Analytics & Monitoring
- **Sentry React Native** (5.15.0) - Error tracking
- **Expo Application** (5.9.1) - App information
- **React Native Device Info** (10.13.0) - Device information

### Testing
- **Jest** (29.7.0) - Testing framework
- **React Native Testing Library** (12.4.2) - Testing utilities
- **Jest Native** (5.4.3) - Additional Jest matchers
- **Detox** (20.13.5) - E2E testing framework

### Development Tools
- **ESLint** (8.57.0) - Code linting
- **Prettier** (3.1.0) - Code formatting
- **TypeScript ESLint** (6.0.0) - TypeScript linting

## 🔧 Development Workflow

### 1. Starting Development
```bash
# Clone and setup
git clone <repo-url>
cd appBase
npm install

# Start development server
npm start
```

### 2. Making Changes
```bash
# Create a new feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ... code changes ...

# Run tests
npm test

# Check types
npm run type-check

# Lint code
npm run lint:fix
```

### 3. Testing Your Changes
```bash
# Run on device
npm run android  # or ios

# Run tests
npm run test:coverage

# Test specific component
npm test -- Button.test.tsx
```

### 4. Before Committing
```bash
# Ensure all checks pass
npm run type-check
npm run lint
npm test

# Commit changes
git add .
git commit -m "feat: add new feature"
```

## 📱 Device Testing

### Android Testing
1. **Physical Device**:
   - Enable Developer Options
   - Enable USB Debugging
   - Connect via USB
   - Run `npm run android`

2. **Android Emulator**:
   - Install Android Studio
   - Create AVD (Android Virtual Device)
   - Start emulator
   - Run `npm run android`

### iOS Testing (macOS only)
1. **Physical Device**:
   - Install Xcode
   - Connect device
   - Trust developer certificate
   - Run `npm run ios`

2. **iOS Simulator**:
   - Install Xcode
   - Run `npm run ios`

## 🚨 Troubleshooting

### Common Issues

#### Metro Bundle Error
```bash
# Clear Metro cache
npx expo start --clear
```

#### Node Modules Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Check TypeScript configuration
npm run type-check

# Restart TypeScript server in VS Code
# Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

#### Expo Go Connection Issues
```bash
# Ensure both devices are on same network
# Try tunnel connection
npx expo start --tunnel
```

#### Android Build Issues
```bash
# Clean Android build
cd android
./gradlew clean
cd ..
npm run android
```

#### iOS Build Issues
```bash
# Clean iOS build
cd ios
rm -rf build
pod install
cd ..
npm run ios
```

### Getting Help

1. **Check Logs**:
   ```bash
   # View Metro logs
   npx expo start --verbose
   
   # View device logs
   npx expo logs --platform android  # or ios
   ```

2. **Debug Mode**:
   - Shake device or press Cmd+D (iOS) / Ctrl+M (Android)
   - Enable "Debug JS Remotely"

3. **Common Solutions**:
   - Restart Metro bundler
   - Clear cache: `npx expo start --clear`
   - Restart Expo Go app
   - Check network connectivity

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines
- Use TypeScript for all new code
- Follow existing naming conventions
- Write tests for new features
- Use meaningful commit messages
- Keep components small and focused

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Expo team for the excellent development platform
- React Native community for the ecosystem
- All contributors to the open-source packages used

---

**Happy coding! 🚀**

For additional help, please check the [Expo documentation](https://docs.expo.dev/) or [React Native documentation](https://reactnative.dev/docs/getting-started). 