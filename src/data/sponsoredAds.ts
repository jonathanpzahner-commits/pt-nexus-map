import { AdType } from '@/components/ads/SponsoredBanner';

interface SponsoredAd {
  id: string;
  type: AdType;
  title: string;
  description: string;
  company: string;
  location?: string;
  ctaText: string;
  ctaUrl: string;
  featured?: boolean;
  rating?: number;
  salary?: string;
  deadline?: string;
  targetPages?: string[]; // Which pages/tabs this ad should appear on
}

export const sponsoredAds: SponsoredAd[] = [
  // Job Ads
  {
    id: 'job-1',
    type: 'job',
    title: 'Senior Physical Therapist - Outpatient Ortho',
    description: 'Join our growing team! Excellent benefits, flexible schedule, and continuing education support.',
    company: 'Premier Physical Therapy',
    location: 'Austin, TX',
    salary: '$85,000 - $95,000',
    ctaText: 'Apply Now',
    ctaUrl: '#',
    featured: true,
    targetPages: ['jobs', 'overview', 'providers']
  },
  {
    id: 'job-2',
    type: 'job',
    title: 'Travel PT - $2,200/week',
    description: 'High-paying travel assignments across the country. Housing and travel stipends included.',
    company: 'TravelCare Staffing',
    location: 'Multiple Locations',
    salary: '$2,200/week',
    ctaText: 'View Assignments',
    ctaUrl: '#',
    targetPages: ['jobs', 'providers']
  },

  // Company Ads
  {
    id: 'company-1',
    type: 'company',
    title: 'Revolutionary Pain Management Solutions',
    description: 'Cutting-edge technology for better patient outcomes. FDA-approved and evidence-based.',
    company: 'InnovaPT Technologies',
    rating: 4.8,
    ctaText: 'Learn More',
    ctaUrl: '#',
    featured: true,
    targetPages: ['companies', 'overview']
  },
  {
    id: 'company-2',
    type: 'company',
    title: 'Practice Management Software Built for PTs',
    description: 'Streamline scheduling, billing, and documentation. Free trial available.',
    company: 'PT Pro Software',
    rating: 4.9,
    ctaText: 'Start Free Trial',
    ctaUrl: '#',
    targetPages: ['companies', 'consultants']
  },

  // Research Ads
  {
    id: 'research-1',
    type: 'research',
    title: 'Clinical Trial: Novel Treatment for Lower Back Pain',
    description: 'Seeking PT clinics to participate in groundbreaking research study. Compensation provided.',
    company: 'Medical Research Institute',
    location: 'Nationwide',
    deadline: 'March 15, 2024',
    ctaText: 'Join Study',
    ctaUrl: '#',
    targetPages: ['community', 'overview', 'providers']
  },

  // Survey Ads
  {
    id: 'survey-1',
    type: 'survey',
    title: 'PT Salary & Benefits Survey 2024',
    description: 'Help shape industry standards. Complete our 10-minute survey and receive exclusive market report.',
    company: 'PT Industry Analytics',
    deadline: 'February 28, 2024',
    ctaText: 'Take Survey',
    ctaUrl: '#',
    featured: true,
    targetPages: ['survey', 'overview', 'providers']
  },

  // Education Ads
  {
    id: 'education-1',
    type: 'education',
    title: 'Advanced Manual Therapy Certification',
    description: 'Weekend intensive course. Earn 32 CEUs and advanced certification. Early bird pricing available.',
    company: 'Elite PT Education',
    location: 'Multiple Cities',
    ctaText: 'Register Now',
    ctaUrl: '#',
    targetPages: ['education', 'providers', 'overview']
  },

  // Technology Ads
  {
    id: 'tech-1',
    type: 'technology',
    title: 'AI-Powered Exercise Prescription Platform',
    description: 'Personalized treatment plans using machine learning. Improve outcomes and save time.',
    company: 'RehabAI Solutions',
    rating: 4.7,
    ctaText: 'Request Demo',
    ctaUrl: '#',
    targetPages: ['consultants', 'companies']
  }
];

// Helper function to get ads for specific pages
export const getAdsForPage = (pageKey: string, maxAds: number = 3): SponsoredAd[] => {
  return sponsoredAds
    .filter(ad => !ad.targetPages || ad.targetPages.includes(pageKey))
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)) // Featured ads first
    .slice(0, maxAds);
};