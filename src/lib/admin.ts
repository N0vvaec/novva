import { createServerSupabase } from "@/lib/supabase/server";

export interface AdminInfo {
  id: string;
  email: string;
  role: string;
}

export async function getCurrentAdmin(): Promise<AdminInfo | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("id, email, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return null;

  return {
    id: user.id,
    email: (user.email ?? profile.email) as string,
    role: profile.role,
  };
}
