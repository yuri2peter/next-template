import { useEffect } from "react";

export function useChangeTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
