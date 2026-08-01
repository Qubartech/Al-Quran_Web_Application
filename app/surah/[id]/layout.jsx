import LeftBarContainer from "@/components/layout/LeftBarContainer";
import SurahPrevNextNav from "@/components/surah/SurahPrevNextNav";
import getSurahList from "@/lib/api/getSurahList";

async function SurahReadLayout({ children }) {
  const surahList = await getSurahList();
  const { data } = surahList || {};

  return (
    <>
      <LeftBarContainer data={data}>
        {children}
      </LeftBarContainer>
      <SurahPrevNextNav />
    </>
  );
}

export default SurahReadLayout;
