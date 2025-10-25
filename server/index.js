import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const DATA_FILE = path.join(__dirname, '..', 'back-end.json');
const BACKUP_DIR = path.join(__dirname, '..', 'backups');

// Ensure backup directory exists
async function ensureBackupDir() {
    try {
        await fs.access(BACKUP_DIR);
    } catch {
        await fs.mkdir(BACKUP_DIR, { recursive: true });
    }
}

// Create backup before saving
async function createBackup() {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.json`);
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        await fs.writeFile(backupFile, data);

        // Keep only last 10 backups
        const files = await fs.readdir(BACKUP_DIR);
        const backups = files
            .filter(f => f.startsWith('backup-'))
            .sort()
            .reverse();

        for (let i = 10; i < backups.length; i++) {
            await fs.unlink(path.join(BACKUP_DIR, backups[i]));
        }

        return backupFile;
    } catch (error) {
        console.error('Backup creation failed:', error);
        throw error;
    }
}

// GET all data
app.get('/api/data', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading data:', error);
        res.status(500).json({ error: 'Failed to read data' });
    }
});

// SAVE all data
app.post('/api/data', async (req, res) => {
    try {
        await ensureBackupDir();
        const backupFile = await createBackup();

        const newData = req.body;
        await fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), 'utf-8');

        res.json({
            success: true,
            message: 'Data saved successfully',
            backup: path.basename(backupFile)
        });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// GET specific category
app.get('/api/categories/:id', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        const categories = JSON.parse(data);
        const category = categories.find(c => c.id === parseInt(req.params.id));

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        console.error('Error reading category:', error);
        res.status(500).json({ error: 'Failed to read category' });
    }
});

// GET backup list
app.get('/api/backups', async (req, res) => {
    try {
        await ensureBackupDir();
        const files = await fs.readdir(BACKUP_DIR);
        const backups = files
            .filter(f => f.startsWith('backup-'))
            .map(f => ({
                filename: f,
                path: path.join(BACKUP_DIR, f)
            }))
            .sort()
            .reverse();

        res.json(backups);
    } catch (error) {
        console.error('Error listing backups:', error);
        res.status(500).json({ error: 'Failed to list backups' });
    }
});

// RESTORE from backup
app.post('/api/restore/:filename', async (req, res) => {
    try {
        const backupFile = path.join(BACKUP_DIR, req.params.filename);
        const data = await fs.readFile(backupFile, 'utf-8');
        await fs.writeFile(DATA_FILE, data);

        res.json({
            success: true,
            message: 'Data restored successfully'
        });
    } catch (error) {
        console.error('Error restoring backup:', error);
        res.status(500).json({ error: 'Failed to restore backup' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Data file: ${DATA_FILE}`);
    console.log(`Backup directory: ${BACKUP_DIR}`);
});
