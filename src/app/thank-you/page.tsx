import Image from "next/image";

export default function ThankYouPage() {
  return (
    <div className="text-center space-y-6">
      <Image src="/brand/jewel-logo.svg" alt="Jewel Healthcare" width={200} height={40} className="mx-auto" />
      <h1 className="text-3xl font-semibold">Thank you for your response</h1>
      <p className="text-gray-600">We appreciate your feedback.</p>
    </div>
  );
}
