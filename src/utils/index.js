export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}

export function uuid() {
    const s = []
    const hexDigits = '0123456789abcdef'
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.slice(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.slice((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'
    const uuid = s.join('')
    return uuid
}

export function randomString(length) {
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
export function toHump(str) {
    if (!str) return str
    return str
        .replace(/-(\w)/g, function (all, letter) {
            return letter.toUpperCase()
        })
        .replace(/(\s|^)[a-z]/g, function (char) {
            return char.toUpperCase()
        })
}

export function sortColumns(originColumns, newColumns) {
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
export function formatDate(date) {
    let year = date.getFullYear();
    let months = date.getMonth() + 1;
    let month = (months < 10 ? '0' + months : months).toString();
    let day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()).toString();
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
export function getCurDay(num = 0) {
    let datetime = new Date();
    let year = datetime.getFullYear();
    let month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    let day = datetime.getDate()
    if ((day + num) > 0) {
        day = (day + num) < 10 ? "0" + (day + num) : day + num;
    } else {
        day = (day - num) < 10 ? "0" + (day - num) : day - num;
    }
    return `${year}-${month}-${day}`
}