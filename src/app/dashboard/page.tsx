import { getDashboardContent } from '@/lib/content';
import { getLanguage } from '@/lib/get-language';
import { getContactContent } from '@/lib/content';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  try {
  const lang = await getLanguage();
  const content = getDashboardContent(lang);
  const contactContent = getContactContent(lang);

  return <DashboardClient content={content} contactContent={contactContent} />;
  } catch (error) {
    console.error('Error loading dashboard:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Erreur de chargement</h1>
          <p className="text-secondary">
            Impossible de charger le contenu du dashboard. Veuillez réessayer plus tard.
          </p>
        </div>
      </div>
    );
  }
}
