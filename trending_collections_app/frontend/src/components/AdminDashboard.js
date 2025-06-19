import { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  ViewList as ViewListIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

function AdminDashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [trends, setTrends] = useState([]);
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState('');
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTrend, setCurrentTrend] = useState({
    original_query: '',
    trend_topic: '',
    description: '',
    reformulated_queries: '',
    category: ''
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [activeTab, setActiveTab] = useState(0);
  const drawerWidth = 240;

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('http://localhost:5000/api/trends', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched data:', data);
        
        if (Array.isArray(data)) {
          setTrends(data);
          const uniqueQueries = [...new Set(data.map(trend => trend.original_query))];
          console.log('Unique queries:', uniqueQueries);
          setQueries(uniqueQueries);
          setError(null);
        } else {
          setError('Invalid data format received');
        }
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        setError('Failed to fetch trends: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Error connecting to the server');
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleOpenDialog = (trend = null) => {
    if (trend) {
      setCurrentTrend({...trend});
      setEditMode(true);
    } else {
      setCurrentTrend({
        original_query: '',
        trend_topic: '',
        description: '',
        reformulated_queries: '',
        category: ''
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Reset current trend when closing dialog
    setCurrentTrend({
      original_query: '',
      trend_topic: '',
      description: '',
      reformulated_queries: '',
      category: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTrend({
      ...currentTrend,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('No authentication token found', 'error');
        return;
      }

      const url = editMode 
        ? `http://localhost:5000/api/trends/${currentTrend.id}`
        : 'http://localhost:5000/api/trends';
      
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentTrend)
      });

      if (response.ok) {
        const message = editMode ? 'Trend updated successfully' : 'Trend created successfully';
        showNotification(message, 'success');
        fetchTrends();
        handleCloseDialog();
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'Operation failed', 'error');
      }
    } catch (error) {
      showNotification('Error connecting to the server', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trend?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('No authentication token found', 'error');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/trends/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        showNotification('Trend deleted successfully', 'success');
        fetchTrends();
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'Delete operation failed', 'error');
      }
    } catch (error) {
      showNotification('Error connecting to the server', 'error');
    }
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    // Reset current trend when changing tabs to avoid data persistence
    setCurrentTrend({
      original_query: '',
      trend_topic: '',
      description: '',
      reformulated_queries: '',
      category: ''
    });
  };

  const drawer = (
    <Box>
      <Toolbar />
      <List>
        <ListItem button onClick={() => handleTabChange(0)}>
          <ListItemIcon sx={{ color: 'white' }}>
            <ViewListIcon />
          </ListItemIcon>
          <ListItemText primary="View Trends" />
        </ListItem>
        <ListItem button onClick={() => handleTabChange(1)}>
          <ListItemIcon sx={{ color: 'white' }}>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add Trend" />
        </ListItem>
        <ListItem button onClick={() => handleTabChange(2)}>
          <ListItemIcon sx={{ color: 'white' }}>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary="Edit Trends" />
        </ListItem>
        <ListItem button onClick={() => handleTabChange(3)}>
          <ListItemIcon sx={{ color: 'white' }}>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary="Delete Trends" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#232f3e'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('isAdmin');
              window.location.href = '/login';
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: '#232f3e',
              color: 'white'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: '#232f3e',
              color: 'white'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8
        }}
      >
        {error && (
          <Paper sx={{ p: 2, mb: 2, bgcolor: '#ffebee' }}>
            <Typography color="error">{error}</Typography>
          </Paper>
        )}

        {/* View Trends Tab */}
        {activeTab === 0 && (
          <>
            <Paper sx={{ p: 2, mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="query-select-label">Filter by Original Query</InputLabel>
                <Select
                  labelId="query-select-label"
                  id="query-select"
                  value={selectedQuery}
                  label="Filter by Original Query"
                  onChange={(e) => setSelectedQuery(e.target.value)}
                >
                  <MenuItem value="">
                    <em>All Queries</em>
                  </MenuItem>
                  {queries.map((query, index) => (
                    <MenuItem key={index} value={query}>
                      {query}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>

            <Grid container spacing={3}>
              {trends
                .filter(trend => !selectedQuery || trend.original_query === selectedQuery)
                .map((trend) => (
                  <Grid item xs={12} md={6} key={trend.id}>
                    <Card sx={{ 
                      borderRadius: '16px', 
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <CardContent sx={{ 
                        flexGrow: 1,
                        overflow: 'auto'
                      }}>
                        <Typography variant="h6" gutterBottom>
                          {trend.trend_topic}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Original Query: {trend.original_query}
                        </Typography>
                        <Typography variant="body2" paragraph sx={{ 
                          maxHeight: '150px',
                          overflow: 'auto'
                        }}>
                          {trend.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Reformulated Queries:
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          maxHeight: '100px',
                          overflow: 'auto'
                        }}>
                          {trend.reformulated_queries}
                        </Typography>
                        {trend.category && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Category: {trend.category}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </>
        )}

        {/* Add Trend Tab */}
        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Add New Trend</Typography>
            <TextField
              margin="dense"
              name="original_query"
              label="Original Query"
              type="text"
              fullWidth
              variant="outlined"
              value={currentTrend.original_query}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="trend_topic"
              label="Trend Topic"
              type="text"
              fullWidth
              variant="outlined"
              value={currentTrend.trend_topic}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={currentTrend.description}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="reformulated_queries"
              label="Reformulated Queries"
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={currentTrend.reformulated_queries}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="category"
              label="Category (Optional)"
              type="text"
              fullWidth
              variant="outlined"
              value={currentTrend.category}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <Button 
              variant="contained" 
              onClick={() => {
                setEditMode(false);
                handleSubmit();
              }}
            >
              Create Trend
            </Button>
          </Paper>
        )}

        {/* Edit Trends Tab */}
        {activeTab === 2 && (
          <Grid container spacing={3}>
            {trends.map((trend) => (
              <Grid item xs={12} md={6} key={trend.id}>
                <Card sx={{ 
                  borderRadius: '16px', 
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <CardContent sx={{ 
                    flexGrow: 1,
                    overflow: 'auto'
                  }}>
                    <Typography variant="h6" gutterBottom>
                      {trend.trend_topic}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Original Query: {trend.original_query}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {trend.description.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      fullWidth
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenDialog(trend)}
                    >
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Delete Trends Tab */}
        {activeTab === 3 && (
          <Grid container spacing={3}>
            {trends.map((trend) => (
              <Grid item xs={12} md={6} key={trend.id}>
                <Card sx={{ 
                  borderRadius: '16px', 
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <CardContent sx={{ 
                    flexGrow: 1,
                    overflow: 'auto'
                  }}>
                    <Typography variant="h6" gutterBottom>
                      {trend.trend_topic}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Original Query: {trend.original_query}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {trend.description.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      fullWidth
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(trend.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>{editMode ? 'Edit Trend' : 'Add New Trend'}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="original_query"
              label="Original Query"
              type="text"
              fullWidth
              variant="outlined"
              value={currentTrend.original_query}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="trend_topic"
              label="Trend Topic"
              type="text"
              fullWidth
              variant="outlined"
              value={currentTrend.trend_topic}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={currentTrend.description}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="reformulated_queries"
              label="Reformulated Queries"
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={currentTrend.reformulated_queries}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="category"
              label="Category (Optional)"
              type="text"
              fullWidth
              variant="outlined"
              value={currentTrend.category}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editMode ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar 
          open={notification.open} 
          autoHideDuration={6000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity} 
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default AdminDashboard;