import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => {
  return (
    <Html>
      <Head>
        <link rel="shortcut icon" href="image/favicon.svg" />
        <meta name="description" content="로스트아크 엘릭서 연성 컨텐츠에 대한 시뮬레이션 제공" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
