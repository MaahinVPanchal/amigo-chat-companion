import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Stats {
  totalUsers: number;
  totalDocuments: number;
  totalReviews: number;
  averageRating: number;
  interviewsPracticed: number;
}

export const useStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 1250,
    totalDocuments: 850,
    totalReviews: 0,
    averageRating: 0,
    interviewsPracticed: 10000,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // Method 1: Try using RPC functions (more secure, bypasses RLS safely)
      let usersCount: number | null = null;
      let documentsCount: number | null = null;

      try {
        // Use RPC functions for secure counting
        const { data: profileCount, error: profileError } = await supabase
          .rpc('get_profile_count');
        
        if (!profileError && profileCount !== null) {
          usersCount = profileCount;
        }

        const { data: docCount, error: docError } = await supabase
          .rpc('get_document_count');
        
        if (!docError && docCount !== null) {
          documentsCount = docCount;
        }
      } catch (rpcError) {
        console.warn('RPC functions not available, falling back to direct queries:', rpcError);
      }

      // Method 2: Fallback to direct queries (if RPC functions don't exist yet)
      if (usersCount === null) {
        const { count, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (usersError) {
          console.error('Error fetching profiles count:', usersError);
          throw usersError;
        }
        usersCount = count ?? 0;
      }

      if (documentsCount === null) {
        const { count, error: documentsError } = await supabase
          .from('documents')
          .select('*', { count: 'exact', head: true });
        
        if (documentsError) {
          console.error('Error fetching documents count:', documentsError);
          throw documentsError;
        }
        documentsCount = count ?? 0;
      }

      // Fetch reviews stats
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating');

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
      }

      const totalReviews = reviewsData?.length || 0;
      const averageRating = totalReviews > 0 
        ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;

      // Calculate interviews practiced (estimate 8 interviews per user)
      const actualUsers = usersCount ?? 0;
      const actualDocuments = documentsCount ?? 0;
      const interviewsPracticed = actualUsers > 0 ? actualUsers * 8 : 0;

      console.log('Stats fetched:', {
        usersCount: actualUsers,
        documentsCount: actualDocuments,
        totalReviews,
        averageRating,
        interviewsPracticed
      });

      // Use actual counts - no fallback values
      setStats({
        totalUsers: actualUsers,
        totalDocuments: actualDocuments,
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        interviewsPracticed,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // On error, set to 0 instead of fake fallback values
      setStats({
        totalUsers: 0,
        totalDocuments: 0,
        totalReviews: 0,
        averageRating: 0,
        interviewsPracticed: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, refetch: fetchStats };
};