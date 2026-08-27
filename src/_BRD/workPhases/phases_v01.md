EasyHome — AI Agent Development Roadmap
Phase 1 — Android Launcher Foundation
Goal
Convert the existing bare React Native application into a functional Android launcher. The purpose of this phase is only to prove that EasyHome can become and operate as the device's default Home application.
Tasks
Configure AndroidManifest.xml for launcher functionality.
Add the required MAIN, HOME, and DEFAULT intent categories.
Configure the main Android activity as a launcher activity.
Ensure EasyHome appears in Android's Home/Launcher selection screen.
Implement a Kotlin launcher service/module.
Implement a native method to determine whether EasyHome is currently the default launcher.
Implement a native method to open Android's default Home-app selection/settings screen.
Expose the launcher functionality to React Native using the modern React Native native-module architecture.
Create a basic React Native launcher setup screen.
Display the current launcher status.
Add a Set EasyHome as Default Launcher button.
Add a Open Launcher Settings button.
Detect launcher status again when returning from Android Settings.
Show a minimal Home screen when EasyHome is the active launcher.
Verify Android Home button behavior.
Verify switching from EasyHome to another launcher.
Verify returning to EasyHome after switching launchers.
Handle Android activity lifecycle correctly.
Basic UI
EasyHome

EasyHome is not your default launcher.

[ Set EasyHome as Default Launcher ]

[ Open Launcher Settings ]
When EasyHome is already the default launcher:
EasyHome

✓ EasyHome is your default launcher.

[ Continue ]
Do Not Implement Yet
Family
Contacts
App discovery
Camera
Torch
Reminders
Emergency
Themes
Database
Final Home UI
Family Setup
Completion Criteria
EasyHome can:
Be installed.
Appear as an Android launcher.
Be selected as the default launcher.
Respond to the Android Home button.
Detect whether it is the current launcher.
Allow the user to switch to another launcher.
Return to EasyHome without crashing.

Phase 2 — Project Architecture & Folder Structure
Goal
Create a scalable project structure before implementing the actual EasyHome features.
Tasks
Create the React Native structure:
src/
├── app/
├── components/
├── screens/
├── navigation/
├── store/
├── database/
├── services/
├── native/
├── theme/
├── types/
└── utils/
Create screen modules:
screens/
├── home/
├── family/
├── apps/
├── setup/
├── reminders/
├── settings/
└── safety/
Create reusable components:
components/
├── common/
├── buttons/
├── cards/
├── forms/
└── feedback/
Create Android native structure:
android/
└── app/
└── src/
└── main/
└── java/
└── .../
└── easyhome/
├── launcher/
├── modules/
├── apps/
├── contacts/
├── camera/
├── torch/
├── battery/
├── reminders/
└── emergency/
Architecture Rules
Keep UI separate from business logic.
Keep business logic separate from persistence.
Keep native Android functionality inside native modules/services.
Do not put Android-specific implementation directly inside React components.
Create shared TypeScript types.
Create service abstractions for native functionality.
Keep components reusable.
Avoid circular dependencies.
Keep feature-specific code grouped together.
Completion Criteria
Project follows the new structure.
Existing launcher functionality continues working.
Android build succeeds.
TypeScript compiles.
No feature implementation is added beyond Phase 1.

Phase 3 — Redux Toolkit & Local Persistence
Goal
Create the central application state and local persistence architecture.
Tasks
Configure:
Redux Toolkit
Redux Store
Provider
Typed dispatch
Typed selectors
Typed Redux hooks
Create slices:
appSlice
parentSlice
familySlice
homeSlice
settingsSlice
reminderSlice
Create TypeScript models:
Parent
FamilyMember
InstalledApp
HomeAction
Reminder
AppearanceSettings
SafetySettings
LauncherSettings
MMKV Architecture
Implement:
React Component
↓
Redux
↓
Repository
↓
MMKV
Create a dedicated storage layer.
Implement:
Read
Write
Update
Delete
Clear
Persist
Restore
Do not access MMKV directly from UI components.
Persist
Parent profile
Family members
Home configuration
Important apps
Appearance settings
Reminder configuration
Safety configuration
Setup completion state
Launcher configuration
Completion Criteria
Redux store works.
All slices are typed.
Data can be persisted.
Data survives application restart.
Data is restored during application startup.
Storage implementation is centralized.

