import { HttpClient } from "@/sdk/education/core/utils/http-client";
import { AgoraFetchParams } from "@/sdk/education/interfaces";

export type ApiInitParams = {
  userToken: string
  sdkDomain: string
  appId: string
  rtmToken: string
  rtmUid: string
  prefix: string
  roomUuid: string
}

export type ApiBaseInitializerParams = {
  sdkDomain: string
  appId: string
  rtmToken: string
  rtmUid: string
}

export abstract class ApiBase {
  protected rtmToken: string = ''
  protected rtmUid: string = ''
  protected appId: string = ''
  protected sdkDomain: string = '';
  protected userToken: string = '';
  
  protected prefix!: string

  constructor(params: ApiBaseInitializerParams) {
    this.appId = params.appId
    this.sdkDomain = params.sdkDomain
    this.rtmToken = params.rtmToken
    this.rtmUid = params.rtmUid
  }

  updateRtmConfig(info: {
    rtmUid: string
    rtmToken: string
  }) {
    this.rtmUid = info.rtmUid
    this.rtmToken = info.rtmToken
  }

  // 接口请求
  async fetch (params: AgoraFetchParams) {
    const {
      method,
      token,
      data,
      full_url,
      url,
    } = params
    const opts: any = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-agora-token': this.rtmToken,
        'x-agora-uid': this.rtmUid,
      }
    }
    if (data) {
      opts.body = JSON.stringify(data);
    }
    if (token) {
      opts.headers['token'] = token
    } else {
      if (this.userToken) {
        opts.headers['token'] = this.userToken
      }
    }
    let resp: any;
    if (full_url) {
      resp = await HttpClient(`${full_url}`, opts);
    } else {
      resp = await HttpClient(`${this.prefix}${url}`, opts);
    }
    if (resp.code !== 0) {
      throw {msg: resp.msg}
    }
    return resp
  }
}