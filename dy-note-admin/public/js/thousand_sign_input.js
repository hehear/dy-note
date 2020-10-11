
Vue.component("currency-input", {
    template: '\
            <div class="el-input el-input--small">\
                <input class="el-input__inner"\
                    v-bind:value="formatValue"\
                    ref="input"\
                    v-on:input="updatevalue($event.target.value)"\
                    v-on:blur="onBlur"\
                    v-on:focus="selectAll"/>\
            </div>\
        ',
    props: {
        value: {
            type: [String, Number],
            default: 0,
            desc: '数值'
        },
        symbol: {
            type: String,
            default: '',
            desc: '货币标识符'
        },
        decimal: {
            type: Number,
            default: 2,
            desc: '小数位'
        }
    },
    data() {
        return {
            focused: false,
        }
    },
    computed: {
        formatValue() {
            if (this.focused) {
                return accounting.unformat(this.value);
            } else {
                return accounting.formatMoney(this.value, this.symbol, this.decimal);
            }
        }
    },
    methods: {
        updatevalue(value) {
            var formatvalue = accounting.unformat(value);
            this.$emit("input", formatvalue)
        },
        onBlur() {
            this.focused = false;
            this.$emit("blur");
            this.dispatch("ElFormItem", "el.form.blur", [this.value]);
        },
        selectAll(event) {
            this.focused = true;
            setTimeout(() => {
                event.target.select()
            }, 0)
        },
        dispatch(componentName, eventName, params) {
            var parent = this.$parent || this.$root;
            var name = parent.$options.componentName;
            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;
                if (parent) {
                    name = parent.$options.componentName;
                }
            }
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(params));
            }
        }
    },
})
