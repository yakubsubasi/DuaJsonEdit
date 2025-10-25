# Quick Start Guide

## Getting Started in 3 Steps

### Step 1: Install & Start
```bash
npm install
npm run dev
```

### Step 2: Open Browser
Navigate to: **http://localhost:3000**

### Step 3: Start Editing!
- Click a category on the left
- Edit the details on the right
- Click "Save" when done

---

## Common Tasks

### ➕ Add a New Category
1. Click "Add Category" button in top bar
2. Edit the title and image URL
3. Click "Save"

### ✏️ Edit Existing Content
1. Click category in left sidebar
2. Expand a prayer accordion
3. Modify content text
4. Change language/type if needed
5. Click "Save"

### 🔄 Add a Prayer
1. Select a category
2. Click "Add Prayer" button
3. Click "Add Content" to add content items
4. Fill in the content text
5. Click "Save"

### 🗑️ Delete Something
1. Click the trash icon next to any item
2. Confirm deletion in dialog
3. Click "Save"

### 📋 Duplicate a Prayer
1. Find the prayer you want to copy
2. Click the copy icon
3. Edit the duplicated prayer
4. Click "Save"

### 🔍 Search Categories
1. Type in the search box at top of sidebar
2. Results filter automatically
3. Click any result to edit

### ↩️ Undo a Mistake
- Click the undo button, or press Ctrl+Z
- Click redo button, or press Ctrl+Y

### 💾 Export Data
1. Click the download icon in top bar
2. File downloads with today's date
3. Save for backup or sharing

### 📤 Import Data
1. Click the upload icon in top bar
2. Select a JSON file
3. Data replaces current content
4. Click "Save" to persist

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo last change |
| Ctrl+Y | Redo last undone change |
| Tab | Navigate between fields |
| Enter | Submit/Confirm (in dialogs) |

---

## Tips & Tricks

💡 **Use Search**: Type category ID or title fragment to quickly find what you need

💡 **Check Image Preview**: After entering an image URL, scroll down to see if it loaded correctly

💡 **Language Matters**: Make sure to select the correct language (TR/AR) for content

💡 **Note vs Content**: Use "note" type for references and citations, "content" for actual prayers

💡 **Backups Are Automatic**: Every save creates a backup in the `backups/` folder

💡 **Unsaved Changes**: Look for the orange "Unsaved Changes" chip in the top bar

💡 **Prayer Order**: Prayers and content appear in the order they're listed (top to bottom)

---

## Troubleshooting

**❌ Can't see my changes**
- Make sure you clicked "Save"
- Check for the unsaved changes indicator

**❌ Search isn't working**
- Clear the search box and try again
- Search is case-insensitive

**❌ Image won't load**
- Verify the URL is correct
- Check if the image URL is publicly accessible

**❌ Lost data after refresh**
- If you didn't save, use Ctrl+Z to undo
- Check the `backups/` folder for recent backups

**❌ Application won't start**
- Run `npm install` first
- Check if ports 3000 and 5000 are available
- Make sure `back-end.json` exists

---

## Need Help?

Check these files for more information:
- `README.md` - Complete documentation
- `FEATURES.md` - Full feature list
- `JSON_STRUCTURE.md` - Data structure reference

---

**Happy Editing! 🎉**
