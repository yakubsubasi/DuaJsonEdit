# Dua JSON Editor - Admin Panel

A comprehensive web-based admin panel for editing Islamic prayers (Duas) JSON data. This application provides a user-friendly interface to manage categories, prayers, and multilingual content with automatic backup functionality.

![Admin Panel](https://img.shields.io/badge/React-18.2-blue) ![Material--UI](https://img.shields.io/badge/Material--UI-5.14-blue) ![Express](https://img.shields.io/badge/Express-4.18-green)

## Features

### 🎯 Core Functionality
- **Category Management**: Create, edit, and delete prayer categories
- **Prayer Management**: Add, edit, duplicate, and delete prayers within categories
- **Content Management**: Manage multilingual content items (Arabic and Turkish)
- **Search & Filter**: Quick search functionality in the category sidebar
- **Auto-save Detection**: Visual indicator for unsaved changes

### 💾 Data Management
- **Direct JSON Editing**: Changes are saved directly to `back-end.json`
- **Automatic Backups**: Every save creates a timestamped backup (keeps last 10)
- **Import/Export**: Import and export JSON data files
- **Undo/Redo**: Full history management with keyboard shortcuts

### 🎨 User Interface
- **Left Sidebar**: 
  - Searchable category list
  - Category counter and prayer count chips
  - Quick delete functionality
  
- **Command Bar** (Top):
  - Save button with unsaved changes indicator
  - Add new category
  - Undo/Redo buttons (Ctrl+Z, Ctrl+Y)
  - Export/Import JSON files
  - Refresh from file
  
- **Main Content Area**:
  - Category details editor (ID, title, image URL)
  - Image preview
  - Expandable prayer accordions
  - Content item editors with language and type selection
  - Duplicate prayer functionality
  - RTL text support for Arabic content

### 🔒 Safety Features
- Confirmation dialogs for delete operations
- Automatic backup before every save
- Data validation
- Error notifications with snackbar alerts

## Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd /Users/yakubsubasi/development/projects/DuaJsonEdit
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Usage

### Starting the Application

Run both the backend server and frontend development server:

```bash
npm run dev
```

This will start:
- **Backend API**: http://localhost:5000
- **Frontend App**: http://localhost:3000

Open your browser and navigate to **http://localhost:3000**

### Alternative: Run Separately

**Backend only**:
```bash
npm run server
```

**Frontend only**:
```bash
npm run client
```

## How to Use

### 1. **Select a Category**
- Click on any category in the left sidebar to view and edit its details
- Use the search box to quickly find categories by name or ID

### 2. **Edit Category Details**
- Modify the category title
- Update the image URL
- See live preview of the category image

### 3. **Manage Prayers**
- Click "Add Prayer" to create a new prayer
- Expand/collapse prayer accordions
- Set the repeat count for each prayer
- Duplicate prayers using the copy icon
- Delete prayers using the trash icon

### 4. **Manage Content Items**
- Add content items to prayers with "Add Content" button
- Edit content text (supports multiline)
- Choose content type: `content` or `note`
- Select language: Turkish (TR) or Arabic (AR)
- Arabic text automatically displays right-to-left

### 5. **Save Changes**
- Click the **Save** button in the command bar
- A backup is automatically created before saving
- Success notification appears with backup filename

### 6. **Import/Export**
- **Export**: Download current data as JSON file
- **Import**: Upload a JSON file to replace current data

### 7. **Undo/Redo**
- Use the undo/redo buttons in the command bar
- Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y (redo)

## Project Structure

```
DuaJsonEdit/
├── src/
│   ├── components/
│   │   ├── CommandBar.jsx      # Top toolbar with actions
│   │   ├── Sidebar.jsx          # Left category navigation
│   │   └── MainContent.jsx      # Main editing area
│   ├── App.jsx                  # Main application component
│   └── main.jsx                 # Application entry point
├── server/
│   └── index.js                 # Express backend server
├── backups/                     # Auto-generated backups (created on first save)
├── back-end.json                # Main data file
├── package.json
├── vite.config.js
└── index.html
```

## API Endpoints

The backend server provides the following endpoints:

- `GET /api/data` - Get all data
- `POST /api/data` - Save all data (creates backup)
- `GET /api/categories/:id` - Get specific category
- `GET /api/backups` - List all backups
- `POST /api/restore/:filename` - Restore from backup

## Data Structure

The application manages data with the following structure:

```json
[
  {
    "id": 309,
    "title": "Category Title",
    "imageUrl": "https://example.com/image.jpg",
    "prayers": [
      {
        "prayerId": 1,
        "contents": [
          {
            "id": 2657,
            "contentText": "Prayer text",
            "contentType": "content",
            "contentLanguage": "tr"
          }
        ],
        "repeat": 1
      }
    ]
  }
]
```

See `JSON_STRUCTURE.md` for detailed schema documentation.

## Backup System

- Backups are created automatically before each save
- Stored in `backups/` directory with timestamp
- Format: `backup-YYYY-MM-DDTHH-MM-SS.json`
- Last 10 backups are kept automatically
- Backups can be restored via API endpoint

## Technologies Used

- **Frontend**:
  - React 18.2
  - Material-UI (MUI) 5.14
  - Vite 5.0 (build tool)

- **Backend**:
  - Node.js
  - Express.js 4.18
  - CORS enabled

## Browser Support

Works on all modern browsers:
- Chrome, Firefox, Safari, Edge (latest versions)

## Tips & Best Practices

1. **Save Frequently**: Click save after making important changes
2. **Use Search**: Use the sidebar search to quickly find categories
3. **Check Backups**: Backups folder contains recent versions
4. **Preview Images**: Verify image URLs by checking the preview
5. **Language Selection**: Make sure to select the correct language for content
6. **Content Order**: Content items are displayed in the order they appear in the array

## Troubleshooting

**Port Already in Use**:
If port 3000 or 5000 is already in use, you can modify the ports in:
- Frontend: `vite.config.js` (server.port)
- Backend: `server/index.js` (PORT constant)

**Cannot Save Data**:
- Check file permissions on `back-end.json`
- Ensure the file is not open in another application

**Import Fails**:
- Verify the JSON file structure matches the expected format
- Check for valid JSON syntax

## License

This project is for managing Islamic prayer data and is intended for personal or community use.

---

**Created with ❤️ for managing Islamic prayer data**
