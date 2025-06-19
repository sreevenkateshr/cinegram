import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMGNlYjMzZmIyM2Y5MWMxNzkyNzcxNjI3NTYxYzMyOSIsIm5iZiI6MTc0OTc5MjY1Ni45NDU5OTk5LCJzdWIiOiI2ODRiYjc5MGI1MThkZmRjYjIzZGVmODkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.04SBmPdfY3C0Zv0FTfNR-DvWCpHjkemhrHiv-s96K5w`,
  },
});

export default api;
