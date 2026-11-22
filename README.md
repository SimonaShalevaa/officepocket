# OfficePocket

OfficePocket is a mobile app for small businesses. It helps you keep track of income and expenses, store photos of documents and plan vacations.

React Native exam project – SoftUni, 2026.

## Download

- **APK (Android):** _link will be added here_
- **Demo account:**
  - Email: `_add demo email_`
  - Password: `_add demo password_`

You can also create your own account from the Register screen.

## Tech Stack

- React Native + Expo (SDK 58)
- React Navigation (native stack + bottom tabs)
- Supabase (authentication, database, file storage)
- Axios (requests to the Supabase REST API)
- Expo modules: Image Picker, Secure Store, Haptics, Sharing, File System
- DateTimePicker

## How to Run the Project

1. Clone the repository and install the packages:

   ```bash
   git clone https://github.com/SimonaShalevaa/officepocket.git
   cd officepocket
   npm install
   ```

2. Start the app:

   ```bash
   npx expo start
   ```

3. Open **Expo Go** on your phone and scan the QR code.
   If your phone and computer are on different networks, use `npx expo start --tunnel`.

The `.env` file with the Supabase URL and publishable key is included in the repository. The publishable key is safe to share, because every table is protected with Row Level Security (each user can see only their own data).

---

# Functional Guide

## 1. Project Overview

**Application Name:** OfficePocket

**Application Category / Topic:** Finance / Productivity for small businesses

**Main Purpose:**
OfficePocket helps a small business owner keep everyday office work in one place. The user can record income, expenses, salaries and dividends and see the monthly balance. Photos of invoices, receipts and contracts can be stored in the app and shared. The user can also plan vacations and see how many paid days are left.

## 2. User Access & Permissions

### Guest (Not Authenticated)

- Available screens: **Login** and **Register**.
- A guest cannot see any data.

### Authenticated User

- **Main sections / tabs:** Dashboard, Finances, Documents, Vacations, Profile.
- **Details screens:** Record details, Document details, Vacation details, Pending payments.
- **Create / Edit / Delete actions:**
  - Records (finances): create, edit, delete, mark as paid.
  - Documents: create, delete, share.
  - Vacations: create, edit, delete.
- Each user sees only their own data (Supabase Row Level Security).

## 3. Authentication & Session Handling

### Authentication Flow

1. **When the app starts**, it shows a loading indicator and checks if there is a saved session.
2. **The authentication status is checked** by reading the refresh token from Secure Store. If it exists, the app asks Supabase for a new access token.
3. **On successful login or registration**, the access token is kept in memory and added to every request. The refresh token is saved in Secure Store. The user is taken to the Dashboard.
4. **On logout**, the tokens are removed from memory and from Secure Store, and the user goes back to the Login screen.

### Session Persistence

- **How is the session stored?** Only the **refresh token** is saved, in **Expo Secure Store** (not in AsyncStorage). The access token lives only in memory.
- **Automatic login after restart:** on start the app uses the saved refresh token to get a new session, so the user is logged in without typing the password.
- **Expired token:** the access token is valid for one hour. If a request returns 401, an Axios interceptor gets a new token and repeats the request automatically. If this fails, the user is logged out with a message.

## 4. Navigation Structure

### Root Navigation Logic

- The **Root Stack** shows different screens depending on the login status:
  - not logged in → **Auth stack** (Login, Register);
  - logged in → **Tabs** + form screens (New record, New document, New vacation, Pending payments).

### Main Navigation

- **Bottom Tabs** with 5 sections: Dashboard, Finances, Documents, Vacations, Profile.

### Nested Navigation

- Yes. **Finances**, **Documents** and **Vacations** each have their own **Stack inside the Tab**:
  - list screen → details screen.
- Form screens open on top of the tabs in the Root Stack.

## 5. List → Details Flow

### List / Overview Screen

- **Data displayed:**
  - Finances – records with description, type, category, date, amount and paid/pending status.
  - Documents – documents with photo thumbnail, type and date.
  - Vacations – vacations with period, type, working days and status.
