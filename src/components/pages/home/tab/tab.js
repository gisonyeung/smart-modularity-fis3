module.exports = Vue.extend({
    template: __inline('./tab.tpl'),
    props: ['activePanel'],
    data: function() {
        return {
            items: [
                { key: 1, name: '看点' },
                { key: 2, name: '视频' },
                { key: 3, name: '关注' },
                { key: 4, name: '我的' },
            ]
        }
    },
    methods: {
        toggleTab(key) {
            window.vBus.$emit('togglePanel', key);
        },
    }
});