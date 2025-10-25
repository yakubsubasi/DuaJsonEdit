import React from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    Typography,
    Chip,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Save as SaveIcon,
    Add as AddIcon,
    FileDownload as ExportIcon,
    Undo as UndoIcon,
    Redo as RedoIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';

function CommandBar({
    onSave,
    onAddCategory,
    onExport,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    hasUnsavedChanges,
    onRefresh,
}) {

    return (
        <AppBar position="static" color="primary" elevation={2}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
                    Dua JSON Editörü
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexGrow: 1, alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<SaveIcon />}
                        onClick={onSave}
                        sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                    >
                        Kaydet
                    </Button>

                    {hasUnsavedChanges && (
                        <Chip
                            label="Kaydedilmemiş Değişiklikler"
                            color="warning"
                            size="small"
                            sx={{ ml: 1 }}
                        />
                    )}

                    <Box sx={{ borderLeft: '1px solid rgba(255,255,255,0.3)', height: 30, mx: 1 }} />

                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={onAddCategory}
                        sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                    >
                        Kategori Ekle
                    </Button>

                    <Box sx={{ borderLeft: '1px solid rgba(255,255,255,0.3)', height: 30, mx: 1 }} />

                    <Tooltip title="Geri Al (Ctrl+Z)">
                        <span>
                            <IconButton
                                color="inherit"
                                onClick={onUndo}
                                disabled={!canUndo}
                                size="small"
                            >
                                <UndoIcon />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Yinele (Ctrl+Y)">
                        <span>
                            <IconButton
                                color="inherit"
                                onClick={onRedo}
                                disabled={!canRedo}
                                size="small"
                            >
                                <RedoIcon />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Box sx={{ borderLeft: '1px solid rgba(255,255,255,0.3)', height: 30, mx: 1 }} />

                    <Tooltip title="JSON Dışa Aktar">
                        <IconButton color="inherit" onClick={onExport} size="small">
                            <ExportIcon />
                        </IconButton>
                    </Tooltip>

                    <Box sx={{ borderLeft: '1px solid rgba(255,255,255,0.3)', height: 30, mx: 1 }} />

                    <Tooltip title="Dosyadan Yenile">
                        <IconButton color="inherit" onClick={onRefresh} size="small">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default CommandBar;
