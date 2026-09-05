export function getSupabaseConfig(env = process.env) {
  const url = env.SUPABASE_URL;
  const anonKey = env.SUPABASE_ANON_KEY;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error('SUPABASE_URL is required');
  if (!anonKey) throw new Error('SUPABASE_ANON_KEY is required');
  return { url, anonKey, serviceRoleKey };
}

export function assertServerConfig(env = process.env) {
  const config = getSupabaseConfig(env);
  if (!config.serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required on server');
  return config;
}
