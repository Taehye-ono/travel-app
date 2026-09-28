import './globals.css';

export const metadata = {
  title: 'BritRoute — 나다운 영국 여행',
  description: '런던, 에든버러, 글래스고, 카디프. 내 관심사와 여행 속도로 만드는 1~3일의 영국 여행 일정.',
};

export default function RootLayout({ children }) {
  return <html lang="ko"><body>{children}</body></html>;
}
