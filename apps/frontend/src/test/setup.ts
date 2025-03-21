import "@testing-library/jest-dom";

// Mock window.matchMedia
window.matchMedia = (query) => ({
	matches: false,
	media: query,
	onchange: null,
	addListener: jest.fn(),
	removeListener: jest.fn(),
	addEventListener: jest.fn(),
	removeEventListener: jest.fn(),
	dispatchEvent: jest.fn(),
});

// Mock window.innerWidth
Object.defineProperty(window, "innerWidth", {
	writable: true,
	configurable: true,
	value: 1024,
});

// Mock ResizeObserver
class ResizeObserverMock {
	observe = jest.fn();
	unobserve = jest.fn();
	disconnect = jest.fn();
}

window.ResizeObserver = ResizeObserverMock;
