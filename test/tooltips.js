// import { w2overlay } from '../src/w2overlay.js'
import { TsUtils } from '../src/tsutils.js'
import { TsTooltip, TsColor, TsMenu } from '../src/tstooltip.js'
import { $, query } from '../src/query.js'

window.query = query
window.TsTooltip = TsTooltip
window.TsUtils = TsUtils

$('.corners input').each(el => {
    TsTooltip.attach(el, {
        html: 'Corner tooltip',
        autoShow: true,
        // showOn: 'focus',
        // hideOn: 'blur'
        // anchorClass: 'my',
        // anchorStyle: 'border: 1px solid red; border-radius: 2px;'
    })
})

$('button').on('click', event => {
    let el = event.target
    let isLong = $(el).attr('long') != null
    let isHide = $(el).attr('hide') != null
    let anchor = $('#inp0')
    anchor.css('height', '120px')
    if (!isHide) {
        // TsTooltip.show({
        //     name: 'tpA',
        //     anchor: anchor[0],
        //     html: 'small',
        //     position: 'left',
        //     hideOn: ['click']
        // })
        // TsTooltip.show({
        //     name: 'tpB',
        //     anchor: anchor[0],
        //     class: 'TsUi-light',
        //     html: 'White small tooltip',
        //     position: 'bottom',
        //     hideOn: ['click']
        // })
        TsTooltip.attach({
            name: 'tp1',
            anchor: anchor[0],
            // position: $('#position').val(),
            // position: 'right|left',
            position: 'top|bottom',
            // position: 'bottom|top',
            // position: 'top',
            // align: 'both',
            // maxWidth: 100,
            // maxHeight: 100,
            // arrowSize: 0,
            // margin: 1,
            autoShowOn: 'focus',
            hideOn: ['doc-click', 'input', 'change'],
            // offsetY: 5,
            html: isLong
                ? `Long text for the tooltip to see how it would wrap if any.<br>
                   Long text for the tooltip to see how it would wrap if any.<br>
                   Long text for the tooltip to see how it would wrap if any.<br>
                   Long text for the tooltip to see how it would wrap if any.<br>
                   Long text for the tooltip to see how it would wrap if any.`
                : 'Small text tooltip',
            class: 'TsUi-light',
            style: 'background-color: white; border: 1px solid red; color: red; text-shadow: none',
            // onShow(event) {
            //     console.log('show', event)
            // },
            // onHide(event) {
            //     console.log('hide', event)
            // },
            // onUpdate(event) {
            //     console.log('update', event)
            // },
            // onMove(event) {
            //     console.log('move', event)
            // }
        })
        // .then(event => {
        //     console.log('then 1', event)
        // })
        // .show(event => {
        //     console.log('show 1', event)
        // })
        // .hide(event => {
        //     console.log('hide 1', event)
        // })
        // .update(event => {
        //     console.log('update 1', event)
        // })
        // .move(event => {
        //     console.log('move 1', event)
        // })
    } else {
        TsTooltip.hide(anchor[0])
    }
})

// let func =  (event) => {
//     console.log('enter 1', event)
// }

// query('.input')
//     .off('.tooltip')
//     .on('mouseenter.tooltip', function(event) {
//         TsTooltip.show(this, 'some input')
//     })
//     .on('mouseleave.tooltip', function(event) {
//         TsTooltip.hide(this)
//     })

// TsTooltip.show({
//     anchor: query('#inp0')[0],
//     position: 'top',
//     html: 'Auto show',
//     style: 'background-color: white; border: 1px solid red; color: red; text-shadow: none'
// })

let ret2 = TsMenu.attach({
    type: 'check',
    anchor: query('#inp0')[0],
    // align: 'both',
    items: [
        { id: 1, text: 'item 1', icon: 'TsUi-icon-plus', count1: 4, remove: true, group: false },
        { id: 2, text: 'item 2', icon: 'TsUi-icon-pencil', hotkey: 'Cmd + A' },
        { id: 3, text: 'item 3', icon: 'TsUi-icon-colors' },
        { id: 4, text: 'item 4', icon: 'TsUi-icon-drop' },
    ]
})
.select(event => {
    console.log(event)
    event.preventDefault()
})
.remove(event => {

})
.subMenu(event => {

})
console.log(ret2)
// .liveUpdate(event => {
//     console.log('update', event.color)
// })
// .select(event => {
//     console.log('selected', event.color)
// });

let ret = TsMenu.attach({
    anchor: query('#inp6')[0],
    type: 'radio',
    // search: true,
    // filter: true,
    // topHTML: '1',
    // menuStyle: 'border: 1px solid red;',
    // spinner: true,
    items: [
        { id: 1, text: 'item 1', icon1: 'TsUi-icon-plus', count: 'ab', checked: true, disabled: true },
        { id: 2, text: 'item 2', icon: 'TsUi-icon-pencil', remove: true, group: 1, disabled: true },
        { id: 21, text: 'This is some longer item', icon: 'TsUi-icon-colors', remove: true, group: 1 },
        { id: 3, text: 'item 3', icon: 'TsUi-icon-drop',  group: 1,  hotkey: 'Cmd + A' },
        { text: '--' },
        { id: 4, text: 'Has sub items', icon: true, count: '5A', expanded: true, group: false,
            items: [
                { id: 41, text: 'sub item 6', icon: 'TsUi-icon-info', group: 1 },
                { id: 42, text: 'sub item long 7', icon: 'TsUi-icon-info', group: 1 },
                { id: 43, text: 'sub item long 8', icon: 'TsUi-icon-info', group: 1 },
            ]
        },
        { id: 5, text: 'item 5', icon: true, tooltip: 'Some tooltip' },
        { text: '-- group' },
        { id: 6, text: 'item 6', icon: 'TsUi-icon-info', disabled: true },
        { id: 7, text: 'item long 7', icon: 'TsUi-icon-info' },
        { id: 8, text: 'item long 8', icon: 'TsUi-icon-info' },
        { text: '-- No icon items' },
        'Some text w/o an icon',
        'Some text w/o an icon',
        'Some text w/o an icon',
        'Some text w/o an icon',
        'Some text w/o an icon',
        'Some text w/o an icon',
        'Some text w/o an icon',
        'Some text w/o an icon',
        'Some text w/o an icon',
        'Some text w/o an icon',
        'Some text w/o an icon',
    ],
    // advanced: true,
    // position: 'right|left',
    // arrowSize: 14,
    // autoShow: true,
    // html: 'more text',
})
.select(event => {
    console.log(event.item)
})
.remove(event => {
    // console.log(event)
    // event.preventDefault()

})
.subMenu(event => {
    // console.log(event.item.expanded)
})
.hide(event => {
    // console.log('hide')
})
console.log(ret)
