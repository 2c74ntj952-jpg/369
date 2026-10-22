import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-900 text-white text-center">
      <h2 className="text-2xl font-bold mb-2">Сторінку не знайдено</h2>
      <p className="text-neutral-400 mb-4">На жаль, запитана сторінка не існує.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-medium transition-colors"
      >
        Повернутися на головну
      </Link>
    </div>
  );
}
