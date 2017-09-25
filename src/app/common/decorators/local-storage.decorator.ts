/**
 * Decorator factory for a property we wanna store in the LocalStorage
 * @JadeLocalStorage(key)
 * property
 * 
 * Will store in Jade:key and automatically return stored value on access
 */
export function JadeLocalStorage(key?: string) {
    return (target: Object, propertyName: string): void => {
        key = key || propertyName;

        let index = "jade:" + key;

        let getter = function () {
            return JSON.parse(localStorage.getItem(index));
        }

        let setter = function (value: any) {
            localStorage.setItem(index, JSON.stringify(value));
        }

        Object.defineProperty(target, propertyName, {
            get: getter,
            set: setter,
        });
    }
}