'use strict';

'require form';
'require network';
'require uci';
'require view';

return view.extend({
    load: function() {
        // 并行加载 UCI 配置和主机提示，捕获错误避免界面白屏
        return Promise.all([
            uci.load('eqos').catch(function(err) {
                console.error('Failed to load eqos UCI:', err);
                return null; // 返回 null 表示加载失败，后续 render 会处理
            }),
            network.getHostHints().catch(function(err) {
                console.error('Failed to get host hints:', err);
                return { hosts: {} }; // 返回空对象作为后备
            })
        ]);
    },

    render: function(data) {
        var m, s, o;
        var uciData = data[0];      // UCI 配置数据（此处未直接使用，但由 form.Map 接管）
        var hostData = data[1] || { hosts: {} };

        // -------------------- 全局配置 --------------------
        m = new form.Map('eqos', _('EQoS'), _('Network speed control service.'));

        s = m.section(form.NamedSection, 'config', 'eqos');

        // 启用开关
        o = s.option(form.Flag, 'enabled', _('Enable'));
        o.default = o.disabled;
        o.rmempty = false;

        // 带宽选项（复用函数）
        this._addBandwidthOption(s, 'download', _('Download speed (Kbit/s)'), _('Total download bandwidth.'));
        this._addBandwidthOption(s, 'upload', _('Upload speed (Kbit/s)'), _('Total upload bandwidth.'));

        // -------------------- IP 限速表 --------------------
        s = m.section(form.TableSection, 'device', _('Speed limit based on IP address'));
        s.addremove = true;
        s.anonymous = true;
        s.sortable = true;

        // 启用列
        o = s.option(form.Flag, 'enabled', _('Enable'));
        o.default = o.enabled;

        // IP 地址列（带主机名提示）
        o = s.option(form.Value, 'ip', _('IP address'));
        o.datatype = 'ip4addr';
        o.rmempty = false;
        this._populateIpSuggestions(o, hostData.hosts);

        // 带宽列
        this._addBandwidthOption(s, 'download', _('Download speed (Kbit/s)'));
        this._addBandwidthOption(s, 'upload', _('Upload speed (Kbit/s)'));

        // 备注列
        s.option(form.Value, 'comment', _('Comment'));

        return m.render();
    },

    // 辅助方法：添加带宽选项（减少重复代码）
    _addBandwidthOption: function(section, name, label, description) {
        var o = section.option(form.Value, name, label, description || '');
        o.datatype = 'and(uinteger,min(1))';
        o.rmempty = false;
        return o;
    },

    // 辅助方法：填充 IP 下拉建议（从主机提示中读取）
    _populateIpSuggestions: function(ipOption, hosts) {
        if (!hosts || typeof hosts !== 'object') return;

        // 遍历所有主机
        for (var hostKey in hosts) {
            if (!hosts.hasOwnProperty(hostKey)) continue;
            var host = hosts[hostKey];
            if (!host.ipaddrs || !Array.isArray(host.ipaddrs)) continue;

            host.ipaddrs.forEach(function(ip) {
                if (ip) {
                    var label = host.name ? String.format('%s (%s)', host.name, ip) : ip;
                    ipOption.value(ip, label);
                }
            });
        }
    }
});