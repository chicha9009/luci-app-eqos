# luci-app-eqos

[![license](https://img.shields.io/badge/license-GPLv2-brightgreen.svg)](LICENSE)

EQOS (Easy QoS) for OpenWrt LuCI - 基于IP限速的流量控制工具

## 特性

基于 Linux 内核 TC（Traffic Control，流量控制）子系统，结合 HTB（Hierarchical Token Bucket，分层令牌桶）队列算法、IFB（Intermediate Functional Block，中间功能块）虚拟设备 和 u32 包过滤器 来实现 IP 级别的带宽限速。

## 系统要求

- OpenWrt 18.06 或更高版本
- LuCI Web 界面
- kmod-sched-core
- kmod-ifb
- tc (iproute2)

## 安装

### 编译安装

```bash
# 克隆到 OpenWrt SDK
git clone https://github.com/chicha9009/luci-app-eqos.git

# 放入 packages 目录
mv luci-app-eqos /path/to/openwrt/package/feeds/luci/

# 编译
make package/luci-app-eqos/compile V=s
```

### 在线安装

```bash
opkg update
opkg install luci-app-eqos
```

## 目录结构

```
luci-app-eqos/
├── Makefile
├── po/
│   └── zh_Hans/eqos.po
├── root/
│   ├── etc/
│   │   ├── config/eqos
│   │   ├── init.d/eqos
│   │   └── hotplug.d/iface/10-eqos
│   └── www/
│   │   ├── luci-static/resources/view/eqos.js
│   └── usr/
│       ├── sbin/eqos
│       └── share/luci/menu.d/luci-app-eqos.json
│       └── share/rpcd/acl.d/luci-app-eqos.json
└── README.md
```


GPL-2.0
## 更新日志

V2.0.1
1.修改usr/sbin/eqos脚本，由Mbit/s改为Kbit/s,限速更为精细

2.优化www/luci-static/resources/view/eqos.js文件

