# Calendar App

A fully interactive calendar application built with **React**, **Vite**, **Zustand**, **TailwindCSS**, and **Framer Motion**.  
Includes both **Month View** and **Week View** with advanced scheduling features.

This version is the **stable Option A build**, with complete functionality and working Storybook (v7).

---

## 🚀 Features

### 🗓 Calendar Views
- **Month View** with clickable days  
- **Week View** with hourly grid  
- Smooth navigation (Today, Prev, Next)

### 📌 Event Management
- Create events (drag-to-create in Week View)
- Move events (drag-and-drop)
- Resize event duration (drag-resize handle)
- Edit and Delete using modal form
- Color-coded events
- Overlap detection and smart layout
- Automatic duration preservation when moving

### 🎨 UI & UX
- Tailwind CSS styling  
- Clean layout and responsive design  
- Animations via Framer Motion  
- Modal for adding/editing events  

### 📦 State Management
- Zustand store  
- Persistent event storage via LocalStorage  

### 🧪 Storybook Support
- Storybook v7 configured  
- Works with Node 22  
- Stories for:
  - MonthView
  - WeekView
  - EventForm

Run with:
- npm install
- npm run dev
- npm run storybook