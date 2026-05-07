import '@testing-library/jest-dom'

// Polyfill para ResizeObserver — jsdom no lo implementa pero Headless UI lo requiere
globalThis.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}

// Evita el warning de Headless UI en tests al asegurar Animations API mínima.
if (!Element.prototype.getAnimations) {
    Object.defineProperty(Element.prototype, 'getAnimations', {
        configurable: true,
        value: () => [],
    })
}

if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => { },
            removeListener: () => { },
            addEventListener: () => { },
            removeEventListener: () => { },
            dispatchEvent: () => false,
        }),
    })
}
