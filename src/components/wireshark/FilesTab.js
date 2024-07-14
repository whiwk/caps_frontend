import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../services/apiService';

const FilesTab = ({ isActive }) => {
  const [pcapFiles, setPcapFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [fileToRemove, setFileToRemove] = useState(null);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    if (isActive) {
      const fetchPcapFiles = async () => {
        setLoading(true);
        const authToken = localStorage.getItem('authToken');
        try {
          const response = await api.get('shark/pcap_files/', {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          setPcapFiles(response.data);
        } catch (error) {
          console.error('Error fetching pcap files:', error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchPcapFiles();
    }
  }, [isActive]);

  const handleDownload = async (id, displayFilename) => {
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await api.get(`shark/pcap_files/${id}/download/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', displayFilename); // Use the display filename
      document.body.appendChild(link);
      link.click();
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading pcap file:', error.message);
    }
  };

  const handleRemoveClick = (file) => {
    setFileToRemove(file);
    setRemoveDialogOpen(true);
  };

  const confirmRemove = async () => {
    if (!fileToRemove) return;
    setRemoving(true);
    const authToken = localStorage.getItem('authToken');
    try {
      await api.delete(`shark/pcap_files/${fileToRemove.id}/remove/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setPcapFiles(pcapFiles.filter(file => file.id !== fileToRemove.id));
      setSnackbarMessage('PCAP file removed successfully.');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error removing pcap file:', error.message);
      setSnackbarMessage('Failed to remove PCAP file.');
      setSnackbarSeverity('error');
    } finally {
      setRemoveDialogOpen(false);
      setSnackbarOpen(true);
      setRemoving(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const formattedDate = date.toLocaleDateString();
      const formattedTime = date.toLocaleTimeString();
      return (
        <>
          <div>{formattedDate}</div>
          <div>{formattedTime}</div>
        </>
      );
    } catch (error) {
      console.error('Invalid date format:', timestamp);
      return 'Invalid date';
    }
  };

  const formatFileSize = (size) => {
    if (size >= 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else if (size >= 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else {
      return `${size} B`;
    }
  };

  const shortenFileName = (filename) => {
    if (!filename) return 'Unknown filename';
    const parts = filename.split('-');
    if (parts.length >= 3) {
      const componentPart = parts[0].split('_')[1]; // extract oai/cu/du/ue from user1_oai/cu/du/ue
      const datePart = parts[2];
      const timePart = parts[3];
      let componentPrefix = '';

      switch (componentPart) {
        case 'cu':
          componentPrefix = 'cu_f1';
          break;
        case 'du':
          componentPrefix = 'du_f1';
          break;
        case 'ue':
          componentPrefix = 'ue_oaitun';
          break;
        default:
          componentPrefix = componentPart;
      }

      return `${componentPrefix}_${datePart}_${timePart}.pcap`;
    }
    return filename;
  };

  const sortedPcapFiles = [...pcapFiles].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const cancelButtonStyles = {
    textTransform: 'none', // Prevent text from being uppercased
    minWidth: '80px',
    borderRadius: '20px',
    backgroundColor: '#E3AE14',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#E39514',
      color: '#fff'
    }
  };

  const removeButtonStyles = {
    textTransform: 'none', // Prevent text from being uppercased
    minWidth: '80px',
    borderRadius: '20px',
    backgroundColor: '#FF1F19', // Red color
    color: '#fff',
    '&:hover': {
      backgroundColor: '#CC1914', // Darker red color
      color: '#fff'
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="Pcap Files Table">
          <TableHead style={{ backgroundColor: '#F2F2F2' }}>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold', textAlign: 'left', width: '20%', fontSize: '0.9rem' }}>Timestamp</TableCell>
              <TableCell style={{ fontWeight: 'bold', textAlign: 'center', width: '50%', fontSize: '0.9rem' }}>File Name</TableCell>
              <TableCell style={{ fontWeight: 'bold', textAlign: 'left', width: '10%', fontSize: '0.9rem' }}>Size</TableCell>
              <TableCell style={{ fontWeight: 'bold', textAlign: 'right', width: '20%', fontSize: '0.9rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ display: 'block', maxHeight: '400px', overflowY: 'auto', width: '500%' }}>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} style={{ padding: 0 }}>
                  <Box display="flex" justifyContent="center" alignItems="center" height="100px" width="1700%">
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : sortedPcapFiles.length === 0 ? (
              <TableRow style={{ display: 'table', width: '100%', tableLayout: 'fixed' }}>
                <TableCell colSpan={4} style={{ textAlign: 'center', fontStyle: 'italic' }}>
                  Available pcap files will be shown here
                </TableCell>
              </TableRow>
            ) : (
              sortedPcapFiles.map((file) => {
                const shortenedFilename = shortenFileName(file.filename);
                return (
                  <TableRow key={file.id} sx={{ display: 'table', width: '100%', tableLayout: 'fixed' }}>
                    <TableCell style={{ textAlign: 'left', width: '20%', fontSize: '0.9rem' }}>{formatTimestamp(file.created_at)}</TableCell>
                    <TableCell style={{ textAlign: 'center', width: '70%', fontSize: '0.9rem' }}>{shortenedFilename}</TableCell>
                    <TableCell style={{ textAlign: 'left', width: '20%', fontSize: '0.9rem' }}>{formatFileSize(file.file_size)}</TableCell>
                    <TableCell style={{ textAlign: 'right', width: '20%',}}>
                      <Box marginRight= '-10px' display="flex" justifyContent="flex-end" gap={1}>
                        <IconButton
                          onClick={() => handleDownload(file.id, shortenedFilename)}
                          size="small"
                          color="primary"
                        >
                          <DownloadIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleRemoveClick(file)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert variant="filled" onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog
        open={removeDialogOpen}
        onClose={() => setRemoveDialogOpen(false)}
      >
        <DialogTitle>Confirm Remove</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove the file?
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "flex-end", marginTop: '-10px', marginRight: '16px' }}>
          <Button onClick={() => setRemoveDialogOpen(false)} color="primary" variant="contained" sx={cancelButtonStyles}>
            Cancel
          </Button>
          <Button onClick={confirmRemove} color="primary" variant="contained" sx={removeButtonStyles}>
            {removing ? <CircularProgress size={25} color="inherit" /> : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FilesTab;
