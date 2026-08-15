export function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export function initialsFor(name) {
    return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'IN';
}