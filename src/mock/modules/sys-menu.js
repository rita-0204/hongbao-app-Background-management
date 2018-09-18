// 生成数据列表
var dataList = [
  {
    'menuId': 1,
    'parentId': 0,
    'parentName': null,
    'name': '系统管理',
    'url': null,
    'perms': null,
    'type': 0,
    'icon': 'system',
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 2,
    'parentId': 1,
    'parentName': '系统管理',
    'name': '管理员列表',
    'url': 'sys/user',
    'perms': null,
    'type': 1,
    'icon': 'admin',
    'orderNum': 1,
    'open': null,
    'list': null
  },
  {
    'menuId': 3,
    'parentId': 1,
    'parentName': '系统管理',
    'name': '角色管理',
    'url': 'sys/role',
    'perms': null,
    'type': 1,
    'icon': 'role',
    'orderNum': 2,
    'open': null,
    'list': null
  },
  {
    'menuId': 4,
    'parentId': 1,
    'parentName': '系统管理',
    'name': '菜单管理',
    'url': 'sys/menu',
    'perms': null,
    'type': 1,
    'icon': 'menu',
    'orderNum': 3,
    'open': null,
    'list': null
  },
  {
    'menuId': 5,
    'parentId': 1,
    'parentName': '系统管理',
    'name': 'SQL监控',
    'url': 'http://localhost:8080/renren-fast/druid/sql.html',
    'perms': null,
    'type': 1,
    'icon': 'sql',
    'orderNum': 4,
    'open': null,
    'list': null
  },
  {
    'menuId': 6,
    'parentId': 1,
    'parentName': '系统管理',
    'name': '定时任务',
    'url': 'job/schedule',
    'perms': null,
    'type': 1,
    'icon': 'job',
    'orderNum': 5,
    'open': null,
    'list': null
  },
  {
    'menuId': 7,
    'parentId': 6,
    'parentName': '定时任务',
    'name': '查看',
    'url': null,
    'perms': 'sys:schedule:list,sys:schedule:info',
    'type': 2,
    'icon': null,
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 8,
    'parentId': 6,
    'parentName': '定时任务',
    'name': '新增',
    'url': null,
    'perms': 'sys:schedule:save',
    'type': 2,
    'icon': null,
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 9,
    'parentId': 6,
    'parentName': '定时任务',
    'name': '修改',
    'url': null,
    'perms': 'sys:schedule:update',
    'type': 2,
    'icon': null,
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 10,
    'parentId': 6,
    'parentName': '定时任务',
    'name': '删除',
    'url': null,
    'perms': 'sys:schedule:delete',
    'type': 2,
    'icon': null,
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 11,
    'parentId': 6,
    'parentName': '定时任务',
    'name': '暂停',
    'url': null,
    'perms': 'sys:schedule:pause',
    'type': 2,
    'icon': null,
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 12,
    'parentId': 6,
    'parentName': '定时任务',
    'name': '恢复',
    'url': null,
    'perms': 'sys:schedule:resume',
    'type': 2,
    'icon': null,
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 13,
    'parentId': 6,
    'parentName': '定时任务',
    'name': '立即执行',
    'url': null,
    'perms': 'sys:schedule:run',
    'type': 2,
    'icon': null,
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 14,
    'parentId': 6,
    'parentName': '定时任务',
    'name': '日志列表',
    'url': null,
    'perms': 'sys:schedule:log',
    'type': 2,
    'icon': null,
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 15,
    'parentId': 2,
    'parentName': '管理员列表',
    'name': '查看',
    'url': null,
    'perms': 'sys:user:list,sys:user:info',
    'type': 2,
    'icon': null,
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 16,
    'parentId': 2,
    'parentName': '管理员列表',
    'name': '新增',
    'url': null,
    'perms': 'sys:user:save,sys:role:select',
    'type': 2,
    'icon': null,
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 17,
    'parentId': 2,
    'parentName': '管理员列表',
    'name': '修改',
    'url': null,
    'perms': 'sys:user:update,sys:role:select',
    'type': 2,
    'icon': null,
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 18,
    'parentId': 2,
    'parentName': '管理员列表',
    'name': '删除',
    'url': null,
    'perms': 'sys:user:delete',
    'type': 2,
    'icon': null,
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 19,
    'parentId': 3,
    'parentName': '角色管理',
    'name': '查看',
    'url': null,
    'perms': 'sys:role:list,sys:role:info',
    'type': 2,
    'icon': null,
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 20,
    'parentId': 3,
    'parentName': '角色管理',
    'name': '新增',
    'url': null,
    'perms': 'sys:role:save,sys:menu:list',
    'type': 2,
    'icon': null,
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 21,
    'parentId': 3,
    'parentName': '角色管理',
    'name': '修改',
    'url': null,
    'perms': 'sys:role:update,sys:menu:list',
    'type': 2,
    'icon': null,
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 22,
    'parentId': 3,
    'parentName': '角色管理',
    'name': '删除',
    'url': null,
    'perms': 'sys:role:delete',
    'type': 2,
    'icon': null,
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 23,
    'parentId': 4,
    'parentName': '菜单管理',
    'name': '查看',
    'url': null,
    'perms': 'sys:menu:list,sys:menu:info',
    'type': 2,
    'icon': null,
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 24,
    'parentId': 4,
    'parentName': '菜单管理',
    'name': '新增',
    'url': null,
    'perms': 'sys:menu:save,sys:menu:select',
    'type': 2,
    'icon': null,
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 25,
    'parentId': 4,
    'parentName': '菜单管理',
    'name': '修改',
    'url': null,
    'perms': 'sys:menu:update,sys:menu:select',
    'type': 2,
    'icon': null,
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 26,
    'parentId': 4,
    'parentName': '菜单管理',
    'name': '删除',
    'url': null,
    'perms': 'sys:menu:delete',
    'type': 2,
    'icon': null,
    'orderNum': 0,
    'open': null,
    'list': null
  },
  {
    'menuId': 27,
    'parentId': 1,
    'parentName': '系统管理',
    'name': '参数管理',
    'url': 'sys/config',
    'perms': 'sys:config:list,sys:config:info,sys:config:save,sys:config:update,sys:config:delete',
    'type': 1,
    'icon': 'config',
    'orderNum': 6,
    'open': null,
    'list': null
  },
  {
    'menuId': 29,
    'parentId': 1,
    'parentName': '系统管理',
    'name': '系统日志',
    'url': 'sys/log',
    'perms': 'sys:log:list',
    'type': 1,
    'icon': 'log',
    'orderNum': 7,
    'open': null,
    'list': null
  },
  {
    'menuId': 30,
    'parentId': 1,
    'parentName': '系统管理',
    'name': '文件上传',
    'url': 'oss/oss',
    'perms': 'sys:oss:all',
    'type': 1,
    'icon': 'oss',
    'orderNum': 6,
    'open': null,
    'list': null
  }
]
var navDataList = [
  {
    'id': 1,
    'name': '内容管理',
    'url': null,
    'list': [
      {
        'menuId': 2,
        'name': '分类管理',
        'url': 'content/classify'
      },
      {
        'menuId': 3,
        'name': '图文爬虫管理',
        'url': 'content/imgtxt'
      },
      {
        'menuId': 4,
        'name': '视频爬虫管理',
        'url': 'content/video'
      },
      {
        'menuId': 5,
        'name': 'PGC爬虫管理',
        'url': 'content/pgc'
      },
      {
        'menuId': 6,
        'name': '举报管理',
        'url': 'content/report'
      }
    ]
  },
  {
    'menuId': 7,
    'name': '运营管理',
    'url': null,
    'list': [
      {
        'menuId': 8,
        'name': '频道管理',
        'url': 'operate/channel'
      },
      {
        'menuId': 9,
        'name': '图文列表',
        'url': 'operate/imgtxt'
      },
      {
        'menuId': 10,
        'name': '视频列表',
        'url': 'operate/viedolist'
      },
      {
        'menuId': 11,
        'name': '评论审核',
        'url': 'operate/comment'
      },
      {
        'menuId': 12,
        'name': '推送管理',
        'url': 'operate/push'
      },
      {
        'menuId': 13,
        'name': '开屏管理',
        'url': 'operate/openscreen'
      }
    ]
  },
  {
    'menuId': 14,
    'name': '用户管理',
    'url': null,
    'list': [
      {
        'menuId': 15,
        'name': 'PGC用户',
        'url': 'user/pgc'
      },
      {
        'menuId': 16,
        'name': '普通用户',
        'url': 'user/normal'
      }
    ]
  },
  {
    'menuId': 17,
    'name': '系统管理',
    'url': null,
    'list': [
      {
        'menuId': 18,
        'name': '资源管理',
        'url': 'sys/menu'
      },
      {
        'menuId': 19,
        'name': '角色管理',
        'url': 'sys/role'
      },
      {
        'menuId': 20,
        'name': '用户管理',
        'url': 'sys/user'
      }
    ]
  }
]

// 获取导航菜单列表 / 权限
export function nav () {
  return {
    // isOpen: false,
    url: '/controll/getLoginMenu',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0,
      'menuList': navDataList
    }
  }
}

// 获取菜单列表
export function list () {
  return {
    // isOpen: false,
    url: '/sys/menu/list',
    type: 'get',
    data: dataList
  }
}

// 获取上级菜单
export function select () {
  let dataList = JSON.parse(JSON.stringify(navDataList))
  dataList = dataList.concat(dataList[0].list)
  return {
    // isOpen: false,
    url: '/sys/menu/select',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'menuList': dataList
    }
  }
}

// 获取菜单信息
export function info () {
  return {
    // isOpen: false,
    url: '/sys/menu/info',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'menu': dataList[0]
    }
  }
}

// 添加菜单
export function add () {
  return {
    // isOpen: false,
    url: '/sys/menu/save',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}

// 修改菜单
export function update () {
  return {
    // isOpen: false,
    url: '/sys/menu/update',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}

// 删除菜单
export function del () {
  return {
    // isOpen: false,
    url: '/sys/menu/delete',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}
