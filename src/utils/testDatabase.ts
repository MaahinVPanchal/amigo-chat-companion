import { supabase } from '@/lib/supabase';

export const testDatabaseConnection = async () => {
  try {
    console.log('Testing database connection...');
    
    // Test reviews table
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .limit(1);
    
    if (reviewsError) {
      console.error('Reviews table error:', reviewsError);
    } else {
      console.log('Reviews table connected successfully:', reviews);
    }

    // Test profiles table
    const { count: profilesCount, error: profilesError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (profilesError) {
      console.error('Profiles table error:', profilesError);
    } else {
      console.log('Profiles table connected successfully. Count:', profilesCount);
    }

    // Test documents table
    const { count: documentsCount, error: documentsError } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true });
    
    if (documentsError) {
      console.error('Documents table error:', documentsError);
    } else {
      console.log('Documents table connected successfully. Count:', documentsCount);
    }

    return {
      reviews: !reviewsError,
      profiles: !profilesError,
      documents: !documentsError,
    };
  } catch (error) {
    console.error('Database connection test failed:', error);
    return {
      reviews: false,
      profiles: false,
      documents: false,
    };
  }
};

// Auto-run test in development
if (import.meta.env.DEV) {
  testDatabaseConnection();
}