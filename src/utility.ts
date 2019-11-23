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
