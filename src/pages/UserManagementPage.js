import React, { useEffect, useState } from 'react';
import api from '../services/apiService';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [numUsers, setNumUsers] = useState(1);
  const [creatingUsers, setCreatingUsers] = useState(false);
  const [removingUser, setRemovingUser] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('user/list/');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setNewUsername(user.username);
    setNewPassword('');
    setEditModalOpen(true);
    setUsernameError('');
    setPasswordError('');
  };

  const handleRemove = (user) => {
    setCurrentUser(user);
    setRemoveModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setUsernameError('');
    setPasswordError('');
  };

  const closeRemoveModal = () => {
    setRemoveModalOpen(false);
  };

  const showSuccessSnackbar = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const showErrorSnackbar = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const handleCreateUsers = async () => {
    setCreatingUsers(true);
    const token = localStorage.getItem('authToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  
    try {
      const response = await api.post('user/create/', { number: numUsers }, { headers });
      
      if (response || response.status === 200 || response.data || response.data.success) {
        await refreshUserList();
        showSuccessSnackbar("Users created successfully!");
      } else {
        throw new Error(response.data.message || "Failed to create users");
      }
    } catch (error) {
      console.error('Failed to create users:', error);
      showErrorSnackbar("Failed to create users! " + (error.message || ""));
    } finally {
      setCreatingUsers(false);
      setCreateModalOpen(false);
    }
  };
  
  const confirmEdit = async () => {
    if (!newUsername.trim()) {
      setUsernameError('Username is required.');
      return;
    }
    if (!newPassword.trim()) {
      setPasswordError('Password is required.');
      return;
    }
    try {
      const response = await api.put(`user/update/${currentUser.id}/`, {
        username: newUsername,
        password: newPassword
      });
      if (response && response.status === 200) {
        const updatedUsers = users.map(user => user.id === currentUser.id ? {...user, username: newUsername} : user);
        setUsers(updatedUsers);
        closeEditModal();
        showSuccessSnackbar("User updated successfully!");
      } else {
        throw new Error(response.data.message || "Failed to update user");
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      showErrorSnackbar("Failed to update user: " + (error.message || ""));
    }
  };

  const confirmRemove = async () => {
    setRemovingUser(true);
    try {
      const response = await api.delete(`user/delete/${currentUser.id}/`);
      if (response.status === 204) {
        const filteredUsers = users.filter(user => user.id !== currentUser.id);
        setUsers(filteredUsers);
        showSuccessSnackbar("User removed successfully!");
        refreshUserList(); // Optionally refresh the list from the server
      } else {
        throw new Error(response.data.message || "Failed to remove user");
      }
    } catch (error) {
      console.error('Failed to remove user:', error);
      showErrorSnackbar("Failed to remove user: " + (error.message || ""));
    } finally {
      setRemovingUser(false);
      closeRemoveModal();
    }
  };

  const refreshUserList = async () => {
    setLoading(true); // Show loading indicator while fetching
    try {
      const response = await api.get('user/list/');
      console.log(response.data); // Log to see what is being returned
      if (response && response.data) {
        setUsers(response.data); // Update the users state with the fetched data
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error('Failed to refresh user list:', error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <>
      <h4 style={{ margin: '20px' }}>List Users</h4>
      <Button variant="contained" color="primary" onClick={() => setCreateModalOpen(true)} style={{ margin: '20px' }}>
        Create User
      </Button>
      <TableContainer component={Paper} style={{ margin: '20px', width: 'auto' }}>
        {loading ? <CircularProgress style={{ display: 'block', margin: '20px auto' }} /> : (
          <Table aria-label="simple table">
            <TableHead style={{ backgroundColor: '#e0e0e0' }}>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell align="right">Level</TableCell>
                <TableCell align="right">Completion (%)</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell component="th" scope="row">{user.username}</TableCell>
                  <TableCell align="right">{user.profile.level}</TableCell>
                  <TableCell align="right">{user.profile.completion}%</TableCell>
                  <TableCell align="right">
                    <Button color="primary" onClick={() => handleEdit(user)}>Edit</Button>
                    <Button color="secondary" onClick={() => handleRemove(user)}>Remove</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Success Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          style={{
            position: 'absolute',
            top: `50%`,
            left: `50%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <MuiAlert elevation={6} variant="filled" onClose={() => setSuccessMessage('')} severity="success">
            {successMessage}
          </MuiAlert>
        </Snackbar>

        {/* Error Snackbar */}
        <Snackbar
          open={!!errorMessage}
          autoHideDuration={3000}
          onClose={() => setErrorMessage('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          style={{
            position: 'absolute',
            top: `50%`,
            left: `50%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <MuiAlert elevation={6} variant="filled" onClose={() => setErrorMessage('')} severity="error">
            {errorMessage}
          </MuiAlert>
        </Snackbar>

        {/* Create User Modal */}
        <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
          <DialogTitle>Create Users</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter the number of users you want to create:</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="numUsers"
              label="Number of Users"
              type="number"
              fullWidth
              variant="standard"
              value={numUsers}
              onChange={(e) => setNumUsers(Math.max(1, parseInt(e.target.value, 10)))}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateUsers} disabled={creatingUsers}>
              {creatingUsers ? <CircularProgress size={24} /> : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit User Modal */}
        <Dialog open={editModalOpen} onClose={closeEditModal}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="username"
              label="New Username"
              type="text"
              fullWidth
              variant="standard"
              value={newUsername}
              onChange={(e) => {
                setNewUsername(e.target.value);
                setUsernameError('');
              }}
              error={!!usernameError}
              helperText={usernameError}
            />
            <TextField
              margin="dense"
              id="password"
              label="New Password"
              type="password"
              fullWidth
              variant="standard"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordError('');
              }}
              error={!!passwordError}
              helperText={passwordError}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEditModal}>Cancel</Button>
            <Button onClick={confirmEdit}>Confirm</Button>
          </DialogActions>
        </Dialog>

        {/* Remove User Modal */}
        <Dialog open={removeModalOpen} onClose={closeRemoveModal}>
          <DialogTitle>Remove User</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to remove {currentUser?.username}?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeRemoveModal}>Cancel</Button>
            <Button onClick={confirmRemove} color="secondary" disabled={removingUser}>
              {removingUser ? <CircularProgress size={24} /> : 'Remove'}
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
    </>
  );
}

export default UserManagementPage;
