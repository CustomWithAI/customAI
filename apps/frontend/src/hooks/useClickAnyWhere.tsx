import { useEventListener } from "./useEventListener";

export function useClickAnyWhere(handler: (event: MouseEvent) => void) {
	useEventListener("click", (event) => {
		handler(event);
	});
}
