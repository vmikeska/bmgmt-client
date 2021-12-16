export class ObjectUtils {
    public static isArray(obj: any) {
        if (Array.isArray) {
            return Array.isArray(obj);
        }

        return obj instanceof Array;
    }

    public static isNullOrUndefined(val: any) {
        if (val === null) {
            return true;
        }

        if (val === undefined) {
            return true;
        }

        return false;
    }

    public static isObject(val: any) {
        if (!val) {
            return false;
        }

        let isObj = typeof val === 'object';
        return isObj;
    }

    public static safeStr(val: any) {
        if (!val) {
            return '';
        }

        return val;
    }

    public static numberToBoolean(val: number | string) {
        if ([0, '0'].includes(val)) {
            return false;
        }

        if ([1, '1'].includes(val)) {
            return true;
        }

        return false;
    }

    public static isEmptyOrWhiteSpace(val: any) {
        if (this.isNullOrUndefined(val)) {
            return true;
        }

        if (val.trim() === '') {
            return true;
        }

        return false;
    }
}
