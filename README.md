# @fe9527/tool

## 安装

```bash
$ pnpm install @fe9527/tool
```

### 已有方法

|         工具名          |              描述              |
|:--------------------:|:----------------------------:|
|          getDeviceInfo          | 对 `navigator.userAgent` 进行解析, 获取访问的设备信息 |


### getDeviceInfo 示例

```js
import { getDeviceInfo } from '@fe9527/tool'

// BrowserEnum: 浏览器名字枚举
// DeviceTypeEnum 设备类型枚举
// EngineTypeEnum 浏览器内核枚举
// OSTypeEnum ： 操作系统枚举
// DeviceInfo： getDeviceInfo() 返回结果的类型

console.log(getDeviceInfo())
// console.log(ua('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36'))
// {
//   "browser": "Chrome",
//   "browserZH": "Chrome",
//   "browserVersion": "96.0.4664.93",
//   "os": "Macintosh",
//   "osVersion": "10.15.7",
//   "device": "PC",
//   "engine": "WebKit"
// }
```