- **Interaction:** tap an item to open its details, pull down to refresh, "+" button to add a new item.

### Details Screen

- **How is navigation triggered?** By tapping an item in the list.
- **Route parameters:** the item **id** and a **title** for the header. The details screen loads the full item from Supabase by id, so it always shows fresh data.

## 6. Data Source & Backend

### Backend Type

- **Real backend: Supabase**
  - **Auth** – register, login, refresh token.
  - **Database (PostgreSQL)** – tables `transactions`, `documents`, `vacations`.
  - **Storage** – private bucket `documents` for the photos.
- Requests are made with **Axios** to the Supabase REST API (`src/api`).

## 7. Data Operations (CRUD)

### Read (GET)

- Finances, Documents, Vacations and Dashboard load data when the screen is opened and on pull to refresh.
- Details screens load one item by id.
- Document photos are shown with temporary signed links from the private bucket.

### Create (POST)

- **New record** form (Finances "+" button).
- **New document** form (Documents "+" button): the photo is uploaded to Storage, then the document is saved in the database.
- **New vacation** form (Vacations "+" button).

### Update / Delete (Mutation)

- **Update:** edit records and vacations; mark a pending payment as paid.
- **Delete:** records, documents (row and photo) and vacations, always with a confirmation dialog.
- **How is the UI updated?** After a change the app goes back to the list, which reloads the data from Supabase when it gets focus.

## 8. Forms & Validation

### Forms Used

- Login
- Register
- New / Edit record
- New document
- New / Edit vacation

### Validation Rules

- **Email:** required, must be a valid email address.
- **Password:** required, at least 6 characters. In Register, "Confirm password" must match.
- **Amount:** required, must be a number greater than 0, maximum 2 decimal places (comma or dot).
- **Description:** required, between 3 and 100 characters.
- **Vacation dates:** end date cannot be before start date, the period must contain at least one working day, and a paid vacation cannot be longer than the days left.
- **Document:** a photo is required.

Errors are shown under the field in red, and the phone vibrates shortly.

## 9. Native Device Features

### Used Native Feature(s)

- **Camera / Image Picker** (expo-image-picker)
- Also used: **Secure Store**, **Haptics**, **Sharing + File System**, **Date Picker**

### Usage Description

- **Camera / Image Picker** – in "New document" the user takes a photo of an invoice or chooses one from the gallery. The app asks for camera permission and explains why. If access is denied, it offers a button to open the phone settings.
- **Secure Store** – keeps the refresh token safe for automatic login.
- **Haptics** – short vibration on save, delete, form errors and month change.
- **Sharing + File System** – on the document details screen the photo is downloaded to the phone cache and shared with other apps (Viber, email, etc.).
- **Date Picker** – native calendar for record and vacation dates.

## 10. Typical User Flow

1. The user registers and is taken to the Dashboard.
2. In **Finances** they add an expense, for example "Office rent", choose the category "Rent" and mark it as pending.
3. On the **Dashboard** they see the monthly balance and the pending payment. Later they open **Pending payments** and mark it as paid.
4. In **Documents** they take a photo of the invoice and share it with their accountant.
5. In **Vacations** they add a paid vacation and see how many days are left this year.
6. They close the app. The next time they open it, they are logged in automatically.

## 11. Error & Edge Case Handling

- **Authentication errors:** clear messages for wrong email or password, existing email, weak password and no internet. If the session cannot be renewed, the user is logged out with a message.
- **Network or data errors:** each list and details screen shows an error message with a **"Try again"** button. Failed saves or deletes show an alert, and the data on the screen is kept.
- **Empty or missing data:** lists show a friendly empty message (for example "No records yet"). If an item is not found, the details screen shows "not found". The Dashboard shows 0,00 € for months without records.

## Project Structure

```
src/
  api/          requests to Supabase (auth, transactions, documents, vacations)
  components/   reusable UI parts (buttons, form fields, list items)
  contexts/     authentication context
  navigation/   navigators (root stack, tabs, nested stacks)
  reducers/     list reducer (loading, refreshing, error, data)
  screens/      app screens
  utils/        validation, formatting, calculations, haptics
```
