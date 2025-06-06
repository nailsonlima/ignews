import Document, { Html, Head, Main, NextScript } from "next/document"

export default class MyDocument extends Document {
    render() {
        return(
        <Html>
        <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,900;1,700&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>

            <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        </Head>
        <body>
            <Main />
            <NextScript />
        </body>
        </Html>
    )
    }
}