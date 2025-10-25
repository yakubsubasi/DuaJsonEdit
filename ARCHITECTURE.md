# Application Workflow & Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (localhost:3000)                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  React Application                      │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │ CommandBar   │  │   Sidebar    │  │ MainContent  │ │ │
│  │  │              │  │              │  │              │ │ │
│  │  │ - Save       │  │ - Categories │  │ - Editor     │ │ │
│  │  │ - Undo/Redo  │  │ - Search     │  │ - Prayers    │ │ │
│  │  │ - Export     │  │ - Select     │  │ - Contents   │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  │                                                         │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │            App.jsx (State Management)            │ │ │
│  │  │  - Data state                                    │ │ │
│  │  │  - History (undo/redo)                           │ │ │
│  │  │  - Selection state                               │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │ (Proxy: /api/*)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Express Server (localhost:5000)                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    API Endpoints                        │ │
│  │  GET  /api/data           - Fetch all data             │ │
│  │  POST /api/data           - Save all data              │ │
│  │  GET  /api/categories/:id - Get category               │ │
│  │  GET  /api/backups        - List backups               │ │
│  │  POST /api/restore/:file  - Restore backup             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
        ┌────────────────────┐  ┌──────────────┐
        │   back-end.json    │  │  backups/    │
        │  (Main data file)  │  │  (Auto-saved)│
        └────────────────────┘  └──────────────┘
```

## Data Flow

### 1. Initial Load
```
User Opens Browser
       │
       ▼
React App Mounts
       │
       ▼
useEffect Hook Triggers
       │
       ▼
Fetch /api/data
       │
       ▼
Server Reads back-end.json
       │
       ▼
JSON Parsed & Sent to Client
       │
       ▼
State Updated (setData)
       │
       ▼
UI Renders Categories in Sidebar
```

### 2. Edit Flow
```
User Clicks Category
       │
       ▼
setSelectedCategory(category)
       │
       ▼
MainContent Re-renders with Category Data
       │
       ▼
User Edits Field (title, prayer, content)
       │
       ▼
onChange Handler Triggered
       │
       ▼
updateData(newData) Called
       │
       ▼
State Updated
       │
       ▼
History Updated (for undo/redo)
       │
       ▼
hasUnsavedChanges = true
       │
       ▼
UI Shows "Unsaved Changes" Chip
```

### 3. Save Flow
```
User Clicks Save Button
       │
       ▼
POST /api/data with Current State
       │
       ▼
Server Creates Backup (timestamp)
       │
       ▼
Backup Saved to backups/
       │
       ▼
Server Writes to back-end.json
       │
       ▼
Success Response with Backup Name
       │
       ▼
hasUnsavedChanges = false
       │
       ▼
Success Snackbar Appears
```

### 4. Undo/Redo Flow
```
User Clicks Undo (or Ctrl+Z)
       │
       ▼
historyIndex Decremented
       │
       ▼
setData(history[newIndex])
       │
       ▼
UI Updates with Previous State
       │
       ▼
hasUnsavedChanges = true
```

## Component Hierarchy

```
App
├── CommandBar
│   ├── Save Button
│   ├── Add Category Button
│   ├── Undo/Redo Buttons
│   ├── Export/Import Buttons
│   └── Refresh Button
│
├── Sidebar
│   ├── Search TextField
│   ├── Category List
│   │   └── Category Items
│   │       ├── Category Info
│   │       ├── Prayer Count Chip
│   │       └── Delete Button
│   └── Delete Confirmation Dialog
│
├── MainContent
│   ├── Category Details Section
│   │   ├── ID Field (readonly)
│   │   ├── Title Field
│   │   ├── Image URL Field
│   │   └── Image Preview
│   │
│   ├── Prayers Section
│   │   ├── Add Prayer Button
│   │   └── Prayer Accordions
│   │       ├── Prayer Header
│   │       │   ├── Prayer ID Chip
│   │       │   ├── Content Count Chip
│   │       │   ├── Repeat Chip
│   │       │   ├── Duplicate Button
│   │       │   └── Delete Button
│   │       │
│   │       └── Prayer Content
│   │           ├── Repeat Count Field
│   │           ├── Add Content Button
│   │           └── Content Items
│   │               ├── Content Metadata (ID, Language, Type)
│   │               ├── Type Selector
│   │               ├── Language Selector
│   │               ├── Content Text Field
│   │               └── Delete Button
│   │
│   └── Delete Confirmation Dialog
│
└── Snackbar (Notifications)
```

## State Management

### Global State (App.jsx)
```javascript
{
  data: [],                    // All categories
  selectedCategory: null,      // Currently selected category
  loading: false,              // Initial load state
  hasUnsavedChanges: false,    // Save indicator
  snackbar: {                  // Notification state
    open: false,
    message: '',
    severity: 'info'
  },
  history: [],                 // Undo/redo history
  historyIndex: -1             // Current position in history
}
```

### Data Structure
```javascript
// Category
{
  id: Number,           // Unique ID
  title: String,        // Category name
  imageUrl: String,     // Image URL
  prayers: [Prayer]     // Array of prayers
}

// Prayer
{
  prayerId: Number,     // Unique ID
  contents: [Content],  // Array of content items
  repeat: Number        // Times to repeat
}

// Content
{
  id: Number,              // Unique ID
  contentText: String,     // The actual text
  contentType: String,     // 'content' | 'note'
  contentLanguage: String  // 'tr' | 'ar'
}
```

## File Operations

### Backup Process
```
1. User clicks Save
2. Server reads current back-end.json
3. Creates timestamp: "2025-10-25T14-30-00.json"
4. Writes current data to backups/ folder
5. Checks backup count
6. If > 10 backups, deletes oldest
7. Writes new data to back-end.json
8. Returns success with backup filename
```

### Import Process
```
1. User clicks Import icon
2. File input opens
3. User selects JSON file
4. FileReader reads file content
5. JSON.parse validates structure
6. If valid: updateData(imported)
7. If invalid: Show error snackbar
8. User must click Save to persist
```

### Export Process
```
1. User clicks Export icon
2. Current data converted to JSON string
3. Blob created with JSON data
4. Temporary download link created
5. Filename: "back-end-YYYY-MM-DD.json"
6. Browser downloads file
7. Temporary URL revoked
```

## Error Handling

```
Frontend Errors → Snackbar Notification
Backend Errors → Console Log + 500 Response
File System Errors → Try-Catch + Error Response
JSON Parse Errors → Validation + User Notification
```

## Performance Optimizations

1. **Lazy Loading**: Accordions only render expanded content
2. **Conditional Rendering**: Empty states prevent unnecessary renders
3. **Event Delegation**: Single handlers for multiple items
4. **Debouncing**: Search input can be typed freely
5. **State Batching**: React batches state updates automatically

---

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Unidirectional data flow
- ✅ Automatic backup protection
- ✅ Full undo/redo support
- ✅ Real-time UI updates
- ✅ Error resilience
