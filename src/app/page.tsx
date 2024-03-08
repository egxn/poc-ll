"use client"

import { ReactNode, createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

function useWindowScroll(): number {
  const [scroll, setScroll] = useState<number>(window.scrollY);

  const handleScroll = useCallback(() => {
    setScroll(window.scrollY);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return scroll;
}

const ScrollProgressContext = createContext({
  progress: 0,
  boxRef: {} as React.RefObject<HTMLDivElement>,
});

function ScrollProgressProvider({
  boxRef,
  children,
} : {
  boxRef: React.RefObject<HTMLDivElement>
  children: ReactNode,
}) {
  const scroll = useWindowScroll();
  const [progress, setProgress] = useState<number>(0);

  const getProgress = useCallback(() => {
    if (boxRef?.current) {
      const topPositionBox = boxRef.current.getBoundingClientRect().top + scroll;
      const progress = Math.min(1, Math.max(0, (scroll - topPositionBox) / boxRef.current.clientHeight));

      setProgress(progress);
    }
  }, [boxRef, scroll]);


  useEffect(() => {
    getProgress();
    window.addEventListener("scroll", getProgress);
    return () => window.removeEventListener("scroll", getProgress);
  }, [getProgress]);

  return (
    <ScrollProgressContext.Provider value={{ progress, boxRef }}>
      {children}
    </ScrollProgressContext.Provider>
  );
}

function useScrollProgress() {
  const { progress, boxRef } = useContext(ScrollProgressContext);
  return { progress, boxRef };
}

function ScrollViewport ({
  children,
  classname,
  height,
}: {
  children: ReactNode,
  classname: string,
  height: string,
  DEBUG?: boolean,
}) {
  const boxRef = useRef<HTMLDivElement>(null);

  return (
    <ScrollProgressProvider boxRef={boxRef}>
      <div
        className={classname}
        ref={boxRef}
        style={{
          height: `${height}vh`
        }}>
        {children}
      </div>
    </ScrollProgressProvider>
  )
}

function Slide({
  classname,
  text,
}: {
  classname: string,
  text: string,
}) {
  const { progress } = useScrollProgress();

  return (
    <div className={classname}>
      <h1
        style={{
          transform: `scale(${(progress * 2) + 1}`,
        }}
      >{text}</h1>
      <br />
      <div>{progress.toFixed(2)}</div>
    </div>
  );
}

export default function Home() {
  return (
    <main className={styles.main}>
      <ScrollViewport classname={styles.one} height="800">
        <Slide classname={styles.content} text="🙂" />
      </ScrollViewport>
      <ScrollViewport classname={styles.two} height="200" DEBUG>
        <Slide classname={styles.content} text="🙂" />
      </ScrollViewport>
      <ScrollViewport classname={styles.three} height="100">
        <Slide classname={styles.content} text="🙂" />
      </ScrollViewport >
      <ScrollViewport classname={styles.four} height="100">
        <Slide classname={styles.content} text="🙂" />
      </ScrollViewport >
      <ScrollViewport classname={styles.five} height="100">
        <Slide classname={styles.content} text="🙂" />
      </ScrollViewport >
      <ScrollViewport classname={styles.six} height="100">
        <Slide classname={styles.content} text="🙂" />
      </ScrollViewport >
      <ScrollViewport classname={styles.seven} height="100" >
        <Slide classname={styles.content} text="🙂" />
      </ScrollViewport >
    </main>
  );
}
