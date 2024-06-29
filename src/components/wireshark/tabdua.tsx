import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import api from '../../services/apiService'

interface PcapFile {
  id: number; 
  created_at: string;
  filename: string;
  file_size: number;
}

interface FilesTabProps {
  isActive: boolean;
}

const FilesTab: React.FC<FilesTabProps> = ({ isActive }) => {
  const [pcapFiles, setPcapFiles] = useState<PcapFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [fileToRemove, setFileToRemove] = useState<PcapFile | null>(null);
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


  const handleDownload = async (id: number, displayFilename: string) => {
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

  const handleRemoveClick = (file: PcapFile) => {
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

  const formatTimestamp = (timestamp: string) => {
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

  const formatFileSize = (size: number) => {
    if (size >= 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else if (size >= 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else {
      return `${size} B`;
    }
  };

  const shortenFileName = (filename: string, id: number) => {
    if (!filename) return 'Unknown filename';
    const parts = filename.split('-');
    if (parts.length >= 3) {
      const userPart = parts[0].split('_')[0]; // extract user1 from user1_oai
      const componentPart = parts[0].split('_')[1]; // extract oai from user1_oai
      const namePart = parts[1]; // extract cu
      return `${userPart}_${componentPart}-${namePart}-${id}.pcap`;
    }
    return filename;
  };

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

  const createButtonStyles = {
    textTransform: 'none', // Prevent text from being uppercased
    minWidth: '80px',
    borderRadius: '20px'
  };

  return (
    <>
      <TableContainer component={Paper}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
          </Box>
        ) : (
          <Table aria-label="Pcap Files Table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Timestamp</TableCell>
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>File Name</TableCell>
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Size</TableCell>
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pcapFiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} style={{ textAlign: 'center', fontStyle: 'italic' }}>
                    Available pcap files will be shown here
                  </TableCell>
                </TableRow>
              ) : (
                pcapFiles.map((file) => {
                  const shortenedFilename = shortenFileName(file.filename, file.id);
                  return (
                    <TableRow key={file.id}>
                      <TableCell style={{ textAlign: 'center' }}>{formatTimestamp(file.created_at)}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{shortenedFilename}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{formatFileSize(file.file_size)}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>
                        <Box display="flex" justifyContent="flex-end" gap={1}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleDownload(file.id, shortenedFilename)}
                            sx={createButtonStyles}
                          >
                            Download
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleRemoveClick(file)}
                            sx={createButtonStyles}
                          >
                            Remove
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
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
        <Button sx={cancelButtonStyles} variant="contained" onClick={() => setRemoveDialogOpen(false)} color="primary">
          Cancel
        </Button>
        <Button sx={removeButtonStyles} variant="contained" color="primary" onClick={confirmRemove}>
          {removing ? <CircularProgress size={20} color="inherit" /> : 'Remove'}
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default FilesTab;
