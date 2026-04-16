export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="text-2xl font-extrabold tracking-tight">
          <span className="text-purple-600">Szene</span>
        </div>

        <nav className="hidden gap-6 md:flex">
          <a className="text-sm font-medium text-gray-700 hover:text-black" href="#">OrtEvents</a>
          <a className="text-sm font-medium text-gray-700 hover:text-black" href="#">Locations</a>
          <a className="text-sm font-medium text-gray-700 hover:text-black" href="#">Über uns</a>
        </nav>

        <div className="hidden md:block">
          <input
            placeholder="Events, Locations suchen…"
            className="w-72 rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
    </header>
  );
}
 