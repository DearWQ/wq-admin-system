// 引入组件
import {createApp, nextTick} from "vue";
import MyToolTip from './MyToolTip.vue'

function getViewportSize() {
    return {
        windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        windowHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    };
}

let windowWidth = getViewportSize().windowWidth
let windowHeight = getViewportSize().windowHeight

interface TooltipHtml extends HTMLElement {
    tooltipPosition: {
        x: number;
        y: number;
        right: number;
        left: number;
        width: number;
        bottom: number;
        top: number;
    },
    arrowPosition: {
        left: number;
        top: number;
        right: number;
        bottom: number;
    }
}

// 位置定位
function calculationLocation(el: TooltipHtml, target: HTMLElement, placements: string) {
    if (!el || !target) return;
    el.tooltipPosition.y = 0;
    el.tooltipPosition.x = 0;
    // @ts-ignore
    let el_dom = target.w_tooltip.firstElementChild.getBoundingClientRect()
    let target_dom = target.getBoundingClientRect()
    if (placements === "left") {
        el.tooltipPosition.x = 0
        el.tooltipPosition.y = target_dom.y - target_dom.height / 2
        el.tooltipPosition.right = windowWidth - target_dom.left + target_dom.height / 2
    } else if (placements === "left-right") {
        el.tooltipPosition.x = 0
        el.tooltipPosition.y = target_dom.y - (el_dom?.height || 0) / 2 + target_dom.height / 2
        el.tooltipPosition.left = target_dom.left + target_dom.width + 10
    } else if (placements === "bottom") {
        el.tooltipPosition.x = target_dom.x + target_dom.width / 2 - (el_dom?.width || 0) / 2
        el.tooltipPosition.y = target_dom.y + target_dom.height + 10
        if (el.tooltipPosition.x > (windowWidth-el_dom.width) && target_dom.left + el_dom.width > windowWidth) {
            el.tooltipPosition.x = windowWidth - el_dom.width
            el.arrowPosition.left = (el_dom.width / 10) * 8
        }
        if (el.tooltipPosition.x < 0) {
            el.arrowPosition.left = (el_dom.width / 10) * 2
        }

    } else if (placements === "right") {
        el.tooltipPosition.x = 0
        el.tooltipPosition.y = target_dom.y - (el_dom?.height || 0) / 2 + target_dom.height / 2
        el.tooltipPosition.left = target_dom.left + target_dom.width + 10
    } else if (placements === "right-left") {
        //提示文字的位置
        el.tooltipPosition.x = 0;
        el.tooltipPosition.y = target_dom.y - target_dom.height / 2;
        el.tooltipPosition.right = windowWidth - target_dom.left + target_dom.height / 2
        //三角形的位置
        el.arrowPosition.top = target_dom.height
    } else if (placements === "top") {
        el.tooltipPosition.x = target_dom.x + target_dom.width / 2 - (el_dom?.width || 0) / 2
        el.tooltipPosition.y = target_dom.y - target_dom.height - 20
        if (el.tooltipPosition.x > (windowWidth-el_dom.width) && target_dom.left + el_dom.width > windowWidth) {
            el.tooltipPosition.x = windowWidth - el_dom.width
            el.arrowPosition.left = (el_dom.width / 10) * 9
        }
        if (el.tooltipPosition.x < 0) {
            el.arrowPosition.left = (el_dom.width / 10) * 2
        }
    }
    el.tooltipPosition.x = el.tooltipPosition.x < 0 ? 0 : el.tooltipPosition.x
    el.tooltipPosition.y = el.tooltipPosition.y < 0 ? 0 : el.tooltipPosition.y
}

/**
 * 处理边界情况
 * @param  {HTMLElement} el
 * @param direction
 * return {string} props
 */
function dealDomBoundary(el: HTMLElement, direction: string) {
    let target_dom = el.getBoundingClientRect()
    //处理上下左右边界情况
    if (target_dom.left < 150 && direction === 'left') {
        direction = 'left-right'
    }

    if (target_dom.right > (windowWidth - 150) && direction === 'right') {
        direction = 'right-left'
    }
    if (target_dom.top > windowHeight / 100 * 90 && direction === 'bottom') {
        direction = 'top'
    }
    if (target_dom.top < windowHeight / 100 * 10 && direction === 'top') {
        direction = 'bottom'
    }
    return direction
}

