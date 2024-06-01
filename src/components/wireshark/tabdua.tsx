import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@mui/material';
import api from '../../services/apiService'

interface PcapFile {
  timestamp: string;
  fileName: string;
  size: string;
}

const FilesTab: React.FC = () => {
  const [pcapFiles, setPcapFiles] = useState<PcapFile[]>([]);


  useEffect(() => {
    // Fetch pcap files from the API
    const fetchPcapFiles = async () => {
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
      }
    };

    fetchPcapFiles();
  }, []);

  const handleDownload = async (id: number) => {
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
      link.setAttribute('download', 'file.pcap'); // or extract the filename from the response
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading pcap file:', error.message);
    }
  };

  const handleRemove = async (id: number) => {
    const authToken = localStorage.getItem('authToken');
    try {
      await api.delete(`shark/pcap_files/${id}/remove/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setPcapFiles(pcapFiles.filter(file => file.id !== id));
    } catch (error) {
      console.error('Error removing pcap file:', error.message);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="Pcap Files Table">
        <TableHead>
          <TableRow>
            <TableCell>Timestamp</TableCell>
            <TableCell>File Name</TableCell>
            <TableCell>Size (Bytes)</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pcapFiles.map((file) => (
            <TableRow key={file.fileName}>
              <TableCell>{file.created_at}</TableCell>
              <TableCell>{file.filename}</TableCell>
              <TableCell>{file.file_size}</TableCell>
              <TableCell>
              <Button variant="contained" color="primary" onClick={() => handleDownload(file.id)}>
                  Download
                </Button>
                <Button variant="contained" color="secondary" onClick={() => handleRemove(file.id)} style={{ marginLeft: '8px' }}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FilesTab;
