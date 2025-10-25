# Back-end.json Structure Documentation

## Overview
This JSON file contains a collection of Islamic prayers (duas) and religious content organized in a hierarchical structure. The file is designed to store multilingual religious texts, including prayers, Quranic verses, hadiths, and explanatory content.

## File Structure

### Root Level
The file contains an **array** of category objects. Each category represents a thematic collection of prayers.

---

## Schema Breakdown

### 1. Category Object (Root Array Element)

Each object in the root array represents a prayer category with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `id` | Number | Unique identifier for the category |
| `title` | String | Name/title of the prayer category (in Turkish) |
| `imageUrl` | String | URL to an associated image for the category |
| `prayers` | Array | Collection of prayer objects within this category |

**Example:**
```json
{
    "id": 309,
    "title": "Hısnu'l Muslim Kur'an ve Sünnette Müslümanın Sığınağı",
    "imageUrl": "https://images.pexels.com/photos/...",
    "prayers": [...]
}
```

---

### 2. Prayer Object

Each prayer object within the `prayers` array contains:

| Property | Type | Description |
|----------|------|-------------|
| `prayerId` | Number | Unique identifier for the prayer |
| `contents` | Array | Collection of content items that make up the prayer |
| `repeat` | Number | Number of times this prayer should be repeated (typically 1) |

**Example:**
```json
{
    "prayerId": 1,
    "contents": [...],
    "repeat": 1
}
```

---

### 3. Content Object

Each content object within the `contents` array represents a piece of text with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `id` | Number | Unique identifier for the content item |
| `contentText` | String | The actual text content |
| `contentType` | String | Type of content (see Content Types below) |
| `contentLanguage` | String | Language code of the content |

**Example:**
```json
{
    "id": 2657,
    "contentText": "Hamd, Allah'adır...",
    "contentType": "content",
    "contentLanguage": "tr"
}
```

---

## Content Types

The `contentType` field can have the following values:

| Content Type | Description |
|--------------|-------------|
| `content` | Main prayer or religious text content |
| `note` | Additional notes, references, or citations |

---

## Language Codes

The `contentLanguage` field uses ISO language codes:

| Code | Language |
|------|----------|
| `tr` | Turkish |
| `ar` | Arabic |

---

## Data Organization Pattern

The typical organization pattern within a prayer is:

1. **Introductory Content** - Introduction or context (Turkish)
2. **Arabic Text** - Original Arabic prayer/verse
3. **Arabic Reference** - Source reference in Arabic (as note)
4. **Turkish Translation** - Translation of the Arabic text
5. **Turkish Reference** - Source reference in Turkish (as note)

**Example Flow:**
```
Content (tr) → Content (ar) → Note (ar) → Content (tr) → Note (tr)
```

---

## Key Characteristics

1. **Hierarchical Structure**: Category → Prayer → Content items
2. **Multilingual Support**: Content is stored in both Arabic and Turkish
3. **Metadata Rich**: Each level includes unique identifiers for easy reference
4. **Source Attribution**: Notes are used to cite Islamic sources (Quran, Hadith collections)
5. **Flexible Content**: Content items can be combined to form complete prayers with context, original text, and translations

---

## Use Cases

This structure is designed to support:
- **Prayer/Dua Applications**: Mobile or web apps displaying Islamic prayers
- **Multilingual Display**: Showing original Arabic text alongside translations
- **Content Management**: Easy editing and organization of religious content
- **Citation Tracking**: Maintaining references to original Islamic sources
- **Categorization**: Organizing prayers by themes or occasions

---

## Sample Data Structure

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
                        "contentText": "Prayer text in Turkish",
                        "contentType": "content",
                        "contentLanguage": "tr"
                    },
                    {
                        "id": 2658,
                        "contentText": "Arabic prayer text",
                        "contentType": "content",
                        "contentLanguage": "ar"
                    },
                    {
                        "id": 2659,
                        "contentText": "Source reference",
                        "contentType": "note",
                        "contentLanguage": "tr"
                    }
                ],
                "repeat": 1
            }
        ]
    }
]
```

---

## File Statistics

- **Total Lines**: 9,043 lines
- **Format**: JSON
- **Encoding**: UTF-8 (supports Arabic and Turkish characters)
- **Structure Depth**: 4 levels (Root → Category → Prayer → Content)

---

## Notes for Developers

1. **IDs are Unique**: Each `id`, `prayerId`, and content `id` should be unique across the entire file
2. **Order Matters**: Content items should be displayed in the order they appear in the array
3. **Image URLs**: All image URLs point to external resources (Pexels, Freepik)
4. **Character Encoding**: Ensure UTF-8 encoding is maintained when editing to preserve Arabic text
5. **Repeat Field**: The `repeat` field indicates how many times a prayer should be recited (currently all set to 1)

---

## Example Implementation Scenarios

### Displaying a Prayer
1. Find the category by `id`
2. Select the prayer by `prayerId`
3. Iterate through `contents` array in order
4. Display each content item based on its `contentType` and `contentLanguage`
5. Apply special formatting for `note` type items (e.g., smaller font, italics)

### Filtering by Language
```javascript
const turkishContent = prayer.contents.filter(c => c.contentLanguage === 'tr');
const arabicContent = prayer.contents.filter(c => c.contentLanguage === 'ar');
```

### Finding References
```javascript
const references = prayer.contents.filter(c => c.contentType === 'note');
```

---

*Last Updated: October 25, 2025*
