import LeftBar from "@/components/LeftBar";

async function LeftLayout({ children }) {

  return (
    <div className="flex justify-between gap-4 w-full my-5">
      <div className="w-96 hidden md:block max-h-full overflow-hidden h-[calc(100vh-89px)] overflow-y-auto">
        <LeftBar />
      </div>
      <div className="w-full bg-white rounded-md h-[calc(100vh-89px)] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export default LeftLayout;
