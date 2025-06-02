# 🌍 PolyglotPal

**Modern and User-Friendly Language Learning Application**

PolyglotPal is an interactive language learning platform developed with React Native and Expo Router, featuring multi-language support. It offers translation and learning opportunities between Turkish, English, German, and Spanish.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%20-lightgrey.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.79.2-blue.svg)
![Expo](https://img.shields.io/badge/Expo-SDK%2053-black.svg)

## ✨ Features

- 🌐 **Multi-Language Support**: Turkish, English, German, Spanish
- 📱 **Cross-Platform**: iOS and Android
- 🎯 **Modern UI/UX**: User-friendly interface design
- 🔄 **Dynamic Language Pairs**: Different language combinations
- 👤 **Profile Management**: Customizable user profile
- ⚙️ **Settings System**: Manage application preferences
- 🎨 **Responsive Design**: Compatible with all screen sizes

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/emirefeulusoy/polyglotpal.git
cd polyglotpal
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start the application**
```bash
npm start
# or
expo start
```

4. **Platform selection**
- For Android: `npm run android`
- For iOS: `npm run ios`

## 📱 Screenshots

### Main Screens
- **Language Selection**: Choose the language pair you want to learn
- **Main Screen**: Interactive learning modules
- **Profile**: Manage your personal information
- **Settings**: Configure your application preferences

## 🏗️ Project Structure

```
polyglotpal/
├── app/                    # Main application files
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── language-selection.tsx
│   │   ├── mainscreen.tsx
│   │   └── profile.tsx
│   └── settings/          # Settings screens
├── assets/                # Images and static files
│   ├── images/
│   │   ├── flags/         # Country flags
│   │   └── icons/         # Application icons
├── components/            # Reusable components
├── constants/             # Theme and constants
│   └── Theme.ts
├── context/               # React Context API
│   └── LanguageContext.tsx
├── hooks/                 # Custom React hooks
├── utils/                 # Helper functions
│   └── helpers.ts
└── package.json
```

## 🛠️ Technologies Used

### Core
- **React Native**: 0.79.2
- **Expo**: SDK 53
- **TypeScript**: 5.8.3
- **Expo Router**: 5.0.6

### UI & Navigation
- **@react-navigation/native**: 7.1.6
- **@react-navigation/bottom-tabs**: 7.3.10
- **@expo/vector-icons**: 14.1.0
- **expo-checkbox**: 4.1.4

### Additional Libraries
- **react-native-gesture-handler**: 2.24.0
- **react-native-reanimated**: 3.17.4
- **react-native-safe-area-context**: 5.4.0
- **expo-splash-screen**: 0.30.8

## 🌟 Key Features

### Language Management
```typescript

const { sourceLang, targetLang, setLanguages } = useLanguage();
```

### Responsive Design
```typescript
const screenWidth = Dimensions.get('window').width;
const buttonWidth = screenWidth * 0.8;
```

### Theme System
```typescript
export const Colors = {
  primary: '#007ACC',
  background: '#A9D1FE',
  text: 'black',
  white: 'white',
};
```

## 🔧 Development

### Scripts
```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run lint       # Code quality check with ESLint
```

### Code Quality
- **ESLint**: Code standards
- **TypeScript**: Type safety
- **Expo Config**: Optimized configuration


## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 📞 Contact

- **Developer**: Emir Efe Ulusoy
- **Email**: emirulusoy53@gmail.com
- **Project Link**: [https://github.com/emirefeulusoy/polyglotpal](https://github.com/emirefeulusoy/polyglotpal)

## 🙏 Acknowledgments

- Thanks to the Expo team for the amazing platform
- Thanks to the React Native community for continuous support
- Thanks to all contributors

---

⭐ If you like this project, don't forget to give it a star!
