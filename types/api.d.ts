interface CommonJson {
  /** 接口地址拼接：ip */
  SOUTHBOUND_SERVER_IP: { [key: string]: string }
  /** 接口地址拼接：port */
  SOUTHBOUND_SERVER_PORT: { [key: string]: string }
  /** 网络节点信息：key-关联 index */
  Router_List: {
    [key: string]: {
      /** 节点 id */
      LOCAL_LABEL: string
      /** 节点类型：fz-封装、zf-转发 */
      TYPE: 'fz' | 'zf'
      /** 节点编号映射 */
      PORT_LIST: { [key: string]: number }
      /** 节点编号速率 */
      PORT_LIMIT: { [key: string]: string }
    }
  }
}

