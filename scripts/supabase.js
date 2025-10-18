import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

function App() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    setProfiles();
  }, []);

  async function getProfiles() {
    const { data } = await supabase.from("profiles").select();
    setProfiles(data);
  }

  return (
    <ul>
      {profiles.map((instrument) => (
        <li key={profiles.name}>{profiles.name}</li>
      ))}
    </ul>
  );
}