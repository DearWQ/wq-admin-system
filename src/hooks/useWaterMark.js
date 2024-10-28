// 图片加水印


/**
 *
 * @param {File | String} image 图片文件或图片url地址
 * @param {Object} option
 */
export default async function (image, option) {
    // @ts-ignore
    const text = option.text,//水印文字
        font = option.font || '16px microsoft yahei',//字体属性
        fillStyle = option.fillStyle || 'rgba(0, 0, 0, 0.3)',//字体颜色
        rotate = option.rotate || -25 //旋转角度

    let img;
    if (typeof (image) === 'string') {
        img = await urlToImg(image);
    } else {
        if (['image/png', 'image/jpeg'].includes(image.type)) {
            img = await blobToImg(image);
        } else {
            return Promise.reject('不支持该类型的文件加水印');
        }
    }
    let canvas = imgToCanvas(img);
    let blob = await watermark(canvas, text, font, fillStyle, rotate);
    // @ts-ignore
    let newImg = await blobToImg(blob);
    let src = newImg.src;
    let newFile = base64ToFile(src, 'image.png');
    // @ts-ignore
    let newUrl = window.URL.createObjectURL(newFile);

    return {newFile, src, newUrl};
}

// 图片地址转image
function urlToImg(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.addEventListener('load', () => resolve(img));
        img.crossOrigin = 'Anonymous';
        img.src = url;
        // @ts-ignore
        img.objectFit = 'contain'
    })
}

// 图片文件转image
function blobToImg(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const img = new Image();
            img.addEventListener('load', () => resolve(img));
            img.crossOrigin = 'Anonymous';
            // @ts-ignore
            img.src = reader.result;
            // img.width = document.body.clientWidth
        })
        reader.readAsDataURL(blob);
    })
}

// 图片转canvas
function imgToCanvas(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext('2d');
    // @ts-ignore
    context.drawImage(img, 0, 0);
    return canvas;
}

function base64ToFile(dataUrl, filename) {
    if (!dataUrl) {
        return '';
    }

    let arr = dataUrl.split(',');
    // @ts-ignore
    let mime = arr[0].match(/:(.*?);/)[1],
        bStr = atob(arr[1]),
        n = bStr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bStr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
}

// canvas 添加水印
function watermark(canvas, text, font, fillStyle, rotate) {
    return new Promise((resolve) => {
        let context = canvas.getContext('2d');
        // @ts-ignore
        context.font = font;
        // @ts-ignore
        context.fillStyle = fillStyle;
        // 设置旋转中心点
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        // 将原点移到中心
        // @ts-ignore
        context.translate(centerX, centerY);
        // @ts-ignore
        context.rotate(rotate * Math.PI / 180);
        // @ts-ignore
        context.textAlign = 'center';
        // @ts-ignore
        context.textBaseline = 'Middle';
        // @ts-ignore
        const measure = context.measureText(text)
        const textWidth = measure.width;//获取文字长度
        const textHeight = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent;//获取文字高度
        for (let i = -centerX - textWidth / 2; i < canvas.width; i += (textWidth + (textWidth / 5))) {
            for (let j = -centerY + textHeight; j < canvas.height * 2; j += 50) {
                // 填充文字，i 间距, j 间距
                // @ts-ignore
                context.fillText(text, i, j);
            }
        }
        canvas.toBlob((blob) => resolve(blob));
    })
}