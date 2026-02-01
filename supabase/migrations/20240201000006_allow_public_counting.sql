-- Allow public counting for stats purposes
-- This enables anonymous users to count total profiles and documents for display in the UI

-- Create a secure function to get document count (bypasses RLS for counting only)
CREATE OR REPLACE FUNCTION public.get_document_count()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM documents);
END;
$$;

-- Create a secure function to get profile count (bypasses RLS for counting only)
CREATE OR REPLACE FUNCTION public.get_profile_count()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM profiles);
END;
$$;

-- Grant execute permission to anon users
GRANT EXECUTE ON FUNCTION public.get_document_count() TO anon;
GRANT EXECUTE ON FUNCTION public.get_profile_count() TO anon;
GRANT EXECUTE ON FUNCTION public.get_document_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_profile_count() TO authenticated;
