# ⏱ StampleApp

A modern and intuitive **React Native** app for tracking work hours.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Appwrite](https://img.shields.io/badge/Appwrite-FF0000?style=for-the-badge&logo=appwrite&logoColor=white)

---

# 📋 Features

## ⏰ Work Time Logging
- Record work time for each day
- Select the date (default: current date)
- Pick start and end times using a time picker
- Automatic calculation of total hours per day

## 📊 Dashboard & Overview
- List all work days with date, start time, end time, and total hours
- Show cumulative total hours
- Filter entries by week or month
- Option to delete entries

## 💾 Data Storage
- No authentication required
- Local data storage using **AsyncStorage**
- Data persists across sessions

## 🎨 User Interface
- Clean, modern mobile UI in German
- Main screen: Dashboard with workday list and total hours
- Button **"Neuer Arbeitstag"** to add new entries
- Material Design-inspired color scheme

---

# ⚙️ Installation & Setup

## Prerequisites
- Node.js (version 14 or higher) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
- npm or yarn ![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
- **Expo CLI** installed globally ![Expo](https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white)
- **Expo Go** app on your mobile device (for testing)

## Installation
```bash
# Clone the repository
git clone https://github.com/jordansoftware/stampleapp.git
cd stampleapp

# Install dependencies
npm install
# or
yarn install
   ```
### Running the App
1. Start Expo development server :
```bash
npm start
 # ou
 expo start
```
1-Scan the QR code with Expo Go on your mobile device  
2-The app will launch automatically

### Available Scripts

* npm start – Start Expo development server

* npm run android – Launch app on Android emulator

* npm run ios – Launch app on iOS simulator

* npm run web – Launch app in browser

## 🗂 Project Structure
```
stampleapp/
├── App.js                   # Main entry point with navigation
├── package.json             # Dependencies and scripts
├── screens/                 # App screens
│ ├── DashboardScreen.js     # Dashboard with workday list
│ └── AddWorkDayScreen.js    # Screen to add a new workday
├── components/              # Reusable components
│ └── DateTimePicker.js      # Date & time picker component
├── services/                # Services & business logic
│ ├── StorageService.js      # Local storage service with AsyncStorage
│ ├── workService.js         # Workday CRUD logic
│ └── ReportService.js       # PDF report generation
└── assets/                  # Images and resources
```


## ⚡ Technical Features


* Data Storage: AsyncStorage with JSON format, error handling

* Automatic Calculations: Total work hours calculated from start/end times

* Validation: End time must be after start time

* German Date & Time Formatting

* Responsive & Modern UI: Consistent color palette (#2196F3 main color)

* PDF Reports: Generate work hours reports in PDF format

## 🎨 Customization

* Colors: Modify in the style files

* Primary color: #2196F3

* Background color: #f5f5f5

* Text color: #333

* Language: Currently in English; change text and date formats in components

## 🧑‍💻 Development

* Add new components in components/

* Add new screens in screens/

* Extend storage service if needed

* Update navigation in App.js

## 📱 Testing

* Android devices (via Expo Go)

* iOS devices (via Expo Go)

* Browser (limited features)

## 💡 Support

For questions or issues, consult Expo Documentation
 or React Native Documentation

## 📄 License

This project is licensed under 0BSD (see package.json)
