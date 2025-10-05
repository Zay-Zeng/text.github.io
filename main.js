const app = new Vue({
    el: "#app",
    data: {
        popoverVisible: false,
        popoverInfo: {
            name: "",
            population: "",
            area: "",
            gdp: "",
            capital: "",
            papers: [],
        },
        popoverX: 0,
        popoverY: 0,
    },
    methods: {
        initECharts() {
            const chart = echarts.init(document.getElementById("main"));
            const vm = this;
            let option;
            fetch("https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json")
                .then((r) => r.json())
                .then((chinaJson) => {
                    echarts.registerMap("china", chinaJson);
                    option = {
                        tooltip: { trigger: "item", formatter: "{b}" },
                        series: [{
                            name: "中国",
                            type: "map",
                            map: "china",
                            emphasis: { label: { show: true }, itemStyle: { areaColor: "#66ccff" } },
                            data: [
                                { name: "北京", value: 80 },
                                { name: "福建", value: 70 },
                                { name: "江西", value: 65 },
                                { name: "浙江", value: 80 },
                            ],
                        }],
                    };
                    chart.setOption(option);
                    chart.on("click", (params) => {
                        if (params.componentType === "series" && provinceData[params.name]) {
                            const d = provinceData[params.name];
                            vm.popoverInfo = {
                                name: params.name,
                                population: d.population,
                                area: d.area,
                                gdp: d.gdp,
                                capital: d.capital,
                                papers: d.papers || [],
                            };
                            const mapContainerRect = document.querySelector(".map-container").getBoundingClientRect();
                            vm.popoverX = params.event.event.clientX - mapContainerRect.left + 10;
                            vm.popoverY = params.event.event.clientY - mapContainerRect.top - 50;
                            console.log(`Popover X: ${vm.popoverX}, Popover Y: ${vm.popoverY}`);
                            vm.$nextTick(() => { vm.popoverVisible = true; });
                        } else {
                            vm.popoverVisible = false;
                        }
                    });
                });
        },
    },
    mounted() {
        this.initECharts();
    },
});