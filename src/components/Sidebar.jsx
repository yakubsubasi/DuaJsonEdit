import React, { useState } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    TextField,
    InputAdornment,
    Typography,
    IconButton,
    Chip,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import {
    Search as SearchIcon,
    Delete as DeleteIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';

function Sidebar({ categories, selectedCategory, onSelectCategory, onDeleteCategory, onReorderCategory }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const filteredCategories = categories.filter(category =>
        category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.id.toString().includes(searchTerm)
    );

    const handleDeleteClick = (category, event) => {
        event.stopPropagation();
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            onDeleteCategory(categoryToDelete.id);
        }
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
    };

    const cancelDelete = () => {
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
    };

    return (
        <>
            <Box
                sx={{
                    width: 320,
                    borderRight: '1px solid #e0e0e0',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    bgcolor: '#f5f5f5',
                }}
            >
                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', bgcolor: 'white' }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Kategori ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            {filteredCategories.length} / {categories.length} kategori
                        </Typography>
                    </Box>
                </Box>

                <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
                    {filteredCategories.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Kategori bulunamadı
                            </Typography>
                        </Box>
                    ) : (
                        filteredCategories.map((category, index) => (
                            <ListItem
                                key={category.id}
                                disablePadding
                                secondaryAction={
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        <Tooltip title="Yukarı taşı">
                                            <span>
                                                <IconButton
                                                    edge="end"
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onReorderCategory(category.id, 'up');
                                                    }}
                                                    disabled={index === 0}
                                                    sx={{ color: 'primary.main' }}
                                                >
                                                    <ArrowUpwardIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                        <Tooltip title="Aşağı taşı">
                                            <span>
                                                <IconButton
                                                    edge="end"
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onReorderCategory(category.id, 'down');
                                                    }}
                                                    disabled={index === filteredCategories.length - 1}
                                                    sx={{ color: 'primary.main' }}
                                                >
                                                    <ArrowDownwardIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                        <Tooltip title="Kategoriyi sil">
                                            <IconButton
                                                edge="end"
                                                size="small"
                                                onClick={(e) => handleDeleteClick(category, e)}
                                                sx={{ color: 'error.main' }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                }
                                sx={{
                                    borderBottom: '1px solid #e0e0e0',
                                    bgcolor: selectedCategory?.id === category.id ? 'primary.light' : 'white',
                                    '&:hover': {
                                        bgcolor: selectedCategory?.id === category.id ? 'primary.light' : 'grey.50',
                                    },
                                }}
                            >
                                <ListItemButton
                                    selected={selectedCategory?.id === category.id}
                                    onClick={() => onSelectCategory(category)}
                                    sx={{ pr: 14 }}
                                >
                                    <ListItemText
                                        primary={
                                            <Box>
                                                <Typography variant="body2" fontWeight={500} noWrap>
                                                    {category.title}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                                    <Chip
                                                        label={`ID: ${category.id}`}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ height: 20, fontSize: '0.7rem' }}
                                                    />
                                                    <Chip
                                                        label={`${category.prayers?.length || 0} dua`}
                                                        size="small"
                                                        color="primary"
                                                        sx={{ height: 20, fontSize: '0.7rem' }}
                                                    />
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))
                    )}
                </List>
            </Box>

            <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
                <DialogTitle>Kategoriyi Sil</DialogTitle>
                <DialogContent>
                    <Typography>
                        "{categoryToDelete?.title}" kategorisini silmek istediğinizden emin misiniz?
                        Bu işlem geri alınamaz.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete}>İptal</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Sil
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Sidebar;
