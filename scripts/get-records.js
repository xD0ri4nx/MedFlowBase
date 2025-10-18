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
  console.error("Please make sure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set in your .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getSomnRecords() {
  try {
    console.log("Fetching 'somn' records from the 'general' table...");

    const { data, error } = await supabase
      .from('general')
      .select('*')
      .eq('type', 'somn');

    if (error) {
      console.error("Error fetching records:", error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log(`Found ${data.length} 'somn' record(s):`);
      console.log(data);
    } else {
      console.log("No records with type 'somn' found.");
    }

  } catch (e) {
    console.error("An unexpected error occurred:", e.message);
  }
}

getSomnRecords();
