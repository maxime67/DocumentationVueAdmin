<script>
import axios from "axios";



export const fetchCategories = async (categories) => {
  try {
    const response = await axios.get(import.meta.env.VITE_APIURL + '/categories');
    categories.value = response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

export const fetchData = async (loading, results, totalDocuments, selectedSubcategories) => {
  loading.value = true;
  try {
    const response = await axios.get(
        import.meta.env.VITE_APIURL + `/category${
            selectedSubcategories.value.length
                ? `?categories=${selectedSubcategories.value.join(',')}`
                : ''
        }`
    );
    results.value = response.data.results;
    totalDocuments.value = response.data.totalDocuments;
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    loading.value = false;
  }
};
</script>
