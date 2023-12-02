import  Link  from 'next/link';

function Navbar() {
  return (
    <div className="px-5 bg-white mb-4 shadow fixed left-0 right-0 w-full z-50">
      <div className="max-w-screen-xl mx-auto py-4">
        <div className="text-3xl font-semibold"><Link href="/">Quran</Link></div>
      </div>
    </div>
  );
}

export default Navbar;
