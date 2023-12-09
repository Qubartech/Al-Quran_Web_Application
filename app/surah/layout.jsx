import LeftBar from "@/components/LeftBar";

async function LeftLayout({ children }) {

  return (
    <div className="flex justify-between gap-4 w-full my-5">
      <div className="w-96 hidden md:block max-h-full overflow-hidden">
        <LeftBar />
      </div>
      <div className="w-full bg-white rounded-md">{children}</div>
    </div>
  );
}

export default LeftLayout;
