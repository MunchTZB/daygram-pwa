const ua = navigator.userAgent,
  android = ua.match(/(Android);?[\s\/]+([\d.]+)?/), // 匹配 android
  ipad = ua.match(/(iPad).*OS\s([\d_]+)/), // 匹配 ipad
  ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/), // 匹配 ipod
  iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/); // 匹配 iphone

const isAdr = !!android,
  isIos = !!(ipad || ipod || iphone);

export {
  isAdr,
  isIos
};
