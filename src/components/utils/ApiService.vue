<script>
import axios from "axios";

const apiClient = axios.create({
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export const fetchData = async (error, loading, data, endpoint) => {
  try {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiClient.get(import.meta.env.VITE_APIURL + endpoint);
      data.value = response.data;
    } catch (axiosError) {
      console.log(import.meta.env.VITE_APIURL + endpoint)
      console.log('fetch attempt failed', axiosError.message);
    }

  } catch (err) {
    error.value = `Error loading data: ${err.message}`;
    console.error('Error fetching data:', err);
  }
};
</script>
