const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// eslint-disable-next-line no-undef
const result = dotenv.config({ path: path.resolve(__dirname, '../.env') });
if (result.error) {
    console.error("Error loading .env file:", result.error);
    process.exit(1);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase URL or key not found in .env file.");
    console.error("Please make sure VITE_SUPABASE_URL/VITE_SUPABASE_PUBLISHABLE_KEY or EXPO_PUBLIC_SUPABASE_URL/EXPO_PUBLIC_SUPABASE_ANON_KEY are set in your .env file.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getRecordsByType(type) {
    try {
        console.log(`Fetching '${type}' records from the 'general' table...`);
        const { data, error } = await supabase
            .from('general')
            .select('*')
            .eq('type', type)
            .order('created_at', { ascending: true });

        if (error) {
            console.error(`Error fetching ${type} records:`, error.message);
            return [];
        }

        return data || [];
    } catch (e) {
        console.error('An unexpected error occurred:', e.message);
        return [];
    }
}

function prettyPrintRecords(records) {
    return records.map((r) => {
        let parsedDetails = r.details;
        try {
            parsedDetails = JSON.parse(r.details);
        } catch (e) {
        }
        return {
            id: r.id,
            user_id: r.user_id,
            date: r.data,
            type: r.type,
            details: parsedDetails,
            created_at: r.created_at,
        };
    });
}

async function main() {
    const somn = await getRecordsByType('somn');
    console.log(`\n---- Sleep records (${somn.length}) ----`);
    console.log(JSON.stringify(prettyPrintRecords(somn), null, 2));
}

main();
