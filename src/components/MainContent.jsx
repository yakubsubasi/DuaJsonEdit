import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Chip,
    Divider,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    ContentCopy as CopyIcon,
    Info as InfoIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';

function MainContent({ category, onUpdateCategory, showSnackbar }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    if (!category) {
        return (
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: '#fafafa',
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <InfoIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" color="text.secondary">
                        Düzenlemek için bir kategori seçin
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Detayları görüntülemek ve düzenlemek için sol kenar çubuğundan bir kategori seçin
                    </Typography>
                </Box>
            </Box>
        );
    }

    const updateField = (field, value) => {
        onUpdateCategory({ ...category, [field]: value });
    };

    const addPrayer = () => {
        const maxPrayerId = category.prayers.length > 0
            ? Math.max(...category.prayers.map(p => p.prayerId))
            : 0;

        const newPrayer = {
            prayerId: maxPrayerId + 1,
            contents: [],
            repeat: 1,
        };

        updateField('prayers', [...category.prayers, newPrayer]);
        showSnackbar('Dua başarıyla eklendi', 'success');
    };

    const updatePrayer = (prayerId, updatedPrayer) => {
        const updatedPrayers = category.prayers.map(p =>
            p.prayerId === prayerId ? updatedPrayer : p
        );
        updateField('prayers', updatedPrayers);
    };

    const deletePrayer = (prayerId) => {
        const updatedPrayers = category.prayers.filter(p => p.prayerId !== prayerId);
        updateField('prayers', updatedPrayers);
        showSnackbar('Dua başarıyla silindi', 'success');
    };

    const duplicatePrayer = (prayer) => {
        const maxPrayerId = Math.max(...category.prayers.map(p => p.prayerId));
        const newPrayer = {
            ...prayer,
            prayerId: maxPrayerId + 1,
            contents: prayer.contents.map(c => ({ ...c, id: c.id + 10000 })), // Offset IDs
        };
        updateField('prayers', [...category.prayers, newPrayer]);
        showSnackbar('Dua başarıyla kopyalandı', 'success');
    };

    const addContent = (prayerId) => {
        const prayer = category.prayers.find(p => p.prayerId === prayerId);
        const maxContentId = prayer.contents.length > 0
            ? Math.max(...prayer.contents.map(c => c.id))
            : prayerId * 1000;

        const newContent = {
            id: maxContentId + 1,
            contentText: '',
            contentType: 'content',
            contentLanguage: 'tr',
        };

        const updatedPrayer = {
            ...prayer,
            contents: [...prayer.contents, newContent],
        };

        updatePrayer(prayerId, updatedPrayer);
        showSnackbar('İçerik başarıyla eklendi', 'success');
    };

    const updateContent = (prayerId, contentId, field, value) => {
        const prayer = category.prayers.find(p => p.prayerId === prayerId);
        const updatedContents = prayer.contents.map(c =>
            c.id === contentId ? { ...c, [field]: value } : c
        );
        updatePrayer(prayerId, { ...prayer, contents: updatedContents });
    };

    const deleteContent = (prayerId, contentId) => {
        const prayer = category.prayers.find(p => p.prayerId === prayerId);
        const updatedContents = prayer.contents.filter(c => c.id !== contentId);
        updatePrayer(prayerId, { ...prayer, contents: updatedContents });
        showSnackbar('İçerik başarıyla silindi', 'success');
    };

    const reorderPrayer = (prayerId, direction) => {
        const index = category.prayers.findIndex(p => p.prayerId === prayerId);
        if (index === -1) return;

        if (direction === 'up' && index > 0) {
            const newPrayers = [...category.prayers];
            [newPrayers[index], newPrayers[index - 1]] = [newPrayers[index - 1], newPrayers[index]];
            updateField('prayers', newPrayers);
            showSnackbar('Dua yukarı taşındı', 'success');
        } else if (direction === 'down' && index < category.prayers.length - 1) {
            const newPrayers = [...category.prayers];
            [newPrayers[index], newPrayers[index + 1]] = [newPrayers[index + 1], newPrayers[index]];
            updateField('prayers', newPrayers);
            showSnackbar('Dua aşağı taşındı', 'success');
        }
    };

    const reorderContent = (prayerId, contentId, direction) => {
        const prayer = category.prayers.find(p => p.prayerId === prayerId);
        const index = prayer.contents.findIndex(c => c.id === contentId);
        if (index === -1) return;

        if (direction === 'up' && index > 0) {
            const newContents = [...prayer.contents];
            [newContents[index], newContents[index - 1]] = [newContents[index - 1], newContents[index]];
            updatePrayer(prayerId, { ...prayer, contents: newContents });
            showSnackbar('İçerik yukarı taşındı', 'success');
        } else if (direction === 'down' && index < prayer.contents.length - 1) {
            const newContents = [...prayer.contents];
            [newContents[index], newContents[index + 1]] = [newContents[index + 1], newContents[index]];
            updatePrayer(prayerId, { ...prayer, contents: newContents });
            showSnackbar('İçerik aşağı taşındı', 'success');
        }
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            if (itemToDelete.type === 'prayer') {
                deletePrayer(itemToDelete.id);
            } else if (itemToDelete.type === 'content') {
                deleteContent(itemToDelete.prayerId, itemToDelete.id);
            }
        }
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };

    return (
        <Box sx={{ flex: 1, overflow: 'auto', bgcolor: '#fafafa' }}>
            <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
                {/* Category Details */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h5" gutterBottom fontWeight={600}>
                        Kategori Detayları
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <TextField
                        label="Kategori ID"
                        value={category.id}
                        disabled
                        fullWidth
                        margin="normal"
                        size="small"
                    />

                    <TextField
                        label="Başlık"
                        value={category.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        fullWidth
                        margin="normal"
                        size="small"
                    />

                    <TextField
                        label="Resim URL"
                        value={category.imageUrl}
                        onChange={(e) => updateField('imageUrl', e.target.value)}
                        fullWidth
                        margin="normal"
                        size="small"
                        helperText="Kategori resmi için URL girin"
                    />

                    {category.imageUrl && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                Resim Önizleme:
                            </Typography>
                            <Box
                                component="img"
                                src={category.imageUrl}
                                alt={category.title}
                                sx={{
                                    mt: 1,
                                    maxWidth: '100%',
                                    maxHeight: 200,
                                    borderRadius: 1,
                                    border: '1px solid #e0e0e0',
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </Box>
                    )}
                </Paper>

                {/* Prayers Section */}
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" fontWeight={600}>
                            Dualar ({category.prayers.length})
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={addPrayer}
                        >
                            Dua Ekle
                        </Button>
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    {category.prayers.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                                Henüz dua yok. Oluşturmak için "Dua Ekle"ye tıklayın.
                            </Typography>
                        </Box>
                    ) : (
                        category.prayers.map((prayer, index) => (
                            <Accordion key={prayer.prayerId} defaultExpanded={index === 0} sx={{ mb: 2 }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                        <Chip label={`Dua ${prayer.prayerId}`} color="primary" size="small" />
                                        <Chip label={`${prayer.contents.length} içerik`} size="small" variant="outlined" />
                                        <Chip label={`Tekrar: ${prayer.repeat}x`} size="small" variant="outlined" />
                                        <Box sx={{ flex: 1 }} />
                                        <Tooltip title="Yukarı taşı">
                                            <span>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        reorderPrayer(prayer.prayerId, 'up');
                                                    }}
                                                    disabled={index === 0}
                                                >
                                                    <ArrowUpwardIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                        <Tooltip title="Aşağı taşı">
                                            <span>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        reorderPrayer(prayer.prayerId, 'down');
                                                    }}
                                                    disabled={index === category.prayers.length - 1}
                                                >
                                                    <ArrowDownwardIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                duplicatePrayer(prayer);
                                            }}
                                        >
                                            <CopyIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick({ type: 'prayer', id: prayer.prayerId });
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TextField
                                        label="Tekrar Sayısı"
                                        type="number"
                                        value={prayer.repeat}
                                        onChange={(e) => updatePrayer(prayer.prayerId, { ...prayer, repeat: parseInt(e.target.value) || 1 })}
                                        size="small"
                                        sx={{ mb: 3, width: 150 }}
                                    />

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6">
                                            İçerik Öğeleri
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<AddIcon />}
                                            onClick={() => addContent(prayer.prayerId)}
                                        >
                                            İçerik Ekle
                                        </Button>
                                    </Box>

                                    {prayer.contents.map((content, contentIndex) => (
                                        <Card key={content.id} sx={{ mb: 2, bgcolor: '#f9f9f9' }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Chip label={`ID: ${content.id}`} size="small" variant="outlined" />
                                                        <Chip
                                                            label={content.contentLanguage.toUpperCase()}
                                                            size="small"
                                                            color={content.contentLanguage === 'ar' ? 'success' : 'info'}
                                                        />
                                                        <Chip
                                                            label={content.contentType}
                                                            size="small"
                                                            color={content.contentType === 'note' ? 'warning' : 'default'}
                                                        />
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                        <Tooltip title="Yukarı taşı">
                                                            <span>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => reorderContent(prayer.prayerId, content.id, 'up')}
                                                                    disabled={contentIndex === 0}
                                                                >
                                                                    <ArrowUpwardIcon fontSize="small" />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>
                                                        <Tooltip title="Aşağı taşı">
                                                            <span>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => reorderContent(prayer.prayerId, content.id, 'down')}
                                                                    disabled={contentIndex === prayer.contents.length - 1}
                                                                >
                                                                    <ArrowDownwardIcon fontSize="small" />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDeleteClick({ type: 'content', id: content.id, prayerId: prayer.prayerId })}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Box>

                                                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                                    <TextField
                                                        select
                                                        label="Tip"
                                                        value={content.contentType}
                                                        onChange={(e) => updateContent(prayer.prayerId, content.id, 'contentType', e.target.value)}
                                                        size="small"
                                                        SelectProps={{ native: true }}
                                                        sx={{ width: 150 }}
                                                    >
                                                        <option value="content">İçerik</option>
                                                        <option value="note">Not</option>
                                                    </TextField>

                                                    <TextField
                                                        select
                                                        label="Dil"
                                                        value={content.contentLanguage}
                                                        onChange={(e) => updateContent(prayer.prayerId, content.id, 'contentLanguage', e.target.value)}
                                                        size="small"
                                                        SelectProps={{ native: true }}
                                                        sx={{ width: 150 }}
                                                    >
                                                        <option value="tr">Türkçe (TR)</option>
                                                        <option value="ar">Arapça (AR)</option>
                                                    </TextField>
                                                </Box>

                                                <TextField
                                                    label="İçerik Metni"
                                                    value={content.contentText}
                                                    onChange={(e) => updateContent(prayer.prayerId, content.id, 'contentText', e.target.value)}
                                                    multiline
                                                    rows={4}
                                                    fullWidth
                                                    dir={content.contentLanguage === 'ar' ? 'rtl' : 'ltr'}
                                                />
                                            </CardContent>
                                        </Card>
                                    ))}

                                    {prayer.contents.length === 0 && (
                                        <Box sx={{ textAlign: 'center', py: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Henüz içerik öğesi yok. Oluşturmak için "İçerik Ekle"ye tıklayın.
                                            </Typography>
                                        </Box>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        ))
                    )}
                </Paper>
            </Box>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Silmeyi Onayla</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bu {itemToDelete?.type === 'prayer' ? 'duayı' : 'içeriği'} silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Sil
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default MainContent;
