include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-eqos
PKG_VERSION:=2.0.1
PKG_RELEASE:=20260803
PKG_MAINTAINER:=chicha <tangtang0523@chicha.work>
PKG_LICENSE:=GPL-2.0

LUCI_TITLE:=LuCI support for EQOS
LUCI_DEPENDS:=+luci-base +tc +kmod-sched-core +kmod-ifb
LUCI_PKGARCH:=all

define Build/Compile
endef

define Package/$(PKG_NAME)/postinst
#!/bin/sh
rm -f /tmp/luci-*
endef

define Package/$(PKG_NAME)/conffiles
/etc/config/eqos
endef

#define Package/luci-app-eqos/install
# 	$(INSTALL_DIR) $(1)/etc/config
#	$(INSTALL_DIR) $(1)/etc/init.d
#	$(INSTALL_DIR) $(1)/etc/hotplug.d/iface
#	$(INSTALL_DIR) $(1)/usr/sbin
#	$(INSTALL_BIN) ./files/etc/config/eqos $(1)/etc/config/eqos
#	$(INSTALL_BIN) ./files/etc/init.d/eqos $(1)/etc/init.d/eqos
#	$(INSTALL_BIN) ./files/etc/hotplug.d/iface/10-eqos $(1)/etc/hotplug.d/iface/10-eqos
#	$(INSTALL_BIN) ./files/usr/sbin/eqos $(1)/usr/sbin/eqos
#endef

include $(TOPDIR)/feeds/luci/luci.mk

$(eval $(call BuildPackage,luci-app-eqos))
