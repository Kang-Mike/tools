// 操作系统枚举
export enum OSTypeEnum {
  Windows = 'Windows',
  Macintosh = 'Macintosh',
  IPad = 'iPad',
  IPhone = 'iPhone',
  Android = 'Android',
  Linux = 'Linux',
  Unknown = 'Unknown',
}

/** 设备类型 */
export enum DeviceTypeEnum {
  PC = 'PC',
  Mobile = 'Mobile',
  Tablet = 'Tablet',
  Unknown = 'Unknown',
}

/** 浏览器内核 */
export enum EngineTypeEnum {
  Trident = 'Trident',
  Gecko = 'Gecko',
  Presto = 'Presto',
  WebKit = 'WebKit',
}

// 浏览器类型
export enum BrowserEnum {
  MicroMessenger = 'MicroMessenger',
  UCBrowser = 'UCBrowser',
  IE = 'IE',
  Edge = 'Edge',
  Opera = 'Opera',
  Firefox = 'Firefox',
  Chrome = 'Chrome',
  Safari = 'Safari',
  Unknown = 'Unknown',
}

interface Browser {
  /** 浏览器类型 */
  browser: BrowserEnum

  /** 浏览器版本号 */
  browserVersion: string
}

interface OS {
  /** 系统名称 */
  os: OSTypeEnum

  /** 系统版本号 */
  osVersion: string
}

export interface DeviceInfo extends Browser, OS {
  engine: EngineTypeEnum
  device: DeviceTypeEnum
}

/**
 * 通过navigator.userAgent获取浏览器版本与系统版本
 */
class UA {
  /**
   * 浏览器 navigator.userAgent
   * @private
   */
  agent = ''

  /**
   * 解析后的结果
   * @private
   */
  info: DeviceInfo = {
    browser: BrowserEnum.Unknown,
    browserVersion: '',
    os: OSTypeEnum.Unknown,
    osVersion: '',
    device: DeviceTypeEnum.Unknown,
    engine: EngineTypeEnum.WebKit,
  }

  /**
   * 需要匹配的浏览器名称
   * @private
   */
  private browserNameMap = {
    'MicroMessenger': BrowserEnum.MicroMessenger,
    'UCBrowser': BrowserEnum.UCBrowser,
    'Trident': BrowserEnum.IE,
    'Edge?': BrowserEnum.Edge,
    'OPR': BrowserEnum.Opera,
    'Firefox': BrowserEnum.Firefox,
    'Chrome': BrowserEnum.Chrome,
    'Safari': BrowserEnum.Safari,
  }

  /**
   * @param {string} userAgent 默认使用 navigator.userAgent
   */
  constructor(userAgent: string) {
    this.agent = userAgent
    this.init()
    const { browser, browserVersion, osVersion } = this.info
    this.info = {
      ...this.info,
      engine: this.getEngine(),
      // Safari 版本号跟系统走的
      browserVersion: browser === 'Safari' ? osVersion : browserVersion,
    }
  }

  private init() {
    try {
      this.getSystemName()
      this.getBrowserName()
    }
    catch (error) {
      console.warn(`[UA formatter error] ${error}`)
    }
  }

  /**
   * 获取浏览器内核引擎
   */
  getEngine(): EngineTypeEnum {
    const userAgent = this.agent
    if (userAgent.includes('Trident'))
      return EngineTypeEnum.Trident
    if (userAgent.includes('Firefox'))
      return EngineTypeEnum.Gecko
    if (userAgent.includes('Presto'))
      return EngineTypeEnum.Presto
    return EngineTypeEnum.WebKit
  }

