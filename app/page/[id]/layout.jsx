import LeftBarContainer from "@/components/layout/LeftBarContainer";
import getSurahList from "@/lib/api/getSurahList";

export default async function PageLayout({ children }) {
  const surahList = await getSurahList();
  const { data } = surahList || {};

  return (
    <LeftBarContainer data={data}>
      {children}
    </LeftBarContainer>
  );
}