Phase 4 — Navigation Architecture
Goal
Create the complete navigation foundation for both the parent experience and Family Setup.
Tasks
Configure React Navigation.
Create:
RootNavigator
├── Home
├── Family
├── Apps
├── Settings
└── FamilySetup
Create Family Setup navigation:
FamilySetup
├── Welcome
├── ParentProfile
├── Family
├── Apps
├── Appearance
├── Reminders
├── Safety
└── Complete
Implement:
Navigation types.
Android back behavior.
Safe-area handling.
Navigation state.
Screen transitions.
Parent-friendly navigation.
Protected navigation area for future Family Settings.
Completion Criteria
Every major application area has a navigation entry point and all navigation works correctly on Android.

Phase 5 — EasyHome Design System
Goal
Create the visual foundation of EasyHome before building the final screens.
EasyHome should feel warm, modern, calm, trustworthy, family-oriented, and respectful—not medical, childish, or overly technical.
Tasks
Create design tokens for:
Colors
Typography
Font weights
Spacing
Border radius
Elevation
Shadows
Icon sizes
Button sizes
Screen padding
Touch targets
Create reusable components:
EHText
EHButton
EHIconButton
EHCard
EHAvatar
EHListItem
EHSection
EHModal
EHBottomSheet
EHSwitch
Create accessibility-friendly sizes:
Text:

- Large
- Extra Large

Icons:

- Large
- Extra Large

Buttons:

- Large
- Extra Large
  Avoid hardcoded typography and dimensions inside individual screens.
  Completion Criteria
  Create a small internal component showcase screen demonstrating all core EasyHome components and sizes.

Phase 6 — Parent Home Screen
Goal
Build the complete visual Home screen using mock data.
The Home experience should prioritize time, family, communication, camera, entertainment, reminders, and safety.
Tasks
Implement:
Time
Large current time.
Day.
Date.
Weather
Temperature.
Weather condition.
Weather icon.
Family
Favorite family members.
Profile photo.
Name.
Relationship.
Communication
Call.
WhatsApp.
Camera
Photo.
Selfie.
Video.
Entertainment
YouTube.
Instagram.
Photos.
Utilities
Torch.
Reminder.
Safety
Help/Emergency.
Requirements
Use the EasyHome design system.
Use Redux state.
Use configurable text/icon/button sizes.
Make the layout responsive.
Keep the interface uncluttered.
Use mock data for features not yet implemented.
Completion Criteria
The Home screen visually represents the complete EasyHome experience without requiring native functionality yet.

Phase 7 — Android App Discovery & App Launching
Goal
Allow EasyHome to discover installed applications and launch them.
Kotlin
Implement native App Discovery functionality:
Get installed applications.
Get launchable applications.
Get package name.
Get application name.
Get application icon.
Check whether a package exists.
Launch an application.
Handle unavailable applications.
React Native
Create:
Apps service.
Apps Redux slice.
App TypeScript model.
Important Apps screen.
All Apps screen.
App launcher component.
Important Apps
Allow EasyHome to distinguish between:
Important Apps
and:
All Apps
The parent should not be presented with dozens of applications on the main interface.
Completion Criteria
EasyHome can discover installed apps and launch any supported launchable application.

Phase 8 — Family & Contacts
Goal
Implement the Family system and make important people directly accessible from EasyHome.
Family access is a core part of the product, including contact photo, name, relationship and communication actions.
Tasks
Native
Create Kotlin Contacts module.
Request contacts permission.
Read Android contacts.
Retrieve contact name.
Retrieve phone number.
Retrieve contact photo where available.
Handle permission denial.
Family Management
Implement:
Add family member.
Edit family member.
Delete family member.
Select contact.
Set relationship.
Set profile photo.
Set preferred communication method.
Persist family configuration.
Communication
Implement:
Direct phone call.
Message where supported.
WhatsApp launch where supported.
Completion Criteria
A configured family member appears on the Home screen and can be contacted directly.