  /**
   * 获取系统版本号
   */
  getSystemName() {
    const [, $1] = this.agent.match(/^[a-z]+\/\d+\.\d+\s?\(([a-z\d\s:;./_-]+)\)/i) || []
    try {
      let osVersion = ''
      if (/Windows/i.test($1)) {
        const [, _osVersion] = $1.match(/NT\s(\d+\.\d+)/) || []
        this.info.os = OSTypeEnum.Windows
        switch (_osVersion) {
          case '6.3':
            osVersion = '8.1'
            break
          case '6.2':
            osVersion = '8'
            break
          case '6.1':
            osVersion = '7'
            break
          case '5.2':
          case '5.1':
            osVersion = 'XP'
            break
          default:
            osVersion = _osVersion
        }

        this.info.device = DeviceTypeEnum.PC
        this.info.osVersion = osVersion
        return
      }

      if (/^Macintosh/i.test($1)) {
        [, osVersion] = $1.match(/X\s((\d+(_|\.))+\d+)/) || []
        this.info.os = OSTypeEnum.Macintosh
        this.info.device = DeviceTypeEnum.PC
        this.info.osVersion = osVersion?.replace(/_/g, '.') ?? 'Unknown'
        return
      }

      if (/^iPad/i.test($1)) {
        [, osVersion] = $1.match(/((\d+_)+\d+)/) || []
        this.info.os = OSTypeEnum.IPad
        this.info.device = DeviceTypeEnum.Tablet
        this.info.osVersion = osVersion.replace(/_/g, '.')
        return
      }

      if (/^iPhone/i.test($1)) {
        [, osVersion] = $1.match(/((\d+_)+\d+)/) || []
        this.info.os = OSTypeEnum.IPhone
        this.info.device = DeviceTypeEnum.Mobile
        this.info.osVersion = osVersion.replace(/_/g, '.')
        return
      }

      if ($1.includes('Android')) {
        const [, _version] = $1.match(/Android\s((\d+\.?)+\d?)/) || []
        this.info.device = DeviceTypeEnum.Mobile
        this.info.os = OSTypeEnum.Android
        this.info.osVersion = _version
        return
      }

      if (/Linux\s[a-z\d_]+/.test($1)) {
        this.info.os = OSTypeEnum.Linux
        this.info.osVersion = 'Unknown'
        return
      }

      this.info.os = OSTypeEnum.Unknown
      this.info.osVersion = 'Unknown'
    }
    catch (error) {
      this.info.os = OSTypeEnum.Unknown
      this.info.osVersion = 'Unknown'
    }
  }

  getBrowserName() {
    const regexps = Object.keys(this.browserNameMap).map(name => new RegExp(`${name}(\\/|\\s)(\\d+\\.)+\\d+`))

    // 过滤浏览器信息
    const browsers = this.agent.match(/[a-z\d]+(\/|\s)(\d+\.)+\d+/ig) || []
    let browser = browsers.filter(_ => regexps.findIndex(v => v.test(_)) !== -1)

    // 如果最后一项不是Safari并且结果长度大于1取最后一项为当前浏览器信息
    browser = browser.length > 1 && !browser[browser.length - 1].startsWith('Safari') ? browser.reverse() : browser

    this.info = {
      ...this.info,
      ...this._formatBrowserVersion(browser[0]),
    }
  }

  _formatBrowserVersion(str: string): Browser {
    try {
      // ie 浏览器版本对照
      const ieVersionMap: any = {
        '4.0': 8,
        '5.0': 9,
        '6.0': 10,
        '7.0': 11,
      }
      const { name, version } = str.match(/(?<name>[a-z\d]+)(\/|\s)(?<version>(\d+\.)+\d+)/i)?.groups ?? {}

      // 遍历查出浏览器名称，名称支持正则所以需要遍历查找
      let browserName: any = {}
      for (const [key, value] of Object.entries(this.browserNameMap)) {
        if (new RegExp(key).test(name)) {
          browserName = value
          break
        }
      }

      const result: Browser = {
        browserVersion: version ?? 'Unknown',
        browser: browserName ?? 'Unknown',
      }

      // IE 浏览器特殊处理
      if (name === 'Trident')
        result.browserVersion = ieVersionMap[version]

      return result
    }
    catch (error) {
      console.warn(`[UA formatter error] ${error}`)
      return {
        browser: BrowserEnum.Unknown,
        browserVersion: 'Unknown',
      }
    }
  }
}

export function getDeviceInfo(agent = navigator.userAgent) {
  const ua: UA = new UA(agent)
  return ua.info
}