// 方向
const allPlacements: string[] = ['left', 'bottom', 'right', 'top']


function getElStyleAttr(element: HTMLElement, attr: string) {
    const styles: CSSStyleDeclaration = window.getComputedStyle(element)
    // @ts-ignore
    return styles[attr]
}

const isOverflow = (target: HTMLElement) => {
    const scrollWidth = target.scrollWidth
    const offsetWidth = target.offsetWidth
    const range = document.createRange()
    range.setStart(target, 0)
    range.setEnd(target, target.childNodes.length)
    const rangeWidth = range.getBoundingClientRect().width
    const padding = (parseInt(getElStyleAttr(target, 'paddingLeft'), 10) || 0) + (parseInt(getElStyleAttr(target, 'paddingRight'), 10) || 0)
    return (rangeWidth + padding > target.offsetWidth) || scrollWidth > offsetWidth
}

interface ellipsisTooltipHtml extends HTMLElement {
    w_tipInstance: any,
    w_tooltip: any,
    tooltipPosition: {
        x: number;
        y: number;
        right: number;
        left: number;
        width: number;
        bottom: number;
        top: number;
    },
    arrowPosition: {
        left: number;
        top: number;
        right: number;
        bottom: number;
    }
    _scrollHandler: any,
    _resizeHandler: any,
}

type ModifierMap = {
    left: boolean;
    bottom: boolean;
    right: boolean;
    top: boolean;
};
export const ellipsisTooltip = {
    mounted(el: ellipsisTooltipHtml, binding: {
        value: { placement: string, content: string, destroyOnLeave: boolean },
        modifiers: ModifierMap
    }) {
        //获取指令的参数
        const {
            value: {
                placement, content, destroyOnLeave
            } = {}
        } = binding;
        // 加上超出...样式
        el.style.overflow = "hidden";
        el.style.textOverflow = "ellipsis";
        el.style.whiteSpace = "nowrap";
        windowWidth = getViewportSize().windowWidth
        windowHeight = getViewportSize().windowHeight
        //鼠标移开时 清除元素
        const onMouseLeave = () => {
            if (el.w_tipInstance) {
                el.w_tipInstance.hiddenTip()
                el.w_tooltip.remove()
                el.w_tipInstance = null
                el.w_tooltip = null
            }
        };
        const onMouseEnter = () => {
            // 判断内容长度 需要展示
            if (isOverflow(el)) {
                // @ts-ignore
                const directiveList = allPlacements.filter(placement => binding.modifiers[placement])
                const placements = directiveList.length ? directiveList : allPlacements
                if (!el.w_tooltip) {
                    // 创建tooltip实例
                    const vm = createApp(MyToolTip)
                    // 创建根元素
                    el.w_tooltip = document.createElement('div')
                    // 挂载到页面
                    document.body.appendChild(el.w_tooltip)
                    el.w_tooltip.id = `tooltip_${Math.floor(Math.random() * 10000)}`
                    el.w_tipInstance = vm.mount(el.w_tooltip)
                }
                // 设置 tooltip 显示方向 处理边界情况
                let direction: string = dealDomBoundary(el, placement || placements[0] || 'top')

                el.w_tipInstance.placements = direction;
                // 设置显示内容
                el.w_tipInstance.setContent(content || el.innerText)
                // 使 tooltip 显示
                el.w_tipInstance.showTip()
                nextTick(() => {
                    // 计算 tooltip 在页面中的位置
                    calculationLocation(el.w_tipInstance, el, direction)
                })
                el._scrollHandler = () => {
                    // 重新定位位置
                    if (el.w_tipInstance) calculationLocation(el.w_tipInstance, el, placements[0])
                }
                window.addEventListener('scroll', el._scrollHandler)
                const _destroyOnLeave = destroyOnLeave || true
                if (_destroyOnLeave) el.addEventListener("mouseleave", onMouseLeave);
            }
        };
        el.addEventListener("mouseenter", onMouseEnter);
    },
    unmounted(el: ellipsisTooltipHtml) {
        if (el.w_tooltip) {
            document.body.removeChild(el.w_tooltip)
        }
        window.removeEventListener('scroll', el._scrollHandler)
    }
}