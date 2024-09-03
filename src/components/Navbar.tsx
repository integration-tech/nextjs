import Link from "next/link";
import Container from "./Container";
import Icons from "@/lib/Icons";
import ThemeSwitcher from "@/lib/ThemeSwitcher";

const Navbar = async () => {
    return (
        <header className="px-4 h-14 sticky top-0 inset-x-0 w-full bg-background/40 backdrop-blur-lg border-b border-border z-50">
            <Container reverse>
                <div className="flex items-center justify-between h-full mx-auto md:max-w-screen-xl">
                    <div className="flex items-start">
                        <Link href="/" className="flex items-center gap-2">
                        <img src="logo.png" className="w-20 h-20" />
                            
                        </Link>
                    </div>
                    <nav className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <ul className="flex items-center justify-center gap-8">
                            <Link href={"/sold"} className="hover:text-foreground/80 text-sm">Sold Player</Link>
                            <Link href={"/unsold"} className="hover:text-foreground/80 text-sm">Unsold Player</Link>
                            </ul>
                    </nav>
                    <div className="flex items-center gap-4">
                        <ThemeSwitcher/>
                    </div>
                </div>
            </Container>
        </header>
    )
};

export default Navbar