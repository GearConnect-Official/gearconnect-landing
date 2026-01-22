import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<{
    redirect_url?: string;
  }>;
}) {
  // Utiliser l'URL de redirection depuis les paramètres de requête, ou /dashboard par défaut
  const params = await (searchParams || Promise.resolve({} as { redirect_url?: string }));
  const redirectUrl = params?.redirect_url || '/dashboard';
  const afterSignInUrl = redirectUrl;

  return (
    <div className="min-h-[calc(100vh-14rem)] flex flex-col items-center justify-center py-12 sm:py-16 px-4">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Image 
          src="/logo.png" 
          alt="GearConnect Logo" 
          width={60} 
          height={60}
          className="w-15 h-15"
          priority
        />
      </div>

      {/* SignIn Component from Clerk */}
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "shadow-xl rounded-xl",
            headerTitle: "text-3xl font-bold text-center",
            headerSubtitle: "text-center text-secondary",
            socialButtonsBlockButton: "bg-[#E53935] hover:bg-[#C62828] text-white border-0",
            formButtonPrimary: "bg-[#E53935] hover:bg-[#C62828] text-white",
            footerActionLink: "text-[#E53935] hover:text-[#C62828]",
            formFieldInput: "border-grey focus:ring-2 focus:ring-[#E53935]",
            formFieldLabel: "text-primary font-semibold",
            identityPreviewText: "text-primary",
            identityPreviewEditButton: "text-[#E53935] hover:text-[#C62828]",
            formResendCodeLink: "text-[#E53935] hover:text-[#C62828]",
            otpCodeFieldInput: "border-grey focus:ring-2 focus:ring-[#E53935]",
            alertText: "text-red-600",
            formFieldErrorText: "text-red-600",
          },
        }}
        routing="path"
        path="/auth/login"
        signUpUrl="/auth/register"
        afterSignInUrl={afterSignInUrl}
        redirectUrl={redirectUrl}
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}
