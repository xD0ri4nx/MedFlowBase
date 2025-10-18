const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env file
const result = dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (result.error) {
  console.error("Error loading .env file:", result.error);
  process.exit(1);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL or key not found in .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteRecords() {
  try {
    const idsToDelete = [
      'bb56d873-ee91-4033-8d6b-1446a239dec4',
      'f88cffe9-9f9f-4b70-98c0-c1da84d5ad13',
      'c52d4525-6ad0-45ef-a448-adf1964ddf63'
    ];

    console.log(`Attempting to delete ${idsToDelete.length} records...`);

    const { data, error } = await supabase
      .from('general')
      .delete()
      .in('id', idsToDelete);

    if (error) {
      console.error("Error deleting records:", error.message);
      return;
    }

    console.log("Successfully deleted the records.");

  } catch (e) {
    console.error("An unexpected error occurred:", e.message);
  }
}

deleteRecords();
