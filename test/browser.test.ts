import { describe, expect, it } from 'vitest'
import { getDeviceInfo } from '../src/browser'

describe('should', () => {
  it('chrome', () => {
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
    const equalResult = {
      browser: 'Chrome',
      browserVersion: '115.0.0.0',
      device: 'PC',
      engine: 'WebKit',
      os: 'Windows',
      osVersion: '10.0',
    }
    expect(getDeviceInfo(userAgent)).toEqual(equalResult)
  })
  it('edge', () => {
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.200'
    const equalResult = {
      browser: 'Edge',
      browserVersion: '115.0.1901.200',
      device: 'PC',
      engine: 'WebKit',
      os: 'Windows',
      osVersion: '10.0',
    }
    expect(getDeviceInfo(userAgent)).toEqual(equalResult)
  })
  it('firefox', () => {
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0'
    const equalResult = {
      browser: 'Firefox',
      browserVersion: '116.0',
      device: 'PC',
      engine: 'Gecko',
      os: 'Windows',
      osVersion: '10.0',
    }
    expect(getDeviceInfo(userAgent)).toEqual(equalResult)
  })
})
