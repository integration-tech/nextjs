import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image component if needed

export default function Home() {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/home.jpg')" }}
    >
      <div className="text-8xl mb-10 text-white">
        Welcome to RSTC 3.0
      </div>
      <Link href={'/auction'}>
        <Button className="text-xl pt-2 bg-transparent text-white border-white border-2 hover:bg-white hover:text-black transition">
          Lets Begin!
        </Button>
      </Link>
    </div>
  );
}
