import { useEffect } from "react";

type UseKeyDownProps = {
	action: Record<KeyboardEvent["key"], () => void>;
};
export function useKeyDown({ action }: UseKeyDownProps) {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement;
			if (["INPUT", "TEXTAREA"].includes(target.tagName)) return;
			action[event.key]?.();
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [action]);
}
