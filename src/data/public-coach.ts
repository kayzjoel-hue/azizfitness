export interface PublicCoachProfile {
  id: string;
  slug: string;
  name: string;
  photoUrl: string | null;
  bio: string;
  specializations: string[];
  programmes: string[];
  verificationStatus: 'SUBMITTED' | 'REGISTERED' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'SUSPENDED' | 'ARCHIVED';
  isPublished: boolean;
  title?: string;
}
