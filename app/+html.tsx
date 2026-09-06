import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1, maximum-scale=1" name="viewport" />
        <meta content="#0B0D0C" name="theme-color" />
        <meta content="A motion-first personal finance dashboard." name="description" />
        <title>MotionBoard — Financial motion, made visible</title>
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: `html,body,#root{height:100%;background:#0B0D0C}body{margin:0;overscroll-behavior:none}*{box-sizing:border-box}::selection{background:#C9FF4A;color:#0B0D0C}` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
