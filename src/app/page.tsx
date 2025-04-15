import Image from "next/image";

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <Image
                    className="dark:invert"
                    src="/next.svg"
                    alt="Next.js logo"
                    width={100}
                    height={38}
                    priority
                />
                <h1 className="text-5xl font-extrabold font-[family-name:var(--font-geist-mono)] uppercase tracking-wider">Tracking Tracker</h1>

            </main>
        </div>
    );
}
