import Page from './enums/page';
import ThoughtSize from './enums/thoughtSize';

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