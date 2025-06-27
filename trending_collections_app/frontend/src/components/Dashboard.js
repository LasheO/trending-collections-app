/**
 * Dashboard Component
 * 
 * This component provides a unified interface for both standard users and admins to interact with trending collections.
 * It implements a clean single-page layout with role-based access control for different functionality.
 * 
 * Features:
 * - Create new trends with a form at the top of the page
 * - View trends with filtering by original query and sorting options
 * - Edit existing trends
 * - Delete trends (admin only)
 * - Success/error notifications
 * - Clean, full-width layout with icon in header
 * - Role-based access control
 */

import { useState, useEffect } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Sort as SortIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

function Dashboard() {
  // UI state
  // No drawer needed anymore
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Data state
  const [trends, setTrends] = useState([]);
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [error, setError] = useState(null);
  
  // Form state
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTrend, setCurrentTrend] = useState({
    original_query: '',
    trend_topic: '',
    description: '',
    reformulated_queries: '',
    category: ''
  });
  const [validationErrors, setValidationErrors] = useState({
    original_query: '',
    trend_topic: '',
    description: '',
    reformulated_queries: ''
  });
  
  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch trends data and check admin status when component mounts
  useEffect(() => {
    fetchTrends();
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  /**
   * Fetches trending collections data from the API
   * 
   * This function:
   * 1. Gets the authentication token from localStorage
   * 2. Makes an authenticated request to the trends API
   * 3. Processes the response data
   * 4. Extracts unique queries for the filter dropdown
   * 5. Handles any errors that occur during the process
   */
  const fetchTrends = async () => {
    try {
      // Get authentication token
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found');
        return;
      }

      // Make authenticated API request
      const response = await fetch('/api/trends', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Validate and process response data
        if (Array.isArray(data)) {
          setTrends(data);
          // Extract unique queries for filtering
          const uniqueQueries = [...new Set(data.map(trend => trend.original_query))];
          setQueries(uniqueQueries);
          setError(null);
        } else {
          setError('Invalid data format received');
        }
      } else {
        // Handle API error response
        const errorData = await response.json();
        setError('Failed to fetch trends: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      // Handle network or other errors
      setError('Error connecting to the server');
    }
  };


  // No drawer toggle needed
  
  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
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
    
    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const validateTrendForm = () => {
    const errors = {
      original_query: '',
      trend_topic: '',
      description: '',
      reformulated_queries: ''
    };
    let isValid = true;

    // Check for required fields
    if (!currentTrend.original_query.trim()) {
      errors.original_query = 'Original query is required';
      isValid = false;
    }

    if (!currentTrend.trend_topic.trim()) {
      errors.trend_topic = 'Trend topic is required';
      isValid = false;
    }

    if (!currentTrend.description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    }

    if (!currentTrend.reformulated_queries.trim()) {
      errors.reformulated_queries = 'Reformulated queries are required';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    // Validate form before submission
    if (!validateTrendForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('No authentication token found', 'error');
        return;
      }

      const url = editMode 
        ? `/api/trends/${currentTrend.id}`
        : '/api/trends';
      
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

      const response = await fetch(`/api/trends/${id}`, {
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

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          bgcolor: '#232f3e'
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img 
              src="/trending_logo.svg" 
              alt="Trending Collections Logo" 
              style={{ height: '40px', marginRight: '16px' }} 
            />
            <Typography variant="h6" noWrap component="div">
              {isAdmin ? 'Trending Collections Admin' : 'Trending Collections'}
            </Typography>
          </Box>
          <Button 
            color="inherit" 
            startIcon={<LogoutIcon />}
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
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          mt: 8
        }}
      >
        {error && (
          <Paper sx={{ p: 2, mb: 2, bgcolor: '#ffebee' }}>
            <Typography color="error">{error}</Typography>
          </Paper>
        )}

        {/* Create Trend Form */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Create New Trend</Typography>
          <TextField
            margin="dense"
            name="original_query"
            label="Original Query"
            type="text"
            fullWidth
            variant="outlined"
            value={currentTrend.original_query}
            onChange={handleInputChange}
            error={!!validationErrors.original_query}
            helperText={validationErrors.original_query}
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
            error={!!validationErrors.trend_topic}
            helperText={validationErrors.trend_topic}
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
            error={!!validationErrors.description}
            helperText={validationErrors.description}
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
            error={!!validationErrors.reformulated_queries}
            helperText={validationErrors.reformulated_queries}
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

        {/* Divider */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', my: 3 }} />

        {/* Filter and Sort Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <FormControl sx={{ width: '300px' }}>
            <InputLabel id="query-select-label">Filter by Original Query</InputLabel>
            <Select
              labelId="query-select-label"
              id="query-select"
              value={selectedQuery}
              label="Filter by Original Query"
              onChange={(e) => setSelectedQuery(e.target.value)}
              size="small"
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
          
          <Button 
            variant="outlined" 
            startIcon={<SortIcon />}
            onClick={handleSortToggle}
          >
            Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </Button>
        </Box>

        {/* Trends Grid */}
        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {trends
            .filter(trend => !selectedQuery || trend.original_query === selectedQuery)
            .sort((a, b) => {
              if (sortOrder === 'asc') {
                return a.trend_topic.localeCompare(b.trend_topic);
              } else {
                return b.trend_topic.localeCompare(a.trend_topic);
              }
            })
            .map((trend) => (
              <Grid item xs={12} md={4} key={trend.id} sx={{ width: '350px' }}>
                <Card sx={{ 
                  borderRadius: '16px', 
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 280
                }}>
                  <CardContent sx={{ 
                    flexGrow: 1,
                    overflow: 'auto'
                  }}>
                    <Typography variant="h6" gutterBottom>
                      {trend.trend_topic}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Original Query: {trend.original_query}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      maxHeight: '100px',
                      overflow: 'auto',
                      mb: 2,
                      mt: 1
                    }}>
                      {trend.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Reformulated Queries:
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      maxHeight: '60px',
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
                  <CardActions>
                    <Button 
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenDialog(trend)}
                      sx={{ flexGrow: 1 }}
                    >
                      Edit
                    </Button>
                    {isAdmin && (
                      <Button 
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(trend.id)}
                        sx={{ flexGrow: 1 }}
                      >
                        Delete
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>

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
              error={!!validationErrors.original_query}
              helperText={validationErrors.original_query}
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
              error={!!validationErrors.trend_topic}
              helperText={validationErrors.trend_topic}
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
              error={!!validationErrors.description}
              helperText={validationErrors.description}
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
              error={!!validationErrors.reformulated_queries}
              helperText={validationErrors.reformulated_queries}
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

export default Dashboard;
