import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import CommandBar from './components/CommandBar';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

function App() {
    const [data, setData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Load data from server
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/data');
            const jsonData = await response.json();
            setData(jsonData);
            setHistory([jsonData]);
            setHistoryIndex(0);
            setHasUnsavedChanges(false);
            showSnackbar('Veri başarıyla yüklendi', 'success');
        } catch (error) {
            console.error('Error loading data:', error);
            showSnackbar('Veri yüklenemedi', 'error');
        } finally {
            setLoading(false);
        }
    };

    const saveData = async () => {
        try {
            const response = await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();

            if (result.success) {
                setHasUnsavedChanges(false);
                showSnackbar(`Veri başarıyla kaydedildi (Yedek: ${result.backup})`, 'success');
            } else {
                showSnackbar('Veri kaydedilemedi', 'error');
            }
        } catch (error) {
            console.error('Error saving data:', error);
            showSnackbar('Veri kaydedilemedi', 'error');
        }
    };

    const updateData = (newData) => {
        setData(newData);
        setHasUnsavedChanges(true);

        // Add to history for undo/redo
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newData);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setData(history[newIndex]);
            setHasUnsavedChanges(true);
            showSnackbar('Geri alma başarılı', 'info');
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setData(history[newIndex]);
            setHasUnsavedChanges(true);
            showSnackbar('Yineleme başarılı', 'info');
        }
    };

    const addCategory = () => {
        const maxId = data.length > 0 ? Math.max(...data.map(c => c.id)) : 0;
        const newCategory = {
            id: maxId + 1,
            title: 'Yeni Kategori',
            imageUrl: '',
            prayers: []
        };
        const newData = [...data, newCategory];
        updateData(newData);
        setSelectedCategory(newCategory);
        showSnackbar('Yeni kategori eklendi', 'success');
    };

    const deleteCategory = (categoryId) => {
        const newData = data.filter(c => c.id !== categoryId);
        updateData(newData);
        if (selectedCategory?.id === categoryId) {
            setSelectedCategory(null);
        }
        showSnackbar('Kategori silindi', 'success');
    };

    const updateCategory = (updatedCategory) => {
        const newData = data.map(c =>
            c.id === updatedCategory.id ? updatedCategory : c
        );
        updateData(newData);
        setSelectedCategory(updatedCategory);
    };

    const reorderCategory = (categoryId, direction) => {
        const index = data.findIndex(c => c.id === categoryId);
        if (index === -1) return;

        if (direction === 'up' && index > 0) {
            const newData = [...data];
            [newData[index], newData[index - 1]] = [newData[index - 1], newData[index]];
            updateData(newData);
            showSnackbar('Kategori yukarı taşındı', 'success');
        } else if (direction === 'down' && index < data.length - 1) {
            const newData = [...data];
            [newData[index], newData[index + 1]] = [newData[index + 1], newData[index]];
            updateData(newData);
            showSnackbar('Kategori aşağı taşındı', 'success');
        }
    };

    const exportData = () => {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `back-end-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        showSnackbar('Veri başarıyla dışa aktarıldı', 'success');
    };

    const importData = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                updateData(importedData);
                showSnackbar('Veri başarıyla içe aktarıldı', 'success');
            } catch (error) {
                showSnackbar('Geçersiz JSON dosyası', 'error');
            }
        };
        reader.readAsText(file);
    };

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <CommandBar
                onSave={saveData}
                onAddCategory={addCategory}
                onExport={exportData}
                onImport={importData}
                onUndo={undo}
                onRedo={redo}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                hasUnsavedChanges={hasUnsavedChanges}
                onRefresh={loadData}
            />

            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <Sidebar
                    categories={data}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    onDeleteCategory={deleteCategory}
                    onReorderCategory={reorderCategory}
                />

                <MainContent
                    category={selectedCategory}
                    onUpdateCategory={updateCategory}
                    showSnackbar={showSnackbar}
                />
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default App;