Phase 9 — Camera, Photos & Torch
Goal
Make EasyHome's primary camera and utility actions functional.
Camera
Implement:
Photo.
Selfie.
Video.
Use appropriate Android camera functionality/intents.
The three separate actions should remove the need for the parent to understand camera modes.
Photos
Implement:
Open Gallery/Photos.
Handle unavailable gallery application.
Torch
Create Kotlin Torch module.
Implement:
Turn torch ON.
Turn torch OFF.
Detect flashlight availability.
Handle devices without flashlight hardware.
Completion Criteria
These Home actions work on a real Android device:
PHOTO
SELFIE
VIDEO
PHOTOS
TORCH

Phase 10 — Family Setup Wizard
Goal
Build the complete configuration experience for the child/caregiver.
The child should configure the parent's phone instead of requiring the parent to navigate complicated settings.
Setup Flow
Welcome
↓
Parent Profile
↓
Family
↓
Important Apps
↓
Appearance
↓
Reminders
↓
Safety
↓
Review
↓
Complete
Tasks
Implement:
Parent name.
Parent photo.
Family members.
Important applications.
Theme.
Text size.
Icon size.
Button size.
Reminders.
Emergency contact.
Safety settings.
Requirements
Save each step.
Allow previous/next navigation.
Restore incomplete setup.
Prevent accidental loss of configuration.
Show setup progress.
Mark setup as completed.
Open Home after completion.
Completion Criteria
A fresh EasyHome installation can be completely configured through the Family Setup flow.

Phase 11 — Personalization System
Goal
Make EasyHome dynamically adapt to the parent's preferences.
Themes
Implement:
Ocean
Green
Rose
Warm
Blue
Dark
Text Size
Implement:
Large
Extra Large
Icon Size
Implement:
Large
Extra Large
Button Size
Implement configurable button sizes.
Appearance
Implement:
Light.
Dark.
Architecture
Settings
↓
Redux
↓
Theme Provider
↓
All EasyHome Components
Persist all settings locally.
The BRD specifically calls for theme, text, icon, button and appearance customization.
Completion Criteria
Changing personalization settings updates the entire EasyHome interface consistently.

Phase 12 — Reminder System
Goal
Build a reliable local reminder system using Android-native scheduling and notifications.
Reminder Types
Implement:
Medicine.
Doctor appointment.
Water.
Exercise.
Important events.
Family occasions.
These reminder categories are defined in the BRD.
Tasks
Create reminder model.
Create Reminder Redux slice.
Create Reminder repository.
Create Add Reminder screen.
Create Edit Reminder screen.
Create Delete Reminder functionality.
Support one-time reminders.
Support recurring reminders.
Display next reminder on Home.
Implement Android-native scheduling.
Create notification channels.
Handle notification permissions.
Handle device reboot.
Restore/reschedule reminders after reboot.
Handle missed reminders appropriately.
Completion Criteria
A configured reminder reliably produces an understandable Android notification even when the app is not open.

Phase 13 — Emergency, Help & Location
Goal
Implement EasyHome's safety functionality with strong protection against accidental actions.
The BRD requires Help functionality, emergency contacts, emergency calling, and potential location sharing.
Tasks
Implement:
Help screen.
Emergency contact.
Family help call.
Emergency number.
Emergency confirmation.
Location permission.
Current location.
Location sharing.
Graceful permission denial.
Failure handling.
Safety Flow
HELP
↓
Confirmation
↓
Family / Emergency Action
Emergency actions must not trigger accidentally from a single unintended tap.
Completion Criteria
Safety actions are accessible but protected from accidental activation.

