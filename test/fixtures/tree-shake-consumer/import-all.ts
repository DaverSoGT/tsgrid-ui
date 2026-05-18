import * as Icons from 'tsgrid-ui/icons'
Object.values(Icons).forEach(fn => typeof fn === 'function' && console.log((fn as () => string)()))
