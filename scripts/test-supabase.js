const path = require('path');
const dotenv = require('dotenv');
const result = dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (result.error) {
  console.error("Error loading .env file:", result.error);
  process.exit(1);
}

console.log("Variables parsed from .env file:", result.parsed);

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL or key not found in .env file.");
  console.error("Please make sure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set in your .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addSomnRecord() {
  try {
    console.log("Fetching a random user profile...");

    // 1. Fetch all profiles
    let { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id');

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError.message);
      return;
    }

    if (!profiles || profiles.length === 0) {
      console.error("No profiles found in the database.");
      return;
    }

    // 2. Pick one at random
    const randomProfile = profiles[Math.floor(Math.random() * profiles.length)];
    const userId = randomProfile.id;
    console.log(`Found ${profiles.length} profile(s). Using random user ID: ${userId}`);

    // 3. Add the new record to the 'general' table
    console.log("Adding 'somn' record to the 'general' table...");
    const { data: newRecord, error: insertError } = await supabase
      .from('general')
      .insert([
        { 
          user_id: userId, 
          type: 'somn', 
          details: JSON.stringify({ "ore_somn": 8, "calitate": "excelent", "treziri": 0 }),
          data: new Date().toISOString().slice(0, 10) // Get date in YYYY-MM-DD format
        }
      ])
      .select();

    if (insertError) {
      console.error("Error inserting new record:", insertError.message);
      if (insertError.details) {
        console.error("Details:", insertError.details)
      }
      return;
    }

    console.log("Successfully inserted new record:", newRecord[0]);

  } catch (e) {
    console.error("An unexpected error occurred:", e.message);
  }
}

addSomnRecord();
