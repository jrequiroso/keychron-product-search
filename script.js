
import { createApp } from 'vue';

createApp({
    data() {
        return {
            sidebar_collapsed: false,
            search_keyword: '',
            products: [],

            selected_sizes: [],
            selected_layouts: [],
            is_wireless: false,
            is_hotswap: false,
            is_slim: false,
            is_exploded: false,
            is_qmk_via: false,

            size_collapsed: false,
            others_collapsed: false,
            layouts_collapsed: false,

            sizes: [
                { name: 'Full / 100%', code: 'size_100' },
                { name: '1800 / 96%', code: 'size_96' },
                { name: 'TKL / 80%', code: 'size_80' },
                { name: '75%', code: 'size_75' },
                { name: 'Alice 75%', code: 'size_75_alice' },
                { name: '70%', code: 'size_70' },
                { name: '65%', code: 'size_65' },
                { name: 'Alice 65%', code: 'size_65_alice' },
                { name: '60%', code: 'size_60' },
                { name: '40%', code: 'size_40' },
                { name: 'Numpad', code: 'size_numpad' },
            ],

            layouts: [
                { name: 'ANSI', code: 'layout_ansi' },
                { name: 'ISO-UK', code: 'layout_isouk' },
                { name: 'ISO-DE', code: 'layout_isode' },
                { name: 'ISO-NORDIC', code: 'layout_isonordic' },
                { name: 'ISO-ES', code: 'layout_isoes' },
                { name: 'ISO-FR', code: 'layout_isofr' },
                { name: 'ISO-SWISS', code: 'layout_isoswiss' },
                { name: 'JIS', code: 'layout_jis' },
            ]
        }
    },

    watch: {
        selected_sizes(new_val) {
            console.log("selected_sizes: ", new_val)
        },

        /* is_wireless(new_val) {
            console.log("is_wireless: ", new_val)
        } */
    },

    computed: {
        layouts_exist() {
            let layouts_count = 0;

            this.layouts.forEach(layout => {
                layouts_count += this.productsWithFilter('layout', layout.name);
            });
            
            return layouts_count;
        },

        filtered_products() {
            
            var self = this;
            var filtered_products = self.products;

            if ((self.search_keyword != undefined) || (self.search_keyword != '')) {
                filtered_products = filtered_products.filter((product) => {
                    return (product.name !== undefined) && (product.name.toLowerCase().indexOf(self.search_keyword.toLowerCase()) >= 0)
                });
            }

            if (self.selected_sizes.length > 0) {
                filtered_products = filtered_products.filter((product) => {
                    return self.selected_sizes.includes(product.size.toLowerCase());
                })
            }

            if (self.selected_layouts.length > 0) {
                filtered_products = filtered_products.filter((product) => {
                    return (product.layout !== undefined) && self.selected_layouts.includes(product.layout.toLowerCase());
                })
            }

            if (self.is_wireless) {
                filtered_products = filtered_products.filter((product) => {
                    return product.wireless == "Y";
                })
            }

            if (self.is_slim) {
                filtered_products = filtered_products.filter((product) => {
                    return product.slim == "Y";
                })
            }

            if (self.is_exploded) {
                filtered_products = filtered_products.filter((product) => {
                    return product.exploded == "Y";
                })
            }

            if (self.is_hotswap) {
                filtered_products = filtered_products.filter((product) => {
                    return product.hotswap == "Y";
                })
            }

            if (self.is_qmk_via) {
                filtered_products = filtered_products.filter((product) => {
                    return product.qmkVia == "Y";
                })
            }
            
            return filtered_products;
        }
    },

    methods: {
        productsWithFilter(filter_name, value) {
            let count = this.filtered_products.filter((product) => {
                // console.log("product[filter_name]: ", product[filter_name])
                // console.log("value: ", value)
                return (product[filter_name] !== undefined) && (product[filter_name].toLowerCase() == value.toLowerCase());
            }).length

            return count;
        },

        goToProductPage(url) {
            window.open(url, '_blank').focus();
        },

        resetFilters() {
            this.search_keyword = '';
            this.selected_sizes = [];
            this.selected_layouts = [];
            this.is_wireless = false;
            this.is_hotswap = false;
            this.is_slim =false;
            this.is_exploded = false;
            this.is_qmk_via = false;
        }
    },

    mounted() {
        fetch('./products.json')
            .then((response) => response.json())
            .then((json) => this.products = json);
    }
}).mount('#app')