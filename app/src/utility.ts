import Page from './enums/page';
import ThoughtSize from './enums/thoughtSize';
import IPopup from './interfaces/IPopup';
import store from './store';
import IState from './interfaces/IState';

const lut: Array<string> = [];
for (let i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
}

export function isEmptyString (str: string) {
    return str === '' || str === null || str === undefined;
}

export function interactifyNav() {
    // Get all "navbar-burger" elements
    const navbarBurgers: Array<HTMLElement> = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if (navbarBurgers.length > 0) {

    // Add a click event on each of them
        navbarBurgers.forEach((el) => {
            el.addEventListener('click', () => {
                // Get the target from the "data-target" attribute
                const dataTarget = el.dataset.target;
                if (dataTarget) {
                    const target = document.getElementById(dataTarget);
                    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                    if (target) {
                        el.classList.toggle('is-active');
                        target.classList.toggle('is-active');
                    }
                }
            });
        });
    }
}

export function setDocumentTitle(title: string) {
    document.title = `Mind Map - ${title}`;
}

export function getUserFriendlyPageName(page: Page): string {
    switch(page) {
        case Page.MapList:
            return 'My Mind Maps';
        case Page.Mapper:
            return 'New Mind Map';
        default:
            return ''
    }
}

export function getSmallerThoughtSize(size: ThoughtSize): ThoughtSize {
    return size === ThoughtSize.Tiny ? ThoughtSize.Tiny : size + 1;
}

export function getObjectZIndex(canvas: fabric.Canvas, object: fabric.Object) {
    return canvas.getObjects().indexOf(object);
}

export function getUUID(): string {
    const d0 = Math.random()*0xffffffff|0;
    const d1 = Math.random()*0xffffffff|0;
    const d2 = Math.random()*0xffffffff|0;
    const d3 = Math.random()*0xffffffff|0;
    return lut[d0&0xff] + lut[d0>>8&0xff] + lut[d0>>16&0xff] + lut[d0>>24&0xff] + '-'
        + lut[d1&0xff] + lut[d1>>8&0xff] + '-'
        + lut[d1>>16&0x0f|0x40] + lut[d1>>24&0xff] + '-'
        + lut[d2&0x3f|0x80] + lut[d2>>8&0xff] + '-'
        + lut[d2>>16&0xff] + lut[d2>>24&0xff] + lut[d3&0xff] + lut[d3>>8&0xff] + lut[d3>>16&0xff] + lut[d3>>24&0xff];
}

export async function showPopup(options: IPopup) {
    return new Promise((resolve, reject) => {
        store.commit('showPopup', options);
        const unwatch = store.watch((state: IState) => state.popup.result, (value) => {
            unwatch();
            store.commit('hidePopup');
            if (value === 'good') {
                resolve();
            } else {
                reject();
            }
        });
    });
}
