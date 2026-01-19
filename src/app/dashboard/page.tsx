import { getDashboardContent } from '@/lib/content';
import { getLanguage } from '@/lib/get-language';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const lang = await getLanguage();
  const content = getDashboardContent(lang);

  return <DashboardClient content={content} />;
}
