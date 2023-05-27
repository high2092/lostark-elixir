import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

const Document = () => {
  return (
    <Html>
      <Head>
        <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`} />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="image/favicon.svg" />
        <meta name="theme-color" content="#a4907c" />
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
