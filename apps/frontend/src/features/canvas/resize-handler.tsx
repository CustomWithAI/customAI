export const ResizeHandler = () => (
	<>
		<div
			className="resize-handle absolute w-3 h-3 -left-1.5 -top-1.5 bg-white border-2 border-blue-500 rounded-full cursor-nw-resize z-10"
			data-corner="top-left"
		/>
		<div
			className="resize-handle absolute w-3 h-3 -right-1.5 -top-1.5 bg-white border-2 border-blue-500 rounded-full cursor-ne-resize z-10"
			data-corner="top-right"
		/>
		<div
			className="resize-handle absolute w-3 h-3 -left-1.5 -bottom-1.5 bg-white border-2 border-blue-500 rounded-full cursor-sw-resize z-10"
			data-corner="bottom-left"
		/>
		<div
			className="resize-handle absolute w-3 h-3 -right-1.5 -bottom-1.5 bg-white border-2 border-blue-500 rounded-full cursor-se-resize z-10"
			data-corner="bottom-right"
		/>
	</>
);
