import { getLanguage } from '@/lib/get-language';
import { getDashboardContent } from '@/lib/content';
import TicketPageClient from './page-client';

export default async function TicketPage() {
  const lang = await getLanguage();
  const content = getDashboardContent(lang);

  return <TicketPageClient content={content} />;
}
