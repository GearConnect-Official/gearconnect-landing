import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12 sm:py-16">
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl",
            headerTitle: "text-2xl font-bold",
            headerSubtitle: "text-[#474C54]",
            socialButtonsBlockButton: "bg-[#E53935] hover:bg-[#C62828]",
            formButtonPrimary: "bg-[#E53935] hover:bg-[#C62828]",
            footerActionLink: "text-[#E53935] hover:text-[#C62828]",
          },
        }}
      />
    </div>
  );
}