Phase 14 — Protected Settings & Family PIN
Goal
Prevent accidental modification of important EasyHome configuration.
The BRD identifies home layout, family contacts, theme, emergency settings, important apps, and family configuration as settings that may require protected access.
Tasks
Implement:
Family PIN setup.
PIN verification.
Protected Settings screen.
Protected Home configuration.
Protected Family configuration.
Protected App configuration.
Protected Theme configuration.
Protected Emergency configuration.
Incorrect PIN handling.
Lockout/rate limiting where appropriate.
Secure handling of authentication data.
Use Android secure storage facilities where appropriate.
Completion Criteria
A parent can use EasyHome normally, but protected configuration cannot be changed without family authentication.

Phase 15 — Battery & Weather
Goal
Add useful device information without exposing technical Android interfaces.
Battery
Implement Kotlin battery module.
Battery percentage.
Charging status.
Low battery detection.
Low battery message.
Example:
🔋 18%

Battery is low.
Please connect your charger.
The BRD specifically calls for understandable battery information without technical terminology.
Weather
Implement:
Current temperature.
Weather condition.
Weather icon.
Location-based weather where supported.
Loading state.
Error state.
Offline state.
Completion Criteria
Battery and weather information are displayed clearly without overwhelming the parent.

Phase 16 — Final Launcher Experience
Goal
Combine all completed functionality into the final EasyHome MVP experience.
Main Areas
HOME
FAMILY
APPS
SETTINGS
The BRD defines these four areas as the core product structure.
Tasks
Connect all real data.
Remove mock data.
Connect Home actions.
Connect Family.
Connect Apps.
Connect Reminders.
Connect Safety.
Connect Personalization.
Connect protected settings.
Finalize launcher lifecycle.
Handle returning from external applications.
Handle Android Home button.
Handle Android Back button.
Handle Recent Apps behavior.
Handle switching default launchers.
Handle missing applications.
Handle permission failures.
Handle device-specific failures.
Completion Criteria
The complete parent experience works from the launcher Home screen without requiring technical Android knowledge.

Phase 17 — Testing, Hardening & Production MVP
Goal
Make EasyHome reliable enough for real-device MVP testing.
Launcher Testing
Install.
Uninstall.
Reinstall.
Set as default launcher.
Switch to another launcher.
Switch back.
Reboot device.
Press Home.
Press Back.
Open Recent Apps.
Launch external applications.
Return to EasyHome.
Permission Testing
Test:
Contacts denied.
Camera denied.
Notifications denied.
Location denied.
Permissions revoked later.
Data Testing
Test:
Fresh installation.
App restart.
Device reboot.
State persistence.
MMKV persistence.
Incomplete Family Setup.
Corrupted/missing data.
App upgrades.
Feature Testing
Test:
Family contacts.
App launching.
Camera.
Selfie.
Video.
Torch.
Photos.
Reminders.
Notifications.
Emergency.
Location.
PIN protection.
Themes.
Large/Extra Large UI.
Device Testing
Test on multiple:
Android versions.
Screen sizes.
Resolutions.
Manufacturers.
RAM configurations.
Completion Criteria
No critical crashes.
No broken launcher lifecycle.
No data-loss issues.
No critical permission failures.
Reminder system works reliably.
Parent-facing UI remains usable at all supported sizes.
Production Android build succeeds.

Phase 18 — MVP Release Build
Goal
Prepare the first production-ready EasyHome MVP.
Tasks
Finalize application icon.
Finalize launcher branding.
Finalize splash screen.
Finalize package/application configuration.
Configure release signing.
Configure release build.
Verify R8/ProGuard configuration.
Remove debug logs.
Remove development screens.
Remove mock data.
Remove unused dependencies.
Remove unused code.
Verify Android permissions.
Build release APK.
Build release AAB.
Test release build on a clean device.
Perform complete Family Setup.
Perform complete parent daily journey.
Verify EasyHome remains the default launcher.
Perform final regression testing.
Final MVP Flow
Install EasyHome
↓
Set as Default Launcher
↓
Family Setup
↓
Parent Profile
↓
Family Members
↓
Important Apps
↓
Appearance
↓
Reminders
↓
Safety
↓
Protect Settings
↓
EasyHome Home
↓
Daily Parent Usage
