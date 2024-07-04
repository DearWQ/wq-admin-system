export function isExternal(path: string) {
    return /^(https?:|mailto:|tel:)/.test(path)
}

export function uuid() {
    const s: Array<any> = []
    const hexDigits = '0123456789abcdef'
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'
    const uuid = s.join('')
    return uuid
}

export function randomString(length: number) {
    const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    for (let i = length; i > 0; --i) {
        result += str[Math.floor(Math.random() * str.length)]
    }
    return result
}

/**
 * 中划线字符驼峰
 * @param {*} str 要转换的字符串
 * @returns 返回值
 */
export function toHump(str: string): string {
    if (!str) return str
    return str
        .replace(/\-(\w)/g, function (all, letter) {
            return letter.toUpperCase()
        })
        .replace(/(\s|^)[a-z]/g, function (char) {
            return char.toUpperCase()
        })
}

export function sortColumns(originColumns: any[], newColumns: any[]) {
    if (!originColumns || !newColumns) {
        return
    }
    if (newColumns.length === 0) {
        originColumns.length = 0
    } else {
        const selectionItem = originColumns.find((it) => it.type === 'selection')
        originColumns.length = 0
        if (selectionItem) {
            originColumns.push(selectionItem)
        }
        originColumns.push(...newColumns)
    }
}

/**
 * 格式化日期
 * @param date
 */
export function formatDate(date: Date): { year: string, month: string, day: string } {
    let year: number = date.getFullYear();
    let months: number = date.getMonth() + 1;
    let month: string = (months < 10 ? '0' + months : months).toString();
    let day: string = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()).toString();
    return {
        year: year.toString(),
        month,
        day
    }
}

/**
 * 获取当天时间
 * @param {number} num
 * @returns {string}
 */
export function getCurDay(num: number = 0): string {
    let datetime: Date = new Date();
    let year: number = datetime.getFullYear();
    let month: string | number = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    let day: string | number = datetime.getDate()
    if ((day + num) > 0) {
        day = (day + num) < 10 ? "0" + (day + num) : day + num;
    } else {
        day = (day - num) < 10 ? "0" + (day - num) : day - num;
    }
    return `${year}-${month}-${day}`
}