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
  timestamp: string;
  filename: string;
  size: string;
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


  const handleDownload = async (id: number, filename: string) => {
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
      link.setAttribute('download', `${filename}.pcap`); // Use the actual file name
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
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
    const date = new Date(timestamp);
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = date.toTimeString().split(' ')[0];
    return (
      <>
        <div>{formattedDate}</div>
        <div>{formattedTime}</div>
      </>
    );
  };


  const shortenFileName = (filename: string) => {
    if (!filename) return 'Unknown filename';
    const parts = filename.split('-');
    if (parts.length >= 3) {
      const userPart = parts[0].split('_')[0]; // extract user1 from user1_oai
      const componentPart = parts[0].split('_')[1]; // extract oai from user1_oai
      const namePart = parts[1]; // extract cu
      const levelPart = parts[2]; // extract level1
      return `${userPart}_${componentPart}-${namePart}-${levelPart}.pcap`;
    }
    return filename;
  };

  const cancelButtonStyles = {
    backgroundColor: '#E3AE14',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#E39514',
      color: '#fff'
    }
  };

  const removeButtonStyles = {
    backgroundColor: '#FF1F19', // Red color
    color: '#fff',
    '&:hover': {
      backgroundColor: '#CC1914', // Darker red color
      color: '#fff'
    }
  };

  const createButtonStyles = {
    textTransform: 'none' // Prevent text from being uppercased
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
          {pcapFiles.map((file) => (
            <TableRow key={file.fileName}>
                <TableCell style={{ textAlign: 'center' }}>{formatTimestamp(file.created_at)}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{shortenFileName(file.filename)}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{`${file.file_size} B`}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                <Box display="flex" justifyContent="flex-end" gap={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleDownload(file.id, file.filename)}
                    style={{minWidth: '80px', borderRadius: '20px', ...createButtonStyles}}
                  >
                    Download
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleRemoveClick(file)}
                    style={{minWidth: '80px', borderRadius: '20px', ...createButtonStyles}}
                  >
                    Remove
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
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
        <Button sx={cancelButtonStyles} variant="contained" onClick={() => setRemoveDialogOpen(false)} color="primary" style={{minWidth: '80px', borderRadius: '20px', ...createButtonStyles}}>
          Cancel
        </Button>
        <Button sx={removeButtonStyles} variant="contained" color="primary" onClick={confirmRemove} style={{minWidth: '80px', borderRadius: '20px', ...createButtonStyles}}>
          {removing ? <CircularProgress size={20} color="inherit" /> : 'Remove'}
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default FilesTab;
